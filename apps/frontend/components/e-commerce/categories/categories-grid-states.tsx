"use client";

import { useLocalized } from "../../../i18n/use-localized";

/**
 * Skeleton grid shown while the categories tree is loading.
 */
export function CategoriesLoadingGrid() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="overflow-hidden rounded-2xl border border-gray-200/80 bg-white dark:border-gray-800 dark:bg-gray-900"
        >
          <div className="h-44 w-full animate-pulse bg-gray-200/80 dark:bg-gray-800" />
          <div className="grid grid-cols-2 gap-2 p-4">
            {Array.from({ length: 4 }).map((__, j) => (
              <div
                key={j}
                className="h-12 animate-pulse rounded-xl bg-gray-100 dark:bg-gray-800/70"
              />
            ))}
          </div>
          <div className="h-10 animate-pulse border-t border-gray-100 bg-gray-50/70 dark:border-gray-800 dark:bg-gray-900" />
        </div>
      ))}
    </div>
  );
}

interface CategoriesEmptyStateProps {
  hasSearch: boolean;
  onClearSearch: () => void;
}

/**
 * Empty state displayed when no categories match the active search query.
 */
export function CategoriesEmptyState({
  hasSearch,
  onClearSearch,
}: CategoriesEmptyStateProps) {
  const { t } = useLocalized();

  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center dark:border-gray-700 dark:bg-gray-900">
      <p className="text-base font-semibold text-gray-900 dark:text-white">
        {t({
          name: "No matching categories found",
          arName: "لم يتم العثور على أقسام مطابقة",
        })}
      </p>
      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
        {t({
          name: "Try a different keyword or clear your search filter.",
          arName: "جرب كلمة بحث أخرى أو امسح التصفية.",
        })}
      </p>
      {hasSearch && (
        <button
          type="button"
          onClick={onClearSearch}
          className="mt-4 rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-blue-700"
        >
          {t({ name: "Clear search", arName: "مسح البحث" })}
        </button>
      )}
    </div>
  );
}
