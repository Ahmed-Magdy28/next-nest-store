import { applyDecorators } from "@nestjs/common";
import { ApiBearerAuth, ApiResponse } from "@nestjs/swagger";

export const meSwagger = applyDecorators(
  ApiBearerAuth("access-token"),
  ApiResponse({
    status: 200,
    description: "Current authenticated user.",
  }),
  ApiResponse({
    status: 401,
    description: "Invalid or missing access token.",
  }),
);
