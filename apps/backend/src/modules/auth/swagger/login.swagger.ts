import { applyDecorators } from "@nestjs/common";
import { ApiBody, ApiOperation, ApiResponse } from "@nestjs/swagger";

export const loginSwagger = applyDecorators(
  ApiOperation({
    summary: "Login",
  }),
  ApiBody({
    schema: {
      example: {
        email: "ahmed@example.com",
        password: "Password123!",
      },
    },
  }),
  ApiResponse({
    status: 200,
    description: "User logged in successfully.",
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
        accessToken: "eyJhbGciOiJIUzI1NiIs...",
        refreshToken: "eyJhbGciOiJIUzI1NiIs...",
      },
    },
  }),
);
