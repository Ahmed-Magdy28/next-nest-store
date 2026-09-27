import { applyDecorators } from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
} from "@nestjs/swagger";

export const removeFromWishlistSwagger = applyDecorators(
  ApiBearerAuth("access-token"),
  ApiOperation({
    summary: "Remove a product from my wishlist",
    description:
      "Removes the product by product id. Idempotent: removing a product that isn't in the wishlist succeeds silently.",
  }),
  ApiParam({
    name: "productId",
    description: "Product id",
    type: String,
    format: "uuid",
  }),
  ApiOkResponse({ description: "Updated wishlist." }),
  ApiResponse({ status: 401, description: "Authentication required." }),
);
