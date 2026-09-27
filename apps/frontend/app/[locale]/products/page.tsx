"use client";

import { Suspense, useMemo, useState } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

import { useProducts } from "../../../hooks/use-products";

import { Pagination } from "../../../components/common/pagination";
import { ProductFilters } from "../../../components/e-commerce/products/product-filters";
import { ProductGrid } from "../../../components/e-commerce/products/product-grid";

const DEFAULT_LIMIT = 12;

function ProductsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // ─── Derive filter state from URL (shareable links) ───
  const search = searchParams.get("search") ?? "";
  const categoryId = searchParams.get("categoryId") ?? undefined;
  const onDiscountParam = searchParams.get("onDiscount");
  const isNewParam = searchParams.get("isNew");
  const sortBy = (searchParams.get("sortBy") ?? "createdAt") as
    "createdAt" | "updatedAt" | "price" | "name";
  const sortOrder = (searchParams.get("sortOrder") ?? "desc") as "asc" | "desc";
  const page = Number(searchParams.get("page") ?? 1);

  const [localSearch, setLocalSearch] = useState(search);

  const onDiscount =
    onDiscountParam === "true"
      ? true
      : onDiscountParam === "false"
        ? undefined
        : undefined;

  const isNew =
    isNewParam === "true"
      ? true
      : isNewParam === "false"
        ? undefined
        : undefined;

  // ─── Push filters to URL ───
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

  // Debounce search
  const handleSearchChange = (value: string) => {
    setLocalSearch(value);
    const timeout = setTimeout(() => {
      updateQuery({ search: value || undefined, page: 1 });
    }, 400);
    return () => clearTimeout(timeout);
  };

  // ─── Query ───
  const query = useMemo(
    () => ({
      page,
      limit: DEFAULT_LIMIT,
      search: search || undefined,
      categoryId,
      onDiscount,
      isNew,
      sortBy,
      sortOrder,
    }),
    [page, search, categoryId, onDiscount, isNew, sortBy, sortOrder],
  );

  const { data, isLoading, isError, error } = useProducts(query);

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8 dark:bg-gray-950">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Products
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {data
              ? `${data.meta.total} product(s) found`
              : "Browse our catalog"}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_1fr]">
          {/* Filters */}
          <ProductFilters
            search={localSearch}
            onSearchChange={handleSearchChange}
            categoryId={categoryId}
            onCategoryChange={(v) => updateQuery({ categoryId: v, page: 1 })}
            onDiscount={onDiscount}
            onOnDiscountChange={(v) =>
              updateQuery({
                onDiscount: v === true ? "true" : undefined,
                page: 1,
              })
            }
            isNew={isNew}
            onIsNewChange={(v) =>
              updateQuery({ isNew: v === true ? "true" : undefined, page: 1 })
            }
            sortBy={sortBy}
            onSortByChange={(v) => updateQuery({ sortBy: v, page: 1 })}
            sortOrder={sortOrder}
            onSortOrderChange={(v) => updateQuery({ sortOrder: v, page: 1 })}
            onReset={() => router.push(pathname)}
          />

          {/* Grid */}
          <div className="space-y-6">
            {isLoading && (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 p-4 sm:p-8 dark:bg-gray-950">
          <div className="mx-auto max-w-7xl animate-pulse space-y-8">
            <div className="h-8 w-48 rounded-lg bg-gray-200 dark:bg-gray-800" />
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
      <ProductsContent />
    </Suspense>
  );
}
