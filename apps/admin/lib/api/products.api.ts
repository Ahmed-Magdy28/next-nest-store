import { apiClient } from "./client";
import type {
  ProductDto,
  PaginatedResultDto,
  CreateProductDto,
  UpdateProductDto,
} from "@repo/shared/dtos/e-commerce";

export const productsApi = {
  getProducts(params?: {
    page?: number;
    limit?: number;
    search?: string;
    categoryId?: string;
    isActive?: boolean;
    isAvailable?: boolean;
  }) {
    const query = new URLSearchParams();
    if (params?.page) query.set("page", params.page.toString());
    if (params?.limit) query.set("limit", params.limit.toString());
    if (params?.search) query.set("search", params.search);
    if (params?.categoryId) query.set("categoryId", params.categoryId);
    if (params?.isActive !== undefined)
      query.set("isActive", params.isActive.toString());
    if (params?.isAvailable !== undefined)
      query.set("isAvailable", params.isAvailable.toString());

    const qs = query.toString();
    return apiClient.get<PaginatedResultDto<ProductDto>>(
      `/products${qs ? `?${qs}` : ""}`,
    );
  },

  getProduct(id: string) {
    return apiClient.get<ProductDto>(`/products/${id}`);
  },

  createProduct(data: CreateProductDto) {
    return apiClient.post<ProductDto>("/products", data);
  },

  updateProduct(id: string, data: UpdateProductDto) {
    return apiClient.patch<ProductDto>(`/products/${id}`, data);
  },

  deleteProduct(id: string) {
    return apiClient.delete<void>(`/products/${id}`);
  },
};
