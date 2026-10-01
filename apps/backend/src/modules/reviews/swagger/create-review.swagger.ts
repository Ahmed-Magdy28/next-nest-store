import { applyDecorators } from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiOperation,
  ApiResponse,
} from "@nestjs/swagger";

export const createReviewSwagger = applyDecorators(
  ApiBearerAuth("access-token"),
  ApiOperation({
    summary: "Create product review",
    description: "Submit a review and rating (1-5) for a product. Requires authentication. New reviews are pending approval.",
  }),
  ApiBody({
    schema: {
      type: "object",
      required: ["productId", "rating"],
      properties: {
        productId: {
          type: "string",
          format: "uuid",
          example: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
        },
        rating: { type: "integer", minimum: 1, maximum: 5, example: 5 },
        comment: {
          type: "string",
          maxLength: 2000,
          example: "Excellent product, high quality and fast shipping!",
          nullable: true,
        },
      },
    },
  }),
  ApiCreatedResponse({ description: "Review submitted successfully and pending moderation." }),
  ApiResponse({ status: 400, description: "Validation error." }),
  ApiResponse({ status: 401, description: "Unauthorized - Authentication required." }),
  ApiResponse({ status: 404, description: "Product not found." }),
  ApiResponse({ status: 409, description: "Conflict - User has already reviewed this product." }),
);
