import { Module } from "@nestjs/common";
import { CouponsController } from "./coupons.controller";
import { CouponsService } from "./coupons.service";
import { CouponsRepository } from "./repositories/coupons.repository";

@Module({
  controllers: [CouponsController],
  providers: [CouponsRepository, CouponsService],
  exports: [CouponsService, CouponsRepository],
})
export class CouponsModule {}
