import { z } from "zod";
import {
  createReviewSchema,
  listReviewsQuerySchema,
  moderateReviewSchema,
  updateReviewSchema,
} from "../../../schemas/e-commerce/reviews";

export type CreateReviewDto = z.infer<typeof createReviewSchema>;
export type UpdateReviewDto = z.infer<typeof updateReviewSchema>;
export type ListReviewsQueryDto = z.infer<typeof listReviewsQuerySchema>;
export type ModerateReviewDto = z.infer<typeof moderateReviewSchema>;

export interface ReviewDto {
  id: string;
  userId: string;
  productId: string;
  rating: number;
  comment: string | null;
  isApproved: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
  user?: { id: string; username: string };
}

export interface ProductRatingSummaryDto {
  average: number;
  count: number;
  distribution: Record<1 | 2 | 3 | 4 | 5, number>;
}
