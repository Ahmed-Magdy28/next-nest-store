import { applyDecorators } from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiBody,
  ApiNoContentResponse,
  ApiOperation,
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
  ApiNoContentResponse({ description: "Password changed." }),
);
