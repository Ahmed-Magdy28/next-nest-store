import { Injectable } from "@nestjs/common";
import { PrismaService, type Prisma } from "@repo/database";

import type { CartWithRelations } from "../types";

@Injectable()
export class CartRepository {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Shared include for cart queries.
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
        variant: {
          select: {
            id: true,
            name: true,
            arName: true,
            size: true,
            attributes: true,
            regularPrice: true,
            discountPrice: true,
            stockQuantity: true,
            isActive: true,
            isAvailable: true,
          },
        },
      },
      orderBy: { createdAt: "desc" as const },
    },
  };

  // ─── Read ─────────────────────────────────────────────

  findByUserId(userId: string): Promise<CartWithRelations | null> {
    return this.prisma.cart.findUnique({
      where: { userId },
      include: this.fullInclude,
    });
  }

  findByGuestToken(guestToken: string): Promise<CartWithRelations | null> {
    return this.prisma.cart.findUnique({
      where: { guestToken },
      include: this.fullInclude,
    });
  }

  findById(id: string): Promise<CartWithRelations | null> {
    return this.prisma.cart.findUnique({
      where: { id },
      include: this.fullInclude,
    });
  }

  // ─── Create ───────────────────────────────────────────

  createForUser(userId: string): Promise<CartWithRelations> {
    return this.prisma.cart.create({
      data: { userId },
      include: this.fullInclude,
    });
  }

  createForGuest(guestToken: string): Promise<CartWithRelations> {
    return this.prisma.cart.create({
      data: { guestToken },
      include: this.fullInclude,
    });
  }

  // ─── Items ────────────────────────────────────────────

  /**
   * Upsert a cart item using `variantKey` to work around NULL uniqueness in Postgres.
   * `variantKey` is "none" when there is no variant, or the variantId otherwise.
   */
  async upsertItem(data: {
    cartId: string;
    productId: string;
    variantId: string | null;
    quantity: number;
    priceAtAdd: number;
  }) {
    const variantKey = data.variantId ?? "none";

    return this.prisma.cartItem.upsert({
      where: {
        cartId_productId_variantKey: {
          cartId: data.cartId,
          productId: data.productId,
          variantKey,
        },
      },
      create: {
        cartId: data.cartId,
        productId: data.productId,
        variantId: data.variantId,
        variantKey,
        quantity: data.quantity,
        priceAtAdd: data.priceAtAdd,
      },
      update: {
        quantity: { increment: data.quantity },
        priceAtAdd: data.priceAtAdd,
      },
    });
  }

  findItemById(id: string) {
    return this.prisma.cartItem.findUnique({ where: { id } });
  }

  updateItemQuantity(id: string, quantity: number) {
    return this.prisma.cartItem.update({
      where: { id },
      data: { quantity },
    });
  }

  removeItem(id: string) {
    return this.prisma.cartItem.delete({ where: { id } });
  }

  clearItems(cartId: string) {
    return this.prisma.cartItem.deleteMany({ where: { cartId } });
  }

  // ─── Merge (Guest → User) ─────────────────────────────

  /**
   * Merge all items from sourceCart into targetCart.
   * Existing items with the same product+variant are summed by quantity.
   * Source cart is deleted after merge.
   */
  async mergeCarts(
    tx: Prisma.TransactionClient,
    sourceCartId: string,
    targetCartId: string,
  ): Promise<{ mergedCount: number; skippedCount: number }> {
    const sourceItems = await tx.cartItem.findMany({
      where: { cartId: sourceCartId },
    });

    let mergedCount = 0;
    const skippedCount = 0;

    for (const item of sourceItems) {
      const existing = await tx.cartItem.findFirst({
        where: {
          cartId: targetCartId,
          productId: item.productId,
          variantKey: item.variantKey,
        },
      });

      if (existing) {
        await tx.cartItem.update({
          where: { id: existing.id },
          data: { quantity: { increment: item.quantity } },
        });
      } else {
        await tx.cartItem.create({
          data: {
            cartId: targetCartId,
            productId: item.productId,
            variantId: item.variantId,
            variantKey: item.variantKey,
            quantity: item.quantity,
            priceAtAdd: item.priceAtAdd,
          },
        });
      }
      mergedCount++;
    }

    await tx.cart.delete({ where: { id: sourceCartId } });

    return { mergedCount, skippedCount };
  }

  // ─── Transaction helper ───────────────────────────────

  async runTransaction<T>(
    fn: (tx: Prisma.TransactionClient) => Promise<T>,
  ): Promise<T> {
    return this.prisma.$transaction(fn);
  }
}
