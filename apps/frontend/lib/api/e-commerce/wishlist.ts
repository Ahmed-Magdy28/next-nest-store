import type { WishlistDto, CartDto } from "@repo/shared/dtos/e-commerce";
import { apiClient } from "../common/client";

export async function fetchWishlist(): Promise<WishlistDto> {
  return apiClient.get<WishlistDto>("/wishlist");
}

export async function addToWishlist(productId: string): Promise<WishlistDto> {
  return apiClient.post<WishlistDto>("/wishlist/items", { productId });
}

export async function removeFromWishlist(
  productId: string,
): Promise<WishlistDto> {
  return apiClient.delete<WishlistDto>(`/wishlist/items/${productId}`);
}

export async function clearWishlist(): Promise<WishlistDto> {
  return apiClient.delete<WishlistDto>("/wishlist");
}

export async function moveWishlistItemToCart(
  productId: string,
): Promise<CartDto> {
  return apiClient.post<CartDto>(`/wishlist/items/${productId}/move-to-cart`);
}
