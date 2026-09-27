import { applyDecorators } from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
} from "@nestjs/swagger";

export const createProductSwagger = applyDecorators(
  ApiBearerAuth("access-token"),
  ApiOperation({ summary: "Create a product (Admin only)" }),
  ApiBody({
    schema: {
      type: "object",
      required: ["name", "arName", "slug", "sku", "regularPrice", "mainImage"],
      properties: {
        name: { type: "string", example: "MacBook Pro 16" },
        arName: { type: "string", example: "ماك بوك برو 16" },
        slug: { type: "string", example: "macbook-pro-16" },
        sku: { type: "string", example: "MBP-16-001" },
        regularPrice: { type: "number", example: 2499.99 },
        discountPrice: { type: "number", example: 2299.99, nullable: true },
        onDiscount: { type: "boolean", example: true },
        discountType: {
          type: "string",
          enum: ["PERCENTAGE", "FIXED"],
          nullable: true,
        },
        discountValue: { type: "number", example: 8, nullable: true },
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
        mainImage: {
          type: "string",
          format: "url",
          example: "https://example.com/macbook.jpg",
        },
        imageGallery: {
          type: "array",
          items: { type: "string", format: "url" },
          nullable: true,
        },
        categoryIds: {
          type: "array",
          items: { type: "string", format: "uuid" },
          nullable: true,
          example: ["550e8400-e29b-41d4-a716-446655440000"],
        },
        variants: {
          type: "array",
          nullable: true,
          items: {
            type: "object",
            required: ["sku", "name"],
            properties: {
              sku: { type: "string", example: "MBP-16-001-512" },
              name: { type: "string", example: "512GB / 16GB RAM" },
              arName: { type: "string", nullable: true },
              size: { type: "string", nullable: true },
              attributes: { type: "object", example: { storage: "512GB" } },
              regularPrice: { type: "number", nullable: true },
              discountPrice: { type: "number", nullable: true },
              stockQuantity: { type: "number", nullable: true },
              mainImage: { type: "string", format: "url", nullable: true },
              imageGallery: {
                type: "array",
                items: { type: "string", format: "url" },
                nullable: true,
              },
            },
          },
        },
      },
    },
  }),
  ApiResponse({ status: 201, description: "Product created." }),
  ApiResponse({ status: 400, description: "Invalid payload." }),
  ApiResponse({ status: 401, description: "Unauthorized." }),
  ApiResponse({ status: 403, description: "Admin only." }),
  ApiResponse({
    status: 409,
    description:
      "Slug/SKU already exists, or store/category has reached the limit.",
  }),
);
