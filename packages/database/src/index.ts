export * from "./database.module.js";
export * from "./prisma/prisma.service.js";

export type {
  User,
  Prisma,
  Session,
  Category,
  Product,
  ProductVariant,
} from "../prisma/generated/index.js";

export {
  UserRole,
  SessionStatus,
  DiscountType,
} from "../prisma/generated/index.js";
