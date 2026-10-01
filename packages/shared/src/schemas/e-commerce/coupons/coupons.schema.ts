import { z } from "zod";
import { DEFAULT_PAGE } from "../../../constants";

export const couponTypeEnum = z.enum(["PERCENTAGE", "FIXED"]);

const couponBaseObject = z.object({
  code: z.string().trim().toUpperCase().min(3).max(50),
  type: couponTypeEnum,
  value: z.number().positive(),
  minOrderAmount: z.number().positive().optional(),
  maxDiscount: z.number().positive().optional(),
  usageLimit: z.number().int().positive().optional(),
  usageLimitPerUser: z.number().int().positive().default(1),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  isActive: z.boolean().optional(),
});

export const createCouponSchema = couponBaseObject.refine(
  (d) => new Date(d.endDate) > new Date(d.startDate),
  {
    path: ["endDate"],
    message: "endDate must be after startDate",
  },
);

export const updateCouponSchema = couponBaseObject.partial().refine(
  (d) => {
    if (d.startDate && d.endDate) {
      return new Date(d.endDate) > new Date(d.startDate);
    }
    return true;
  },
  {
    path: ["endDate"],
    message: "endDate must be after startDate",
  },
);

export const validateCouponSchema = z.object({
  code: z.string().trim().toUpperCase().min(1),
  subtotal: z.number().positive().optional(),
});

export const listCouponsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(DEFAULT_PAGE),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  isActive: z.preprocess(
    (v) => (v === "true" ? true : v === "false" ? false : undefined),
    z.boolean().optional(),
  ),
  search: z.string().trim().optional(),
});
