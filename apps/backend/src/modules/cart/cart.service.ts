import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { randomUUID } from "node:crypto";

import type {
  AddToCartDto,
  CartDto,
  MergeCartResponseDto,
  UpdateCartItemDto,
} from "@repo/shared/dtos/e-commerce";
import { MAX_CART_ITEMS, MAX_CART_ITEM_QUANTITY } from "@repo/shared/constants";

import { ProductsRepository } from "../products/repositories/products.repository";
import { CartRepository } from "./repositories/cart.repository";
import { CartMapper } from "./mappers/cart.mapper";
import type { CartWithRelations } from "./types";

@Injectable()
export class CartService {
  constructor(
    private readonly cartRepository: CartRepository,
    private readonly productsRepository: ProductsRepository,
  ) {}

  // ─────────────────────────────────────────────────────────
  //  Get or Create Cart
  // ─────────────────────────────────────────────────────────

  /**
   * Returns the cart for the given user, or creates one.
   * For guests, uses the provided guestToken or creates a new one.
   */
  async getOrCreateCart(
    userId: string | null,
    guestToken: string | null,
  ): Promise<{ cart: CartWithRelations; guestToken: string | null }> {
    if (userId) {
      let cart = await this.cartRepository.findByUserId(userId);
      if (!cart) {
        cart = await this.cartRepository.createForUser(userId);
      }
      return { cart, guestToken: null };
    }

    // Guest flow
    if (guestToken) {
      const existing = await this.cartRepository.findByGuestToken(guestToken);
      if (existing) {
        return { cart: existing, guestToken };
      }
    }

    const newToken = guestToken ?? randomUUID();
    const cart = await this.cartRepository.createForGuest(newToken);
    return { cart, guestToken: newToken };
  }

  /**
   * Read-only cart fetch (creates an empty cart if none exists).
   */
  async getCart(
    userId: string | null,
    guestToken: string | null,
  ): Promise<CartDto> {
    const { cart } = await this.getOrCreateCart(userId, guestToken);
    return CartMapper.toDto(cart);
  }

  // ─────────────────────────────────────────────────────────
  //  Add Item
  // ─────────────────────────────────────────────────────────

  async addItem(
    userId: string | null,
    guestToken: string | null,
    dto: AddToCartDto,
  ): Promise<{ cart: CartDto; guestToken: string | null }> {
    // 1. Validate product
    const product = await this.productsRepository.findById(dto.productId);
    if (!product) {
      throw new NotFoundException("Product not found");
    }

    if (product.deletedAt || !product.isActive) {
      throw new BadRequestException("Product is not available");
    }

    // 2. Determine price + stock
    let priceAtAdd: number;
    let availableStock: number;

    if (product.variants.length > 0) {
      if (!dto.variantId) {
        throw new BadRequestException("Variant is required for this product");
      }

      const variant = product.variants.find((v) => v.id === dto.variantId);
      if (!variant || !variant.isActive) {
        throw new NotFoundException("Variant not found or inactive");
      }
      if (!variant.isAvailable) {
        throw new BadRequestException("Variant is not available");
      }

      priceAtAdd = Number(
        variant.discountPrice ?? variant.regularPrice ?? product.discountPrice,
      );
      availableStock = variant.stockQuantity;
    } else {
      if (dto.variantId) {
        throw new BadRequestException("This product has no variants");
      }

      priceAtAdd = Number(product.discountPrice);
      // Products without variants manage stock at product level
      // (adjust here if you add stockQuantity to Product)
      availableStock = Number.MAX_SAFE_INTEGER;
    }

    if (availableStock < dto.quantity) {
      throw new BadRequestException(
        `Not enough stock. Available: ${availableStock}`,
      );
    }

    // 3. Get or create cart
    const { cart, guestToken: returnedToken } = await this.getOrCreateCart(
      userId,
      guestToken,
    );

    // 4. Enforce cart limits
    const existingItem = cart.items.find(
      (item) =>
        item.productId === dto.productId &&
        item.variantId === (dto.variantId ?? null),
    );

    const isNewItem = !existingItem;
    if (isNewItem && cart.items.length >= MAX_CART_ITEMS) {
      throw new BadRequestException(
        `Cart cannot hold more than ${MAX_CART_ITEMS} items`,
      );
    }

    const currentQtyInCart = existingItem?.quantity ?? 0;
    const newQty = currentQtyInCart + dto.quantity;

    if (newQty > availableStock) {
      throw new BadRequestException(
        `Not enough stock. Available: ${availableStock}, in cart: ${currentQtyInCart}`,
      );
    }

    if (newQty > MAX_CART_ITEM_QUANTITY) {
      throw new BadRequestException(
        `Maximum quantity per item is ${MAX_CART_ITEM_QUANTITY}`,
      );
    }

    // 5. Upsert item
    await this.cartRepository.upsertItem({
      cartId: cart.id,
      productId: dto.productId,
      variantId: dto.variantId ?? null,
      quantity: dto.quantity,
      priceAtAdd,
    });

    const updatedCart = await this.cartRepository.findById(cart.id);

    return {
      cart: CartMapper.toDto(updatedCart!),
      guestToken: returnedToken,
    };
  }

