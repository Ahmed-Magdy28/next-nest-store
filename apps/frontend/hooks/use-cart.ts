"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import type {
  AddToCartDto,
  CartDto,
  UpdateCartItemDto,
} from "@repo/shared/dtos/e-commerce";
import { queryKeys } from "../lib/api/e-commerce/query-keys";
import {
  addToCart,
  clearCart,
  fetchCart,
  mergeCart,
  removeCartItem,
  updateCartItem,
} from "../lib/api/e-commerce/cart";

// ─── Read ───────────────────────────────────────────────

export function useCart() {
  return useQuery({
    queryKey: queryKeys.cart,
    queryFn: fetchCart,
    staleTime: 1000 * 30, // 30s
  });
}

// ─── Mutations ──────────────────────────────────────────

export function useAddToCart() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (body: AddToCartDto) => addToCart(body),
    onSuccess: (cart) => {
      qc.setQueryData<CartDto>(queryKeys.cart, cart);
      toast.success("تمت الإضافة إلى السلة");
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "حدث خطأ");
    },
  });
}

export function useUpdateCartItem() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({
      itemId,
      body,
    }: {
      itemId: string;
      body: UpdateCartItemDto;
    }) => updateCartItem(itemId, body),
    onSuccess: (cart) => {
      qc.setQueryData<CartDto>(queryKeys.cart, cart);
    },
  });
}

export function useRemoveCartItem() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (itemId: string) => removeCartItem(itemId),
    onSuccess: (cart) => {
      qc.setQueryData<CartDto>(queryKeys.cart, cart);
    },
  });
}

export function useClearCart() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: clearCart,
    onSuccess: (cart) => {
      qc.setQueryData<CartDto>(queryKeys.cart, cart);
    },
  });
}

export function useMergeCart() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: mergeCart,
    onSuccess: (result) => {
      qc.setQueryData<CartDto>(queryKeys.cart, result.cart);
    },
  });
}
