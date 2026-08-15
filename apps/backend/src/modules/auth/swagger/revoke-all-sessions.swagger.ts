import { applyDecorators } from "@nestjs/common";

import {
  ApiBearerAuth,
  ApiNoContentResponse,
  ApiOperation,
  ApiResponse,
} from "@nestjs/swagger";

export const revokeAllSessionsSwagger = applyDecorators(
  ApiOperation({ summary: "Revoke all my sessions" }),
  ApiNoContentResponse({ description: "All sessions revoked." }),
  ApiBearerAuth("access-token"),
  ApiResponse({ status: 401, description: "Invalid or missing access token." }),
);
