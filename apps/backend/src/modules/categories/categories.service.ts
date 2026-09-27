import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";

import type {
  CategoryDto,
  CategoryTreeDto,
  CreateCategoryDto,
  UpdateCategoryDto,
  ListCategoriesQueryDto,
  PaginatedResultDto,
  ProductDto,
} from "@repo/shared/dtos/e-commerce";

import { CategoriesRepository } from "./repositories/categories.repository";
import { CategoryMapper } from "./mappers/category.mapper";
import { ProductMapper } from "../products/mappers/product.mapper";
import { MAX_CHILDREN_CATEGORY_PER_PARENT_CATEGORY } from "@repo/shared/constants/e-commerce";

@Injectable()
export class CategoriesService {
  constructor(private readonly categoriesRepository: CategoriesRepository) {}

  // ─── Read ───────────────────────────────────────────────

  async findAll(
    query: ListCategoriesQueryDto,
  ): Promise<PaginatedResultDto<CategoryDto>> {
    const { page, limit, parentId, isActive, search } = query;

    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      this.categoriesRepository.findMany({
        skip,
        take: limit,
        parentId,
        isActive,
        search,
      }),
      this.categoriesRepository.count({ parentId, isActive, search }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      items: items.map(CategoryMapper.toDto),
      meta: {
        total,
        page,
        limit,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    };
  }

  async findTree(): Promise<CategoryTreeDto[]> {
    const all = await this.categoriesRepository.findAllFlat();

    // 1. نبني map من id → DTO مع children فاضية
    const map = new Map<string, CategoryTreeDto>();
    for (const cat of all) {
      map.set(cat.id, {
        ...CategoryMapper.toDto(cat),
        children: [],
      });
    }

    const roots: CategoryTreeDto[] = [];
    for (const cat of all) {
      const node = map.get(cat.id)!;
      if (cat.parentId && map.has(cat.parentId)) {
        map.get(cat.parentId)!.children.push(node);
      } else {
        roots.push(node);
      }
    }

    return roots;
  }

  async findById(id: string): Promise<CategoryDto> {
    const category = await this.categoriesRepository.findById(id);
    if (!category) {
      throw new NotFoundException("Category not found");
    }
    return CategoryMapper.toDto(category);
  }

  async findBySlug(slug: string): Promise<CategoryDto> {
    const category = await this.categoriesRepository.findBySlug(slug);
    if (!category) {
      throw new NotFoundException("Category not found");
    }
    return CategoryMapper.toDto(category);
  }

  async findProductsByCategoryId(
    categoryId: string,
    page: number,
    limit: number,
    includeDescendants = true, // ← default: true
  ): Promise<PaginatedResultDto<ProductDto>> {
    await this.findById(categoryId);

    // ✅ لو includeDescendants، نجيب كل الـ descendants
    // غير كده، الـ category دي بس
    const categoryIds = includeDescendants
      ? await this.categoriesRepository.findAllDescendantIds(categoryId)
      : [categoryId];

    return this.fetchProductsByCategoryIds(categoryIds, page, limit);
  }

  async findProductsByCategorySlug(
    slug: string,
    page: number,
    limit: number,
    includeDescendants = true,
  ): Promise<PaginatedResultDto<ProductDto>> {
    const category = await this.categoriesRepository.findBySlug(slug);
    if (!category) {
      throw new NotFoundException("Category not found");
    }

    const categoryIds = includeDescendants
      ? await this.categoriesRepository.findAllDescendantIds(category.id)
      : [category.id];

    return this.fetchProductsByCategoryIds(categoryIds, page, limit);
  }

  async findChildrenById(id: string): Promise<CategoryDto[]> {
    // نتأكد إن الـ parent موجود
    await this.findById(id);

    const children = await this.categoriesRepository.findChildrenByParentId(id);
    return children.map(CategoryMapper.toDto);
  }

  async findChildrenBySlug(slug: string): Promise<CategoryDto[]> {
    const parent = await this.categoriesRepository.findBySlug(slug);
    if (!parent) {
      throw new NotFoundException("Category not found");
    }

    const children = await this.categoriesRepository.findChildrenByParentId(
      parent.id,
    );
    return children.map(CategoryMapper.toDto);
  }

  // ─── Write (Admin only) ─────────────────────────────────

  async create(data: CreateCategoryDto): Promise<CategoryDto> {
    const existingSlug = await this.categoriesRepository.findBySlug(data.slug);
    if (existingSlug) {
      throw new ConflictException("Category slug already exists");
    }

    if (data.parentId) {
      const parent = await this.categoriesRepository.findById(data.parentId);
      if (!parent) {
        throw new BadRequestException("Parent category not found");
      }

      // ✅ نتأكد إن الـ parent مش وصل الحد
      const childrenCount = await this.categoriesRepository.countChildren(
        data.parentId,
      );
      if (childrenCount >= MAX_CHILDREN_CATEGORY_PER_PARENT_CATEGORY) {
        throw new ConflictException(
          `Category "${parent.name}" has reached the maximum of ${MAX_CHILDREN_CATEGORY_PER_PARENT_CATEGORY} children.`,
        );
      }
    }

    const category = await this.categoriesRepository.create(data);
    return CategoryMapper.toDto(category);
  }

  async update(id: string, data: UpdateCategoryDto): Promise<CategoryDto> {
    const category = await this.categoriesRepository.findById(id);
    if (!category) {
      throw new NotFoundException("Category not found");
    }

    if (data.slug && data.slug !== category.slug) {
      const existing = await this.categoriesRepository.findBySlug(data.slug);
      if (existing) {
        throw new ConflictException("Category slug already exists");
      }
    }

    if (data.parentId) {
      if (data.parentId === id) {
        throw new BadRequestException("Category cannot be its own parent");
      }

      const parent = await this.categoriesRepository.findById(data.parentId);
      if (!parent) {
        throw new BadRequestException("Parent category not found");
      }
    }

    const updated = await this.categoriesRepository.update(id, data);
    return CategoryMapper.toDto(updated);
  }

  async delete(id: string): Promise<void> {
    const category = await this.categoriesRepository.findById(id);
    if (!category) {
      throw new NotFoundException("Category not found");
    }

    const [childrenCount, productsCount] = await Promise.all([
      this.categoriesRepository.countChildren(id),
      this.categoriesRepository.countProducts(id),
    ]);

    if (childrenCount > 0) {
      throw new ConflictException(
        "Cannot delete a category that has subcategories. Delete them first.",
      );
    }

    if (productsCount > 0) {
      throw new ConflictException(
        "Cannot delete a category that has products. Remove or reassign them first.",
      );
    }

    await this.categoriesRepository.delete(id);
  }

  private async fetchProductsByCategoryIds(
    categoryIds: string[],
    page: number,
    limit: number,
  ): Promise<PaginatedResultDto<ProductDto>> {
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      this.categoriesRepository.findProductsByCategoryIds(categoryIds, {
        skip,
        take: limit,
      }),
      this.categoriesRepository.countProductsByCategoryIds(categoryIds),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      items: items.map((product) => ProductMapper.toDto(product)),
      meta: {
        total,
        page,
        limit,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    };
  }
}
