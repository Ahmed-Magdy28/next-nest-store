import { applyDecorators } from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
} from "@nestjs/swagger";

export const getCouponSwagger = applyDecorators(
  ApiBearerAuth("access-token"),
  ApiOperation({
    summary: "Get coupon by ID (Admin)",
    description: "Retrieve details of a single coupon by its UUID.",
  }),
  ApiParam({
    name: "id",
    type: String,
    format: "uuid",
    description: "Coupon UUID",
    example: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
  }),
  ApiOkResponse({ description: "Coupon details." }),
  ApiResponse({ status: 401, description: "Unauthorized - Authentication required." }),
  ApiResponse({ status: 403, description: "Forbidden - Admin role required." }),
  ApiResponse({ status: 404, description: "Coupon not found." }),
);
