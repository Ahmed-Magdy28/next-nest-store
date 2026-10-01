import type {
  CartDto,
  AddToCartDto,
  UpdateCartItemDto,
  MergeCartResponseDto,
} from "@repo/shared/dtos/e-commerce";

import { apiClient } from "../common/client";
import { tokenStorage } from "../common/token-storage";

const GUEST_CART_STORAGE_KEY = "guest_cart_token";

export function getStoredGuestToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(GUEST_CART_STORAGE_KEY);
}

export function setStoredGuestToken(token: string | null): void {
  if (typeof window === "undefined") return;
  if (token) {
    localStorage.setItem(GUEST_CART_STORAGE_KEY, token);
  } else {
    localStorage.removeItem(GUEST_CART_STORAGE_KEY);
  }
}

function getGuestCartHeaders(): Record<string, string> | undefined {
  const token = getStoredGuestToken();
  if (token && !tokenStorage.hasAccessToken()) {
    return { "x-guest-cart-token": token };
  }
  return undefined;
}

function syncGuestToken(cart: CartDto): void {
  if (!tokenStorage.hasAccessToken()) {
    if (cart.guestToken) {
      setStoredGuestToken(cart.guestToken);
    }
  } else {
    // Authenticated users don't need a guest cart token
    setStoredGuestToken(null);
  }
}

export async function fetchCart(): Promise<CartDto> {
  const cart = await apiClient.get<CartDto>("/cart", {
    skipRefresh: true,
    headers: getGuestCartHeaders(),
  });
  syncGuestToken(cart);
  return cart;
}

export async function addToCart(body: AddToCartDto): Promise<CartDto> {
  const cart = await apiClient.post<CartDto>("/cart/items", body, {
    skipRefresh: true,
    headers: getGuestCartHeaders(),
  });
  syncGuestToken(cart);
  return cart;
}

export async function updateCartItem(
  itemId: string,
  body: UpdateCartItemDto,
): Promise<CartDto> {
  const cart = await apiClient.patch<CartDto>(`/cart/items/${itemId}`, body, {
    skipRefresh: true,
    headers: getGuestCartHeaders(),
  });
  syncGuestToken(cart);
  return cart;
}

export async function removeCartItem(itemId: string): Promise<CartDto> {
  const cart = await apiClient.delete<CartDto>(`/cart/items/${itemId}`, {
    skipRefresh: true,
    headers: getGuestCartHeaders(),
  });
  syncGuestToken(cart);
  return cart;
}

export async function clearCart(): Promise<CartDto> {
  const cart = await apiClient.delete<CartDto>("/cart", {
    skipRefresh: true,
    headers: getGuestCartHeaders(),
  });
  syncGuestToken(cart);
  return cart;
}

export async function mergeCart(
  guestToken?: string,
): Promise<MergeCartResponseDto> {
  const token = guestToken ?? getStoredGuestToken();
  const res = await apiClient.post<MergeCartResponseDto>(
    "/cart/merge",
    token ? { guestToken: token } : undefined,
    {
      skipRefresh: true,
      headers: token ? { "x-guest-cart-token": token } : undefined,
    },
  );
  setStoredGuestToken(null);
  return res;
}
