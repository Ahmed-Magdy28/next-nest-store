"use client";

import { useQuery } from "@tanstack/react-query";

import type { ListProductsQueryDto } from "@repo/shared/dtos/e-commerce";
import { queryKeys } from "../lib/api/e-commerce/query-keys";
import {
  fetchProductBySlug,
  fetchProducts,
} from "../lib/api/e-commerce/products";

export function useProducts(query: Partial<ListProductsQueryDto> = {}) {
  return useQuery({
    queryKey: queryKeys.products.list(query),
    queryFn: () => fetchProducts(query),
    placeholderData: (previous) => previous, // keeps previous page while loading
  });
}

export function useProduct(slug: string | undefined) {
  return useQuery({
    queryKey: queryKeys.products.detail(slug ?? ""),
    queryFn: () => fetchProductBySlug(slug!),
    enabled: !!slug,
  });
}

/**
 * Featured / new / deals — thin wrappers around useProducts
 * with preset filters for the home page sections.
 */
export function useNewArrivals(limit = 8) {
  return useQuery({
    queryKey: queryKeys.products.newArrivals,
    queryFn: () =>
      fetchProducts({
        isNew: true,
        limit,
        sortBy: "createdAt",
        sortOrder: "desc",
      }),
  });
}

export function useDeals(limit = 8) {
  return useQuery({
    queryKey: queryKeys.products.deals,
    queryFn: () =>
      fetchProducts({
        onDiscount: true,
        limit,
        sortBy: "updatedAt",
        sortOrder: "desc",
      }),
  });
}
