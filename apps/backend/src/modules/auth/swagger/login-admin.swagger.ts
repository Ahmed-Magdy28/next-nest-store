import { applyDecorators } from "@nestjs/common";
import { ApiBody, ApiHeader, ApiOperation, ApiResponse } from "@nestjs/swagger";

export const LoginAdminSwagger = applyDecorators(
  ApiOperation({
    summary: "Login an admin user",
    description:
      "Logs in an admin user. Requires a valid `x-admin-secret` header.",
  }),
  ApiHeader({
    name: "x-admin-secret",
    description: "Admin secret key from environment variables",
    required: true,
    schema: { type: "string", example: "your-super-secret-admin-key-here" },
  }),
  ApiBody({
    schema: {
      type: "object",
      required: ["email", "username", "password"],
      properties: {
        email: {
          type: "string",
          format: "email",
          example: "admin@example.com",
        },
        username: {
          type: "string",
          example: "admin",
          minLength: 4,
          maxLength: 30,
        },
        password: {
          type: "string",
          example: "Admin123!@#",
          minLength: 8,
          maxLength: 64,
        },
      },
    },
  }),
  ApiResponse({
    status: 201,
    description:
      "Admin logged in successfully. Returns user + session + tokens.",
  }),
  ApiResponse({
    status: 400,
    description: "Invalid login payload.",
  }),
  ApiResponse({
    status: 401,
    description: "Invalid or missing admin secret.",
  }),
);
