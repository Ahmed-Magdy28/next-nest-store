import { Injectable } from "@nestjs/common";
import { PrismaService } from "@repo/database";

import type { WishlistWithRelations } from "../types";

@Injectable()
export class WishlistRepository {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Shared include for wishlist queries.
   */
  private readonly fullInclude = {
    items: {
      include: {
        product: {
          select: {
            id: true,
            name: true,
            arName: true,
            slug: true,
            sku: true,
            mainImage: true,
            regularPrice: true,
            discountPrice: true,
            onDiscount: true,
            isActive: true,
            isAvailable: true,
            deletedAt: true,
          },
        },
      },
      orderBy: { createdAt: "desc" as const },
    },
  };

  // ─── Read ─────────────────────────────────────────────

  findByUserId(userId: string): Promise<WishlistWithRelations | null> {
    return this.prisma.wishlist.findUnique({
      where: { userId },
      include: this.fullInclude,
    });
  }

  findById(id: string): Promise<WishlistWithRelations | null> {
    return this.prisma.wishlist.findUnique({
      where: { id },
      include: this.fullInclude,
    });
  }

  /**
   * Returns a map of { productId → true } for a user's wishlist.
   * Used to enrich product responses with `isInWishlist`.
   */
  async findProductIdsByUserId(userId: string): Promise<Set<string>> {
    const items = await this.prisma.wishlistItem.findMany({
      where: { wishlist: { userId } },
      select: { productId: true },
    });

    return new Set(items.map((item) => item.productId));
  }

  // ─── Create ───────────────────────────────────────────

  createForUser(userId: string): Promise<WishlistWithRelations> {
    return this.prisma.wishlist.create({
      data: { userId },
      include: this.fullInclude,
    });
  }

  // ─── Items ────────────────────────────────────────────

  /**
   * Adds a product to the wishlist if not already present.
   * Returns true if a new item was created, false if it already existed.
   */
  async addItem(
    wishlistId: string,
    productId: string,
  ): Promise<{ created: boolean }> {
    const existing = await this.prisma.wishlistItem.findUnique({
      where: {
        wishlistId_productId: { wishlistId, productId },
      },
      select: { id: true },
    });

    if (existing) {
      return { created: false };
    }

    await this.prisma.wishlistItem.create({
      data: { wishlistId, productId },
    });

    return { created: true };
  }

  async removeItem(wishlistId: string, productId: string): Promise<void> {
    await this.prisma.wishlistItem.deleteMany({
      where: { wishlistId, productId },
    });
  }

  async clearItems(wishlistId: string): Promise<void> {
    await this.prisma.wishlistItem.deleteMany({ where: { wishlistId } });
  }

  countItems(wishlistId: string): Promise<number> {
    return this.prisma.wishlistItem.count({ where: { wishlistId } });
  }
}
