"use client";

import { ChevronLeft } from "lucide-react";
import type { CategoryTreeDto } from "@repo/shared/dtos/e-commerce";

import { Link } from "../../../i18n/routing";
import { useLocalized } from "../../../i18n/use-localized";
import { CategoryImage } from "./category-image";

/**
 * Finds a category (and its parent, if it is a subcategory) by slug in the tree.
 */
export function findCategoryInTree(
  tree: CategoryTreeDto[] | undefined,
  slug: string,
): { current: CategoryTreeDto | null; parent: CategoryTreeDto | null } {
  if (!tree) return { current: null, parent: null };
  for (const cat of tree) {
    if (cat.slug === slug) {
      return { current: cat, parent: null };
    }
    const child = cat.children?.find((c) => c.slug === slug);
    if (child) {
      return { current: child, parent: cat };
    }
  }
  return { current: null, parent: null };
}

interface CategoryDetailHeaderProps {
  slug: string;
  current: CategoryTreeDto | null;
  parent: CategoryTreeDto | null;
  totalProducts?: number;
}

/**
 * Renders the breadcrumb, category hero header, and subcategory chips
 * on the category detail page.
 */
export function CategoryDetailHeader({
  slug,
  current,
  parent,
  totalProducts,
}: CategoryDetailHeaderProps) {
  const { t } = useLocalized();
  const displayTitle = current ? t(current) : slug.replace(/-/g, " ");

  return (
    <>
      <div className="flex flex-wrap items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-400">
        <Link
          href="/categories"
          className="inline-flex items-center gap-1.5 hover:text-blue-600 dark:hover:text-white"
        >
          <ChevronLeft className="h-4 w-4 rtl:rotate-180" />
          {t({ name: "Back to categories", arName: "العودة للأقسام" })}
        </Link>
        {parent && (
          <>
            <span className="text-gray-400">/</span>
            <Link
              href={`/categories/${parent.slug}`}
              className="hover:text-blue-600 dark:hover:text-white"
            >
              {t(parent)}
            </Link>
          </>
        )}
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-200/80 bg-white p-5 shadow-xs sm:p-6 dark:border-gray-800 dark:bg-gray-900">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          {current && (
            <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-gray-100 ring-1 ring-gray-200 dark:bg-gray-800 dark:ring-gray-700">
              <CategoryImage
                src={current.image}
                alt={displayTitle}
                fallbackLabel={current.name}
                sizes="80px"
                className="object-cover"
                fallbackClassName="flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-600 to-indigo-700 text-2xl font-black text-white/90"
              />
            </div>
          )}
          <div>
            <h1 className="text-3xl font-bold capitalize text-gray-900 dark:text-white">
              {displayTitle}
            </h1>
            {totalProducts !== undefined && (
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {totalProducts}{" "}
                {t({ name: "product(s) found", arName: "منتج" })}
              </p>
            )}
          </div>
        </div>

        {current?.children && current.children.length > 0 && (
          <div className="mt-6 border-t border-gray-100 pt-5 dark:border-gray-800">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              {t({ name: "Subcategories", arName: "الأقسام الفرعية" })}
            </p>
            <div className="flex flex-wrap gap-2.5">
              {current.children.map((child) => {
                const childName = t(child);
                return (
                  <Link
                    key={child.id}
                    href={`/categories/${child.slug}`}
                    className="group inline-flex items-center gap-2.5 rounded-xl border border-gray-200/80 bg-gray-50/80 p-1.5 pe-3 transition-all hover:border-blue-300 hover:bg-blue-50/70 dark:border-gray-800 dark:bg-gray-800/60 dark:hover:border-blue-800 dark:hover:bg-blue-950/40"
                  >
                    <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-lg bg-gray-200 dark:bg-gray-700">
                      <CategoryImage
                        src={child.image}
                        alt={childName}
                        fallbackLabel={child.name}
                        sizes="32px"
                        className="object-cover transition-transform duration-300 group-hover:scale-110"
                        fallbackClassName="flex h-full w-full items-center justify-center bg-blue-100 text-xs font-bold text-blue-700 dark:bg-blue-950 dark:text-blue-300"
                      />
                    </div>
                    <span className="text-xs font-semibold text-gray-700 group-hover:text-blue-700 dark:text-gray-200 dark:group-hover:text-blue-300">
                      {childName}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
