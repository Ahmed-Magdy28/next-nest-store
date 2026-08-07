#!/bin/bash

curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "Ahmed@example.com",
    "password": "12345678"
  }'