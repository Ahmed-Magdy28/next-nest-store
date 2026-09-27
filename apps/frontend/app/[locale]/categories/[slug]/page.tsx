"use client";

import { use } from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

import { useCategoryProducts } from "../../../../hooks/use-categories";

import { Pagination } from "../../../../components/common/pagination";
import { useLocalized } from "../../../../i18n/use-localized";
import { ProductGrid } from "../../../../components/e-commerce/products/product-grid";

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export default function CategoryPage({ params }: PageProps) {
  const { slug } = use(params);
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const { t } = useLocalized();

  const page = Number(searchParams.get("page") ?? 1);

  const { data, isLoading, isError, error } = useCategoryProducts(slug, {
    page,
    limit: 12,
    includeDescendants: true,
  });

  const updatePage = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(newPage));
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8 dark:bg-gray-950">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Breadcrumb */}
        <Link
          href="/categories"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white"
        >
          <ChevronLeft className="h-4 w-4" />
          {t({ name: "Back to categories", arName: "العودة للأقسام" })}
        </Link>

        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white capitalize">
            {slug.replace(/-/g, " ")}
          </h1>
          {data && (
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {data.meta.total}{" "}
              {t({ name: "product(s) found", arName: "منتج" })}
            </p>
          )}
        </div>

        {/* Loading */}
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

        {/* Error */}
        {isError && (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-rose-700 dark:border-rose-900 dark:bg-rose-950/50 dark:text-rose-300">
            {t({ name: "Failed to load", arName: "فشل التحميل" })}:{" "}
            {error instanceof Error ? error.message : "Unknown error"}
          </div>
        )}

        {/* Grid */}
        {data && (
          <>
            <ProductGrid products={data.items} />

            <Pagination
              page={data.meta.page}
              totalPages={data.meta.totalPages}
              onPageChange={updatePage}
            />
          </>
        )}
      </div>
    </div>
  );
}
