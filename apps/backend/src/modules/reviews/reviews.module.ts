import { Module } from "@nestjs/common";
import { ReviewsController } from "./reviews.controller";
import { ReviewsService } from "./reviews.service";
import { ReviewsRepository } from "./repositories/reviews.repository";

@Module({
  controllers: [ReviewsController],
  providers: [ReviewsRepository, ReviewsService],
  exports: [ReviewsService, ReviewsRepository],
})
export class ReviewsModule {}
