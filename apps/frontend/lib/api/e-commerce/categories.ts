import type {
  CategoryDto,
  CategoryTreeDto,
  PaginatedResultDto,
  ProductDto,
  ListCategoriesQueryDto,
} from "@repo/shared/dtos/e-commerce";

import { apiClient } from "../common/client";

export async function fetchCategoriesTree(): Promise<CategoryTreeDto[]> {
  return apiClient.get<CategoryTreeDto[]>("/categories/tree", {
    skipRefresh: true,
  });
}

export async function fetchCategories(
  query: Partial<ListCategoriesQueryDto> = {},
): Promise<PaginatedResultDto<CategoryDto>> {
  const searchParams = new URLSearchParams();

  Object.entries(query).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;
    searchParams.set(key, String(value));
  });

  const qs = searchParams.toString();
  const path = qs ? `/categories?${qs}` : "/categories";

  return apiClient.get<PaginatedResultDto<CategoryDto>>(path, {
    skipRefresh: true,
  });
}

export async function fetchCategoryProductsBySlug(
  slug: string,
  query: {
    page?: number;
    limit?: number;
    includeDescendants?: boolean;
  } = {},
): Promise<PaginatedResultDto<ProductDto>> {
  const searchParams = new URLSearchParams();

  Object.entries(query).forEach(([key, value]) => {
    if (value === undefined || value === null) return;
    searchParams.set(key, String(value));
  });

  const qs = searchParams.toString();
  const path = `/categories/slug/${slug}/products${qs ? `?${qs}` : ""}`;

  return apiClient.get<PaginatedResultDto<ProductDto>>(path, {
    skipRefresh: true,
  });
}
