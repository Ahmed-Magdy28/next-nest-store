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
} from "@nestjs/common";

import { UserRole } from "@repo/database";

import type {
  CategoryDto,
  CategoryTreeDto,
  CreateCategoryDto,
  UpdateCategoryDto,
  ListCategoriesQueryDto,
  PaginatedResultDto,
  ProductDto,
} from "@repo/shared/dtos";

import {
  Public,
  Roles,
  Swagger,
  UseZodValidation,
} from "../../common/decorators";
import { ZodValidationPipe } from "../../common/pipes/zod-validation.pipe";

import { CategoriesService } from "./categories.service";
import {
  createCategorySchema,
  updateCategorySchema,
  listCategoriesQuerySchema,
} from "@repo/shared/schemas/e-commerce/categories";

@Controller("categories")
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  // ─── Public ─────────────────────────────────────────────

  @Public()
  @Get()
  @Swagger("list-categories")
  findAll(
    @Query(new ZodValidationPipe(listCategoriesQuerySchema))
    query: ListCategoriesQueryDto,
  ): Promise<PaginatedResultDto<CategoryDto>> {
    return this.categoriesService.findAll(query);
  }

  @Public()
  @Get("tree")
  @Swagger("category-tree")
  findTree(): Promise<CategoryTreeDto[]> {
    return this.categoriesService.findTree();
  }

  @Public()
  @Get("slug/:slug")
  @Swagger("get-category-by-slug")
  findBySlug(@Param("slug") slug: string): Promise<CategoryDto> {
    return this.categoriesService.findBySlug(slug);
  }

  @Public()
  @Get(":id")
  @Swagger("get-category")
  findById(@Param("id", ParseUUIDPipe) id: string): Promise<CategoryDto> {
    return this.categoriesService.findById(id);
  }

  @Public()
  @Get(":id/children")
  @Swagger("get-category-children")
  findChildrenById(
    @Param("id", ParseUUIDPipe) id: string,
  ): Promise<CategoryDto[]> {
    return this.categoriesService.findChildrenById(id);
  }

  @Public()
  @Get("slug/:slug/children")
  @Swagger("get-category-children-by-slug")
  findChildrenBySlug(@Param("slug") slug: string): Promise<CategoryDto[]> {
    return this.categoriesService.findChildrenBySlug(slug);
  }

  @Public()
  @Get("slug/:slug/products")
  @Swagger("get-category-products-by-slug")
  findProductsBySlug(
    @Param("slug") slug: string,
    @Query("page") page?: string,
    @Query("limit") limit?: string,
    @Query("includeDescendants") includeDescendants?: string,
  ): Promise<PaginatedResultDto<ProductDto>> {
    const pageNum = page ? Number(page) : 1;
    const limitNum = limit ? Number(limit) : 5;
    // ✅ default: true
    const includeDesc = includeDescendants !== "false";
    return this.categoriesService.findProductsByCategorySlug(
      slug,
      pageNum,
      limitNum,
      includeDesc,
    );
  }

  @Public()
  @Get(":id/products")
  @Swagger("get-category-products")
  findProducts(
    @Param("id", ParseUUIDPipe) id: string,
    @Query("page") page?: string,
    @Query("limit") limit?: string,
    @Query("includeDescendants") includeDescendants?: string,
  ): Promise<PaginatedResultDto<ProductDto>> {
    const pageNum = page ? Number(page) : 1;
    const limitNum = limit ? Number(limit) : 5;
    const includeDesc = includeDescendants !== "false";
    return this.categoriesService.findProductsByCategoryId(
      id,
      pageNum,
      limitNum,
      includeDesc,
    );
  }

  // ─── Admin only ─────────────────────────────────────────

  @Post()
  @Roles(UserRole.ADMIN)
  @Swagger("create-category")
  @UseZodValidation(createCategorySchema)
  create(@Body() body: CreateCategoryDto): Promise<CategoryDto> {
    return this.categoriesService.create(body);
  }

  @Patch(":id")
  @Roles(UserRole.ADMIN)
  @Swagger("update-category")
  @UseZodValidation(updateCategorySchema)
  update(
    @Param("id", ParseUUIDPipe) id: string,
    @Body() body: UpdateCategoryDto,
  ): Promise<CategoryDto> {
    return this.categoriesService.update(id, body);
  }

  @Delete(":id")
  @Roles(UserRole.ADMIN)
  @Swagger("delete-category")
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(@Param("id", ParseUUIDPipe) id: string): Promise<void> {
    return this.categoriesService.delete(id);
  }
}
