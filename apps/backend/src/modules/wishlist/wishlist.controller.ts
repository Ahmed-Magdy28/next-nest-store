import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
} from "@nestjs/common";

import {
  CurrentUser,
  Swagger,
  UseZodValidation,
} from "../../common/decorators";

import type { JwtUser } from "@repo/shared/interfaces";
import type {
  AddToWishlistDto,
  WishlistDto,
} from "@repo/shared/dtos/e-commerce";
import { addToWishlistSchema } from "@repo/shared/schemas/e-commerce/wishlist";

import { WishlistService } from "./wishlist.service";

@Controller("wishlist")
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}

  // ─────────────────────────────────────────────────────────
  //  Get Wishlist
  // ─────────────────────────────────────────────────────────

  @Get()
  @Swagger("get-wishlist")
  getWishlist(@CurrentUser() user: JwtUser): Promise<WishlistDto> {
    return this.wishlistService.getWishlist(user.id);
  }

  // ─────────────────────────────────────────────────────────
  //  Add Item
  // ─────────────────────────────────────────────────────────

  @Post("items")
  @HttpCode(HttpStatus.OK)
  @Swagger("add-to-wishlist")
  @UseZodValidation(addToWishlistSchema)
  addItem(
    @CurrentUser() user: JwtUser,
    @Body() body: AddToWishlistDto,
  ): Promise<WishlistDto> {
    return this.wishlistService.addItem(user.id, body);
  }

  // ─────────────────────────────────────────────────────────
  //  Remove Item
  // ─────────────────────────────────────────────────────────

  @Delete("items/:productId")
  @Swagger("remove-from-wishlist")
  removeItem(
    @CurrentUser() user: JwtUser,
    @Param("productId", ParseUUIDPipe) productId: string,
  ): Promise<WishlistDto> {
    return this.wishlistService.removeItem(user.id, productId);
  }

  // ─────────────────────────────────────────────────────────
  //  Clear Wishlist
  // ─────────────────────────────────────────────────────────

  @Delete()
  @Swagger("clear-wishlist")
  clearWishlist(@CurrentUser() user: JwtUser): Promise<WishlistDto> {
    return this.wishlistService.clearWishlist(user.id);
  }
}
