"use client";

import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";

import { Link } from "../../i18n/routing";
import { useCategoriesTree } from "../../hooks/use-categories";
import { useLocalized } from "../../i18n/use-localized";
import { CategoryImage } from "../e-commerce/categories/category-image";

/**
 * Displays the home page "Shop by Category" visual showcase grid
 * using each category's image, localized name, and subcategory count.
 */
export function HomeCategories() {
  const categories = useCategoriesTree();
  const { t: tLocal } = useLocalized();
  const t = useTranslations("Home");

  return (
    <section className="py-14 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
              {tLocal({
                name: "Explore Collections",
                arName: "استكشف المجموعات",
              })}
            </span>
            <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl dark:text-white">
              {t("shopByCategory")}
            </h2>
          </div>

          <Link
            href="/categories"
            className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-xs transition-all hover:border-blue-500 hover:text-blue-600 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-200 dark:hover:border-blue-500 dark:hover:text-blue-400"
          >
            <span>{t("viewAll")}</span>
            <ArrowRight className="h-4 w-4 rtl:rotate-180" />
          </Link>
        </div>

        {categories.isLoading ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {Array.from({ length: 10 }).map((_, i) => (
              <div
                key={i}
                className="h-44 animate-pulse rounded-2xl bg-gray-200/80 dark:bg-gray-800/70"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {categories.data?.slice(0, 10).map((cat) => {
              const title = tLocal(cat);
              const subCount = cat.children?.length ?? 0;

              return (
                <Link
                  key={cat.id}
                  href={`/categories/${cat.slug}`}
                  className="group relative h-44 overflow-hidden rounded-2xl border border-gray-200/80 bg-gray-900 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-blue-500/70 hover:shadow-xl hover:shadow-blue-500/15 dark:border-gray-800"
                >
                  <CategoryImage
                    src={cat.image}
                    alt={title}
                    fallbackLabel={cat.name}
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    fallbackClassName="flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-600 to-indigo-700 text-3xl font-black text-white"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-gray-950/90 via-gray-950/35 to-transparent transition-opacity group-hover:from-gray-950/95" />

                  {subCount > 0 && (
                    <span className="absolute top-3 end-3 rounded-full border border-white/20 bg-gray-950/50 px-2 py-0.5 text-[10px] font-semibold text-white backdrop-blur-md">
                      {subCount}{" "}
                      {tLocal({ name: "items", arName: "أقسام" })}
                    </span>
                  )}

                  <div className="absolute inset-x-0 bottom-0 p-3.5">
                    <p className="line-clamp-1 text-sm font-extrabold text-white transition-colors group-hover:text-blue-200 sm:text-base">
                      {title}
                    </p>
                    <span className="mt-0.5 inline-flex items-center gap-1 text-[11px] font-medium text-gray-300">
                      {tLocal({ name: "Explore", arName: "تصفح" })}
                      <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5" />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
