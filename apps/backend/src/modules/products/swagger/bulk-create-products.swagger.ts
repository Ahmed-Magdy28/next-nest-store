import { applyDecorators } from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
} from "@nestjs/swagger";

export const bulkCreateProductsSwagger = applyDecorators(
  ApiBearerAuth("access-token"),
  ApiOperation({
    summary: "Bulk create products (Admin only)",
    description: `Creates multiple products in a single request. Max 500 products per request.`,
  }),
  ApiBody({
    schema: {
      type: "object",
      required: ["products"],
      properties: {
        products: {
          type: "array",
          minItems: 1,
          maxItems: 500,
          items: {
            type: "object",
            required: [
              "name",
              "arName",
              "slug",
              "sku",
              "regularPrice",
              "mainImage",
            ],
            properties: {
              name: { type: "string", example: "MacBook Pro 16" },
              arName: { type: "string", example: "ماك بوك برو 16" },
              slug: { type: "string", example: "macbook-pro-16" },
              sku: { type: "string", example: "MBP-16-001" },
              regularPrice: { type: "number", example: 2499.99 },
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
              mainImage: { type: "string", format: "url" },
              imageGallery: {
                type: "array",
                items: { type: "string", format: "url" },
                nullable: true,
              },
              categoryIds: {
                type: "array",
                items: { type: "string", format: "uuid" },
                nullable: true,
              },
              variants: {
                type: "array",
                nullable: true,
                items: { type: "object" },
              },
            },
          },
        },
      },
    },
  }),
  ApiResponse({
    status: 201,
    description: "Products created.",
    schema: {
      example: { created: 5 },
    },
  }),
  ApiResponse({ status: 400, description: "Invalid payload." }),
  ApiResponse({ status: 401, description: "Unauthorized." }),
  ApiResponse({ status: 403, description: "Admin only." }),
  ApiResponse({
    status: 409,
    description:
      "Duplicate slug/SKU in bulk, or already exists, or store/category full.",
  }),
);
