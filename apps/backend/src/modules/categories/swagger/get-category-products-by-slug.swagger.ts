import { applyDecorators } from "@nestjs/common";
import {
  ApiOperation,
  ApiOkResponse,
  ApiParam,
  ApiQuery,
  ApiNotFoundResponse,
} from "@nestjs/swagger";

export const getCategoryProductsBySlugSwagger = applyDecorators(
  ApiOperation({
    summary: "Get products in a category by slug (paginated)",
    description:
      "Returns paginated products belonging to a category (by slug). By default, includes products from all descendant categories. Set `includeDescendants=false` to get only products directly linked to this category.",
  }),
  ApiParam({
    name: "slug",
    description: "Category slug",
    type: String,
    example: "electronics",
  }),
  ApiQuery({
    name: "page",
    required: false,
    type: Number,
    example: 1,
    description: "Page number (default: 1)",
  }),
  ApiQuery({
    name: "limit",
    required: false,
    type: Number,
    example: 5,
    description: "Items per page (default: 5, max: 100)",
  }),
  ApiQuery({
    name: "includeDescendants",
    required: false,
    type: Boolean,
    example: true,
    description:
      "Include products from all descendant categories (default: true)",
  }),
  ApiOkResponse({ description: "Paginated products." }),
  ApiNotFoundResponse({ description: "Category not found." }),
);
