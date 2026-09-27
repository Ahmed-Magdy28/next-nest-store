import { applyDecorators } from "@nestjs/common";
import { ApiOkResponse, ApiOperation } from "@nestjs/swagger";

export const clearCartSwagger = applyDecorators(
  ApiOperation({
    summary: "Clear the cart",
    description: "Removes all items from the current cart.",
  }),
  ApiOkResponse({ description: "Empty cart." }),
);
