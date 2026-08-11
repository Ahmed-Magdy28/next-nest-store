import { applyDecorators } from "@nestjs/common";
import { ApiBody, ApiOkResponse, ApiOperation } from "@nestjs/swagger";

export const verifyEmailSwagger = applyDecorators(
  ApiOperation({ summary: "Verify a pending email change" }),
  ApiBody({ schema: { example: { token: "verification-token" } } }),
  ApiOkResponse({ description: "Email verified." }),
);
