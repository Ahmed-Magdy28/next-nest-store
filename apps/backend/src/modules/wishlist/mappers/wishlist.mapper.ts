import type {
  WishlistDto,
  WishlistItemDto,
} from "@repo/shared/dtos/e-commerce";

import type {
  WishlistItemWithRelations,
  WishlistWithRelations,
} from "../types";

export class WishlistMapper {
  // ─── Wishlist Item ────────────────────────────────────

  static toItemDto(item: WishlistItemWithRelations): WishlistItemDto {
    const product = item.product;

    return {
      id: item.id,
      productId: item.productId,
      product: {
        id: product.id,
        name: product.name,
        arName: product.arName,
        slug: product.slug,
        sku: product.sku,
        mainImage: product.mainImage,
        regularPrice: Number(product.regularPrice),
        discountPrice: Number(product.discountPrice),
        onDiscount: product.onDiscount,
        isAvailable:
          !product.deletedAt && product.isActive && product.isAvailable,
      },
      createdAt: item.createdAt,
    };
  }

  // ─── Wishlist ─────────────────────────────────────────

  static toDto(wishlist: WishlistWithRelations): WishlistDto {
    const items = wishlist.items.map((item) => WishlistMapper.toItemDto(item));

    return {
      id: wishlist.id,
      items,
      itemsCount: items.length,
      updatedAt: wishlist.updatedAt,
    };
  }

  // ─── Empty Wishlist ───────────────────────────────────

  static emptyDto(): WishlistDto {
    return {
      id: "",
      items: [],
      itemsCount: 0,
      updatedAt: new Date(),
    };
  }
}
