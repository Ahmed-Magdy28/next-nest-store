"use client";

import { CreditCard, RotateCcw, ShieldCheck, Truck } from "lucide-react";
import { useLocalized } from "../../i18n/use-localized";

const VALUE_ITEMS = [
  {
    icon: Truck,
    title: { name: "Free Shipping", arName: "شحن مجاني" },
    subtitle: { name: "On orders over $100", arName: "للطلبات فوق $100" },
  },
  {
    icon: ShieldCheck,
    title: { name: "100% Authentic", arName: "أصلي 100%" },
    subtitle: { name: "Verified brand warranty", arName: "ضمان الوكيل المعتمد" },
  },
  {
    icon: RotateCcw,
    title: { name: "Easy Returns", arName: "استرجاع سهل" },
    subtitle: { name: "30-day return policy", arName: "خلال 30 يوم من الاستلام" },
  },
  {
    icon: CreditCard,
    title: { name: "Secure Checkout", arName: "دفع آمن" },
    subtitle: { name: "Encrypted transactions", arName: "حماية كاملة للمدفوعات" },
  },
];

/**
 * Compact 4-column storefront trust and value-proposition strip.
 */
export function HomeValueProps() {
  const { t } = useLocalized();

  return (
    <section className="border-b border-gray-200/80 bg-white py-5 dark:border-gray-800 dark:bg-gray-900/70">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {VALUE_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title.name} className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
                  <Icon className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-gray-900 dark:text-white">
                    {t(item.title)}
                  </p>
                  <p className="truncate text-xs text-gray-500 dark:text-gray-400">
                    {t(item.subtitle)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
