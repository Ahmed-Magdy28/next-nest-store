import { applyDecorators } from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiNoContentResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
} from "@nestjs/swagger";

export const revokeSessionSwagger = applyDecorators(
  ApiOperation({ summary: "Revoke one of my sessions" }),
  ApiParam({
    name: "id",
    description: "Session id",
    example: "550e8400-e29b-41d4-a716-446655440000",
  }),
  ApiNoContentResponse({ description: "Session revoked." }),
  ApiBearerAuth("access-token"),
  ApiResponse({ status: 401, description: "Invalid or missing access token." }),
  ApiResponse({
    status: 403,
    description: "Session belongs to another user.",
  }),
  ApiResponse({ status: 404, description: "Session not found." }),
);
