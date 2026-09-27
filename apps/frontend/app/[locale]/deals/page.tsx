"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";

import { useDeals } from "../../../hooks/use-products";

import { useLocalized } from "../../../i18n/use-localized";
import { ProductGrid } from "../../../components/e-commerce/products/product-grid";

export default function DealsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const { t } = useLocalized();

  const page = Number(searchParams.get("page") ?? 1);

  // useDeals بياخد limit بس، فلو عايز pagination كاملة استخدم useProducts
  const { data, isLoading } = useDeals(12);

  const updatePage = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(newPage));
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8 dark:bg-gray-950">
      <div className="mx-auto max-w-7xl space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {t({ name: "Hot Deals", arName: "أقوى العروض" })}
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {t({
              name: "Best discounts on quality products",
              arName: "أفضل الخصومات على منتجات مختارة",
            })}
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="aspect-square animate-pulse rounded-2xl bg-gray-200 dark:bg-gray-800"
              />
            ))}
          </div>
        ) : (
          <ProductGrid products={data?.items ?? []} />
        )}
      </div>
    </div>
  );
}
