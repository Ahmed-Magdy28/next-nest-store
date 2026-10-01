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
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from "@nestjs/common";

import type { Request, Response } from "express";

import {
  CurrentUser,
  OptionalAuth,
  Swagger,
  UseZodValidation,
} from "../../common/decorators";
import { OptionalJwtAuthGuard } from "../../common/guards";
import { ZodValidationPipe } from "../../common/pipes/zod-validation.pipe";

import type { JwtUser } from "@repo/shared/interfaces";
import type {
  AddToCartDto,
  CartDto,
  MergeCartResponseDto,
  UpdateCartItemDto,
} from "@repo/shared/dtos/e-commerce";
import {
  addToCartSchema,
  updateCartItemSchema,
} from "@repo/shared/schemas/e-commerce/cart";
import {
  GUEST_CART_COOKIE_NAME,
  GUEST_CART_COOKIE_PATH,
  GUEST_CART_TTL_MS,
} from "@repo/shared/constants";

import { CartService } from "./cart.service";
import { CartMapper } from "./mappers/cart.mapper";

@Controller("cart")
@UseGuards(OptionalJwtAuthGuard)
@OptionalAuth()
export class CartController {
  constructor(private readonly cartService: CartService) {}

  // ─────────────────────────────────────────────────────────
  //  Get Cart
  // ─────────────────────────────────────────────────────────

  @Get()
  @Swagger("get-cart")
  async getCart(
    @CurrentUser() user: JwtUser | null,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<CartDto> {
    const guestToken = this.readGuestToken(req);
    const result = await this.cartService.getOrCreateCart(
      user?.id ?? null,
      guestToken,
    );

    if (result.guestToken && !user) {
      this.setGuestTokenCookie(res, result.guestToken);
    }

    return CartMapper.toDto(result.cart);
  }

  // ─────────────────────────────────────────────────────────
  //  Add Item
  // ─────────────────────────────────────────────────────────

  @Post("items")
  @HttpCode(HttpStatus.OK)
  @Swagger("add-to-cart")
  @UseZodValidation(addToCartSchema)
  async addItem(
    @CurrentUser() user: JwtUser | null,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @Body() body: AddToCartDto,
  ): Promise<CartDto> {
    const guestToken = this.readGuestToken(req);

    const result = await this.cartService.addItem(
      user?.id ?? null,
      guestToken,
      body,
    );

    // If a new guest token was generated, persist it in a cookie
    if (result.guestToken && !user) {
      this.setGuestTokenCookie(res, result.guestToken);
    }

    return result.cart;
  }

  // ─────────────────────────────────────────────────────────
  //  Update Item Quantity
  // ─────────────────────────────────────────────────────────

  @Patch("items/:id")
  @Swagger("update-cart-item")
  @UseZodValidation(updateCartItemSchema)
  async updateItem(
    @CurrentUser() user: JwtUser | null,
    @Req() req: Request,
    @Param("id", ParseUUIDPipe) itemId: string,
    @Body() body: UpdateCartItemDto,
  ): Promise<CartDto> {
    const guestToken = this.readGuestToken(req);

    return this.cartService.updateItemQuantity(
      user?.id ?? null,
      guestToken,
      itemId,
      body,
    );
  }

  // ─────────────────────────────────────────────────────────
  //  Remove Item
  // ─────────────────────────────────────────────────────────

  @Delete("items/:id")
  @Swagger("remove-from-cart")
  async removeItem(
    @CurrentUser() user: JwtUser | null,
    @Req() req: Request,
    @Param("id", ParseUUIDPipe) itemId: string,
  ): Promise<CartDto> {
    const guestToken = this.readGuestToken(req);

    return this.cartService.removeItem(user?.id ?? null, guestToken, itemId);
  }

  // ─────────────────────────────────────────────────────────
  //  Clear Cart
  // ─────────────────────────────────────────────────────────

  @Delete()
  @Swagger("clear-cart")
  async clearCart(
    @CurrentUser() user: JwtUser | null,
    @Req() req: Request,
  ): Promise<CartDto> {
    const guestToken = this.readGuestToken(req);

    return this.cartService.clearCart(user?.id ?? null, guestToken);
  }

  // ─────────────────────────────────────────────────────────
  //  Merge Guest Cart → User Cart
  // ─────────────────────────────────────────────────────────

  @Post("merge")
  @HttpCode(HttpStatus.OK)
  @Swagger("merge-cart")
  async mergeCart(
    @CurrentUser() user: JwtUser | null,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @Body() body?: { guestToken?: string },
  ): Promise<MergeCartResponseDto> {
    if (!user) {
      throw new UnauthorizedException("Authentication required to merge cart");
    }

    const guestToken = body?.guestToken || this.readGuestToken(req);

    // No guest cart cookie or token → return user cart as-is
    if (!guestToken) {
      const cart = await this.cartService.getCart(user.id, null);
      return { cart, mergedItemsCount: 0, skippedItemsCount: 0 };
    }

    const result = await this.cartService.mergeGuestCart(user.id, guestToken);

    // Clear the guest cookie after merging
    res.clearCookie(GUEST_CART_COOKIE_NAME, {
      path: GUEST_CART_COOKIE_PATH,
    });
    res.setHeader("x-guest-cart-token", "");

    return result;
  }

  // ─────────────────────────────────────────────────────────
  //  Cookie Helpers
  // ─────────────────────────────────────────────────────────

  private readGuestToken(req: Request): string | null {
    const cookies = (req as Request & { cookies?: Record<string, string> })
      .cookies;
    const fromCookie = cookies?.[GUEST_CART_COOKIE_NAME];
    if (fromCookie) return fromCookie;

    const fromHeader = req.headers["x-guest-cart-token"];
    if (typeof fromHeader === "string" && fromHeader.trim()) {
      return fromHeader.trim();
    }

    return null;
  }

  private setGuestTokenCookie(res: Response, token: string): void {
    res.cookie(GUEST_CART_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: GUEST_CART_COOKIE_PATH,
      maxAge: GUEST_CART_TTL_MS,
    });
    res.setHeader("x-guest-cart-token", token);
  }
}
