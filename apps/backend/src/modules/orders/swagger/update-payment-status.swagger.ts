import { applyDecorators } from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
} from "@nestjs/swagger";

export const updatePaymentStatusSwagger = applyDecorators(
  ApiBearerAuth("access-token"),
  ApiOperation({
    summary: "Update payment status (Admin)",
    description: "Update payment status of an order (PENDING, PAID, FAILED, REFUNDED).",
  }),
  ApiParam({
    name: "id",
    type: String,
    format: "uuid",
    description: "Order UUID",
    example: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
  }),
  ApiBody({
    schema: {
      type: "object",
      required: ["paymentStatus"],
      properties: {
        paymentStatus: {
          type: "string",
          enum: ["UNPAID", "PAID", "FAILED", "REFUNDED"],
          example: "PAID",
        },
      },
    },
  }),
  ApiOkResponse({ description: "Payment status updated successfully." }),
  ApiResponse({ status: 400, description: "Validation error." }),
  ApiResponse({ status: 401, description: "Unauthorized - Authentication required." }),
  ApiResponse({ status: 403, description: "Forbidden - Admin role required." }),
  ApiResponse({ status: 404, description: "Order not found." }),
);
