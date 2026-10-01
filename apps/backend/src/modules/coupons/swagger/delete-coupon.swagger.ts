import { applyDecorators } from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiNoContentResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
} from "@nestjs/swagger";

export const deleteCouponSwagger = applyDecorators(
  ApiBearerAuth("access-token"),
  ApiOperation({
    summary: "Delete coupon (Admin)",
    description: "Permanently delete a coupon by its UUID.",
  }),
  ApiParam({
    name: "id",
    type: String,
    format: "uuid",
    description: "Coupon UUID",
    example: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
  }),
  ApiNoContentResponse({ description: "Coupon deleted successfully." }),
  ApiResponse({ status: 401, description: "Unauthorized - Authentication required." }),
  ApiResponse({ status: 403, description: "Forbidden - Admin role required." }),
  ApiResponse({ status: 404, description: "Coupon not found." }),
);
