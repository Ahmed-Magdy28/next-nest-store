import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common";

import { UserRole } from "@repo/database";

import type {
  ProductDto,
  ProductListItemDto,
  CreateProductDto,
  UpdateProductDto,
  ListProductsQueryDto,
  BulkCreateProductsDto,
  PaginatedResultDto,
  CategoryDto,
} from "@repo/shared/dtos";
import type { JwtUser } from "@repo/shared/interfaces";

import {
  createProductSchema,
  updateProductSchema,
  bulkCreateProductsSchema,
  listProductsQuerySchema,
} from "@repo/shared/schemas";

import {
  CurrentUser,
  OptionalAuth,
  Roles,
  Swagger,
  UseZodValidation,
} from "../../common/decorators";
import { OptionalJwtAuthGuard } from "../../common/guards";
import { ZodValidationPipe } from "../../common/pipes/zod-validation.pipe";

import { ProductsService } from "./products.service";

@Controller("products")
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  // ─── Public (but enriched for logged-in users) ─────────

  @Get()
  @OptionalAuth()
  @UseGuards(OptionalJwtAuthGuard)
  @Swagger("list-products")
  findAll(
    @CurrentUser() user: JwtUser | null,
    @Query(new ZodValidationPipe(listProductsQuerySchema))
    query: ListProductsQueryDto,
  ): Promise<PaginatedResultDto<ProductListItemDto>> {
    return this.productsService.findAll(query, user?.id ?? null);
  }

  @Get("slug/:slug")
  @OptionalAuth()
  @UseGuards(OptionalJwtAuthGuard)
  @Swagger("get-product-by-slug")
  findBySlug(
    @CurrentUser() user: JwtUser | null,
    @Param("slug") slug: string,
  ): Promise<ProductDto> {
    return this.productsService.findBySlug(slug, user?.id ?? null);
  }

  @Get("slug/:slug/categories")
  @Swagger("get-product-categories-by-slug")
  findCategoriesBySlug(@Param("slug") slug: string): Promise<CategoryDto[]> {
    return this.productsService.findCategoriesBySlug(slug);
  }

  @Get(":id")
  @OptionalAuth()
  @UseGuards(OptionalJwtAuthGuard)
  @Swagger("get-product")
  findById(
    @CurrentUser() user: JwtUser | null,
    @Param("id", ParseUUIDPipe) id: string,
  ): Promise<ProductDto> {
    return this.productsService.findById(id, user?.id ?? null);
  }

  @Get(":id/categories")
  @Swagger("get-product-categories")
  findCategoriesById(
    @Param("id", ParseUUIDPipe) id: string,
  ): Promise<CategoryDto[]> {
    return this.productsService.findCategoriesById(id);
  }

  // ─── Admin only ─────────────────────────────────────────

  @Post()
  @Roles(UserRole.ADMIN)
  @Swagger("create-product")
  @UseZodValidation(createProductSchema)
  create(@Body() body: CreateProductDto): Promise<ProductDto> {
    return this.productsService.create(body);
  }

  @Post("bulk")
  @Roles(UserRole.ADMIN)
  @Swagger("bulk-create-products")
  @UseZodValidation(bulkCreateProductsSchema)
  @HttpCode(HttpStatus.CREATED)
  bulkCreate(
    @Body() body: BulkCreateProductsDto,
  ): Promise<{ created: number }> {
    return this.productsService.bulkCreate(body.products);
  }

  @Patch(":id")
  @Roles(UserRole.ADMIN)
  @Swagger("update-product")
  @UseZodValidation(updateProductSchema)
  update(
    @Param("id", ParseUUIDPipe) id: string,
    @Body() body: UpdateProductDto,
  ): Promise<ProductDto> {
    return this.productsService.update(id, body);
  }

  @Delete(":id")
  @Roles(UserRole.ADMIN)
  @Swagger("delete-product")
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(@Param("id", ParseUUIDPipe) id: string): Promise<void> {
    return this.productsService.delete(id);
  }
}