  // ─────────────────────────────────────────────────────────
  //  Update Item Quantity
  // ─────────────────────────────────────────────────────────

  async updateItemQuantity(
    userId: string | null,
    guestToken: string | null,
    itemId: string,
    dto: UpdateCartItemDto,
  ): Promise<CartDto> {
    const cart = await this.resolveCart(userId, guestToken);

    const item = await this.cartRepository.findItemById(itemId);
    if (!item) {
      throw new NotFoundException("Cart item not found");
    }
    if (item.cartId !== cart.id) {
      throw new BadRequestException("Item does not belong to this cart");
    }

    // Validate stock
    const product = await this.productsRepository.findById(item.productId);
    if (!product) {
      throw new NotFoundException("Product not found");
    }

    let availableStock = Number.MAX_SAFE_INTEGER;
    if (item.variantId) {
      const variant = product.variants.find((v) => v.id === item.variantId);
      if (!variant) {
        throw new NotFoundException("Variant not found");
      }
      availableStock = variant.stockQuantity;
    }

    if (dto.quantity > availableStock) {
      throw new BadRequestException(
        `Not enough stock. Available: ${availableStock}`,
      );
    }

    await this.cartRepository.updateItemQuantity(itemId, dto.quantity);

    const updatedCart = await this.cartRepository.findById(cart.id);
    return CartMapper.toDto(updatedCart!);
  }

  // ─────────────────────────────────────────────────────────
  //  Remove Item
  // ─────────────────────────────────────────────────────────

  async removeItem(
    userId: string | null,
    guestToken: string | null,
    itemId: string,
  ): Promise<CartDto> {
    const cart = await this.resolveCart(userId, guestToken);

    const item = await this.cartRepository.findItemById(itemId);
    if (!item) {
      throw new NotFoundException("Cart item not found");
    }
    if (item.cartId !== cart.id) {
      throw new BadRequestException("Item does not belong to this cart");
    }

    await this.cartRepository.removeItem(itemId);

    const updatedCart = await this.cartRepository.findById(cart.id);
    return CartMapper.toDto(updatedCart!);
  }

  // ─────────────────────────────────────────────────────────
  //  Clear Cart
  // ─────────────────────────────────────────────────────────

  async clearCart(
    userId: string | null,
    guestToken: string | null,
  ): Promise<CartDto> {
    const cart = await this.resolveCart(userId, guestToken);
    await this.cartRepository.clearItems(cart.id);

    const updatedCart = await this.cartRepository.findById(cart.id);
    return CartMapper.toDto(updatedCart!);
  }

  // ─────────────────────────────────────────────────────────
  //  Merge Guest Cart → User Cart
  // ─────────────────────────────────────────────────────────

  async mergeGuestCart(
    userId: string,
    guestToken: string,
  ): Promise<MergeCartResponseDto> {
    const guestCart = await this.cartRepository.findByGuestToken(guestToken);

    // No guest cart or empty → just return the user cart
    if (!guestCart || guestCart.items.length === 0) {
      const { cart } = await this.getOrCreateCart(userId, null);
      return {
        cart: CartMapper.toDto(cart),
        mergedItemsCount: 0,
        skippedItemsCount: 0,
      };
    }

    const { cart: userCart } = await this.getOrCreateCart(userId, null);

    const result = await this.cartRepository.runTransaction(async (tx) =>
      this.cartRepository.mergeCarts(tx, guestCart.id, userCart.id),
    );

    const updatedCart = await this.cartRepository.findById(userCart.id);

    return {
      cart: CartMapper.toDto(updatedCart!),
      mergedItemsCount: result.mergedCount,
      skippedItemsCount: result.skippedCount,
    };
  }

  // ─────────────────────────────────────────────────────────
  //  Helpers
  // ─────────────────────────────────────────────────────────

  private async resolveCart(
    userId: string | null,
    guestToken: string | null,
  ): Promise<CartWithRelations> {
    let cart: CartWithRelations | null = null;

    if (userId) {
      cart = await this.cartRepository.findByUserId(userId);
    } else if (guestToken) {
      cart = await this.cartRepository.findByGuestToken(guestToken);
    }

    if (!cart) {
      throw new NotFoundException("Cart not found");
    }

    return cart;
  }
}
