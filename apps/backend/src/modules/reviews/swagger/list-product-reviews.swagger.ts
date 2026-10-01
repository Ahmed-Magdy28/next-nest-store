import { applyDecorators } from "@nestjs/common";
import {
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
} from "@nestjs/swagger";

export const listProductReviewsSwagger = applyDecorators(
  ApiOperation({
    summary: "List approved reviews for a product",
    description: "Get paginated approved customer reviews for a given product.",
  }),
  ApiParam({
    name: "productId",
    type: String,
    format: "uuid",
    description: "Product UUID",
    example: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
  }),
  ApiQuery({ name: "page", required: false, type: Number, example: 1 }),
  ApiQuery({ name: "limit", required: false, type: Number, example: 10 }),
  ApiOkResponse({ description: "Paginated list of approved reviews." }),
  ApiResponse({ status: 400, description: "Invalid productId or pagination params." }),
);
