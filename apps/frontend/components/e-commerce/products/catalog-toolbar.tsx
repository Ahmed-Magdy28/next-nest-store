"use client";

import { Search, SlidersHorizontal, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useLocalized } from "../../../i18n/use-localized";

interface CatalogToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;
  sortBy: "createdAt" | "updatedAt" | "price" | "name";
  sortOrder: "asc" | "desc";
  onSortChange: (
    sortBy: "createdAt" | "updatedAt" | "price" | "name",
    sortOrder: "asc" | "desc",
  ) => void;
  limit: number;
  onLimitChange: (limit: number) => void;
  showFilters: boolean;
  onToggleFilters: () => void;
  activeFilterCount: number;
}

/**
 * Top catalog toolbar providing quick search, combined sort presets,
 * page-size selection, and a filter-sidebar toggle button.
 */
export function CatalogToolbar({
  search,
  onSearchChange,
  sortBy,
  sortOrder,
  onSortChange,
  limit,
  onLimitChange,
  showFilters,
  onToggleFilters,
  activeFilterCount,
}: CatalogToolbarProps) {
  const { t } = useLocalized();
  const tFilters = useTranslations("ProductFilters");
  const sortValue = `${sortBy}:${sortOrder}`;

  const handleSortSelect = (value: string) => {
    const [nextBy, nextOrder] = value.split(":") as [
      CatalogToolbarProps["sortBy"],
      CatalogToolbarProps["sortOrder"],
    ];
    onSortChange(nextBy, nextOrder);
  };

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-gray-200/80 bg-white p-3.5 shadow-xs sm:flex-row sm:items-center sm:justify-between dark:border-gray-800 dark:bg-gray-900">
      <div className="relative flex-1">
        <Search className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={tFilters("searchPlaceholder")}
          className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2 ps-9 pe-8 text-sm outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20 dark:border-gray-800 dark:bg-gray-950 dark:text-white"
        />
        {search && (
          <button
            type="button"
            onClick={() => onSearchChange("")}
            aria-label={t({ name: "Clear search", arName: "مسح البحث" })}
            className="absolute end-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2.5">
        <select
          value={sortValue}
          onChange={(e) => handleSortSelect(e.target.value)}
          aria-label={tFilters("sortBy")}
          className="rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-xs font-semibold text-gray-700 outline-none focus:border-blue-500 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-200"
        >
          <option value="createdAt:desc">
            {t({ name: "Newest First", arName: "الأحدث أولاً" })}
          </option>
          <option value="price:asc">
            {t({ name: "Price: Low to High", arName: "السعر: من الأقل للأعلى" })}
          </option>
          <option value="price:desc">
            {t({ name: "Price: High to Low", arName: "السعر: من الأعلى للأقل" })}
          </option>
          <option value="name:asc">
            {t({ name: "Name: A to Z", arName: "الاسم: أ - ي" })}
          </option>
          <option value="updatedAt:desc">
            {t({ name: "Recently Updated", arName: "المحدثة مؤخراً" })}
          </option>
        </select>

        <select
          value={limit}
          onChange={(e) => onLimitChange(Number(e.target.value))}
          aria-label={t({ name: "Items per page", arName: "عدد المنتجات" })}
          className="rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-xs font-semibold text-gray-700 outline-none focus:border-blue-500 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-200"
        >
          <option value={12}>12 / {t({ name: "page", arName: "صفحة" })}</option>
          <option value={24}>24 / {t({ name: "page", arName: "صفحة" })}</option>
          <option value={36}>36 / {t({ name: "page", arName: "صفحة" })}</option>
        </select>

        <button
          type="button"
          onClick={onToggleFilters}
          className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2 text-xs font-semibold text-gray-700 transition hover:bg-gray-100 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-200 dark:hover:bg-gray-800"
        >
          <SlidersHorizontal className="h-4 w-4" />
          <span>
            {showFilters ? tFilters("hideFilters") : tFilters("showFilters")}
          </span>
          {activeFilterCount > 0 && (
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white">
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>
    </div>
  );
}
