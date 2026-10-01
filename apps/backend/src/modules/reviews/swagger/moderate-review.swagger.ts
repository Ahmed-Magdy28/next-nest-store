import { applyDecorators } from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
} from "@nestjs/swagger";

export const moderateReviewSwagger = applyDecorators(
  ApiBearerAuth("access-token"),
  ApiOperation({
    summary: "Moderate review (Admin)",
    description: "Approve or reject a review.",
  }),
  ApiParam({
    name: "id",
    type: String,
    format: "uuid",
    description: "Review UUID",
    example: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
  }),
  ApiBody({
    schema: {
      type: "object",
      required: ["isApproved"],
      properties: {
        isApproved: { type: "boolean", example: true },
      },
    },
  }),
  ApiOkResponse({ description: "Review moderated successfully." }),
  ApiResponse({ status: 400, description: "Validation error." }),
  ApiResponse({ status: 401, description: "Unauthorized - Authentication required." }),
  ApiResponse({ status: 403, description: "Forbidden - Admin role required." }),
  ApiResponse({ status: 404, description: "Review not found." }),
);
