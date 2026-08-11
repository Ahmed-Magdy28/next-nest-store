import { applyDecorators } from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
} from "@nestjs/swagger";

export const updateMyProfileSwagger = applyDecorators(
  ApiBearerAuth("access-token"),
  ApiOperation({ summary: "Update my profile" }),
  ApiBody({
    schema: {
      example: { username: "Ahmed_123", email: "ahmed.new@example.com" },
    },
  }),
  ApiOkResponse({ description: "Profile updated." }),
);
