import { z } from "zod";
import type { CouponType } from "@repo/database";
import {
  createCouponSchema,
  listCouponsQuerySchema,
  updateCouponSchema,
  validateCouponSchema,
} from "../../../schemas/e-commerce/coupons";

export type CreateCouponDto = z.infer<typeof createCouponSchema>;
export type UpdateCouponDto = z.infer<typeof updateCouponSchema>;
export type ValidateCouponDto = z.infer<typeof validateCouponSchema>;
export type ListCouponsQueryDto = z.infer<typeof listCouponsQuerySchema>;

export interface CouponDto {
  id: string;
  code: string;
  type: CouponType;
  value: number;
  minOrderAmount: number | null;
  maxDiscount: number | null;
  usageLimit: number | null;
  usageLimitPerUser: number | null;
  usedCount: number;
  startDate: Date | string;
  endDate: Date | string | null;
  isActive: boolean;
  createdAt: Date | string;
}

export interface CouponValidationResultDto {
  valid: boolean;
  message?: string;
  coupon?: CouponDto;
  discountAmount?: number;
}
