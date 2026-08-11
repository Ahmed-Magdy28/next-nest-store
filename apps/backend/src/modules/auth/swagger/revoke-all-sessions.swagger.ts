import { applyDecorators } from "@nestjs/common";

import {
  ApiBearerAuth,
  ApiNoContentResponse,
  ApiOperation,
} from "@nestjs/swagger";

export const revokeAllSessionsSwagger = applyDecorators(
  ApiOperation({ summary: "Revoke all my sessions" }),
  ApiNoContentResponse({ description: "All sessions revoked." }),
  ApiBearerAuth("access-token"),
);
