"use client";

import { Link } from "../../../i18n/routing";
import { useLocalized } from "../../../i18n/use-localized";
import { CategoryImage } from "./category-image";

/** Category node shape expected by {@link CategoryCard}. */
export interface CategoryTreeItem {
  id: string;
  name: string;
  arName: string;
  slug: string;
  image?: string | null;
  children: {
    id: string;
    name: string;
    arName: string;
    slug: string;
    image?: string | null;
  }[];
}

interface CategoryCardProps {
  category: CategoryTreeItem;
}

/**
 * Displays a main category hero card with its image, localized title,
 * subcategory thumbnail grid, and a link to browse all items.
 */
export function CategoryCard({ category }: CategoryCardProps) {
  const { t } = useLocalized();
  const categoryName = t(category);

  return (
    <article className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-blue-500/60 hover:shadow-xl hover:shadow-blue-500/10 dark:border-gray-800 dark:bg-gray-900 dark:hover:border-blue-500/50">
      <div>
        <Link
          href={`/categories/${category.slug}`}
          className="relative block h-44 w-full overflow-hidden bg-gray-100 dark:bg-gray-800"
        >
          <CategoryImage
            src={category.image}
            alt={categoryName}
            fallbackLabel={category.name}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            fallbackClassName="flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-600 to-indigo-700 text-4xl font-black text-white/90"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-gray-950/85 via-gray-950/30 to-transparent" />

          <div className="absolute top-3 end-3">
            <span className="inline-flex items-center rounded-full border border-white/20 bg-gray-950/45 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur-md">
              {category.children.length > 0
                ? `${category.children.length} ${t({
                    name: "Subcategories",
                    arName: "أقسام فرعية",
                  })}`
                : t({ name: "Main Category", arName: "قسم رئيسي" })}
            </span>
          </div>

          <div className="absolute inset-x-0 bottom-0 p-4">
            <h2 className="text-xl font-extrabold tracking-tight text-white transition-colors group-hover:text-blue-200">
              {categoryName}
            </h2>
          </div>
        </Link>

        <div className="p-4">
          {category.children.length > 0 ? (
            <div className="grid grid-cols-2 gap-2">
              {category.children.map((child) => {
                const childName = t(child);
                return (
                  <Link
                    key={child.id}
                    href={`/categories/${child.slug}`}
                    className="group/sub flex items-center gap-2.5 rounded-xl border border-gray-100 bg-gray-50/80 p-1.5 transition-all hover:border-blue-200 hover:bg-blue-50/70 dark:border-gray-800 dark:bg-gray-800/50 dark:hover:border-blue-800/60 dark:hover:bg-blue-950/40"
                  >
                    <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-lg bg-gray-200 dark:bg-gray-700">
                      <CategoryImage
                        src={child.image}
                        alt={childName}
                        fallbackLabel={child.name}
                        sizes="36px"
                        className="object-cover transition-transform duration-300 group-hover/sub:scale-110"
                        fallbackClassName="flex h-full w-full items-center justify-center bg-blue-100 text-xs font-bold text-blue-700 dark:bg-blue-950 dark:text-blue-300"
                      />
                    </div>
                    <span className="line-clamp-2 text-xs font-semibold text-gray-700 transition-colors group-hover/sub:text-blue-700 dark:text-gray-200 dark:group-hover/sub:text-blue-300">
                      {childName}
                    </span>
                  </Link>
                );
              })}
            </div>
          ) : (
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {t({
                name: "Explore all products in this collection.",
                arName: "استكشف جميع المنتجات في هذا القسم.",
              })}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-gray-100 px-4 py-3 dark:border-gray-800">
        <Link
          href={`/categories/${category.slug}`}
          className="inline-flex w-full items-center justify-between text-xs font-bold text-blue-600 transition-colors hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
        >
          <span>
            {t({
              name: "Browse All Items",
              arName: "تصفح جميع المنتجات",
            })}
          </span>
          <span className="transition-transform duration-200 group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5">
            →
          </span>
        </Link>
      </div>
    </article>
  );
}
