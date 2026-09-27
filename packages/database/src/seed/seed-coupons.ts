import type { PrismaClient } from "../../prisma/generated";
import { CouponType } from "../../prisma/generated";

export async function seedCoupons(prisma: PrismaClient) {
  console.log("🌱 Seeding coupons...");

  await prisma.coupon.upsert({
    where: { code: "WELCOME10" },
    update: {},
    create: {
      code: "WELCOME10",
      type: CouponType.PERCENTAGE,
      value: 10,
      minOrderAmount: 50,
      maxDiscount: 100,
      usageLimit: 1000,
      usageLimitPerUser: 1,
      startDate: new Date(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      isActive: true,
    },
  });

  console.log("✅ Coupon: WELCOME10");
}
