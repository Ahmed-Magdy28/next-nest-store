import { apiClient } from "./client";
import type {
  ReviewDto,
  PaginatedResultDto,
  ModerateReviewDto,
} from "@repo/shared/dtos/e-commerce";

export const reviewsApi = {
  getReviews(params?: {
    page?: number;
    limit?: number;
    productId?: string;
    isApproved?: boolean;
  }) {
    const query = new URLSearchParams();
    if (params?.page) query.set("page", params.page.toString());
    if (params?.limit) query.set("limit", params.limit.toString());
    if (params?.productId) query.set("productId", params.productId);
    if (params?.isApproved !== undefined)
      query.set("isApproved", params.isApproved.toString());

    const qs = query.toString();
    return apiClient.get<PaginatedResultDto<ReviewDto>>(
      `/reviews${qs ? `?${qs}` : ""}`,
    );
  },

  moderate(id: string, data: ModerateReviewDto) {
    return apiClient.patch<ReviewDto>(`/reviews/${id}/moderate`, data);
  },

  delete(id: string) {
    return apiClient.delete<void>(`/reviews/${id}`);
  },
};
