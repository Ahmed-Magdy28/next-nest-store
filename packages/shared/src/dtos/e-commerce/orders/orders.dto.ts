import { z } from "zod";
import type { OrderStatus, PaymentStatus, PaymentMethod } from "@repo/database";
import {
  createOrderSchema,
  listOrdersQuerySchema,
  updateOrderStatusSchema,
  updatePaymentStatusSchema,
} from "../../../schemas/e-commerce/orders";

export type CreateOrderDto = z.infer<typeof createOrderSchema>;
export type UpdateOrderStatusDto = z.infer<typeof updateOrderStatusSchema>;
export type UpdatePaymentStatusDto = z.infer<typeof updatePaymentStatusSchema>;
export type ListOrdersQueryDto = z.infer<typeof listOrdersQuerySchema>;

export interface OrderItemDto {
  id: string;
  productId: string;
  variantId: string | null;
  productName: string;
  variantName: string | null;
  productSku: string;
  productImage: string | null;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface OrderDto {
  id: string;
  orderNumber: string;
  userId: string | null;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: any;
  subtotal: number;
  shippingCost: number;
  discountAmount: number;
  taxAmount: number;
  total: number;
  couponCode: string | null;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod | null;
  notes: string | null;
  items?: OrderItemDto[];
  createdAt: Date | string;
}
