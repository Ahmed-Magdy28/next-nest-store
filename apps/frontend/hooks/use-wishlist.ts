"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { WishlistDto, CartDto } from "@repo/shared/dtos/e-commerce";

import {
  fetchWishlist,
  addToWishlist,
  removeFromWishlist,
  clearWishlist,
  moveWishlistItemToCart,
  queryKeys,
} from "../lib/api/e-commerce";
import { tokenStorage } from "../lib/api/common/token-storage";

export function useWishlist() {
  const hasToken = tokenStorage.hasAccessToken();

  return useQuery({
    queryKey: queryKeys.wishlist,
    queryFn: fetchWishlist,
    enabled: hasToken,
    staleTime: 1000 * 60, // 1 min
  });
}

export function useAddToWishlist() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (productId: string) => addToWishlist(productId),
    onSuccess: (data: WishlistDto) => {
      qc.setQueryData(queryKeys.wishlist, data);
      toast.success("تمت الإضافة إلى المفضلة ❤️");
    },
    onError: (e) => {
      if (!tokenStorage.hasAccessToken()) {
        toast.error("يرجى تسجيل الدخول أولاً لإضافة المنتجات للمفضلة");
      } else {
        toast.error(e instanceof Error ? e.message : "فشلت الإضافة للمفضلة");
      }
    },
  });
}

export function useRemoveFromWishlist() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (productId: string) => removeFromWishlist(productId),
    onSuccess: (data: WishlistDto) => {
      qc.setQueryData(queryKeys.wishlist, data);
      toast.success("تمت الإزالة من المفضلة");
    },
    onError: (e) => {
      toast.error(e instanceof Error ? e.message : "فشلت الإزالة من المفضلة");
    },
  });
}

export function useClearWishlist() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: clearWishlist,
    onSuccess: (data: WishlistDto) => {
      qc.setQueryData(queryKeys.wishlist, data);
      toast.success("تم إفراغ قائمة المفضلة");
    },
  });
}

export function useMoveWishlistItemToCart() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (productId: string) => moveWishlistItemToCart(productId),
    onSuccess: (cart: CartDto) => {
      qc.invalidateQueries({ queryKey: queryKeys.wishlist });
      qc.setQueryData(queryKeys.cart, cart);
      toast.success("تم النقل إلى سلة التسوق 🛒");
    },
    onError: (e) => {
      toast.error(e instanceof Error ? e.message : "فشل النقل إلى السلة");
    },
  });
}

export function useIsInWishlist(productId: string): boolean {
  const { data: wishlist } = useWishlist();
  if (!wishlist || !wishlist.items) return false;
  return wishlist.items.some((item) => item.productId === productId);
}
