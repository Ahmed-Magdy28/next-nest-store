import { applyDecorators } from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
} from "@nestjs/swagger";

export const meSwagger = applyDecorators(
  ApiOperation({
    summary: "Return the current authenticated user",
  }),
  ApiBearerAuth("access-token"),
  ApiOkResponse({
    description: "Current authenticated user.",
  }),
  ApiResponse({
    status: 401,
    description: "Invalid or missing access token.",
  }),
);
