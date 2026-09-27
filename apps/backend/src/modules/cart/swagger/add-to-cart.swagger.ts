import { applyDecorators } from "@nestjs/common";
import {
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
} from "@nestjs/swagger";

export const addToCartSwagger = applyDecorators(
  ApiOperation({
    summary: "Add an item to the cart",
    description:
      "Works for both guests and authenticated users. " +
      "For guests, a `guest_cart_token` cookie is set if missing.",
  }),
  ApiBody({
    schema: {
      type: "object",
      required: ["productId", "quantity"],
      properties: {
        productId: {
          type: "string",
          format: "uuid",
          example: "550e8400-e29b-41d4-a716-446655440000",
        },
        variantId: {
          type: "string",
          format: "uuid",
          nullable: true,
          description: "Required if the product has variants.",
        },
        quantity: { type: "number", example: 2, minimum: 1, maximum: 99 },
      },
    },
  }),
  ApiOkResponse({ description: "Cart with the new item added." }),
  ApiResponse({ status: 400, description: "Invalid payload or stock issue." }),
  ApiResponse({ status: 404, description: "Product or variant not found." }),
);
