import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  Req,
} from "@nestjs/common";
import type { Request } from "express";
import { UserRole } from "@repo/database";
import { GUEST_CART_COOKIE_NAME } from "@repo/shared/constants";

import {
  CurrentUser,
  OptionalAuth,
  Roles,
  Swagger,
  UseZodValidation,
} from "../../common/decorators";
import { OptionalJwtAuthGuard } from "../../common/guards";
import { ZodValidationPipe } from "../../common/pipes/zod-validation.pipe";
import { UseGuards } from "@nestjs/common";
import type { JwtUser } from "@repo/shared/interfaces";

import { OrdersService } from "./orders.service";
import {
  createOrderSchema,
  listOrdersQuerySchema,
  updateOrderStatusSchema,
  updatePaymentStatusSchema,
} from "@repo/shared/schemas/e-commerce/orders";
import type {
  CreateOrderDto,
  ListOrdersQueryDto,
  OrderDto,
  PaginatedResultDto,
  UpdateOrderStatusDto,
  UpdatePaymentStatusDto,
} from "@repo/shared/dtos/e-commerce";

@Controller("orders")
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  // 1) Customer: Create order from cart
  @Post()
  @UseGuards(OptionalJwtAuthGuard)
  @OptionalAuth()
  @Swagger("create-order")
  @UseZodValidation(createOrderSchema)
  create(
    @Body() body: CreateOrderDto,
    @Req() req: Request,
    @CurrentUser() user?: JwtUser | null,
  ): Promise<OrderDto> {
    const cookies = (req as Request & { cookies?: Record<string, string> })
      .cookies;
    const guestToken =
      cookies?.[GUEST_CART_COOKIE_NAME] ||
      (typeof req.headers["x-guest-cart-token"] === "string"
        ? req.headers["x-guest-cart-token"]
        : null);

    return this.ordersService.create(user?.id ?? null, guestToken, body);
  }

  // 2) Customer: Get my orders
  @Get("my")
  @Swagger("get-my-orders")
  getMyOrders(
    @CurrentUser() user: JwtUser,
    @Query(new ZodValidationPipe(listOrdersQuerySchema))
    query: ListOrdersQueryDto,
  ): Promise<PaginatedResultDto<OrderDto>> {
    return this.ordersService.findMyOrders(user.id, query);
  }

  // 3) Customer: Get my single order
  @Get("my/:id")
  @Swagger("get-my-order")
  getMyOrder(
    @CurrentUser() user: JwtUser,
    @Param("id", ParseUUIDPipe) id: string,
  ): Promise<OrderDto> {
    return this.ordersService.findMyOrderById(user.id, id);
  }

  // 4) Admin: List all orders
  @Get()
  @Roles(UserRole.ADMIN)
  @Swagger("list-orders")
  findAll(
    @Query(new ZodValidationPipe(listOrdersQuerySchema))
    query: ListOrdersQueryDto,
  ): Promise<PaginatedResultDto<OrderDto>> {
    return this.ordersService.findAllAdmin(query);
  }

  // 5) Admin: Get order by ID
  @Get(":id")
  @Roles(UserRole.ADMIN)
  @Swagger("get-order")
  findById(@Param("id", ParseUUIDPipe) id: string): Promise<OrderDto> {
    return this.ordersService.findByIdAdmin(id);
  }

  // 6) Admin: Update status
  @Patch(":id/status")
  @Roles(UserRole.ADMIN)
  @Swagger("update-order-status")
  @UseZodValidation(updateOrderStatusSchema)
  updateStatus(
    @Param("id", ParseUUIDPipe) id: string,
    @Body() body: UpdateOrderStatusDto,
  ): Promise<OrderDto> {
    return this.ordersService.updateStatus(id, body);
  }

  // 7) Admin: Update payment status
  @Patch(":id/payment-status")
  @Roles(UserRole.ADMIN)
  @Swagger("update-payment-status")
  @UseZodValidation(updatePaymentStatusSchema)
  updatePaymentStatus(
    @Param("id", ParseUUIDPipe) id: string,
    @Body() body: UpdatePaymentStatusDto,
  ): Promise<OrderDto> {
    return this.ordersService.updatePaymentStatus(id, body);
  }
}
