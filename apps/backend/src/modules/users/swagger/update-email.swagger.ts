import { applyDecorators } from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
} from "@nestjs/swagger";

export const updateEmailSwagger = applyDecorators(
  ApiBearerAuth("access-token"),
  ApiOperation({ summary: "Request an email change" }),
  ApiBody({ schema: { example: { email: "ahmed.new@example.com" } } }),
  ApiOkResponse({ description: "Email change requested." }),
);
