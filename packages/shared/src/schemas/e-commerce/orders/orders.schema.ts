import { z } from "zod";
import { DEFAULT_PAGE } from "../../../constants";
import { emailSchema } from "../../../schemas/common";

export const shippingAddressSchema = z.object({
  country: z.string().min(2),
  city: z.string().min(2),
  area: z.string().optional(),
  street: z.string().min(2),
  building: z.string().optional(),
  apartment: z.string().optional(),
  postalCode: z.string().optional(),
});

export const createOrderSchema = z.object({
  customerName: z.string().min(2).max(100),
  customerEmail: emailSchema,
  customerPhone: z.string().min(6).max(20),
  shippingAddress: shippingAddressSchema,
  paymentMethod: z.enum([
    "CASH_ON_DELIVERY",
    "CREDIT_CARD",
    "PAYPAL",
    "WALLET",
  ]),
  couponCode: z.string().trim().toUpperCase().optional(),
  notes: z.string().max(1000).optional(),
});

export const updateOrderStatusSchema = z.object({
  status: z.enum([
    "PENDING",
    "CONFIRMED",
    "PROCESSING",
    "SHIPPED",
    "DELIVERED",
    "CANCELLED",
    "REFUNDED",
  ]),
});

export const updatePaymentStatusSchema = z.object({
  paymentStatus: z.enum(["UNPAID", "PAID", "FAILED", "REFUNDED"]),
});

export const listOrdersQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(DEFAULT_PAGE),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  status: z
    .enum([
      "PENDING",
      "CONFIRMED",
      "PROCESSING",
      "SHIPPED",
      "DELIVERED",
      "CANCELLED",
      "REFUNDED",
    ])
    .optional(),
  paymentStatus: z.enum(["UNPAID", "PAID", "FAILED", "REFUNDED"]).optional(),
  search: z.string().trim().optional(), // orderNumber / email / phone
});
