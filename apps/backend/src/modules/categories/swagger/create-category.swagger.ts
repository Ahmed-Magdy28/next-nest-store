import { applyDecorators } from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiBadRequestResponse,
  ApiConflictResponse,
} from "@nestjs/swagger";

export const createCategorySwagger = applyDecorators(
  ApiBearerAuth("access-token"),
  ApiOperation({ summary: "Create a category (Admin only)" }),
  ApiBody({
    schema: {
      type: "object",
      required: ["name", "arName", "slug"],
      properties: {
        name: { type: "string", example: "Electronics" },
        arName: { type: "string", example: "إلكترونيات" },
        slug: { type: "string", example: "electronics" },
        image: {
          type: "string",
          format: "url",
          example: "https://example.com/electronics.jpg",
          nullable: true,
        },
        parentId: {
          type: "string",
          format: "uuid",
          nullable: true,
          // example: "550e8400-e29b-41d4-a716-446655440000",
        },
        isActive: { type: "boolean", example: true },
        sortOrder: { type: "number", example: 0 },
      },
    },
  }),
  ApiResponse({ status: 201, description: "Category created." }),
  ApiResponse({ status: 401, description: "Unauthorized." }),
  ApiResponse({ status: 403, description: "Admin only." }),
  ApiBadRequestResponse({ description: "Invalid payload." }),
  ApiConflictResponse({ description: "Category slug already exists." }),
);
