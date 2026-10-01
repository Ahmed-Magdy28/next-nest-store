import { apiClient } from "./client";
import type {
  OrderDto,
  PaginatedResultDto,
  UpdateOrderStatusDto,
  UpdatePaymentStatusDto,
} from "@repo/shared/dtos/e-commerce";

export const ordersApi = {
  getOrders(params?: {
    page?: number;
    limit?: number;
    status?: string;
    paymentStatus?: string;
    search?: string;
  }) {
    const query = new URLSearchParams();
    if (params?.page) query.set("page", params.page.toString());
    if (params?.limit) query.set("limit", params.limit.toString());
    if (params?.status) query.set("status", params.status);
    if (params?.paymentStatus) query.set("paymentStatus", params.paymentStatus);
    if (params?.search) query.set("search", params.search);

    const qs = query.toString();
    return apiClient.get<PaginatedResultDto<OrderDto>>(
      `/orders${qs ? `?${qs}` : ""}`,
    );
  },

  getOrder(id: string) {
    return apiClient.get<OrderDto>(`/orders/${id}`);
  },

  updateStatus(id: string, data: UpdateOrderStatusDto) {
    return apiClient.patch<OrderDto>(`/orders/${id}/status`, data);
  },

  updatePaymentStatus(id: string, data: UpdatePaymentStatusDto) {
    return apiClient.patch<OrderDto>(`/orders/${id}/payment-status`, data);
  },
};
