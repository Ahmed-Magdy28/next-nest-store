import { applyDecorators } from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
} from "@nestjs/swagger";

export const clearWishlistSwagger = applyDecorators(
  ApiBearerAuth("access-token"),
  ApiOperation({
    summary: "Clear my wishlist",
    description: "Removes all items from the authenticated user's wishlist.",
  }),
  ApiOkResponse({ description: "Empty wishlist." }),
  ApiResponse({ status: 401, description: "Authentication required." }),
);
