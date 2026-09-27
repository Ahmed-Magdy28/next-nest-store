import { applyDecorators } from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
} from "@nestjs/swagger";

export const mergeCartSwagger = applyDecorators(
  ApiBearerAuth("access-token"),
  ApiOperation({
    summary: "Merge guest cart into the user cart",
    description:
      "Called after login. Merges the cart associated with the " +
      "`guest_cart_token` cookie into the authenticated user's cart, " +
      "then clears the guest cookie. Requires authentication.",
  }),
  ApiOkResponse({ description: "Merged cart." }),
  ApiResponse({ status: 401, description: "Authentication required." }),
);
