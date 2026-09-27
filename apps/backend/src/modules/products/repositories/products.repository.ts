import { Injectable } from "@nestjs/common";
import { PrismaService, type Prisma } from "@repo/database";
import type { ProductWithRelations } from "@repo/shared/types/e-commerce";

@Injectable()
export class ProductsRepository {
  constructor(private readonly prisma: PrismaService) {}

  // ─── Read ───────────────────────────────────────────────

  findById(id: string): Promise<ProductWithRelations | null> {
    return this.prisma.product.findUnique({
      where: { id },
      include: {
        categories: {
          include: { category: true },
        },
        variants: {
          where: { isActive: true },
          orderBy: { sortOrder: "asc" },
        },
      },
    });
  }

  findBySlug(slug: string): Promise<ProductWithRelations | null> {
    return this.prisma.product.findUnique({
      where: { slug },
      include: {
        categories: {
          include: { category: true },
        },
        variants: {
          where: { isActive: true },
          orderBy: { sortOrder: "asc" },
        },
      },
    });
  }

  findMany(params: {
    skip: number;
    take: number;
    where: Prisma.ProductWhereInput;
    orderBy: Prisma.ProductOrderByWithRelationInput;
  }): Promise<ProductWithRelations[]> {
    return this.prisma.product.findMany({
      where: params.where,
      include: {
        categories: {
          include: { category: true },
        },
        variants: {
          where: { isActive: true },
          orderBy: { sortOrder: "asc" },
        },
      },
      orderBy: params.orderBy,
      skip: params.skip,
      take: params.take,
    });
  }

  count(where: Prisma.ProductWhereInput): Promise<number> {
    return this.prisma.product.count({ where });
  }

  countAll(): Promise<number> {
    return this.prisma.product.count();
  }

  // ─── Search (by slug / sku / id) ────────────────────────

  async existsBySlug(slug: string, excludeId?: string): Promise<boolean> {
    const result = await this.prisma.product.findFirst({
      where: {
        slug,
        ...(excludeId ? { id: { not: excludeId } } : {}),
      },
      select: { id: true },
    });
    return !!result;
  }

  async existsBySku(sku: string, excludeId?: string): Promise<boolean> {
    const result = await this.prisma.product.findFirst({
      where: {
        sku,
        ...(excludeId ? { id: { not: excludeId } } : {}),
      },
      select: { id: true },
    });
    return !!result;
  }

  async existsById(id: string): Promise<boolean> {
    const result = await this.prisma.product.findFirst({
      where: { id },
      select: { id: true },
    });
    return !!result;
  }

  // ─── Write ──────────────────────────────────────────────

  create(data: Prisma.ProductCreateInput): Promise<ProductWithRelations> {
    return this.prisma.product.create({
      data,
      include: {
        categories: {
          include: { category: true },
        },
        variants: true,
      },
    });
  }

  update(
    id: string,
    data: Prisma.ProductUpdateInput,
  ): Promise<ProductWithRelations> {
    return this.prisma.product.update({
      where: { id },
      data,
      include: {
        categories: {
          include: { category: true },
        },
        variants: {
          where: { isActive: true },
          orderBy: { sortOrder: "asc" },
        },
      },
    });
  }

  delete(id: string): Promise<void> {
    return this.prisma.product.delete({ where: { id } }).then(() => undefined);
  }

  // ─── Bulk ───────────────────────────────────────────────

  /**
   * Bulk create with relations (categories + variants).
   * Uses a transaction so all products are created or none.
   * Not as fast as createMany, but supports relations.
   */
  async bulkCreate(
    data: Prisma.ProductCreateInput[],
  ): Promise<{ count: number }> {
    const result = await this.prisma.$transaction(
      data.map((productData) =>
        this.prisma.product.create({ data: productData }),
      ),
    );
    return { count: result.length };
  }
}
