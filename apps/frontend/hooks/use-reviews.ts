import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { reviewsApi } from "../lib/api/e-commerce/reviews";
import { queryKeys } from "../lib/api/e-commerce/query-keys";
import type {
  CreateReviewDto,
  ListReviewsQueryDto,
} from "@repo/shared/dtos/e-commerce";

export function useProductReviews(
  productId: string,
  query?: Partial<ListReviewsQueryDto>,
) {
  return useQuery({
    queryKey: queryKeys.reviews.product(
      productId,
      query as Record<string, unknown>,
    ),
    queryFn: () => reviewsApi.getProductReviews(productId, query),
    enabled: Boolean(productId),
  });
}

export function useProductRatingSummary(productId: string) {
  return useQuery({
    queryKey: queryKeys.reviews.summary(productId),
    queryFn: () => reviewsApi.getProductRatingSummary(productId),
    enabled: Boolean(productId),
  });
}

export function useCreateReview(productId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateReviewDto) => reviewsApi.createReview(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["reviews", "product", productId],
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.reviews.summary(productId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.products.detail(productId),
      });
    },
  });
}

export function useDeleteReview(productId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (reviewId: string) => reviewsApi.deleteReview(reviewId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["reviews", "product", productId],
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.reviews.summary(productId),
      });
    },
  });
}
