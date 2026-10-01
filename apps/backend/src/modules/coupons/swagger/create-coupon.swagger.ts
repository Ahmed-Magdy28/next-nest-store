import { applyDecorators } from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiOperation,
  ApiResponse,
} from "@nestjs/swagger";

export const createCouponSwagger = applyDecorators(
  ApiBearerAuth("access-token"),
  ApiOperation({
    summary: "Create a new coupon (Admin)",
    description: "Create a percentage or fixed discount coupon with limits and validity range.",
  }),
  ApiBody({
    schema: {
      type: "object",
      required: ["code", "type", "value", "startDate", "endDate"],
      properties: {
        code: { type: "string", example: "SAVE25" },
        type: { type: "string", enum: ["PERCENTAGE", "FIXED"], example: "PERCENTAGE" },
        value: { type: "number", example: 25 },
        minOrderAmount: { type: "number", example: 100 },
        maxDiscount: { type: "number", example: 50 },
        usageLimit: { type: "number", example: 500 },
        usageLimitPerUser: { type: "number", example: 1 },
        startDate: { type: "string", format: "date-time", example: "2026-10-01T00:00:00.000Z" },
        endDate: { type: "string", format: "date-time", example: "2026-12-31T23:59:59.000Z" },
        isActive: { type: "boolean", example: true },
      },
    },
  }),
  ApiCreatedResponse({ description: "Coupon successfully created." }),
  ApiResponse({ status: 400, description: "Validation error." }),
  ApiResponse({ status: 401, description: "Unauthorized - Authentication required." }),
  ApiResponse({ status: 403, description: "Forbidden - Admin role required." }),
  ApiResponse({ status: 409, description: "Conflict - Coupon code already exists." }),
);
