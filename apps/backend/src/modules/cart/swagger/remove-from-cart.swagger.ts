import { applyDecorators } from "@nestjs/common";
import {
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
} from "@nestjs/swagger";

export const removeFromCartSwagger = applyDecorators(
  ApiOperation({ summary: "Remove an item from the cart" }),
  ApiParam({
    name: "id",
    description: "Cart item id",
    type: String,
    format: "uuid",
  }),
  ApiOkResponse({ description: "Updated cart." }),
  ApiResponse({ status: 404, description: "Cart item not found." }),
);
