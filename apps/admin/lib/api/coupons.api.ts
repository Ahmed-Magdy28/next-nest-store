import { apiClient } from "./client";
import type {
  CouponDto,
  PaginatedResultDto,
  CreateCouponDto,
  UpdateCouponDto,
} from "@repo/shared/dtos/e-commerce";

export const couponsApi = {
  getCoupons(params?: {
    page?: number;
    limit?: number;
    search?: string;
    isActive?: boolean;
  }) {
    const query = new URLSearchParams();
    if (params?.page) query.set("page", params.page.toString());
    if (params?.limit) query.set("limit", params.limit.toString());
    if (params?.search) query.set("search", params.search);
    if (params?.isActive !== undefined)
      query.set("isActive", params.isActive.toString());

    const qs = query.toString();
    return apiClient.get<PaginatedResultDto<CouponDto>>(
      `/coupons${qs ? `?${qs}` : ""}`,
    );
  },

  getCoupon(id: string) {
    return apiClient.get<CouponDto>(`/coupons/${id}`);
  },

  createCoupon(data: CreateCouponDto) {
    return apiClient.post<CouponDto>("/coupons", data);
  },

  updateCoupon(id: string, data: UpdateCouponDto) {
    return apiClient.patch<CouponDto>(`/coupons/${id}`, data);
  },

  deleteCoupon(id: string) {
    return apiClient.delete<void>(`/coupons/${id}`);
  },
};
