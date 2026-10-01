"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { ArrowRight } from "lucide-react";
import { useCategoriesTree } from "../../hooks/use-categories";
import { useLocalized } from "../../i18n/use-localized";

export function HomeCategories() {
  const categories = useCategoriesTree();
  const { t: tLocal } = useLocalized();
  const t = useTranslations("Home");

  return (
    <section className="py-14 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              Explore Collections
            </span>
            <h2 className="mt-1 text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">
              {t("shopByCategory")}
            </h2>
          </div>
          <Link
            href="/categories"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
          >
            <span>{t("viewAll")}</span>
            <ArrowRight className="h-4 w-4 rtl:rotate-180" />
          </Link>
        </div>

        {categories.isLoading ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-28 animate-pulse rounded-2xl bg-gray-200/70 dark:bg-gray-800/60"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {categories.data?.slice(0, 6).map((cat) => (
              <Link
                key={cat.id}
                href={`/categories/${cat.slug}`}
                className="group relative flex flex-col items-center justify-center rounded-2xl border border-gray-200/80 bg-white p-5 text-center shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-blue-500 hover:shadow-lg hover:shadow-blue-500/10 dark:border-gray-800 dark:bg-gray-900 dark:hover:border-blue-500/50"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition-colors group-hover:bg-blue-600 group-hover:text-white dark:bg-blue-950/60 dark:text-blue-400 dark:group-hover:bg-blue-600 dark:group-hover:text-white">
                  <span className="text-lg font-bold">
                    {cat.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <p className="mt-3 text-sm font-bold text-gray-900 group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400 transition-colors">
                  {tLocal(cat)}
                </p>
                <span className="text-[11px] text-gray-400 font-medium mt-0.5">
                  Explore items
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
