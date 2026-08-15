import { applyDecorators } from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
} from "@nestjs/swagger";

export const SessionSwagger = applyDecorators(
  ApiBearerAuth("access-token"),
  ApiOkResponse({
    description: "Sessions belonging to the authenticated user.",
  }),
  ApiOperation({ summary: "List my sessions" }),
  ApiResponse({ status: 401, description: "Invalid or missing access token." }),
);
