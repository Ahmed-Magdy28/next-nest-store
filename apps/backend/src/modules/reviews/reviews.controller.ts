import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from "@nestjs/common";
import { UserRole } from "@repo/database";

import {
  CurrentUser,
  Public,
  Roles,
  Swagger,
  UseZodValidation,
} from "../../common/decorators";
import { ZodValidationPipe } from "../../common/pipes/zod-validation.pipe";
import type { JwtUser } from "@repo/shared/interfaces";

import { ReviewsService } from "./reviews.service";
import {
  createReviewSchema,
  listReviewsQuerySchema,
  moderateReviewSchema,
  updateReviewSchema,
} from "@repo/shared/schemas/e-commerce/reviews";
import type {
  CreateReviewDto,
  ListReviewsQueryDto,
  ModerateReviewDto,
  ProductRatingSummaryDto,
  ReviewDto,
  UpdateReviewDto,
  PaginatedResultDto,
} from "@repo/shared/dtos/e-commerce";

@Controller("reviews")
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  // 1) Public: Get approved reviews for a product
  @Get("products/:productId")
  @Public()
  @Swagger("list-product-reviews")
  findProductReviews(
    @Param("productId", ParseUUIDPipe) productId: string,
    @Query(new ZodValidationPipe(listReviewsQuerySchema))
    query: ListReviewsQueryDto,
  ): Promise<PaginatedResultDto<ReviewDto>> {
    return this.reviewsService.findProductReviews(productId, query);
  }

  // 2) Public: Get rating summary for a product
  @Get("products/:productId/summary")
  @Public()
  @Swagger("get-rating-summary")
  getProductRatingSummary(
    @Param("productId", ParseUUIDPipe) productId: string,
  ): Promise<ProductRatingSummaryDto> {
    return this.reviewsService.getProductRatingSummary(productId);
  }

  // 3) Authenticated: Create a review
  @Post()
  @Swagger("create-review")
  @UseZodValidation(createReviewSchema)
  create(
    @CurrentUser() user: JwtUser,
    @Body() body: CreateReviewDto,
  ): Promise<ReviewDto> {
    return this.reviewsService.create(user.id, body);
  }

  // 4) Authenticated: Update own review
  @Patch(":id")
  @Swagger("update-review")
  @UseZodValidation(updateReviewSchema)
  update(
    @CurrentUser() user: JwtUser,
    @Param("id", ParseUUIDPipe) id: string,
    @Body() body: UpdateReviewDto,
  ): Promise<ReviewDto> {
    return this.reviewsService.update(user.id, id, body);
  }

  // 5) Authenticated (owner) or Admin: Delete review
  @Delete(":id")
  @Swagger("delete-review")
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(
    @CurrentUser() user: JwtUser,
    @Param("id", ParseUUIDPipe) id: string,
  ): Promise<void> {
    const isAdmin = user.role === UserRole.ADMIN;
    return this.reviewsService.delete(user.id, isAdmin, id);
  }

  // 6) Admin: List all reviews (moderation view)
  @Get()
  @Roles(UserRole.ADMIN)
  @Swagger("list-all-reviews")
  findAllAdmin(
    @Query(new ZodValidationPipe(listReviewsQuerySchema))
    query: ListReviewsQueryDto,
  ): Promise<PaginatedResultDto<ReviewDto>> {
    return this.reviewsService.findAllAdmin(query);
  }

  // 7) Admin: Moderate a review
  @Patch(":id/moderate")
  @Roles(UserRole.ADMIN)
  @Swagger("moderate-review")
  @UseZodValidation(moderateReviewSchema)
  moderate(
    @Param("id", ParseUUIDPipe) id: string,
    @Body() body: ModerateReviewDto,
  ): Promise<ReviewDto> {
    return this.reviewsService.moderate(id, body);
  }
}
