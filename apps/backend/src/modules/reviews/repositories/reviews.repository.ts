import { Injectable } from "@nestjs/common";
import { PrismaService, type Review, type User } from "@repo/database";
import type { ProductRatingSummaryDto } from "@repo/shared/dtos/e-commerce";

export type ReviewWithUser = Review & {
  user?: Pick<User, "id" | "username">;
};

@Injectable()
export class ReviewsRepository {
  constructor(private readonly prisma: PrismaService) {}

  private readonly userSelect = {
    user: {
      select: {
        id: true,
        username: true,
      },
    },
  };

  findById(id: string): Promise<ReviewWithUser | null> {
    return this.prisma.review.findUnique({
      where: { id },
      include: this.userSelect,
    });
  }

  findByProductAndUser(
    productId: string,
    userId: string,
  ): Promise<ReviewWithUser | null> {
    return this.prisma.review.findUnique({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
      include: this.userSelect,
    });
  }

  findManyByProduct(
    productId: string,
    params: { skip: number; take: number },
  ): Promise<ReviewWithUser[]> {
    return this.prisma.review.findMany({
      where: {
        productId,
        isApproved: true,
      },
      include: this.userSelect,
      orderBy: { createdAt: "desc" },
      skip: params.skip,
      take: params.take,
    });
  }

  countByProduct(productId: string): Promise<number> {
    return this.prisma.review.count({
      where: {
        productId,
        isApproved: true,
      },
    });
  }

  findMany(params: {
    skip: number;
    take: number;
    productId?: string;
    isApproved?: boolean;
  }): Promise<ReviewWithUser[]> {
    const where: any = {};
    if (params.productId) where.productId = params.productId;
    if (params.isApproved !== undefined) where.isApproved = params.isApproved;

    return this.prisma.review.findMany({
      where,
      include: this.userSelect,
      orderBy: { createdAt: "desc" },
      skip: params.skip,
      take: params.take,
    });
  }

  count(params: { productId?: string; isApproved?: boolean }): Promise<number> {
    const where: any = {};
    if (params.productId) where.productId = params.productId;
    if (params.isApproved !== undefined) where.isApproved = params.isApproved;

    return this.prisma.review.count({ where });
  }

  create(data: {
    userId: string;
    productId: string;
    rating: number;
    comment?: string;
  }): Promise<ReviewWithUser> {
    return this.prisma.review.create({
      data: {
        userId: data.userId,
        productId: data.productId,
        rating: data.rating,
        comment: data.comment,
        isApproved: false, // Default requires moderation
      },
      include: this.userSelect,
    });
  }

  update(
    id: string,
    data: { rating?: number; comment?: string | null; isApproved?: boolean },
  ): Promise<ReviewWithUser> {
    return this.prisma.review.update({
      where: { id },
      data,
      include: this.userSelect,
    });
  }

  delete(id: string): Promise<Review> {
    return this.prisma.review.delete({
      where: { id },
    });
  }

  async getRatingSummary(productId: string): Promise<ProductRatingSummaryDto> {
    const reviews = await this.prisma.review.findMany({
      where: { productId, isApproved: true },
      select: { rating: true },
    });

    const count = reviews.length;
    const distribution: Record<1 | 2 | 3 | 4 | 5, number> = {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
    };

    let sum = 0;
    for (const r of reviews) {
      sum += r.rating;
      if (r.rating >= 1 && r.rating <= 5) {
        distribution[r.rating as 1 | 2 | 3 | 4 | 5]++;
      }
    }

    const average = count > 0 ? Math.round((sum / count) * 10) / 10 : 0;
    return { average, count, distribution };
  }
}
