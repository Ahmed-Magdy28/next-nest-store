import { forwardRef, Module } from "@nestjs/common";

import { ProductsController } from "./products.controller";
import { ProductsService } from "./products.service";
import { ProductsRepository } from "./repositories/products.repository";
import { CategoriesModule } from "../categories/categories.module";
import { WishlistModule } from "../wishlist/wishlist.module";

@Module({
  imports: [CategoriesModule, forwardRef(() => WishlistModule)],
  controllers: [ProductsController],
  providers: [ProductsRepository, ProductsService],
  exports: [ProductsService, ProductsRepository],
})
export class ProductsModule {}
