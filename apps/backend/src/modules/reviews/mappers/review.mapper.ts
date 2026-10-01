import type { Review, User } from "@repo/database";
import type { ReviewDto } from "@repo/shared/dtos/e-commerce";

type ReviewWithUser = Review & {
  user?: Pick<User, "id" | "username">;
};

export class ReviewMapper {
  static toDto(review: ReviewWithUser): ReviewDto {
    return {
      id: review.id,
      userId: review.userId,
      productId: review.productId,
      rating: review.rating,
      comment: review.comment,
      isApproved: review.isApproved,
      createdAt: review.createdAt,
      updatedAt: review.updatedAt,
      user: review.user
        ? {
            id: review.user.id,
            username: review.user.username,
          }
        : undefined,
    };
  }
}
