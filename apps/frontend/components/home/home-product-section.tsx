"use client";

import { ArrowRight } from "lucide-react";
import type { ProductListItemDto } from "@repo/shared/dtos/e-commerce";

import { Link } from "../../i18n/routing";
import { ProductGrid } from "../e-commerce/products/product-grid";

interface HomeProductSectionProps {
  eyebrow: string;
  title: string;
  viewAllHref: string;
  viewAllLabel: string;
  accent?: "blue" | "rose";
  products: ProductListItemDto[];
  isLoading: boolean;
  tinted?: boolean;
}

/**
 * Reusable home page product showcase section with loading skeletons
 * and a localized "View All" link.
 */
export function HomeProductSection({
  eyebrow,
  title,
  viewAllHref,
  viewAllLabel,
  accent = "blue",
  products,
  isLoading,
  tinted = false,
}: HomeProductSectionProps) {
  const accentText =
    accent === "rose"
      ? "text-rose-600 dark:text-rose-400"
      : "text-blue-600 dark:text-blue-400";

  return (
    <section
      className={`border-t border-gray-200/80 py-14 sm:py-16 dark:border-gray-800 ${
        tinted ? "bg-gray-50/50 dark:bg-gray-900/40" : ""
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <span
              className={`text-xs font-bold uppercase tracking-wider ${accentText}`}
            >
              {eyebrow}
            </span>
            <h2 className="mt-1 text-2xl font-extrabold text-gray-900 sm:text-3xl dark:text-white">
              {title}
            </h2>
          </div>
          <Link
            href={viewAllHref}
            className={`inline-flex items-center gap-1.5 text-sm font-semibold hover:opacity-80 ${accentText}`}
          >
            <span>{viewAllLabel}</span>
            <ArrowRight className="h-4 w-4 rtl:rotate-180" />
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="aspect-square animate-pulse rounded-2xl bg-gray-200/70 dark:bg-gray-800/60"
              />
            ))}
          </div>
        ) : (
          <ProductGrid products={products} />
        )}
      </div>
    </section>
  );
}
