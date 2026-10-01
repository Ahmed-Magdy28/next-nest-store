import { applyDecorators } from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
} from "@nestjs/swagger";

export const updateCouponSwagger = applyDecorators(
  ApiBearerAuth("access-token"),
  ApiOperation({
    summary: "Update coupon by ID (Admin)",
    description: "Update fields of an existing coupon.",
  }),
  ApiParam({
    name: "id",
    type: String,
    format: "uuid",
    description: "Coupon UUID",
    example: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
  }),
  ApiBody({
    schema: {
      type: "object",
      properties: {
        code: { type: "string", example: "SAVE30" },
        type: { type: "string", enum: ["PERCENTAGE", "FIXED"], example: "PERCENTAGE" },
        value: { type: "number", example: 30 },
        minOrderAmount: { type: "number", example: 150 },
        maxDiscount: { type: "number", example: 60 },
        usageLimit: { type: "number", example: 1000 },
        usageLimitPerUser: { type: "number", example: 2 },
        startDate: { type: "string", format: "date-time" },
        endDate: { type: "string", format: "date-time" },
        isActive: { type: "boolean", example: true },
      },
    },
  }),
  ApiOkResponse({ description: "Coupon successfully updated." }),
  ApiResponse({ status: 400, description: "Validation error." }),
  ApiResponse({ status: 401, description: "Unauthorized - Authentication required." }),
  ApiResponse({ status: 403, description: "Forbidden - Admin role required." }),
  ApiResponse({ status: 404, description: "Coupon not found." }),
);
