import { z } from "zod";
import {
  addToCartSchema,
  updateCartItemSchema,
} from "../../../schemas/e-commerce/cart";

// ─── Output DTOs (Response) ────────────────────────────────

export interface CartItemProductDto {
  id: string;
  name: string;
  arName: string;
  slug: string;
  mainImage: string;
  sku: string;
}

export interface CartItemVariantDto {
  id: string;
  name: string;
  arName: string | null;
  attributes: Record<string, any>;
  size: string | null;
}

export interface CartItemDto {
  id: string;
  productId: string;
  variantId: string | null;
  quantity: number;

  priceAtAdd: number;

  product: CartItemProductDto;
  variant: CartItemVariantDto | null;

  currentPrice: number;
  currentStock: number;
  isAvailable: boolean;
  isPriceChanged: boolean;

  subtotal: number;
}

export interface CartDto {
  id: string;
  userId: string | null;
  guestToken: string | null;
  items: CartItemDto[];
  itemsCount: number;
  uniqueItemsCount: number;
  subtotal: number;
  hasUnavailableItems: boolean;
  hasPriceChanges: boolean;
  updatedAt: Date;
}

export interface MergeCartResponseDto {
  cart: CartDto;
  mergedItemsCount: number;
  skippedItemsCount: number;
}

// ─── Input DTOs (Request) — derived from Zod schemas ───────

export type AddToCartDto = z.infer<typeof addToCartSchema>;
export type UpdateCartItemDto = z.infer<typeof updateCartItemSchema>;
