"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { ArrowRight } from "lucide-react";
import { useDeals, useNewArrivals } from "../../../hooks/use-products";
import { ProductGrid } from "../../../components/e-commerce/products/product-grid";
import { HeroSection } from "../../../components/home/hero-section";
import { HomeCategories } from "../../../components/home/home-categories";

export default function HomePage() {
  const newArrivals = useNewArrivals(8);
  const deals = useDeals(8);
  const t = useTranslations("Home");

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Hero */}
      <HeroSection />

      {/* Categories */}
      <HomeCategories />

      {/* New Arrivals */}
      <section className="border-t border-gray-200/80 py-14 sm:py-16 dark:border-gray-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                Fresh From Inventory
              </span>
              <h2 className="mt-1 text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">
                {t("newArrivals")}
              </h2>
            </div>
            <Link
              href="/new-arrivals"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
            >
              <span>{t("viewAll")}</span>
              <ArrowRight className="h-4 w-4 rtl:rotate-180" />
            </Link>
          </div>

          {newArrivals.isLoading ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="aspect-square animate-pulse rounded-2xl bg-gray-200/70 dark:bg-gray-800/60"
                />
              ))}
            </div>
          ) : (
            <ProductGrid products={newArrivals.data?.items ?? []} />
          )}
        </div>
      </section>

      {/* Deals */}
      <section className="border-t border-gray-200/80 py-14 sm:py-16 bg-gray-50/50 dark:border-gray-800 dark:bg-gray-900/40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">
                Special Discounts
              </span>
              <h2 className="mt-1 text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">
                {t("hotDeals")}
              </h2>
            </div>
            <Link
              href="/deals"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-rose-600 hover:text-rose-700 dark:text-rose-400 dark:hover:text-rose-300"
            >
              <span>{t("viewAll")}</span>
              <ArrowRight className="h-4 w-4 rtl:rotate-180" />
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
