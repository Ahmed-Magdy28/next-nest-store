"use client";

import { Suspense, use, useMemo } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

import {
  useCategoriesTree,
  useCategoryProducts,
} from "../../../../hooks/use-categories";
import { Pagination } from "../../../../components/common/pagination";
import { useLocalized } from "../../../../i18n/use-localized";
import { ProductGrid } from "../../../../components/e-commerce/products/product-grid";
import {
  CategoryDetailHeader,
  findCategoryInTree,
} from "../../../../components/e-commerce/categories/category-detail-header";

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
}

/**
 * Displays products for a category slug along with its header and subcategories.
 */
function CategoryContent({ params }: PageProps) {
  const { slug } = use(params);
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const { t } = useLocalized();

  const page = Number(searchParams.get("page") ?? 1);
  const { data: tree } = useCategoriesTree();
  const { current, parent } = useMemo(
    () => findCategoryInTree(tree, slug),
    [tree, slug],
  );

  const { data, isLoading, isError, error } = useCategoryProducts(slug, {
    page,
    limit: 12,
    includeDescendants: true,
  });

  const updatePage = (newPage: number) => {
    const nextParams = new URLSearchParams(searchParams.toString());
    nextParams.set("page", String(newPage));
    router.push(`${pathname}?${nextParams.toString()}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8 dark:bg-gray-950">
      <div className="mx-auto max-w-7xl space-y-8">
        <CategoryDetailHeader
          slug={slug}
          current={current}
          parent={parent}
          totalProducts={data?.meta.total}
        />

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
            {t({ name: "Failed to load", arName: "فشل التحميل" })}:{" "}
            {error instanceof Error ? error.message : "Unknown error"}
          </div>
        )}

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

/**
 * Category detail route wrapper with Suspense boundary for search params.
 */
export default function CategorySlugPage({ params }: PageProps) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen animate-pulse bg-gray-50 p-8 dark:bg-gray-950" />
      }
    >
      <CategoryContent params={params} />
    </Suspense>
  );
}
