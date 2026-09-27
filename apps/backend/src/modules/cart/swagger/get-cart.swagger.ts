import { applyDecorators } from "@nestjs/common";
import { ApiOkResponse, ApiOperation } from "@nestjs/swagger";

export const getCartSwagger = applyDecorators(
  ApiOperation({
    summary: "Get current cart",
    description:
      "Returns the cart for the authenticated user, or the guest cart " +
      "associated with the `guest_cart_token` cookie. Creates an empty cart if none exists.",
  }),
  ApiOkResponse({ description: "Cart contents." }),
);
