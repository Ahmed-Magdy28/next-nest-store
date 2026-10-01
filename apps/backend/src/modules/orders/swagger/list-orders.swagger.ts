import { applyDecorators } from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiResponse,
} from "@nestjs/swagger";

export const listOrdersSwagger = applyDecorators(
  ApiBearerAuth("access-token"),
  ApiOperation({
    summary: "List all orders (Admin)",
    description: "Paginated list of orders with optional status, paymentStatus, and search filters.",
  }),
  ApiQuery({ name: "page", required: false, type: Number, example: 1 }),
  ApiQuery({ name: "limit", required: false, type: Number, example: 10 }),
  ApiQuery({
    name: "status",
    required: false,
    enum: ["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED", "REFUNDED"],
  }),
  ApiQuery({
    name: "paymentStatus",
    required: false,
    enum: ["UNPAID", "PAID", "FAILED", "REFUNDED"],
  }),
  ApiQuery({ name: "search", required: false, type: String, description: "Search by order number, customer name, email, or phone" }),
  ApiOkResponse({ description: "Paginated list of orders." }),
  ApiResponse({ status: 401, description: "Unauthorized - Authentication required." }),
  ApiResponse({ status: 403, description: "Forbidden - Admin role required." }),
);
