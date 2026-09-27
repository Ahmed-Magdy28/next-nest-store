import { applyDecorators } from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
} from "@nestjs/swagger";

export const deleteProductSwagger = applyDecorators(
  ApiBearerAuth("access-token"),
  ApiOperation({
    summary: "Delete a product (Admin only)",
    description: "Permanently deletes the product and all its variants.",
  }),
  ApiParam({
    name: "id",
    description: "Product id",
    type: String,
    format: "uuid",
    example: "550e8400-e29b-41d4-a716-446655440000",
  }),
  ApiResponse({ status: 204, description: "Product deleted." }),
  ApiResponse({ status: 401, description: "Unauthorized." }),
  ApiResponse({ status: 403, description: "Admin only." }),
  ApiResponse({ status: 404, description: "Product not found." }),
);
