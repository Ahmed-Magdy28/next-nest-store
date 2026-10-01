import { Module } from "@nestjs/common";
import { CartModule } from "../cart/cart.module";
import { CouponsModule } from "../coupons/coupons.module";
import { OrdersController } from "./orders.controller";
import { OrdersService } from "./orders.service";
import { OrdersRepository } from "./repositories/orders.repository";

@Module({
  imports: [CartModule, CouponsModule],
  controllers: [OrdersController],
  providers: [OrdersRepository, OrdersService],
  exports: [OrdersService, OrdersRepository],
})
export class OrdersModule {}
