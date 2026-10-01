import { Injectable } from "@nestjs/common";
import { PrismaService, type Prisma, type Coupon } from "@repo/database";

@Injectable()
export class CouponsRepository {
  constructor(private readonly prisma: PrismaService) {}

  findByCode(code: string): Promise<Coupon | null> {
    return this.prisma.coupon.findUnique({ where: { code } });
  }

  findById(id: string): Promise<Coupon | null> {
    return this.prisma.coupon.findUnique({ where: { id } });
  }

  findMany(params: {
    skip: number;
    take: number;
    isActive?: boolean;
    search?: string;
  }): Promise<Coupon[]> {
    return this.prisma.coupon.findMany({
      where: this.buildWhere(params),
      orderBy: { createdAt: "desc" },
      skip: params.skip,
      take: params.take,
    });
  }

  count(params: { isActive?: boolean; search?: string }): Promise<number> {
    return this.prisma.coupon.count({ where: this.buildWhere(params) });
  }

  create(data: Prisma.CouponCreateInput): Promise<Coupon> {
    return this.prisma.coupon.create({ data });
  }

  update(id: string, data: Prisma.CouponUpdateInput): Promise<Coupon> {
    return this.prisma.coupon.update({ where: { id }, data });
  }

  delete(id: string): Promise<Coupon> {
    return this.prisma.coupon.delete({ where: { id } });
  }

  countUsagesByUser(couponId: string, userId: string): Promise<number> {
    return this.prisma.couponUsage.count({
      where: { couponId, userId },
    });
  }

  incrementUsedCount(id: string): Promise<Coupon> {
    return this.prisma.coupon.update({
      where: { id },
      data: { usedCount: { increment: 1 } },
    });
  }

  private buildWhere(params: {
    isActive?: boolean;
    search?: string;
  }): Prisma.CouponWhereInput {
    const where: Prisma.CouponWhereInput = {};
    if (params.isActive !== undefined) where.isActive = params.isActive;
    if (params.search) {
      where.code = { contains: params.search, mode: "insensitive" };
    }
    return where;
  }
}
