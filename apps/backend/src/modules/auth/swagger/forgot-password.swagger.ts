import { applyDecorators } from "@nestjs/common";
import {
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
} from "@nestjs/swagger";

export const forgotPasswordSwagger = applyDecorators(
  ApiOperation({ summary: "Request a password reset" }),
  ApiBody({ schema: { example: { email: "ahmed@example.com" } } }),
  ApiOkResponse({ description: "Password reset request accepted." }),
  ApiResponse({ status: 400, description: "Invalid email payload." }),
);
