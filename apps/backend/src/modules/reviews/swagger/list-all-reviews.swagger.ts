import { applyDecorators } from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiResponse,
} from "@nestjs/swagger";

export const listAllReviewsSwagger = applyDecorators(
  ApiBearerAuth("access-token"),
  ApiOperation({
    summary: "List all reviews (Admin)",
    description: "Paginated list of all reviews with optional filters for productId and isApproved status.",
  }),
  ApiQuery({ name: "page", required: false, type: Number, example: 1 }),
  ApiQuery({ name: "limit", required: false, type: Number, example: 10 }),
  ApiQuery({ name: "productId", required: false, type: String, format: "uuid" }),
  ApiQuery({ name: "isApproved", required: false, type: Boolean }),
  ApiOkResponse({ description: "Paginated list of reviews." }),
  ApiResponse({ status: 401, description: "Unauthorized - Authentication required." }),
  ApiResponse({ status: 403, description: "Forbidden - Admin role required." }),
);
