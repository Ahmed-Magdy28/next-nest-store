import { applyDecorators } from "@nestjs/common";
import { ApiOperation, ApiOkResponse } from "@nestjs/swagger";

export const categoryTreeSwagger = applyDecorators(
  ApiOperation({
    summary: "Get full category tree",
    description: "Returns all root categories with their children recursively.",
  }),
  ApiOkResponse({ description: "Hierarchical category tree." }),
);
