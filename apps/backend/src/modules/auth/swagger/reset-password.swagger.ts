import { applyDecorators } from "@nestjs/common";
import { ApiBody, ApiOkResponse, ApiOperation } from "@nestjs/swagger";

export const resetPasswordSwagger = applyDecorators(
  ApiOperation({ summary: "Reset a password with a reset token" }),
  ApiBody({
    schema: { example: { token: "reset-token", password: "NewPassword123!" } },
  }),
  ApiOkResponse({ description: "Password reset successful." }),
);
