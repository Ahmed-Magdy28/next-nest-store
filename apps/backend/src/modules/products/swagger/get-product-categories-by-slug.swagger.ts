import { applyDecorators } from "@nestjs/common";
import {
  ApiOperation,
  ApiOkResponse,
  ApiParam,
  ApiNotFoundResponse,
} from "@nestjs/swagger";

export const getProductCategoriesBySlugSwagger = applyDecorators(
  ApiOperation({ summary: "Get categories of a product by slug" }),
  ApiParam({
    name: "slug",
    description: "Product slug",
    type: String,
  }),
  ApiOkResponse({ description: "Categories of the product." }),
  ApiNotFoundResponse({ description: "Product not found." }),
);
