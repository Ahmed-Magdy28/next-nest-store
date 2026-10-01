import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";

import { CouponType } from "@repo/database";

import { CouponsRepository } from "./repositories/coupons.repository";
import { CouponMapper } from "./mappers/coupon.mapper";
import type {
  CouponDto,
  CouponValidationResultDto,
  CreateCouponDto,
  ListCouponsQueryDto,
  PaginatedResultDto,
  UpdateCouponDto,
} from "@repo/shared/dtos/e-commerce";

@Injectable()
export class CouponsService {
  constructor(private readonly couponsRepository: CouponsRepository) {}

  async findAll(
    query: ListCouponsQueryDto,
  ): Promise<PaginatedResultDto<CouponDto>> {
    const skip = (query.page - 1) * query.limit;
    const [items, total] = await Promise.all([
      this.couponsRepository.findMany({
        skip,
        take: query.limit,
        isActive: query.isActive,
        search: query.search,
      }),
      this.couponsRepository.count({
        isActive: query.isActive,
        search: query.search,
      }),
    ]);
    const totalPages = Math.ceil(total / query.limit);
    return {
      items: items.map(CouponMapper.toDto),
      meta: {
        total,
        page: query.page,
        limit: query.limit,
        totalPages,
        hasNext: query.page < totalPages,
        hasPrev: query.page > 1,
      },
    };
  }

  async findById(id: string): Promise<CouponDto> {
    const c = await this.couponsRepository.findById(id);
    if (!c) throw new NotFoundException("Coupon not found");
    return CouponMapper.toDto(c);
  }

  async create(dto: CreateCouponDto): Promise<CouponDto> {
    const existing = await this.couponsRepository.findByCode(dto.code);
    if (existing) throw new ConflictException("Coupon code already exists");

    const c = await this.couponsRepository.create({
      code: dto.code,
      type: dto.type,
      value: dto.value,
      minOrderAmount: dto.minOrderAmount ?? null,
      maxDiscount: dto.maxDiscount ?? null,
      usageLimit: dto.usageLimit ?? null,
      usageLimitPerUser: dto.usageLimitPerUser,
      startDate: new Date(dto.startDate),
      endDate: new Date(dto.endDate),
      isActive: dto.isActive ?? true,
    });
    return CouponMapper.toDto(c);
  }

  async update(id: string, dto: UpdateCouponDto): Promise<CouponDto> {
    await this.findById(id);
    const c = await this.couponsRepository.update(id, {
      ...dto,
      startDate: dto.startDate ? new Date(dto.startDate) : undefined,
      endDate: dto.endDate ? new Date(dto.endDate) : undefined,
    });
    return CouponMapper.toDto(c);
  }

  async delete(id: string): Promise<void> {
    await this.findById(id);
    await this.couponsRepository.delete(id);
  }

  // ⭐ الأهم: التحقق من الكوبون وحساب الخصم
  async validate(
    code: string,
    userId: string | null,
    subtotal: number,
  ): Promise<CouponValidationResultDto> {
    const coupon = await this.couponsRepository.findByCode(code);
    if (!coupon) return { valid: false, message: "Coupon not found" };

    const now = new Date();
    if (!coupon.isActive)
      return { valid: false, message: "Coupon is not active" };
    if (coupon.startDate > now)
      return { valid: false, message: "Coupon not yet valid" };
    if (coupon.endDate < now)
      return { valid: false, message: "Coupon expired" };
    if (coupon.usageLimit !== null && coupon.usedCount >= coupon.usageLimit)
      return { valid: false, message: "Coupon usage limit reached" };
    if (
      coupon.minOrderAmount !== null &&
      subtotal < Number(coupon.minOrderAmount)
    )
      return {
        valid: false,
        message: `Minimum order amount is ${coupon.minOrderAmount}`,
      };

    if (userId && coupon.usageLimitPerUser !== null) {
      const userUsages = await this.couponsRepository.countUsagesByUser(
        coupon.id,
        userId,
      );
      if (userUsages >= coupon.usageLimitPerUser)
        return {
          valid: false,
          message: "You reached the usage limit for this coupon",
        };
    }

    // حساب الخصم
    let discountAmount =
      coupon.type === CouponType.PERCENTAGE
        ? (subtotal * Number(coupon.value)) / 100
        : Number(coupon.value);

    if (coupon.maxDiscount !== null) {
      discountAmount = Math.min(discountAmount, Number(coupon.maxDiscount));
    }
    discountAmount = Math.min(discountAmount, subtotal); // مايتجاوزش الإجمالي

    return {
      valid: true,
      coupon: CouponMapper.toDto(coupon),
      discountAmount: Math.round(discountAmount * 100) / 100,
    };
  }
}
