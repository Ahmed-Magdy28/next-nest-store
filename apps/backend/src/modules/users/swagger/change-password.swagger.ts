import { applyDecorators } from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiBody,
  ApiNoContentResponse,
  ApiOperation,
  ApiResponse,
} from "@nestjs/swagger";

export const changePasswordSwagger = applyDecorators(
  ApiBearerAuth("access-token"),
  ApiOperation({ summary: "Change my password" }),
  ApiBody({
    schema: {
      example: {
        currentPassword: "Password123!",
        newPassword: "NewPassword123!",
      },
    },
  }),
  ApiNoContentResponse({
    description: "Password changed and all sessions revoked.",
  }),
  ApiResponse({ status: 400, description: "Invalid password payload." }),
  ApiResponse({
    status: 401,
    description: "Invalid access token or current password.",
  }),
);
