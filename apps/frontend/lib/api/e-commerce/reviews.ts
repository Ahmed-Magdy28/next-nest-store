import { apiClient } from "../common/client";
import type {
  CreateReviewDto,
  ProductRatingSummaryDto,
  ReviewDto,
  ListReviewsQueryDto,
  PaginatedResultDto,
} from "@repo/shared/dtos/e-commerce";

export const reviewsApi = {
  /**
   * Fetch approved reviews for a specific product
   */
  async getProductReviews(
    productId: string,
    query?: Partial<ListReviewsQueryDto>,
  ): Promise<PaginatedResultDto<ReviewDto>> {
    const searchParams = new URLSearchParams();
    if (query?.page) searchParams.set("page", query.page.toString());
    if (query?.limit) searchParams.set("limit", query.limit.toString());

    const queryString = searchParams.toString();
    const endpoint = `/reviews/products/${productId}${queryString ? `?${queryString}` : ""}`;
    return apiClient.get<PaginatedResultDto<ReviewDto>>(endpoint);
  },

  /**
   * Fetch rating summary (average, count, star distribution) for a product
   */
  async getProductRatingSummary(
    productId: string,
  ): Promise<ProductRatingSummaryDto> {
    return apiClient.get<ProductRatingSummaryDto>(
      `/reviews/products/${productId}/summary`,
    );
  },

  /**
   * Create a review for a product (requires authentication)
   */
  async createReview(data: CreateReviewDto): Promise<ReviewDto> {
    return apiClient.post<ReviewDto>("/reviews", data);
  },

  /**
   * Delete own review or admin deletion
   */
  async deleteReview(reviewId: string): Promise<void> {
    return apiClient.delete<void>(`/reviews/${reviewId}`);
  },
};
