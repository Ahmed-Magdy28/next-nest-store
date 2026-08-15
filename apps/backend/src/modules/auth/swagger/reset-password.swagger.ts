import { applyDecorators } from "@nestjs/common";
import {
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
} from "@nestjs/swagger";

export const resetPasswordSwagger = applyDecorators(
  ApiOperation({ summary: "Reset a password with a reset token" }),
  ApiBody({
    schema: { example: { token: "reset-token", password: "NewPassword123!" } },
  }),
  ApiOkResponse({ description: "Password reset successful." }),
  ApiResponse({ status: 400, description: "Invalid password payload." }),
  ApiResponse({
    status: 401,
    description: "Invalid or expired password reset token.",
  }),
);
