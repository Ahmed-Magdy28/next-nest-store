import type {
  CartDto,
  AddToCartDto,
  UpdateCartItemDto,
  MergeCartResponseDto,
} from "@repo/shared/dtos/e-commerce";

import { apiClient } from "../common/client";

export async function fetchCart(): Promise<CartDto> {
  return apiClient.get<CartDto>("/cart", { skipRefresh: true });
}

export async function addToCart(body: AddToCartDto): Promise<CartDto> {
  return apiClient.post<CartDto>("/cart/items", body, { skipRefresh: true });
}

export async function updateCartItem(
  itemId: string,
  body: UpdateCartItemDto,
): Promise<CartDto> {
  return apiClient.patch<CartDto>(`/cart/items/${itemId}`, body, {
    skipRefresh: true,
  });
}

export async function removeCartItem(itemId: string): Promise<CartDto> {
  return apiClient.delete<CartDto>(`/cart/items/${itemId}`, {
    skipRefresh: true,
  });
}

export async function clearCart(): Promise<CartDto> {
  return apiClient.delete<CartDto>("/cart", { skipRefresh: true });
}

export async function mergeCart(): Promise<MergeCartResponseDto> {
  return apiClient.post<MergeCartResponseDto>("/cart/merge", undefined, {
    skipRefresh: true,
  });
}
