import { forwardRef, Module } from "@nestjs/common";

import { ProductsModule } from "../products/products.module";
import { WishlistController } from "./wishlist.controller";
import { WishlistService } from "./wishlist.service";
import { WishlistRepository } from "./repositories/wishlist.repository";

@Module({
  imports: [forwardRef(() => ProductsModule)],
  controllers: [WishlistController],
  providers: [WishlistRepository, WishlistService],
  exports: [WishlistService, WishlistRepository],
})
export class WishlistModule {}
