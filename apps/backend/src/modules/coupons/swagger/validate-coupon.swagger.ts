import { applyDecorators } from "@nestjs/common";
import {
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
} from "@nestjs/swagger";

export const validateCouponSwagger = applyDecorators(
  ApiOperation({
    summary: "Validate coupon code",
    description: "Validate a coupon code and calculate the discount amount for a given subtotal.",
  }),
  ApiBody({
    schema: {
      type: "object",
      required: ["code"],
      properties: {
        code: { type: "string", example: "SUMMER20" },
        subtotal: { type: "number", example: 150.0, description: "Cart subtotal amount" },
      },
    },
  }),
  ApiOkResponse({
    description: "Coupon validation result including valid flag, discount amount, and reason if invalid.",
    schema: {
      type: "object",
      properties: {
        valid: { type: "boolean", example: true },
        discountAmount: { type: "number", example: 30.0 },
        message: { type: "string", example: "Coupon applied successfully" },
        coupon: {
          type: "object",
          nullable: true,
          properties: {
            id: { type: "string", format: "uuid" },
            code: { type: "string" },
            type: { type: "string", enum: ["PERCENTAGE", "FIXED"] },
            value: { type: "number" },
          },
        },
      },
    },
  }),
  ApiResponse({ status: 400, description: "Validation error - invalid request payload." }),
);
