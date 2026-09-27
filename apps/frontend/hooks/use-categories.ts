"use client";

import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "../lib/api/e-commerce/query-keys";
import {
  fetchCategories,
  fetchCategoriesTree,
  fetchCategoryProductsBySlug,
} from "../lib/api/e-commerce/categories";

export function useCategoriesTree() {
  return useQuery({
    queryKey: queryKeys.categories.tree,
    queryFn: fetchCategoriesTree,
    staleTime: 1000 * 60 * 15, // categories don't change often
  });
}

export function useCategories(
  query: { page?: number; limit?: number; search?: string } = {},
) {
  return useQuery({
    queryKey: queryKeys.categories.list(query),
    queryFn: () => fetchCategories(query),
    placeholderData: (previous) => previous,
  });
}

export function useCategoryProducts(
  slug: string | undefined,
  query: {
    page?: number;
    limit?: number;
    includeDescendants?: boolean;
  } = {},
) {
  return useQuery({
    queryKey: queryKeys.categories.products(slug ?? "", query),
    queryFn: () => fetchCategoryProductsBySlug(slug!, query),
    enabled: !!slug,
    placeholderData: (previous) => previous,
  });
}
