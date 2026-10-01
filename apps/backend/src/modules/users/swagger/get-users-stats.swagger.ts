import { applyDecorators } from "@nestjs/common";
import { ApiBearerAuth, ApiOkResponse, ApiOperation } from "@nestjs/swagger";

export const usersStatsSwagger = applyDecorators(
  ApiBearerAuth("access-token"),
  ApiOperation({ summary: "Get users stats (total users, active users) - Admin only" }),
  ApiOkResponse({ description: "Users statistics successfully retrieved." }),
);
