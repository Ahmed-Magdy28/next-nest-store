import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "@repo/database";

import { ReviewsRepository } from "./repositories/reviews.repository";
import { ReviewMapper } from "./mappers/review.mapper";
import type {
  CreateReviewDto,
  ListReviewsQueryDto,
  ModerateReviewDto,
  ProductRatingSummaryDto,
  ReviewDto,
  UpdateReviewDto,
  PaginatedResultDto,
} from "@repo/shared/dtos/e-commerce";

@Injectable()
export class ReviewsService {
  constructor(
    private readonly reviewsRepository: ReviewsRepository,
    private readonly prisma: PrismaService,
  ) {}

  async create(userId: string, dto: CreateReviewDto): Promise<ReviewDto> {
    const product = await this.prisma.product.findUnique({
      where: { id: dto.productId, deletedAt: null },
      select: { id: true },
    });
    if (!product) {
      throw new NotFoundException("Product not found");
    }

    const existing = await this.reviewsRepository.findByProductAndUser(
      dto.productId,
      userId,
    );
    if (existing) {
      throw new ConflictException("You have already reviewed this product");
    }

    const review = await this.reviewsRepository.create({
      userId,
      productId: dto.productId,
      rating: dto.rating,
      comment: dto.comment,
    });

    return ReviewMapper.toDto(review);
  }

  async findProductReviews(
    productId: string,
    query: { page: number; limit: number },
  ): Promise<PaginatedResultDto<ReviewDto>> {
    const skip = (query.page - 1) * query.limit;
    const [items, total] = await Promise.all([
      this.reviewsRepository.findManyByProduct(productId, {
        skip,
        take: query.limit,
      }),
      this.reviewsRepository.countByProduct(productId),
    ]);

    const totalPages = Math.ceil(total / query.limit);
    return {
      items: items.map(ReviewMapper.toDto),
      meta: {
        total,
        page: query.page,
        limit: query.limit,
        totalPages,
        hasNext: query.page < totalPages,
        hasPrev: query.page > 1,
      },
    };
  }

  async getProductRatingSummary(
    productId: string,
  ): Promise<ProductRatingSummaryDto> {
    return this.reviewsRepository.getRatingSummary(productId);
  }

  async update(
    userId: string,
    id: string,
    dto: UpdateReviewDto,
  ): Promise<ReviewDto> {
    const review = await this.reviewsRepository.findById(id);
    if (!review) {
      throw new NotFoundException("Review not found");
    }

    if (review.userId !== userId) {
      throw new ForbiddenException("You cannot modify another user's review");
    }

    const updated = await this.reviewsRepository.update(id, {
      rating: dto.rating,
      comment: dto.comment,
    });

    return ReviewMapper.toDto(updated);
  }

  async delete(userId: string, isAdmin: boolean, id: string): Promise<void> {
    const review = await this.reviewsRepository.findById(id);
    if (!review) {
      throw new NotFoundException("Review not found");
    }

    if (!isAdmin && review.userId !== userId) {
      throw new ForbiddenException("You cannot delete another user's review");
    }

    await this.reviewsRepository.delete(id);
  }

  // Admin
  async findAllAdmin(
    query: ListReviewsQueryDto,
  ): Promise<PaginatedResultDto<ReviewDto>> {
    const skip = (query.page - 1) * query.limit;
    const [items, total] = await Promise.all([
      this.reviewsRepository.findMany({
        skip,
        take: query.limit,
        productId: query.productId,
        isApproved: query.isApproved,
      }),
      this.reviewsRepository.count({
        productId: query.productId,
        isApproved: query.isApproved,
      }),
    ]);

    const totalPages = Math.ceil(total / query.limit);
    return {
      items: items.map(ReviewMapper.toDto),
      meta: {
        total,
        page: query.page,
        limit: query.limit,
        totalPages,
        hasNext: query.page < totalPages,
        hasPrev: query.page > 1,
      },
    };
  }

  async moderate(id: string, dto: ModerateReviewDto): Promise<ReviewDto> {
    const review = await this.reviewsRepository.findById(id);
    if (!review) {
      throw new NotFoundException("Review not found");
    }

    const updated = await this.reviewsRepository.update(id, {
      isApproved: dto.isApproved,
    });

    return ReviewMapper.toDto(updated);
  }
}
