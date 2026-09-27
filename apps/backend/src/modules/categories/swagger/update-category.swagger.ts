import { applyDecorators } from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiParam,
} from "@nestjs/swagger";

export const updateCategorySwagger = applyDecorators(
  ApiBearerAuth("access-token"),
  ApiOperation({ summary: "Update a category (Admin only)" }),
  ApiParam({
    name: "id",
    description: "Category id",
    type: String,
    format: "uuid",
    example: "550e8400-e29b-41d4-a716-446655440000",
  }),
  ApiBody({
    schema: {
      type: "object",
      properties: {
        name: { type: "string", example: "Electronics" },
        arName: { type: "string", example: "إلكترونيات" },
        slug: { type: "string", example: "electronics" },
        image: { type: "string", format: "url", nullable: true },
        parentId: { type: "string", format: "uuid", nullable: true },
        isActive: { type: "boolean", example: true },
        sortOrder: { type: "number", example: 0 },
      },
    },
  }),
  ApiResponse({ status: 200, description: "Category updated." }),
  ApiResponse({ status: 401, description: "Unauthorized." }),
  ApiResponse({ status: 403, description: "Admin only." }),
  ApiResponse({ status: 404, description: "Category not found." }),
);
