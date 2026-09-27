import { Module } from "@nestjs/common";

import { ProductsModule } from "../products/products.module";
import { CartController } from "./cart.controller";
import { CartService } from "./cart.service";
import { CartRepository } from "./repositories/cart.repository";

@Module({
  imports: [ProductsModule],
  controllers: [CartController],
  providers: [CartRepository, CartService],
  exports: [CartService, CartRepository],
})
export class CartModule {}
