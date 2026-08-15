import { applyDecorators } from "@nestjs/common";
import { ApiBody, ApiOperation, ApiResponse } from "@nestjs/swagger";

export const registerSwagger = applyDecorators(
  ApiOperation({
    summary: "Register",
  }),
  ApiBody({
    schema: {
      example: {
        email: "ahmed@example.com",
        username: "ahmed",
        password: "Password123!",
      },
    },
  }),
  ApiResponse({
    status: 201,
    description:
      "User registered successfully. Pending sessions receive only a refresh token.",
    schema: {
      example: {
        user: {
          id: "550e8400-e29b-41d4-a716-446655440000",
          email: "ahmed@example.com",
          username: "ahmed",
          role: "USER",
          createdAt: "2026-08-10T18:00:00.000Z",
          updatedAt: "2026-08-10T18:00:00.000Z",
        },
        session: {
          id: "550e8400-e29b-41d4-a716-446655440001",
          status: "ACTIVE",
          isCurrent: true,
        },
        accessToken: "eyJhbGciOiJIUzI1NiIs...",
        refreshToken: "eyJhbGciOiJIUzI1NiIs...",
      },
    },
  }),
  ApiResponse({
    status: 400,
    description: "Invalid registration payload.",
  }),
  ApiResponse({
    status: 409,
    description: "Email or username already exists.",
  }),
);
