import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { randomUUID } from "node:crypto";

import { CartRepository } from "../cart/repositories/cart.repository";
import { CouponsService } from "../coupons/coupons.service";
import { OrdersRepository } from "./repositories/orders.repository";
import { OrderMapper } from "./mappers/order.mapper";

import type {
  CreateOrderDto,
  ListOrdersQueryDto,
  OrderDto,
  PaginatedResultDto,
  UpdateOrderStatusDto,
  UpdatePaymentStatusDto,
} from "@repo/shared/dtos/e-commerce";

const SHIPPING_FLAT = 0; // TODO: من config
const TAX_RATE = 0; // TODO: من config

@Injectable()
export class OrdersService {
  constructor(
    private readonly ordersRepository: OrdersRepository,
    private readonly cartRepository: CartRepository,
    private readonly couponsService: CouponsService,
  ) {}

  private generateOrderNumber(): string {
    const ts = Date.now().toString(36).toUpperCase();
    const rand = randomUUID().slice(0, 6).toUpperCase();
    return `ORD-${ts}-${rand}`;
  }

  async create(
    userId: string | null,
    guestToken: string | null,
    dto: CreateOrderDto,
  ): Promise<OrderDto> {
    // 1) نجيب الكارت
    let cart: Awaited<ReturnType<typeof this.cartRepository.findByUserId>> =
      null;
    if (userId) {
      cart = await this.cartRepository.findByUserId(userId);
    }
    if (!cart && guestToken) {
      cart = await this.cartRepository.findByGuestToken(guestToken);
    }

    if (!cart || cart.items.length === 0) {
      throw new BadRequestException("Cart is empty");
    }

    // 2) نحسب subtotal من العناصر المتاحة بس
    const availableItems = cart.items.filter((item) => {
      const p = item.product;
      const v = item.variant;
      if (p.deletedAt || !p.isActive || !p.isAvailable) return false;
      if (v && (!v.isActive || !v.isAvailable || v.stockQuantity <= 0))
        return false;
      return true;
    });

    if (availableItems.length === 0) {
      throw new BadRequestException("No available items in cart");
    }

    const subtotal = availableItems.reduce((sum, item) => {
      const price = item.variant
        ? Number(
            item.variant.discountPrice ??
              item.variant.regularPrice ??
              item.product.discountPrice,
          )
        : Number(item.product.discountPrice);
      return sum + price * item.quantity;
    }, 0);

    // 3) الكوبون
    let discountAmount = 0;
    let couponId: string | null = null;
    let couponCode: string | null = null;

    if (dto.couponCode) {
      const result = await this.couponsService.validate(
        dto.couponCode,
        userId,
        subtotal,
      );
      if (!result.valid) {
        throw new BadRequestException(result.message ?? "Invalid coupon");
      }
      discountAmount = result.discountAmount ?? 0;
      couponId = result.coupon!.id;
      couponCode = result.coupon!.code;
    }

    // 4) الإجماليات
    const shippingCost = Number(process.env.SHIPPING_COST || 5);
    const freeThreshold = Number(process.env.SHIPPING_FREE_THRESHOLD || 100);
    const taxRate =
      Number(
        process.env.TAX_RATE_IN_PERCENTAGE || process.env.TAX_RATE || 12,
      ) / 100;

    const actualShipping = subtotal >= freeThreshold ? 0 : shippingCost;
    const taxable = subtotal - discountAmount;
    const taxAmount = Math.round(taxable * taxRate * 100) / 100;
    const total = Math.round((taxable + actualShipping + taxAmount) * 100) / 100;

    // 5) transaction
    const order = await this.ordersRepository.runTransaction(async (tx) => {
      const created = await this.ordersRepository.createFromCart(tx, {
        orderNumber: this.generateOrderNumber(),
        userId,
        customerName: dto.customerName,
        customerEmail: dto.customerEmail,
        customerPhone: dto.customerPhone,
        shippingAddress: dto.shippingAddress as any,
        subtotal,
        shippingCost: actualShipping,
        discountAmount,
        taxAmount,
        total,
        couponId,
        couponCode,
        paymentMethod: dto.paymentMethod,
        notes: dto.notes ?? null,
        items: availableItems.map((item) => {
          const price = item.variant
            ? Number(
                item.variant.discountPrice ??
                  item.variant.regularPrice ??
                  item.product.discountPrice,
              )
            : Number(item.product.discountPrice);
          return {
            productId: item.productId,
            variantId: item.variantId,
            productName: item.product.name,
            variantName: item.variant?.name ?? null,
            productSku: item.variant?.id ? item.product.sku : item.product.sku,
            productImage: item.variant?.id ? null : item.product.mainImage,
            quantity: item.quantity,
            unitPrice: price,
            totalPrice: price * item.quantity,
          };
        }),
      });

      // نسجل CouponUsage لو فيه كوبون
      if (couponId) {
        await tx.couponUsage.create({
          data: {
            couponId,
            userId: userId!,
            orderId: created.id,
            discountAmount,
          },
        });
        await tx.coupon.update({
          where: { id: couponId },
          data: { usedCount: { increment: 1 } },
        });
      }

      // نفضي الكارت
      await tx.cartItem.deleteMany({ where: { cartId: cart.id } });

      return created;
    });

    return OrderMapper.toDto(order);
  }

