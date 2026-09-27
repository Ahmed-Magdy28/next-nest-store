"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { ArrowRight } from "lucide-react";
import { useDeals, useNewArrivals } from "../../../hooks/use-products";
import { useCategoriesTree } from "../../../hooks/use-categories";
import { ProductGrid } from "../../../components/e-commerce/products/product-grid";
import { useLocalized } from "../../../i18n/use-localized";

export default function HomePage() {
  const newArrivals = useNewArrivals(8);
  const deals = useDeals(8);
  const categories = useCategoriesTree();
  const { t: tLocal } = useLocalized();
  const t = useTranslations("Home");

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Hero */}
      <section className="border-b border-gray-200 bg-white py-16 dark:border-gray-800 dark:bg-gray-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl dark:text-white">
              {t("heroTitle")}
            </h1>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
              {t("heroSubtitle")}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-md hover:bg-blue-700"
              >
                {t("shopNow")}
                <ArrowRight className="h-4 w-4 rtl:rotate-180" />
              </Link>
              <Link
                href="/deals"
                className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-6 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-800 dark:text-gray-200 dark:hover:bg-gray-800"
              >
                {t("viewDeals")}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-6 flex items-end justify-between">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {t("shopByCategory")}
            </h2>
            <Link
              href="/categories"
              className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-400"
            >
              {t("viewAll")} →
            </Link>
          </div>

          {categories.isLoading ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="h-24 animate-pulse rounded-xl bg-gray-200 dark:bg-gray-800"
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
              {categories.data?.slice(0, 6).map((cat) => (
                <Link
                  key={cat.id}
                  href={`/categories/${cat.slug}`}
                  className="rounded-xl border border-gray-200 bg-white p-4 text-center transition hover:-translate-y-0.5 hover:border-blue-500 hover:shadow-md dark:border-gray-800 dark:bg-gray-900"
                >
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {tLocal(cat)}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* New Arrivals */}
      <section className="border-t border-gray-200 py-12 dark:border-gray-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-6 flex items-end justify-between">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {t("newArrivals")}
            </h2>
            <Link
              href="/new-arrivals"
              className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-400"
            >
              {t("viewAll")} →
            </Link>
          </div>

          {newArrivals.isLoading ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="aspect-square animate-pulse rounded-2xl bg-gray-200 dark:bg-gray-800"
                />
              ))}
            </div>
          ) : (
            <ProductGrid products={newArrivals.data?.items ?? []} />
          )}
        </div>
      </section>

      {/* Deals */}
      <section className="border-t border-gray-200 py-12 dark:border-gray-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-6 flex items-end justify-between">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {t("hotDeals")}
            </h2>
            <Link
              href="/deals"
              className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-400"
            >
              {t("viewAll")} →
            </Link>
          </div>

          {deals.isLoading ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="aspect-square animate-pulse rounded-2xl bg-gray-200 dark:bg-gray-800"
                />
              ))}
            </div>
          ) : (
            <ProductGrid products={deals.data?.items ?? []} />
          )}
        </div>
      </section>
    </div>
  );
}
