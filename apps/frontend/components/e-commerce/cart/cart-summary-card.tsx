"use client";

import { Link } from "../../../i18n/routing";
import { useLocalized } from "../../../i18n/use-localized";

interface CartSummaryCardProps {
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  taxRate: number;
  isFreeShipping: boolean;
  freeThreshold: number;
  remainingForFreeShipping: number;
}

export function CartSummaryCard({
  subtotal,
  shipping,
  tax,
  total,
  taxRate,
  isFreeShipping,
  freeThreshold,
  remainingForFreeShipping,
}: CartSummaryCardProps) {
  const { t } = useLocalized();

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900 space-y-4">
      <h2 className="text-lg font-bold text-gray-900 dark:text-white">
        {t({ name: "Order Summary", arName: "ملخص الطلب" })}
      </h2>

      {/* Free Shipping Progress */}
      {freeThreshold > 0 && (
        <div className="rounded-xl bg-blue-50/70 p-3.5 text-xs text-blue-900 dark:bg-blue-950/40 dark:text-blue-200 border border-blue-100 dark:border-blue-900/50">
          {remainingForFreeShipping > 0 ? (
            <div>
              <p className="font-medium">
                {t({
                  name: `Add $${remainingForFreeShipping.toFixed(2)} more for FREE shipping!`,
                  arName: `أضف $${remainingForFreeShipping.toFixed(2)} أخرى للحصول على شحن مجاني!`,
                })}
              </p>
              <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-blue-200/60 dark:bg-blue-900">
                <div
                  className="h-full bg-blue-600 transition-all duration-300"
                  style={{
                    width: `${Math.min(100, (subtotal / freeThreshold) * 100)}%`,
                  }}
                />
              </div>
            </div>
          ) : (
            <p className="font-semibold text-emerald-700 dark:text-emerald-400">
              {t({
                name: "🎉 You qualified for FREE shipping!",
                arName: "🎉 لقد حصلت على شحن مجاني!",
              })}
            </p>
          )}
        </div>
      )}

      <div className="space-y-2 text-sm">
        {/* Subtotal */}
        <div className="flex items-center justify-between text-gray-600 dark:text-gray-300">
          <span>{t({ name: "Subtotal", arName: "المجموع الفرعي" })}</span>
          <span className="font-semibold text-gray-900 dark:text-white">
            ${subtotal.toFixed(2)}
          </span>
        </div>

        {/* Shipping Cost */}
        <div className="flex items-center justify-between text-gray-600 dark:text-gray-300">
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

        {/* Estimated Tax */}
        <div className="flex items-center justify-between text-gray-600 dark:text-gray-300">
          <span>
            {t({
              name: `Estimated Tax (${taxRate}%)`,
              arName: `الضريبة التقديرية (${taxRate}%)`,
            })}
          </span>
          <span className="font-semibold text-gray-900 dark:text-white">
            ${tax.toFixed(2)}
          </span>
        </div>

        {/* Total */}
        <div className="border-t border-gray-200 pt-3 dark:border-gray-800 flex items-center justify-between text-base font-bold text-gray-900 dark:text-white">
          <span>{t({ name: "Total", arName: "الإجمالي" })}</span>
          <span className="text-xl text-blue-600 dark:text-blue-400">
            ${total.toFixed(2)}
          </span>
        </div>
      </div>

      <Link
        href="/checkout"
        className="flex w-full items-center justify-center rounded-xl bg-blue-600 py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition"
      >
        {t({ name: "Proceed to Checkout", arName: "المتابعة لإتمام الشراء" })}
      </Link>
    </div>
  );
}
