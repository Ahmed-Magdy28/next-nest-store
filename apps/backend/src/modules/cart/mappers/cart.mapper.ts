import type { CartDto, CartItemDto } from "@repo/shared/dtos/e-commerce";

import type { CartItemWithRelations, CartWithRelations } from "../types";

export class CartMapper {
  // ─── Cart Item ────────────────────────────────────────

  static toItemDto(item: CartItemWithRelations): CartItemDto {
    const product = item.product;
    const variant = item.variant;

    // Compute current effective price
    const currentPrice = variant
      ? Number(
          variant.discountPrice ??
            variant.regularPrice ??
            product.discountPrice,
        )
      : Number(product.discountPrice);

    // Stock: only variants track stock. Products without variants are
    // considered available (stock is managed at the product level elsewhere).
    const currentStock = variant
      ? variant.stockQuantity
      : Number.MAX_SAFE_INTEGER;

    const isAvailable =
      !product.deletedAt &&
      product.isActive &&
      product.isAvailable &&
      (variant
        ? variant.isActive && variant.isAvailable && currentStock > 0
        : true);

    const priceAtAdd = Number(item.priceAtAdd);
    const subtotal = currentPrice * item.quantity;
    const isPriceChanged = priceAtAdd !== currentPrice;

    return {
      id: item.id,
      productId: item.productId,
      variantId: item.variantId,
      quantity: item.quantity,
      priceAtAdd,
      product: {
        id: product.id,
        name: product.name,
        arName: product.arName,
        slug: product.slug,
        mainImage: product.mainImage,
        sku: product.sku,
      },
      variant: variant
        ? {
            id: variant.id,
            name: variant.name,
            arName: variant.arName,
            attributes: (variant.attributes ?? {}) as Record<string, unknown>,
            size: variant.size,
          }
        : null,
      currentPrice,
      currentStock,
      isAvailable,
      isPriceChanged,
      subtotal,
    };
  }

  // ─── Cart ─────────────────────────────────────────────

  static toDto(cart: CartWithRelations): CartDto {
    const items = cart.items.map((item) => CartMapper.toItemDto(item));

    const itemsCount = items.reduce((sum, item) => sum + item.quantity, 0);
    const uniqueItemsCount = items.length;

    // Only available items count toward the subtotal
    const subtotal = items
      .filter((item) => item.isAvailable)
      .reduce((sum, item) => sum + item.subtotal, 0);

    const hasUnavailableItems = items.some((item) => !item.isAvailable);
    const hasPriceChanges = items.some((item) => item.isPriceChanged);

    return {
      id: cart.id,
      userId: cart.userId,
      guestToken: cart.guestToken,
      items,
      itemsCount,
      uniqueItemsCount,
      subtotal,
      hasUnavailableItems,
      hasPriceChanges,
      updatedAt: cart.updatedAt,
    };
  }

  // ─── Empty Cart ───────────────────────────────────────

  static emptyDto(guestToken?: string | null): CartDto {
    return {
      id: "",
      userId: null,
      guestToken: guestToken ?? null,
      items: [],
      itemsCount: 0,
      uniqueItemsCount: 0,
      subtotal: 0,
      hasUnavailableItems: false,
      hasPriceChanges: false,
      updatedAt: new Date(),
    };
  }
}
