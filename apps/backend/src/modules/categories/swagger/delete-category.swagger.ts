import { applyDecorators } from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiParam,
} from "@nestjs/swagger";

export const deleteCategorySwagger = applyDecorators(
  ApiBearerAuth("access-token"),
  ApiOperation({ summary: "Delete a category (Admin only)" }),
  ApiParam({
    name: "id",
    description: "Category id",
    type: String,
    format: "uuid",
    example: "550e8400-e29b-41d4-a716-446655440000",
  }),
  ApiResponse({ status: 204, description: "Category deleted." }),
  ApiResponse({ status: 401, description: "Unauthorized." }),
  ApiResponse({ status: 403, description: "Admin only." }),
  ApiResponse({ status: 404, description: "Category not found." }),
  ApiResponse({
    status: 409,
    description: "Category has subcategories or products.",
  }),
);
