import { applyDecorators } from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
} from "@nestjs/swagger";

export const addToWishlistSwagger = applyDecorators(
  ApiBearerAuth("access-token"),
  ApiOperation({
    summary: "Add a product to my wishlist",
    description:
      "Idempotent: adding an already-wishlisted product returns the current wishlist without errors.",
  }),
  ApiBody({
    schema: {
      type: "object",
      required: ["productId"],
      properties: {
        productId: {
          type: "string",
          format: "uuid",
          example: "550e8400-e29b-41d4-a716-446655440000",
        },
      },
    },
  }),
  ApiOkResponse({ description: "Updated wishlist." }),
  ApiResponse({
    status: 400,
    description: "Invalid payload, product unavailable, or wishlist full.",
  }),
  ApiResponse({ status: 401, description: "Authentication required." }),
  ApiResponse({ status: 404, description: "Product not found." }),
);
