import { apiClient } from "./client";
import type {
  CategoryDto,
  CategoryTreeDto,
  CreateCategoryDto,
  UpdateCategoryDto,
} from "@repo/shared/dtos/e-commerce";

export const categoriesApi = {
  async getCategories(params?: { limit?: number; page?: number; search?: string; parentId?: string }) {
    const query = new URLSearchParams();
    query.set("limit", String(params?.limit ?? 500));
    if (params?.page) query.set("page", String(params.page));
    if (params?.search) query.set("search", params.search);
    if (params?.parentId) query.set("parentId", params.parentId);

    const res = await apiClient.get<any>(`/categories?${query.toString()}`);
    return (Array.isArray(res) ? res : res?.items ?? []) as CategoryDto[];
  },

  getCategoryTree() {
    return apiClient.get<CategoryTreeDto[]>("/categories/tree");
  },

  getCategory(id: string) {
    return apiClient.get<CategoryDto>(`/categories/${id}`);
  },

  createCategory(data: CreateCategoryDto) {
    return apiClient.post<CategoryDto>("/categories", data);
  },

  updateCategory(id: string, data: UpdateCategoryDto) {
    return apiClient.patch<CategoryDto>(`/categories/${id}`, data);
  },

  deleteCategory(id: string) {
    return apiClient.delete<void>(`/categories/${id}`);
  },
};
