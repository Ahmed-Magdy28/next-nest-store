import { applyDecorators } from "@nestjs/common";
import {
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
} from "@nestjs/swagger";

export const getRatingSummarySwagger = applyDecorators(
  ApiOperation({
    summary: "Get rating summary for a product",
    description: "Get average rating, total review count, and star distribution (1 to 5) for a product.",
  }),
  ApiParam({
    name: "productId",
    type: String,
    format: "uuid",
    description: "Product UUID",
    example: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
  }),
  ApiOkResponse({
    description: "Rating summary.",
    schema: {
      type: "object",
      properties: {
        average: { type: "number", example: 4.5 },
        count: { type: "number", example: 120 },
        distribution: {
          type: "object",
          properties: {
            "1": { type: "number", example: 2 },
            "2": { type: "number", example: 3 },
            "3": { type: "number", example: 15 },
            "4": { type: "number", example: 40 },
            "5": { type: "number", example: 60 },
          },
        },
      },
    },
  }),
  ApiResponse({ status: 400, description: "Invalid productId." }),
);
