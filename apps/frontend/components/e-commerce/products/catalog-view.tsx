"use client";

import { Suspense, useMemo, useRef, useState } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

import { useProducts } from "../../../hooks/use-products";
import { useLocalized } from "../../../i18n/use-localized";
import { Pagination } from "../../common/pagination";
import { ActiveFilterChips } from "./active-filter-chips";
import { CatalogToolbar } from "./catalog-toolbar";
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
  presetFilters?: { onDiscount?: boolean; isNew?: boolean };
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
  limit: defaultLimit = 12,
}: CatalogViewProps) {
  const { t } = useLocalized();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [showFilters, setShowFilters] = useState(true);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const search = searchParams.get("search") ?? "";
  const categoryId = searchParams.get("categoryId") ?? undefined;
  const minPrice = searchParams.get("minPrice") ? Number(searchParams.get("minPrice")) : undefined;
  const maxPrice = searchParams.get("maxPrice") ? Number(searchParams.get("maxPrice")) : undefined;
  const isAvailable = searchParams.get("isAvailable") === "true" ? true : undefined;
  const onDiscountParam = searchParams.get("onDiscount");
  const isNewParam = searchParams.get("isNew");
  const sortBy = (searchParams.get("sortBy") ?? defaultSortBy) as "createdAt" | "updatedAt" | "price" | "name";
  const sortOrder = (searchParams.get("sortOrder") ?? defaultSortOrder) as "asc" | "desc";
  const limit = Number(searchParams.get("limit") ?? defaultLimit);
  const page = Math.max(1, Number(searchParams.get("page") ?? 1));
  const [localSearch, setLocalSearch] = useState(search);

  const onDiscount = presetFilters?.onDiscount ?? (onDiscountParam === "true" ? true : undefined);
  const isNew = presetFilters?.isNew ?? (isNewParam === "true" ? true : undefined);

  const activeFilterCount =
    (search ? 1 : 0) + (categoryId ? 1 : 0) + (minPrice !== undefined || maxPrice !== undefined ? 1 : 0) +
    (isAvailable ? 1 : 0) + (!hideDiscountFilter && onDiscount ? 1 : 0) + (!hideNewArrivalsFilter && isNew ? 1 : 0);

  const updateQuery = (updates: Record<string, string | number | undefined>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([k, v]) => (v === undefined || v === "" ? params.delete(k) : params.set(k, String(v))));
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleSearchChange = (value: string) => {
    setLocalSearch(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => updateQuery({ search: value || undefined, page: 1 }), 350);
  };

  const handleRemoveChip = (key: string) => {
    if (key === "price") return updateQuery({ minPrice: undefined, maxPrice: undefined, page: 1 });
    if (key === "search") setLocalSearch("");
    updateQuery({ [key]: undefined, page: 1 });
  };

  const handleResetAll = () => {
    setLocalSearch("");
    router.push(pathname);
  };

  const query = useMemo(
    () => ({ page, limit, onDiscount, isNew, isAvailable, minPrice, maxPrice, categoryId, search: search || undefined, sortBy, sortOrder }),
    [page, limit, onDiscount, isNew, isAvailable, minPrice, maxPrice, categoryId, search, sortBy, sortOrder],
  );
  const { data, isLoading, isError, error } = useProducts(query);
  const BadgeIcon = badge?.icon;

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8 dark:bg-gray-950">
      <div className="mx-auto max-w-7xl space-y-6">
        <div>
          {badge && BadgeIcon && (
            <div className={`mb-2 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${badge.colorClassName || "bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400"}`}>
              <BadgeIcon className="h-3.5 w-3.5" />
              <span>{typeof badge.label === "string" ? badge.label : t(badge.label)}</span>
            </div>
          )}
          <h1 className="text-2xl font-extrabold text-gray-900 sm:text-3xl dark:text-white">{typeof title === "string" ? title : t(title)}</h1>
          <p className="mt-1 text-xs text-gray-500 sm:text-sm dark:text-gray-400">
            {data ? t({ name: `${data.meta.total} products found`, arName: `تم العثور على ${data.meta.total} منتج` }) : subtitle ? (typeof subtitle === "string" ? subtitle : t(subtitle)) : ""}
          </p>
        </div>

        <CatalogToolbar search={localSearch} onSearchChange={handleSearchChange} sortBy={sortBy} sortOrder={sortOrder} onSortChange={(b, o) => updateQuery({ sortBy: b, sortOrder: o, page: 1 })} limit={limit} onLimitChange={(l) => updateQuery({ limit: l, page: 1 })} showFilters={showFilters} onToggleFilters={() => setShowFilters((p) => !p)} activeFilterCount={activeFilterCount} />
        <ActiveFilterChips search={search} categoryId={categoryId} minPrice={minPrice} maxPrice={maxPrice} isAvailable={isAvailable} onDiscount={onDiscount} isNew={isNew} hideDiscountFilter={hideDiscountFilter} hideNewArrivalsFilter={hideNewArrivalsFilter} onRemove={handleRemoveChip} onResetAll={handleResetAll} />

        <div className="flex flex-col items-start gap-6 lg:flex-row">
          {showFilters && (
            <div className="w-full shrink-0 lg:w-[280px]">
              <ProductFilters categoryId={categoryId} onCategoryChange={(v) => updateQuery({ categoryId: v, page: 1 })} minPrice={minPrice} maxPrice={maxPrice} onPriceChange={(min, max) => updateQuery({ minPrice: min, maxPrice: max, page: 1 })} isAvailable={isAvailable} onIsAvailableChange={(v) => updateQuery({ isAvailable: v ? "true" : undefined, page: 1 })} onDiscount={onDiscount} onOnDiscountChange={hideDiscountFilter ? undefined : (v) => updateQuery({ onDiscount: v ? "true" : undefined, page: 1 })} isNew={isNew} onIsNewChange={hideNewArrivalsFilter ? undefined : (v) => updateQuery({ isNew: v ? "true" : undefined, page: 1 })} hideDiscountFilter={hideDiscountFilter} hideNewArrivalsFilter={hideNewArrivalsFilter} onReset={handleResetAll} />
            </div>
          )}
          <div className="w-full min-w-0 flex-1 space-y-6">
            {isLoading && <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">{Array.from({ length: 8 }).map((_, i) => <div key={i} className="aspect-square animate-pulse rounded-2xl bg-gray-200 dark:bg-gray-800" />)}</div>}
            {isError && <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-rose-700 dark:border-rose-900 dark:bg-rose-950/50 dark:text-rose-300">Failed to load products: {error instanceof Error ? error.message : "Unknown error"}</div>}
            {data && <><ProductGrid products={data.items} /><Pagination page={data.meta.page} totalPages={data.meta.totalPages} onPageChange={(p) => updateQuery({ page: p })} /></>}
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Reusable product catalog view with URL-synced search, filters, sorting, and pagination.
 */
export function CatalogView(props: CatalogViewProps) {
  return <Suspense fallback={<div className="min-h-screen animate-pulse bg-gray-50 p-8 dark:bg-gray-950" />}><CatalogViewContent {...props} /></Suspense>;
}
