"use client";

import Link from "next/link";
import { useLocalized } from "../../../i18n/use-localized";

interface CategoryTreeItem {
  id: string;
  name: string;
  arName: string;
  slug: string;
  children: {
    id: string;
    name: string;
    arName: string;
    slug: string;
  }[];
}

interface CategoryCardProps {
  category: CategoryTreeItem;
}

export function CategoryCard({ category }: CategoryCardProps) {
  const { t } = useLocalized();

  return (
    <div className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-gray-200/80 bg-white p-6 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-blue-500 hover:shadow-xl hover:shadow-blue-500/10 dark:border-gray-800 dark:bg-gray-900 dark:hover:border-blue-500/50">
      <div>
        <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-800">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition-colors group-hover:bg-blue-600 group-hover:text-white dark:bg-blue-950/60 dark:text-blue-400 dark:group-hover:bg-blue-600 dark:group-hover:text-white">
            <span className="text-lg font-black">
              {category.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-600 dark:bg-gray-800 dark:text-gray-300">
            {category.children.length > 0
              ? `${category.children.length} Subcategories`
              : "Main Category"}
          </span>
        </div>

        <Link href={`/categories/${category.slug}`} className="block mt-4">
          <h2 className="text-xl font-extrabold text-gray-900 group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400 transition-colors">
            {t(category)}
          </h2>
        </Link>

        {category.children.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {category.children.map((child) => (
              <Link
                key={child.id}
                href={`/categories/${child.slug}`}
                className="inline-flex items-center rounded-lg bg-gray-50 px-2.5 py-1 text-xs font-medium text-gray-600 hover:bg-blue-50 hover:text-blue-700 dark:bg-gray-800/80 dark:text-gray-300 dark:hover:bg-blue-950/50 dark:hover:text-blue-300 transition-colors"
              >
                {t(child)}
              </Link>
            ))}
          </div>
        )}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
        <Link
          href={`/categories/${category.slug}`}
          className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
        >
          <span>Browse All Items</span>
          <span className="rtl:rotate-180">→</span>
        </Link>
      </div>
    </div>
  );
}
