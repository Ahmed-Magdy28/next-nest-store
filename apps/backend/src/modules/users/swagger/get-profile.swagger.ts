import { applyDecorators } from "@nestjs/common";
import { ApiBearerAuth, ApiOkResponse, ApiOperation } from "@nestjs/swagger";

export const myProfileSwagger = applyDecorators(
  ApiBearerAuth("access-token"),
  ApiOperation({ summary: "Get my profile" }),
  ApiOkResponse({ description: "Current user profile." }),
);
