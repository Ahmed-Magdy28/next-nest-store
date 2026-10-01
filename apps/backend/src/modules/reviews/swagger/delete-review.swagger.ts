import { applyDecorators } from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiNoContentResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
} from "@nestjs/swagger";

export const deleteReviewSwagger = applyDecorators(
  ApiBearerAuth("access-token"),
  ApiOperation({
    summary: "Delete review",
    description: "Delete own review (or any review if Admin).",
  }),
  ApiParam({
    name: "id",
    type: String,
    format: "uuid",
    description: "Review UUID",
    example: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
  }),
  ApiNoContentResponse({ description: "Review deleted successfully." }),
  ApiResponse({ status: 401, description: "Unauthorized - Authentication required." }),
  ApiResponse({ status: 403, description: "Forbidden - Cannot delete another user's review." }),
  ApiResponse({ status: 404, description: "Review not found." }),
);
