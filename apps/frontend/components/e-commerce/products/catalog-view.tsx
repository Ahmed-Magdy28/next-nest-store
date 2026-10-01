"use client";

import { Suspense, useMemo, useState } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { SlidersHorizontal } from "lucide-react";

import { useProducts } from "../../../hooks/use-products";
import { useLocalized } from "../../../i18n/use-localized";
import { Pagination } from "../../common/pagination";
import { ProductFilters } from "./product-filters";
import { ProductGrid } from "./product-grid";

export interface CatalogViewProps {
  title: string | { name: string; arName: string };
  subtitle?: string | { name: string; arName: string };
  badge?: {
    icon: React.ComponentType<{ className?: string }>;
    label: string | { name: string; arName: string };
    colorClassName?: string;
  };
  presetFilters?: {
    onDiscount?: boolean;
    isNew?: boolean;
  };
  hideDiscountFilter?: boolean;
  hideNewArrivalsFilter?: boolean;
  defaultSortBy?: "createdAt" | "updatedAt" | "price" | "name";
  defaultSortOrder?: "asc" | "desc";
  limit?: number;
}

function CatalogViewContent({
  title,
  subtitle,
  badge,
  presetFilters,
  hideDiscountFilter = false,
  hideNewArrivalsFilter = false,
  defaultSortBy = "createdAt",
  defaultSortOrder = "desc",
  limit = 12,
}: CatalogViewProps) {
  const { t } = useLocalized();
  const tFilters = useTranslations("ProductFilters");
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [showFilters, setShowFilters] = useState(true);

  // ─── Extract query parameters from URL ───
  const search = searchParams.get("search") ?? "";
  const categoryId = searchParams.get("categoryId") ?? undefined;
  const onDiscountParam = searchParams.get("onDiscount");
  const isNewParam = searchParams.get("isNew");
  const sortBy = (searchParams.get("sortBy") ?? defaultSortBy) as
    | "createdAt"
    | "updatedAt"
    | "price"
    | "name";
  const sortOrder = (searchParams.get("sortOrder") ?? defaultSortOrder) as
    | "asc"
    | "desc";
  const page = Math.max(1, Number(searchParams.get("page") ?? 1));

  const [localSearch, setLocalSearch] = useState(search);

  // Determine actual filter values respecting presets
  const onDiscount =
    presetFilters?.onDiscount !== undefined
      ? presetFilters.onDiscount
      : onDiscountParam === "true"
        ? true
        : onDiscountParam === "false"
          ? false
          : undefined;

  const isNew =
    presetFilters?.isNew !== undefined
      ? presetFilters.isNew
      : isNewParam === "true"
        ? true
        : isNewParam === "false"
          ? false
          : undefined;

  const activeFilterCount =
    (search ? 1 : 0) +
    (categoryId ? 1 : 0) +
    (!hideDiscountFilter && onDiscountParam !== null ? 1 : 0) +
    (!hideNewArrivalsFilter && isNewParam !== null ? 1 : 0);

  // ─── Update URL ───
  const updateQuery = (
    updates: Record<string, string | number | undefined>,
  ) => {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(updates).forEach(([key, value]) => {
      if (value === undefined || value === "" || value === null) {
        params.delete(key);
      } else {
        params.set(key, String(value));
      }
    });

    router.push(`${pathname}?${params.toString()}`);
  };

  // Debounced search
  const handleSearchChange = (value: string) => {
    setLocalSearch(value);
    const timeout = setTimeout(() => {
      updateQuery({ search: value || undefined, page: 1 });
    }, 400);
    return () => clearTimeout(timeout);
  };

  // ─── Query Products ───
  const query = useMemo(
    () => ({
      page,
      limit,
      onDiscount,
      isNew,
      categoryId,
      search: search || undefined,
      sortBy,
      sortOrder,
    }),
    [page, limit, onDiscount, isNew, categoryId, search, sortBy, sortOrder],
  );

  const { data, isLoading, isError, error } = useProducts(query);

  const displayTitle = typeof title === "string" ? title : t(title);
  const displaySubtitle = subtitle
    ? typeof subtitle === "string"
      ? subtitle
      : t(subtitle)
    : undefined;

  const BadgeIcon = badge?.icon;
  const displayBadgeLabel = badge
    ? typeof badge.label === "string"
      ? badge.label
      : t(badge.label)
    : null;

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8 dark:bg-gray-950">
      <div className="mx-auto max-w-7xl space-y-6 sm:space-y-8">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            {badge && BadgeIcon && (
              <div
                className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold mb-2 ${
                  badge.colorClassName ||
                  "bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400"
                }`}
              >
                <BadgeIcon className="h-3.5 w-3.5" />
                <span>{displayBadgeLabel}</span>
              </div>
            )}
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
              {displayTitle}
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              {data
                ? t({
                    name: `${data.meta.total} products found`,
                    arName: `تم العثور على ${data.meta.total} منتج`,
                  })
                : displaySubtitle}
            </p>
          </div>

          {/* Filter Toggle */}
          <button
            type="button"
            onClick={() => setShowFilters((prev) => !prev)}
            className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-xs font-semibold text-gray-700 shadow-xs hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800 transition cursor-pointer"
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

        <div className="flex flex-col lg:flex-row gap-6 items-start">
          {/* Filters Sidebar */}
          {showFilters && (
            <div className="w-full lg:w-[280px] shrink-0">
              <ProductFilters
                search={localSearch}
                onSearchChange={handleSearchChange}
                categoryId={categoryId}
                onCategoryChange={(v) => updateQuery({ categoryId: v, page: 1 })}
                onDiscount={onDiscount}
                onOnDiscountChange={
                  hideDiscountFilter
                    ? undefined
                    : (v) =>
                        updateQuery({
                          onDiscount: v === true ? "true" : undefined,
                          page: 1,
                        })
                }
                isNew={isNew}
                onIsNewChange={
                  hideNewArrivalsFilter
                    ? undefined
                    : (v) =>
                        updateQuery({
                          isNew: v === true ? "true" : undefined,
                          page: 1,
                        })
                }
                hideDiscountFilter={hideDiscountFilter}
                hideNewArrivalsFilter={hideNewArrivalsFilter}
                sortBy={sortBy}
                onSortByChange={(v) => updateQuery({ sortBy: v, page: 1 })}
                sortOrder={sortOrder}
                onSortOrderChange={(v) => updateQuery({ sortOrder: v, page: 1 })}
                onReset={() => router.push(pathname)}
              />
            </div>
          )}

          {/* Product Grid Area */}
          <div className="flex-1 min-w-0 w-full space-y-6">
            {isLoading && (
              <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div
                    key={i}
                    className="aspect-square animate-pulse rounded-2xl bg-gray-200 dark:bg-gray-800"
                  />
                ))}
              </div>
            )}

            {isError && (
              <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-rose-700 dark:border-rose-900 dark:bg-rose-950/50 dark:text-rose-300">
                Failed to load products:{" "}
                {error instanceof Error ? error.message : "Unknown error"}
              </div>
            )}

            {data && (
              <>
                <ProductGrid products={data.items} />

                <Pagination
                  page={data.meta.page}
                  totalPages={data.meta.totalPages}
                  onPageChange={(p) => updateQuery({ page: p })}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export function CatalogView(props: CatalogViewProps) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 p-4 sm:p-8 dark:bg-gray-950">
          <div className="mx-auto max-w-7xl animate-pulse space-y-8">
            <div className="h-8 w-48 rounded-lg bg-gray-200 dark:bg-gray-800" />
            <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="aspect-square rounded-2xl bg-gray-200 dark:bg-gray-800"
                />
              ))}
            </div>
          </div>
        </div>
      }
    >
      <CatalogViewContent {...props} />
    </Suspense>
  );
}
