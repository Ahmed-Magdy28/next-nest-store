import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";

import type {
  AddToWishlistDto,
  WishlistDto,
} from "@repo/shared/dtos/e-commerce";
import { MAX_WISHLIST_ITEMS } from "@repo/shared/constants";

import { ProductsRepository } from "../products/repositories/products.repository";
import { WishlistRepository } from "./repositories/wishlist.repository";
import { WishlistMapper } from "./mappers/wishlist.mapper";
import type { WishlistWithRelations } from "./types";

@Injectable()
export class WishlistService {
  constructor(
    private readonly wishlistRepository: WishlistRepository,
    private readonly productsRepository: ProductsRepository,
  ) {}

  // ─────────────────────────────────────────────────────────
  //  Get or Create Wishlist
  // ─────────────────────────────────────────────────────────

  private async getOrCreateWishlist(
    userId: string,
  ): Promise<WishlistWithRelations> {
    let wishlist = await this.wishlistRepository.findByUserId(userId);

    if (!wishlist) {
      wishlist = await this.wishlistRepository.createForUser(userId);
    }

    return wishlist;
  }

  // ─────────────────────────────────────────────────────────
  //  Read
  // ─────────────────────────────────────────────────────────

  async getWishlist(userId: string): Promise<WishlistDto> {
    const wishlist = await this.getOrCreateWishlist(userId);
    return WishlistMapper.toDto(wishlist);
  }

  /**
   * Returns the set of product IDs that the given user has in their wishlist.
   * Used to enrich product responses with `isInWishlist`.
   */
  async getProductIdsInWishlist(userId: string): Promise<Set<string>> {
    return this.wishlistRepository.findProductIdsByUserId(userId);
  }

  // ─────────────────────────────────────────────────────────
  //  Add Item
  // ─────────────────────────────────────────────────────────

  async addItem(userId: string, dto: AddToWishlistDto): Promise<WishlistDto> {
    // 1. Validate product exists and is available
    const product = await this.productsRepository.findById(dto.productId);
    if (!product) {
      throw new NotFoundException("Product not found");
    }

    if (product.deletedAt || !product.isActive) {
      throw new BadRequestException("Product is not available");
    }

    // 2. Get or create wishlist
    const wishlist = await this.getOrCreateWishlist(userId);

    // 3. Check for existing item first (avoid limit bypass on duplicate)
    const alreadyExists = wishlist.items.some(
      (item) => item.productId === dto.productId,
    );

    if (alreadyExists) {
      // Idempotent: return current wishlist without changes
      return WishlistMapper.toDto(wishlist);
    }

    // 4. Enforce max items limit
    if (wishlist.items.length >= MAX_WISHLIST_ITEMS) {
      throw new BadRequestException(
        `Wishlist cannot hold more than ${MAX_WISHLIST_ITEMS} items`,
      );
    }

    // 5. Add item
    await this.wishlistRepository.addItem(wishlist.id, dto.productId);

    // 6. Return updated wishlist
    const updated = await this.wishlistRepository.findById(wishlist.id);
    return WishlistMapper.toDto(updated!);
  }

  // ─────────────────────────────────────────────────────────
  //  Remove Item
  // ─────────────────────────────────────────────────────────

  async removeItem(userId: string, productId: string): Promise<WishlistDto> {
    const wishlist = await this.wishlistRepository.findByUserId(userId);

    if (!wishlist) {
      // Nothing to remove — return an empty wishlist DTO
      return WishlistMapper.emptyDto();
    }

    await this.wishlistRepository.removeItem(wishlist.id, productId);

    const updated = await this.wishlistRepository.findById(wishlist.id);
    return WishlistMapper.toDto(updated!);
  }

  // ─────────────────────────────────────────────────────────
  //  Clear Wishlist
  // ─────────────────────────────────────────────────────────

  async clearWishlist(userId: string): Promise<WishlistDto> {
    const wishlist = await this.wishlistRepository.findByUserId(userId);

    if (!wishlist) {
      return WishlistMapper.emptyDto();
    }

    await this.wishlistRepository.clearItems(wishlist.id);

    const updated = await this.wishlistRepository.findById(wishlist.id);
    return WishlistMapper.toDto(updated!);
  }
}
