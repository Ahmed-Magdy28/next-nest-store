import { applyDecorators } from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
} from "@nestjs/swagger";

export const refreshSwagger = applyDecorators(
  ApiOperation({
    summary: "Refresh the access token",
  }),
  ApiBearerAuth("refresh-token"),
  ApiOkResponse({
    description: "Newly generated access token.",
  }),
  ApiResponse({
    status: 401,
    description: "Invalid or missing refresh token.",
  }),
);
