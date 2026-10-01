import { applyDecorators } from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiResponse,
} from "@nestjs/swagger";

export const listCouponsSwagger = applyDecorators(
  ApiBearerAuth("access-token"),
  ApiOperation({
    summary: "List all coupons (Admin)",
    description: "Retrieve paginated coupons with optional search and active status filters.",
  }),
  ApiQuery({ name: "page", required: false, type: Number, example: 1 }),
  ApiQuery({ name: "limit", required: false, type: Number, example: 20 }),
  ApiQuery({ name: "isActive", required: false, type: Boolean, example: true }),
  ApiQuery({ name: "search", required: false, type: String, example: "SAVE20" }),
  ApiOkResponse({ description: "Paginated list of coupons." }),
  ApiResponse({ status: 401, description: "Unauthorized - Authentication required." }),
  ApiResponse({ status: 403, description: "Forbidden - Admin role required." }),
);
