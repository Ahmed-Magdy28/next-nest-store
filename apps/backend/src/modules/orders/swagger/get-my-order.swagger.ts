import { applyDecorators } from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
} from "@nestjs/swagger";

export const getMyOrderSwagger = applyDecorators(
  ApiBearerAuth("access-token"),
  ApiOperation({
    summary: "Get single order of current user",
    description: "Retrieve details of a specific order belonging to the currently authenticated user.",
  }),
  ApiParam({
    name: "id",
    type: String,
    format: "uuid",
    description: "Order UUID",
    example: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
  }),
  ApiOkResponse({ description: "Order details." }),
  ApiResponse({ status: 401, description: "Unauthorized - Authentication required." }),
  ApiResponse({ status: 404, description: "Order not found." }),
);
