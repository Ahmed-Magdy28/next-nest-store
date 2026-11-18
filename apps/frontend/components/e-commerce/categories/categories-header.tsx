"use client";

import { useLocalized } from "../../../i18n/use-localized";

interface CategoriesHeaderProps {
  isLoading: boolean;
  totalCategories: number;
  totalSubcategories: number;
  search: string;
  onSearchChange: (value: string) => void;
}

/**
 * Renders the categories directory banner with department counts and a search input.
 */
export function CategoriesHeader({
  isLoading,
  totalCategories,
  totalSubcategories,
  search,
  onSearchChange,
}: CategoriesHeaderProps) {
  const { t } = useLocalized();

  return (
    <section className="relative overflow-hidden rounded-3xl border border-gray-200/80 bg-white p-6 shadow-xs sm:p-8 dark:border-gray-800 dark:bg-gray-900">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-2">
          <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
            {t({ name: "Shop by Department", arName: "تسوق حسب القسم" })}
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl dark:text-white">
            {t({ name: "Categories", arName: "الأقسام" })}
          </h1>
          <p className="max-w-2xl text-sm text-gray-500 sm:text-base dark:text-gray-400">
            {t({
              name: "Browse products by category and explore curated subcategories.",
              arName: "تصفح المنتجات حسب القسم واستكشف الأقسام الفرعية.",
            })}
          </p>

          {!isLoading && totalCategories > 0 && (
            <div className="flex flex-wrap items-center gap-3 pt-2 text-xs font-semibold text-gray-600 dark:text-gray-300">
              <span className="rounded-lg bg-gray-100 px-2.5 py-1 dark:bg-gray-800">
                {totalCategories}{" "}
                {t({ name: "Main Categories", arName: "أقسام رئيسية" })}
              </span>
              <span className="rounded-lg bg-gray-100 px-2.5 py-1 dark:bg-gray-800">
                {totalSubcategories}{" "}
                {t({ name: "Subcategories", arName: "أقسام فرعية" })}
              </span>
            </div>
          )}
        </div>

        <div className="w-full lg:max-w-xs">
          <label htmlFor="category-search" className="sr-only">
            {t({ name: "Search categories", arName: "ابحث في الأقسام" })}
          </label>
          <input
            id="category-search"
            type="search"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={t({
              name: "Search categories or subcategories...",
              arName: "ابحث عن قسم أو قسم فرعي...",
            })}
            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-500 dark:focus:border-blue-400 dark:focus:bg-gray-900"
          />
        </div>
      </div>
    </section>
  );
}
