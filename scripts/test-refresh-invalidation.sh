#!/bin/bash

# 1. Login to get a fresh refresh token (Token A)
echo "🔑 Logging in..."
LOGIN_RESPONSE=$(curl -s -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "Ahmed@example.com",
    "password": "12345678"
  }')

TOKEN_A=$(echo "$LOGIN_RESPONSE" | jq -r '.refreshToken')

if [ -z "$TOKEN_A" ] || [ "$TOKEN_A" == "null" ]; then
  echo "❌ Login failed! Make sure the server is running and user exists."
  exit 1
fi

echo "🟢 Got Token A: ${TOKEN_A:0:30}...${TOKEN_A: -20}"
echo ""

# Wait to ensure dynamic JWT iat changes
sleep 1.2

# 2. Use Token A to get Token B (First Refresh)
echo "🔄 Refreshing using Token A to get Token B..."
REFRESH_1_RESPONSE=$(curl -s -X POST http://localhost:3000/auth/refresh \
  -H "Authorization: Bearer $TOKEN_A")

TOKEN_B=$(echo "$REFRESH_1_RESPONSE" | jq -r '.refreshToken')

if [ -z "$TOKEN_B" ] || [ "$TOKEN_B" == "null" ]; then
  echo "❌ First refresh failed!"
  echo "$REFRESH_1_RESPONSE"
  exit 1
fi

echo "✅ First refresh succeeded! Got Token B: ${TOKEN_B:0:30}...${TOKEN_B: -20}"
echo ""

# Wait to ensure dynamic JWT iat changes
sleep 1.2

# 3. Try to use Token A again (Second Refresh - MUST fail!)
echo "🚫 Trying to reuse the invalidated Token A..."
REFRESH_2_RESPONSE=$(curl -s -X POST http://localhost:3000/auth/refresh \
  -H "Authorization: Bearer $TOKEN_A")

STATUS_CODE=$(echo "$REFRESH_2_RESPONSE" | jq -r '.statusCode // empty')
ERROR_MSG=$(echo "$REFRESH_2_RESPONSE" | jq -r '.message // empty')

if [ "$STATUS_CODE" == "401" ]; then
  echo "🎉 SUCCESS: Reuse of Token A was rejected as expected! (Error: $ERROR_MSG)"
else
  echo "❌ FAILURE: Reuse of Token A was NOT rejected!"
  echo "$REFRESH_2_RESPONSE"
  exit 1
fi
echo ""

# 4. Verify Token B is still valid
echo "🔄 Verifying that the new Token B works..."
REFRESH_3_RESPONSE=$(curl -s -X POST http://localhost:3000/auth/refresh \
  -H "Authorization: Bearer $TOKEN_B")

TOKEN_C=$(echo "$REFRESH_3_RESPONSE" | jq -r '.refreshToken')

if [ -n "$TOKEN_C" ] && [ "$TOKEN_C" != "null" ]; then
  echo "✅ Success! Token B is valid and successfully generated Token C."
else
  echo "❌ Failure! Token B was also rejected."
  echo "$REFRESH_3_RESPONSE"
  exit 1
fi
