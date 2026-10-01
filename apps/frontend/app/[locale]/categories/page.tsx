"use client";

import { useCategoriesTree } from "../../../hooks/use-categories";
import { useLocalized } from "../../../i18n/use-localized";
import { CategoryCard } from "../../../components/e-commerce/categories/category-card";

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
                className="h-44 animate-pulse rounded-2xl bg-gray-200/70 dark:bg-gray-800/60"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {categories?.map((cat) => (
              <CategoryCard key={cat.id} category={cat} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
