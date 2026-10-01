import type {
  CouponValidationResultDto,
  ValidateCouponDto,
} from "@repo/shared/dtos/e-commerce";
import { apiClient } from "../common/client";

/**
 * Validate coupon code against subtotal
 */
export async function validateCoupon(
  body: ValidateCouponDto,
): Promise<CouponValidationResultDto> {
  return apiClient.post<CouponValidationResultDto>("/coupons/validate", body);
}
