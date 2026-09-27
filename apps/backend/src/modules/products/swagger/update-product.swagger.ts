import { applyDecorators } from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
} from "@nestjs/swagger";

export const updateProductSwagger = applyDecorators(
  ApiBearerAuth("access-token"),
  ApiOperation({ summary: "Update a product (Admin only)" }),
  ApiParam({
    name: "id",
    description: "Product id",
    type: String,
    format: "uuid",
    example: "550e8400-e29b-41d4-a716-446655440000",
  }),
  ApiBody({
    schema: {
      type: "object",
      properties: {
        name: { type: "string", example: "MacBook Pro 16 (2024)" },
        arName: { type: "string", nullable: true },
        slug: { type: "string", nullable: true },
        sku: { type: "string", nullable: true },
        regularPrice: { type: "number", nullable: true },
        discountPrice: { type: "number", nullable: true },
        onDiscount: { type: "boolean", nullable: true },
        discountType: {
          type: "string",
          enum: ["PERCENTAGE", "FIXED"],
          nullable: true,
        },
        discountValue: { type: "number", nullable: true },
        discountStartDate: {
          type: "string",
          format: "date-time",
          nullable: true,
        },
        discountEndDate: {
          type: "string",
          format: "date-time",
          nullable: true,
        },
        description: { type: "string", nullable: true },
        arDescription: { type: "string", nullable: true },
        weight: { type: "number", nullable: true },
        dimensions: { type: "object", nullable: true },
        mainImage: { type: "string", format: "url", nullable: true },
        imageGallery: {
          type: "array",
          items: { type: "string", format: "url" },
          nullable: true,
        },
        isNew: { type: "boolean", nullable: true },
        isActive: { type: "boolean", nullable: true },
        isAvailable: { type: "boolean", nullable: true },
        categoryIds: {
          type: "array",
          items: { type: "string", format: "uuid" },
          nullable: true,
          description:
            "Replaces all existing categories. Pass empty array to remove all.",
        },
      },
    },
  }),
  ApiResponse({ status: 200, description: "Product updated." }),
  ApiResponse({ status: 400, description: "Invalid payload." }),
  ApiResponse({ status: 401, description: "Unauthorized." }),
  ApiResponse({ status: 403, description: "Admin only." }),
  ApiResponse({ status: 404, description: "Product not found." }),
  ApiResponse({
    status: 409,
    description: "Slug/SKU already exists, or category has reached the limit.",
  }),
);
