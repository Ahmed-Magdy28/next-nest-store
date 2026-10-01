import { z } from "zod";
import { DEFAULT_PAGE } from "../../../constants";

export const createReviewSchema = z.object({
  productId: z.string().uuid(),
  rating: z.number().int().min(1).max(5),
  comment: z.string().trim().max(2000).optional(),
});

export const updateReviewSchema = z
  .object({
    rating: z.number().int().min(1).max(5).optional(),
    comment: z.string().trim().max(2000).optional(),
  })
  .refine((d) => d.rating !== undefined || d.comment !== undefined, {
    message: "At least one field must be provided",
  });

export const listReviewsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(DEFAULT_PAGE),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  productId: z.string().uuid().optional(),
  isApproved: z.preprocess(
    (v) => (v === "true" ? true : v === "false" ? false : undefined),
    z.boolean().optional(),
  ),
});

export const moderateReviewSchema = z.object({
  isApproved: z.boolean(),
});
