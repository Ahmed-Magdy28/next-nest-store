"use client";

import Image from "next/image";
import { CheckCircle2, Loader2, Tag } from "lucide-react";
import type { CartDto } from "@repo/shared/dtos/e-commerce";
import { useLocalized } from "../../../i18n/use-localized";

interface CheckoutOrderSummaryProps {
  cart: CartDto;
  appliedCoupon: { code: string; discountAmount: number } | null;
  couponInput: string;
  onCouponInputChange: (value: string) => void;
  onApplyCoupon: () => void;
  onRemoveCoupon: () => void;
  isValidatingCoupon: boolean;
  subtotal: number;
  discount: number;
  shipping: number;
  isFreeShipping: boolean;
  tax: number;
  taxRate: number;
  total: number;
  isSubmitting: boolean;
}

export function CheckoutOrderSummary({
  cart,
  appliedCoupon,
  couponInput,
  onCouponInputChange,
  onApplyCoupon,
  onRemoveCoupon,
  isValidatingCoupon,
  subtotal,
  discount,
  shipping,
  isFreeShipping,
  tax,
  taxRate,
  total,
  isSubmitting,
}: CheckoutOrderSummaryProps) {
  const { t } = useLocalized();

  return (
    <div className="sticky top-20 rounded-2xl border border-gray-200 bg-white p-6 shadow-xs dark:border-gray-800 dark:bg-gray-900 space-y-6">
      <h2 className="text-lg font-bold text-gray-900 dark:text-white">
        {t({ name: "Order Summary", arName: "ملخص الطلب" })}
      </h2>

      {/* Items List */}
      <div className="max-h-72 overflow-y-auto space-y-3 pe-1 divide-y divide-gray-100 dark:divide-gray-800">
        {cart.items.map((item) => (
          <div key={item.id} className="pt-3 first:pt-0 flex items-center gap-3">
            <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-gray-100 bg-gray-100 dark:border-gray-800 dark:bg-gray-800">
              <Image
                src={item.product.mainImage}
                alt={t(item.product)}
                fill
                sizes="56px"
                className="object-cover"
              />
              <span className="absolute -top-1 -end-1 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-blue-600 px-1 text-[10px] font-bold text-white shadow-xs">
                {item.quantity}
              </span>
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-xs sm:text-sm font-medium text-gray-900 dark:text-white">
                {t(item.product)}
              </p>
              {item.variant && (
                <p className="text-xs text-gray-500">{t(item.variant)}</p>
              )}
              <p className="text-xs text-gray-500">
                {item.quantity} × ${item.currentPrice.toFixed(2)}
              </p>
            </div>

            <div className="text-sm font-semibold text-gray-900 dark:text-white">
              ${item.subtotal.toFixed(2)}
            </div>
          </div>
        ))}
      </div>

      {/* Coupon Code Section */}
      <div className="border-t border-gray-100 pt-4 dark:border-gray-800">
        <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase mb-2">
          {t({ name: "Coupon Code", arName: "كود الخصم" })}
        </label>

        {appliedCoupon ? (
          <div className="flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50 px-3.5 py-2.5 text-sm text-emerald-800 dark:border-emerald-800/60 dark:bg-emerald-950/40 dark:text-emerald-300">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              <span className="font-bold">{appliedCoupon.code}</span>
              <span>(-${appliedCoupon.discountAmount.toFixed(2)})</span>
            </div>
            <button
              type="button"
              onClick={onRemoveCoupon}
              className="text-xs font-medium text-red-600 hover:underline dark:text-red-400 cursor-pointer"
            >
              {t({ name: "Remove", arName: "إزالة" })}
            </button>
          </div>
        ) : (
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Tag className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={couponInput}
                onChange={(e) => onCouponInputChange(e.target.value)}
                placeholder={t({ name: "PROMO2026", arName: "كود الخصم" })}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2 ps-9 pe-3 text-xs uppercase text-gray-900 focus:border-blue-600 focus:bg-white focus:outline-none dark:border-gray-800 dark:bg-gray-950 dark:text-white"
              />
            </div>
            <button
              type="button"
              onClick={onApplyCoupon}
              disabled={isValidatingCoupon || !couponInput.trim()}
              className="rounded-xl bg-gray-900 px-4 py-2 text-xs font-semibold text-white hover:bg-gray-800 disabled:opacity-50 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-white cursor-pointer"
            >
              {isValidatingCoupon ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                t({ name: "Apply", arName: "تطبيق" })
              )}
            </button>
          </div>
        )}
      </div>

      {/* Totals Breakdown */}
      <div className="space-y-2.5 border-t border-gray-100 pt-4 text-sm dark:border-gray-800">
        <div className="flex justify-between text-gray-600 dark:text-gray-300">
          <span>{t({ name: "Subtotal", arName: "المجموع الفرعي" })}</span>
          <span className="font-semibold text-gray-900 dark:text-white">
            ${subtotal.toFixed(2)}
          </span>
        </div>

        {discount > 0 && (
          <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
            <span>{t({ name: "Coupon Discount", arName: "خصم الكوبون" })}</span>
            <span className="font-semibold">-${discount.toFixed(2)}</span>
          </div>
        )}

        <div className="flex justify-between text-gray-600 dark:text-gray-300">
          <span>{t({ name: "Shipping", arName: "الشحن" })}</span>
          <span className="font-semibold text-gray-900 dark:text-white">
            {isFreeShipping ? (
              <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                {t({ name: "Free", arName: "مجاني" })}
              </span>
            ) : (
              `$${shipping.toFixed(2)}`
            )}
          </span>
        </div>

        <div className="flex justify-between text-gray-600 dark:text-gray-300">
          <span>
            {t({
              name: `Tax (${taxRate}%)`,
              arName: `الضريبة (${taxRate}%)`,
            })}
          </span>
          <span className="font-semibold text-gray-900 dark:text-white">
            ${tax.toFixed(2)}
          </span>
        </div>

        <div className="border-t border-gray-200 pt-3 flex justify-between text-base font-bold text-gray-900 dark:border-gray-800 dark:text-white">
          <span>{t({ name: "Total", arName: "الإجمالي النهائي" })}</span>
          <span className="text-xl text-blue-600 dark:text-blue-400">
            ${total.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3.5 text-base font-bold text-white shadow-md shadow-blue-500/20 hover:bg-blue-700 disabled:opacity-60 transition cursor-pointer"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>{t({ name: "Processing Order...", arName: "جاري تأكيد الطلب..." })}</span>
          </>
        ) : (
          <span>{t({ name: "Place Order", arName: "تأكيد الطلب الآن" })}</span>
        )}
      </button>
    </div>
  );
}
