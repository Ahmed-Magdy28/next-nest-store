import { applyDecorators } from "@nestjs/common";
import {
  ApiOperation,
  ApiOkResponse,
  ApiParam,
  ApiNotFoundResponse,
} from "@nestjs/swagger";

export const getProductBySlugSwagger = applyDecorators(
  ApiOperation({ summary: "Get a product by slug" }),
  ApiParam({ name: "slug", description: "Product slug", type: String }),
  ApiOkResponse({ description: "Product details." }),
  ApiNotFoundResponse({ description: "Product not found." }),
);
