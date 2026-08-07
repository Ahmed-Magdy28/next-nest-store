#!/bin/bash

curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "Ahmed@example.com",
    "username": "Ahmed28",
    "password": "12345678"
  }'