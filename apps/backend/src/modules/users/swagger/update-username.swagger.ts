import { applyDecorators } from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiBody,
} from "@nestjs/swagger";

export const updateMyProfileUsernameSwagger = applyDecorators(
  ApiBearerAuth("access-token"),
  ApiOperation({ summary: "Update my username" }),
  ApiBody({ schema: { example: { username: "Ahmed_123" } } }),
  ApiOkResponse({ description: "Username updated." }),
);