  async findMyOrders(
    userId: string,
    query: ListOrdersQueryDto,
  ): Promise<PaginatedResultDto<OrderDto>> {
    const skip = (query.page - 1) * query.limit;
    const [items, total] = await Promise.all([
      this.ordersRepository.findManyByUserId(userId, {
        skip,
        take: query.limit,
      }),
      this.ordersRepository.countByUserId(userId),
    ]);
    const totalPages = Math.ceil(total / query.limit);
    return {
      items: items.map(OrderMapper.toDto),
      meta: {
        total,
        page: query.page,
        limit: query.limit,
        totalPages,
        hasNext: query.page < totalPages,
        hasPrev: query.page > 1,
      },
    };
  }

  async findMyOrderById(userId: string, orderId: string): Promise<OrderDto> {
    const order = await this.ordersRepository.findById(orderId);
    if (!order) throw new NotFoundException("Order not found");
    if (order.userId !== userId) throw new NotFoundException("Order not found");
    return OrderMapper.toDto(order);
  }

  // Admin
  async findAllAdmin(
    query: ListOrdersQueryDto,
  ): Promise<PaginatedResultDto<OrderDto>> {
    const skip = (query.page - 1) * query.limit;
    const [items, total] = await Promise.all([
      this.ordersRepository.findManyAdmin({
        skip,
        take: query.limit,
        status: query.status,
        paymentStatus: query.paymentStatus,
        search: query.search,
      }),
      this.ordersRepository.countAdmin({
        status: query.status,
        paymentStatus: query.paymentStatus,
        search: query.search,
      }),
    ]);
    const totalPages = Math.ceil(total / query.limit);
    return {
      items: items.map(OrderMapper.toDto),
      meta: {
        total,
        page: query.page,
        limit: query.limit,
        totalPages,
        hasNext: query.page < totalPages,
        hasPrev: query.page > 1,
      },
    };
  }

  async findByIdAdmin(id: string): Promise<OrderDto> {
    const order = await this.ordersRepository.findById(id);
    if (!order) throw new NotFoundException("Order not found");
    return OrderMapper.toDto(order);
  }

  async updateStatus(id: string, dto: UpdateOrderStatusDto): Promise<OrderDto> {
    const order = await this.ordersRepository.findById(id);
    if (!order) throw new NotFoundException("Order not found");
    const updated = await this.ordersRepository.updateStatus(id, dto.status);
    return OrderMapper.toDto(updated);
  }

  async updatePaymentStatus(
    id: string,
    dto: UpdatePaymentStatusDto,
  ): Promise<OrderDto> {
    const order = await this.ordersRepository.findById(id);
    if (!order) throw new NotFoundException("Order not found");
    const updated = await this.ordersRepository.updatePaymentStatus(
      id,
      dto.paymentStatus,
    );
    return OrderMapper.toDto(updated);
  }
}
