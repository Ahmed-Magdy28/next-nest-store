import { applyDecorators } from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiResponse,
} from "@nestjs/swagger";

export const getMyOrdersSwagger = applyDecorators(
  ApiBearerAuth("access-token"),
  ApiOperation({
    summary: "Get current user's orders",
    description: "Paginated list of orders placed by the currently authenticated user.",
  }),
  ApiQuery({ name: "page", required: false, type: Number, example: 1 }),
  ApiQuery({ name: "limit", required: false, type: Number, example: 10 }),
  ApiOkResponse({ description: "Paginated list of user's orders." }),
  ApiResponse({ status: 401, description: "Unauthorized - Authentication required." }),
);
