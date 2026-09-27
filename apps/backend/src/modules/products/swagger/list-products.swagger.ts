import { applyDecorators } from "@nestjs/common";
import { ApiOperation, ApiOkResponse, ApiQuery } from "@nestjs/swagger";

export const listProductsSwagger = applyDecorators(
  ApiOperation({
    summary: "List products (paginated + filters)",
    description: "Returns paginated products with filters and sorting.",
  }),
  ApiQuery({ name: "page", required: false, type: Number, example: 1 }),
  ApiQuery({ name: "limit", required: false, type: Number, example: 15 }),
  ApiQuery({ name: "search", required: false, type: String }),
  ApiQuery({
    name: "categoryId",
    required: false,
    type: String,
    format: "uuid",
  }),
  ApiQuery({ name: "includeDescendants", required: false, type: Boolean }),
  ApiQuery({ name: "isNew", required: false, type: Boolean }),
  ApiQuery({ name: "onDiscount", required: false, type: Boolean }),
  ApiQuery({ name: "isActive", required: false, type: Boolean }),
  ApiQuery({ name: "isAvailable", required: false, type: Boolean }),
  ApiQuery({ name: "minPrice", required: false, type: Number }),
  ApiQuery({ name: "maxPrice", required: false, type: Number }),
  ApiQuery({
    name: "sortBy",
    required: false,
    enum: ["createdAt", "updatedAt", "price", "name"],
  }),
  ApiQuery({ name: "sortOrder", required: false, enum: ["asc", "desc"] }),
  ApiOkResponse({ description: "Paginated products." }),
);
