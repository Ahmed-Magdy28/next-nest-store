"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type {
  CreateOrderDto,
  ListOrdersQueryDto,
  OrderDto,
} from "@repo/shared/dtos/e-commerce";

import {
  createOrder,
  fetchMyOrderById,
  fetchMyOrders,
  queryKeys,
} from "../lib/api/e-commerce";

export function useMyOrders(params: Partial<ListOrdersQueryDto> = {}) {
  return useQuery({
    queryKey: queryKeys.orders.myList(params),
    queryFn: () => fetchMyOrders(params),
    staleTime: 1000 * 60, // 1 minute
  });
}

export function useMyOrder(id: string) {
  return useQuery({
    queryKey: queryKeys.orders.myDetail(id),
    queryFn: () => fetchMyOrderById(id),
    enabled: Boolean(id),
  });
}

export function useCreateOrder() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (body: CreateOrderDto) => createOrder(body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.cart });
      qc.invalidateQueries({ queryKey: queryKeys.orders.all });
      toast.success("تم تأكيد الطلب بنجاح! 🎉");
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "فشل إنشاء الطلب");
    },
  });
}
