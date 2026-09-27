import { applyDecorators } from "@nestjs/common";
import {
  ApiOperation,
  ApiOkResponse,
  ApiParam,
  ApiQuery,
  ApiNotFoundResponse,
} from "@nestjs/swagger";

export const getCategoryProductsSwagger = applyDecorators(
  ApiOperation({
    summary: "Get products in a category (paginated)",
    description: "Returns paginated products belonging to a specific category.",
  }),
  ApiParam({
    name: "id",
    description: "Category id",
    type: String,
    format: "uuid",
    example: "550e8400-e29b-41d4-a716-446655440000",
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
