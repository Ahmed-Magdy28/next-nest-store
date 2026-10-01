"use client";

import { Link } from "../../../i18n/routing";
import { ShoppingBag, ChevronLeft } from "lucide-react";
import { useLocalized } from "../../../i18n/use-localized";

export function CartEmptyState() {
  const { t } = useLocalized();

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-8 dark:bg-gray-950">
      <div className="text-center">
        <ShoppingBag className="mx-auto h-16 w-16 text-gray-300 dark:text-gray-700" />
        <h1 className="mt-4 text-2xl font-bold text-gray-900 dark:text-white">
          {t({ name: "Your cart is empty", arName: "سلتك فارغة" })}
        </h1>
        <Link
          href="/products"
          className="mt-6 inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          <ChevronLeft className="h-4 w-4 rtl:rotate-180" />
          {t({ name: "Continue shopping", arName: "تابع التسوق" })}
        </Link>
      </div>
    </div>
  );
}
