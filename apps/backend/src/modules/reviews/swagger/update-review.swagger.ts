import { applyDecorators } from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
} from "@nestjs/swagger";

export const updateReviewSwagger = applyDecorators(
  ApiBearerAuth("access-token"),
  ApiOperation({
    summary: "Update own review",
    description: "Update the rating or comment of a review previously posted by the authenticated user.",
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
      properties: {
        rating: { type: "integer", minimum: 1, maximum: 5, example: 4 },
        comment: {
          type: "string",
          maxLength: 2000,
          example: "Updated comment: Still good after 1 month of usage.",
        },
      },
    },
  }),
  ApiOkResponse({ description: "Review updated successfully." }),
  ApiResponse({ status: 400, description: "Validation error." }),
  ApiResponse({ status: 401, description: "Unauthorized - Authentication required." }),
  ApiResponse({ status: 403, description: "Forbidden - Cannot edit another user's review." }),
  ApiResponse({ status: 404, description: "Review not found." }),
);
