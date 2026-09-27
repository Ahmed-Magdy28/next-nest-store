import { applyDecorators } from "@nestjs/common";
import {
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
} from "@nestjs/swagger";

export const updateCartItemSwagger = applyDecorators(
  ApiOperation({ summary: "Update a cart item's quantity" }),
  ApiParam({
    name: "id",
    description: "Cart item id",
    type: String,
    format: "uuid",
  }),
  ApiBody({
    schema: {
      type: "object",
      required: ["quantity"],
      properties: {
        quantity: { type: "number", example: 3, minimum: 1, maximum: 99 },
      },
    },
  }),
  ApiOkResponse({ description: "Updated cart." }),
  ApiResponse({ status: 400, description: "Invalid payload or stock issue." }),
  ApiResponse({ status: 404, description: "Cart item not found." }),
);
