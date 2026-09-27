import { applyDecorators } from "@nestjs/common";
import {
  ApiOperation,
  ApiOkResponse,
  ApiParam,
  ApiNotFoundResponse,
} from "@nestjs/swagger";

export const getCategorySwagger = applyDecorators(
  ApiOperation({ summary: "Get a category by id" }),
  ApiParam({
    name: "id",
    description: "Category id",
    type: String,
    format: "uuid",
    example: "550e8400-e29b-41d4-a716-446655440000",
  }),
  ApiOkResponse({ description: "Category details." }),
  ApiNotFoundResponse({ description: "Category not found." }),
);
