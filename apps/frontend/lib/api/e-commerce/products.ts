import type {
  ProductDto,
  ProductListItemDto,
  ListProductsQueryDto,
} from "@repo/shared/dtos/e-commerce";
import type { PaginatedResultDto } from "@repo/shared/dtos/e-commerce";

import { apiClient } from "../common/client";

/**
 * Products API.
 * All functions are typed using the shared DTOs so the UI stays in sync
 * with the backend contracts.
 */

export async function fetchProducts(
  query: Partial<ListProductsQueryDto> = {},
): Promise<PaginatedResultDto<ProductListItemDto>> {
  const searchParams = new URLSearchParams();

  Object.entries(query).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;
    searchParams.set(key, String(value));
  });

  const qs = searchParams.toString();
  const path = qs ? `/products?${qs}` : "/products";

  return apiClient.get<PaginatedResultDto<ProductListItemDto>>(path, {
    skipRefresh: true,
  });
}

export async function fetchProductBySlug(slug: string): Promise<ProductDto> {
  return apiClient.get<ProductDto>(`/products/slug/${slug}`, {
    skipRefresh: true,
  });
}
