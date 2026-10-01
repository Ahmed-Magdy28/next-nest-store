import type { Order } from "@repo/database";
import type { OrderDto } from "@repo/shared/dtos/e-commerce";

export class OrderMapper {
  static toDto(order: Order & { items?: any[] }): OrderDto {
    return {
      id: order.id,
      orderNumber: order.orderNumber,
      userId: order.userId,
      customerName: order.customerName,
      customerEmail: order.customerEmail,
      customerPhone: order.customerPhone,
      shippingAddress: order.shippingAddress,
      subtotal: Number(order.subtotal),
      shippingCost: Number(order.shippingCost),
      discountAmount: Number(order.discountAmount),
      taxAmount: Number(order.taxAmount),
      total: Number(order.total),
      couponCode: order.couponCode,
      status: order.status,
      paymentStatus: order.paymentStatus,
      paymentMethod: order.paymentMethod,
      notes: order.notes,
      items: (order.items ?? []).map((i) => ({
        id: i.id,
        productId: i.productId,
        variantId: i.variantId,
        productName: i.productName,
        variantName: i.variantName,
        productSku: i.productSku,
        productImage: i.productImage,
        quantity: i.quantity,
        unitPrice: Number(i.unitPrice),
        totalPrice: Number(i.totalPrice),
      })),
      createdAt: order.createdAt,
    };
  }
}
