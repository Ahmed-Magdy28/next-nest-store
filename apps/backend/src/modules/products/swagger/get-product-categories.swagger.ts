import { applyDecorators } from "@nestjs/common";
import {
  ApiOperation,
  ApiOkResponse,
  ApiParam,
  ApiNotFoundResponse,
} from "@nestjs/swagger";

export const getProductCategoriesSwagger = applyDecorators(
  ApiOperation({ summary: "Get categories of a product by id" }),
  ApiParam({
    name: "id",
    description: "Product id",
    type: String,
    format: "uuid",
  }),
  ApiOkResponse({ description: "Categories of the product." }),
  ApiNotFoundResponse({ description: "Product not found." }),
);
