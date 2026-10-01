import { applyDecorators } from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiOperation,
  ApiResponse,
} from "@nestjs/swagger";

export const createOrderSwagger = applyDecorators(
  ApiBearerAuth("access-token"),
  ApiOperation({
    summary: "Create order from current cart",
    description: "Create an order using the items in the user's active cart. Clears the cart upon success.",
  }),
  ApiBody({
    schema: {
      type: "object",
      required: [
        "customerName",
        "customerEmail",
        "customerPhone",
        "shippingAddress",
        "paymentMethod",
      ],
      properties: {
        customerName: { type: "string", example: "John Doe" },
        customerEmail: { type: "string", format: "email", example: "john@example.com" },
        customerPhone: { type: "string", example: "+201234567890" },
        shippingAddress: {
          type: "object",
          required: ["street", "city", "country"],
          properties: {
            street: { type: "string", example: "123 Main St" },
            city: { type: "string", example: "Cairo" },
            state: { type: "string", example: "Cairo Governorate" },
            postalCode: { type: "string", example: "11511" },
            country: { type: "string", example: "Egypt" },
          },
        },
        paymentMethod: {
          type: "string",
          enum: ["CASH_ON_DELIVERY", "CREDIT_CARD", "PAYPAL", "STRIPE"],
          example: "CASH_ON_DELIVERY",
        },
        couponCode: { type: "string", example: "SUMMER20", nullable: true },
        notes: { type: "string", example: "Deliver after 5 PM", nullable: true },
      },
    },
  }),
  ApiCreatedResponse({ description: "Order created successfully." }),
  ApiResponse({ status: 400, description: "Validation error or cart is empty." }),
  ApiResponse({ status: 401, description: "Unauthorized - Authentication required." }),
);
