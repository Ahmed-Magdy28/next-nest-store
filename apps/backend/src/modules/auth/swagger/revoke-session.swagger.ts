import { applyDecorators } from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiNoContentResponse,
  ApiOperation,
  ApiParam,
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
);
