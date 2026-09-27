import { applyDecorators } from "@nestjs/common";
import {
  ApiOperation,
  ApiOkResponse,
  ApiParam,
  ApiNotFoundResponse,
} from "@nestjs/swagger";

export const getProductSwagger = applyDecorators(
  ApiOperation({ summary: "Get a product by id" }),
  ApiParam({
    name: "id",
    description: "Product id",
    type: String,
    format: "uuid",
  }),
  ApiOkResponse({ description: "Product details." }),
  ApiNotFoundResponse({ description: "Product not found." }),
);
