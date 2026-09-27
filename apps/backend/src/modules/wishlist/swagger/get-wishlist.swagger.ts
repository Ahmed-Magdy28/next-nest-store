import { applyDecorators } from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
} from "@nestjs/swagger";

export const getWishlistSwagger = applyDecorators(
  ApiBearerAuth("access-token"),
  ApiOperation({
    summary: "Get my wishlist",
    description:
      "Returns the authenticated user's wishlist. Creates one if missing.",
  }),
  ApiOkResponse({ description: "User wishlist with all items." }),
  ApiResponse({ status: 401, description: "Authentication required." }),
);
