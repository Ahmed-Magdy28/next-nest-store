import { applyDecorators } from "@nestjs/common";
import {
  ApiOperation,
  ApiOkResponse,
  ApiQuery,
  ApiBadRequestResponse,
} from "@nestjs/swagger";

export const listCategoriesSwagger = applyDecorators(
  ApiOperation({
    summary: "List categories (paginated)",
    description:
      "Returns a paginated list of categories with optional filters.",
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
    name: "parentId",
    required: false,
    type: String,
    format: "uuid",
    description: "Filter by parent category id",
  }),
  ApiQuery({
    name: "isActive",
    required: false,
    type: Boolean,
    description: "Filter by active status",
  }),
  ApiQuery({
    name: "search",
    required: false,
    type: String,
    description: "Search in name, arName, slug",
  }),
  ApiOkResponse({ description: "Paginated categories." }),
  ApiBadRequestResponse({ description: "Invalid query parameters." }),
);
