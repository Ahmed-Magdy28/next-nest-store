import { applyDecorators } from "@nestjs/common";
import {
  ApiOperation,
  ApiOkResponse,
  ApiParam,
  ApiNotFoundResponse,
} from "@nestjs/swagger";

export const getCategoryChildrenBySlugSwagger = applyDecorators(
  ApiOperation({
    summary: "Get direct children of a category by slug",
    description: "Returns the direct children (one level down) of a category.",
  }),
  ApiParam({
    name: "slug",
    description: "Parent category slug",
    type: String,
    example: "electronics",
  }),
  ApiOkResponse({ description: "List of direct children." }),
  ApiNotFoundResponse({ description: "Category not found." }),
);
