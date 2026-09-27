import { applyDecorators } from "@nestjs/common";
import {
  ApiOperation,
  ApiOkResponse,
  ApiParam,
  ApiNotFoundResponse,
} from "@nestjs/swagger";

export const getCategoryBySlugSwagger = applyDecorators(
  ApiOperation({ summary: "Get a category by slug" }),
  ApiParam({
    name: "slug",
    description: "Category slug",
    type: String,
    example: "electronics",
  }),
  ApiOkResponse({ description: "Category details." }),
  ApiNotFoundResponse({ description: "Category not found." }),
);
