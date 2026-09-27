import { applyDecorators } from "@nestjs/common";
import { ApiBody, ApiHeader, ApiOperation, ApiResponse } from "@nestjs/swagger";

export const registerAdminSwagger = applyDecorators(
  ApiOperation({
    summary: "Register a new admin user",
    description:
      "Creates a new admin user. Requires a valid `x-admin-secret` header.",
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
      "Admin registered successfully. Returns user + session + tokens.",
  }),
  ApiResponse({
    status: 400,
    description: "Invalid registration payload.",
  }),
  ApiResponse({
    status: 401,
    description: "Invalid or missing admin secret.",
  }),
  ApiResponse({
    status: 409,
    description: "Email or username already exists.",
  }),
);
