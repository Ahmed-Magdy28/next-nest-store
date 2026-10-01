import { Injectable } from "@nestjs/common";
import { PrismaService, type Category, type Prisma } from "@repo/database";
import { ProductWithRelations } from "@repo/shared";

@Injectable()
export class CategoriesRepository {
  constructor(private readonly prisma: PrismaService) {}

  // ─── Read ───────────────────────────────────────────────

  findById(id: string): Promise<Category | null> {
    return this.prisma.category.findUnique({ where: { id } });
  }

  findBySlug(slug: string): Promise<Category | null> {
    return this.prisma.category.findUnique({ where: { slug } });
  }

  findMany(params: {
    skip: number;
    take: number;
    parentId?: string;
    isActive?: boolean;
    search?: string;
  }): Promise<Category[]> {
    return this.prisma.category.findMany({
      where: this.buildWhere(params),
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
      skip: params.skip,
      take: params.take,
    });
  }

  count(params: {
    parentId?: string;
    isActive?: boolean;
    search?: string;
  }): Promise<number> {
    return this.prisma.category.count({
      where: this.buildWhere(params),
    });
  }

  findAllForTree(): Promise<(Category & { children: Category[] })[]> {
    return this.prisma.category.findMany({
      where: { parentId: null },
      include: {
        children: {
          orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
        },
      },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    }) as Promise<(Category & { children: Category[] })[]>;
  }

  findProductsByCategoryId(
    categoryId: string,
    params: { skip: number; take: number },
  ): Promise<ProductWithRelations[]> {
    return this.prisma.product.findMany({
      where: {
        deletedAt: null,
        categories: {
          some: { categoryId },
        },
      },
      include: {
        categories: {
          include: { category: true },
        },
        variants: {
          where: { isActive: true },
          orderBy: { sortOrder: "asc" },
        },
      },
      orderBy: { createdAt: "desc" },
      skip: params.skip,
      take: params.take,
    });
  }

  async findAllDescendantIds(categoryId: string): Promise<string[]> {
    const all = await this.prisma.category.findMany({
      select: { id: true, parentId: true },
    });

    const childrenMap = new Map<string, string[]>();
    for (const cat of all) {
      if (cat.parentId) {
        if (!childrenMap.has(cat.parentId)) {
          childrenMap.set(cat.parentId, []);
        }
        childrenMap.get(cat.parentId)!.push(cat.id);
      }
    }

    const result: string[] = [categoryId];
    const queue: string[] = [categoryId];

    while (queue.length > 0) {
      const current = queue.shift()!;
      const children = childrenMap.get(current) ?? [];
      for (const child of children) {
        result.push(child);
        queue.push(child);
      }
    }

    return result;
  }

  findProductsByCategoryIds(
    categoryIds: string[],
    params: { skip: number; take: number },
  ): Promise<ProductWithRelations[]> {
    return this.prisma.product.findMany({
      where: {
        deletedAt: null,
        categories: {
          some: {
            categoryId: { in: categoryIds },
          },
        },
      },
      include: {
        categories: {
          include: { category: true },
        },
        variants: {
          where: { isActive: true },
          orderBy: { sortOrder: "asc" },
        },
      },
      orderBy: { createdAt: "desc" },
      skip: params.skip,
      take: params.take,
    });
  }

  countProductsByCategoryIds(categoryIds: string[]): Promise<number> {
    return this.prisma.product.count({
      where: {
        deletedAt: null,
        categories: {
          some: {
            categoryId: { in: categoryIds },
          },
        },
      },
    });
  }

  findAllFlat(): Promise<Category[]> {
    return this.prisma.category.findMany({
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    });
  }

  countProductsByCategoryId(categoryId: string): Promise<number> {
    return this.prisma.product.count({
      where: {
        deletedAt: null,
        categories: {
          some: { categoryId },
        },
      },
    });
  }

  findChildrenByParentId(parentId: string): Promise<Category[]> {
    return this.prisma.category.findMany({
      where: { parentId },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    });
  }

  // ─── Write ──────────────────────────────────────────────

  create(
    data: Prisma.CategoryCreateInput | Prisma.CategoryUncheckedCreateInput,
  ): Promise<Category> {
    return this.prisma.category.create({ data: data as any });
  }

  update(
    id: string,
    data: Prisma.CategoryUpdateInput | Prisma.CategoryUncheckedUpdateInput,
  ): Promise<Category> {
    return this.prisma.category.update({
      where: { id },
      data: data as any,
    });
  }

  delete(id: string): Promise<Category> {
    return this.prisma.category.delete({ where: { id } });
  }

  countChildren(parentId: string): Promise<number> {
    return this.prisma.category.count({ where: { parentId } });
  }

  countProducts(categoryId: string): Promise<number> {
    return this.prisma.productCategory.count({
      where: { categoryId },
    });
  }

  // ─── Helpers ────────────────────────────────────────────

  private buildWhere(params: {
    parentId?: string;
    isActive?: boolean;
    search?: string;
  }): Prisma.CategoryWhereInput {
    const where: Prisma.CategoryWhereInput = {};

    if (params.parentId !== undefined) {
      where.parentId = params.parentId;
    }

    if (params.isActive !== undefined) {
      where.isActive = params.isActive;
    }

    if (params.search) {
      where.OR = [
        { name: { contains: params.search, mode: "insensitive" } },
        { arName: { contains: params.search, mode: "insensitive" } },
        { slug: { contains: params.search, mode: "insensitive" } },
      ];
    }

    return where;
  }
}
