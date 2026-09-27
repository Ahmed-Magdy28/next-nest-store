import type { Category } from "@repo/database";

import type {
  CategoryDto,
  CategoryTreeDto,
} from "@repo/shared/dtos/e-commerce";

export class CategoryMapper {
  static toDto(category: Category): CategoryDto {
    return {
      id: category.id,
      name: category.name,
      arName: category.arName,
      slug: category.slug,
      image: category.image,
      parentId: category.parentId,
      isActive: category.isActive,
      sortOrder: category.sortOrder,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt,
    };
  }

  static toTree(
    category: Category & { children?: Category[] },
  ): CategoryTreeDto {
    return {
      ...this.toDto(category),
      children: (category.children ?? []).map((child) => this.toTree(child)),
    };
  }
}
