"use client";

import Link from "next/link";
import { useCategoriesTree } from "../../../hooks/use-categories";
import { useLocalized } from "../../../i18n/use-localized";

export default function CategoriesPage() {
  const { data: categories, isLoading } = useCategoriesTree();
  const { t } = useLocalized();

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8 dark:bg-gray-950">
      <div className="mx-auto max-w-7xl space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {t({ name: "Categories", arName: "الأقسام" })}
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {t({
              name: "Browse products by category",
              arName: "تصفح المنتجات حسب القسم",
            })}
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-40 animate-pulse rounded-2xl bg-gray-200 dark:bg-gray-800"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {categories?.map((cat) => (
              <div
                key={cat.id}
                className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900"
              >
                <Link href={`/categories/${cat.slug}`}>
                  <h2 className="text-xl font-bold text-gray-900 hover:text-blue-600 dark:text-white dark:hover:text-blue-400">
                    {t(cat)} {/* ✅ اسم القسم حسب اللغة */}
                  </h2>
                </Link>

                {cat.children.length > 0 && (
                  <ul className="mt-4 space-y-1.5">
                    {cat.children.map((child) => (
                      <li key={child.id}>
                        <Link
                          href={`/categories/${child.slug}`}
                          className="text-sm text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
                        >
                          → {t(child)}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
