import { z } from "zod";
import { addToWishlistSchema } from "../../../schemas/e-commerce/wishlist";

// ─── Output DTOs (Response) ────────────────────────────────

export interface WishlistItemProductDto {
  id: string;
  name: string;
  arName: string;
  slug: string;
  sku: string;
  mainImage: string;
  regularPrice: number;
  discountPrice: number;
  onDiscount: boolean;
  isAvailable: boolean;
}

export interface WishlistItemDto {
  id: string;
  productId: string;
  product: WishlistItemProductDto;
  createdAt: Date;
}

export interface WishlistDto {
  id: string;
  items: WishlistItemDto[];
  itemsCount: number;
  updatedAt: Date;
}

// ─── Input DTOs (Request) — derived from Zod schemas ───────

export type AddToWishlistDto = z.infer<typeof addToWishlistSchema>;
