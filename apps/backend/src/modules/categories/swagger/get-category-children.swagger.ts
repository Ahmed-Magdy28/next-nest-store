import { applyDecorators } from "@nestjs/common";
import {
  ApiOperation,
  ApiOkResponse,
  ApiParam,
  ApiNotFoundResponse,
} from "@nestjs/swagger";

export const getCategoryChildrenSwagger = applyDecorators(
  ApiOperation({
    summary: "Get direct children of a category by id",
    description: "Returns the direct children (one level down) of a category.",
  }),
  ApiParam({
    name: "id",
    description: "Parent category id",
    type: String,
    format: "uuid",
    example: "550e8400-e29b-41d4-a716-446655440000",
  }),
  ApiOkResponse({ description: "List of direct children." }),
  ApiNotFoundResponse({ description: "Category not found." }),
);
