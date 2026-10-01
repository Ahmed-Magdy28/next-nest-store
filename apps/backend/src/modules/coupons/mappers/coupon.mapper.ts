import type { Coupon } from "@repo/database";
import type { CouponDto } from "@repo/shared/dtos/e-commerce";

export class CouponMapper {
  static toDto(c: Coupon): CouponDto {
    return {
      id: c.id,
      code: c.code,
      type: c.type,
      value: Number(c.value),
      minOrderAmount: c.minOrderAmount ? Number(c.minOrderAmount) : null,
      maxDiscount: c.maxDiscount ? Number(c.maxDiscount) : null,
      usageLimit: c.usageLimit,
      usageLimitPerUser: c.usageLimitPerUser,
      usedCount: c.usedCount,
      startDate: c.startDate,
      endDate: c.endDate,
      isActive: c.isActive,
      createdAt: c.createdAt,
    };
  }
}
