export * from "./database.module.js";
export * from "./prisma/prisma.service.js";

export type {
  User,
  Prisma,
  Session,
  Category,
  Product,
  ProductVariant,
  Coupon,
  CouponUsage,
  Order,
  OrderItem,
  Review,
  Address,
} from "../prisma/generated/index.js";

export {
  UserRole,
  SessionStatus,
  DiscountType,
  CouponType,
  OrderStatus,
  PaymentStatus,
  PaymentMethod,
} from "../prisma/generated/index.js";
