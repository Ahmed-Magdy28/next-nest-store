"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { useProducts } from "../../../hooks/use-products";
import { useLocalized } from "../../../i18n/use-localized";
import { ProductCard } from "./ProductCard";

interface RelatedProductsSliderProps {
  currentProductId: string;
  categoryId?: string;
}

/**
 * Auto-advancing horizontal slider displaying "Products You May Like"
 * at the bottom of every product detail page.
 */
export function RelatedProductsSlider({
  currentProductId,
  categoryId,
}: RelatedProductsSliderProps) {
  const { t } = useLocalized();
  const trackRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);

  const primaryQuery = useProducts({ categoryId, limit: 13 });
  const fallbackQuery = useProducts({
    limit: 13,
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  const items = useMemo(() => {
    const primaryItems =
      primaryQuery.data?.items.filter((p) => p.id !== currentProductId) ?? [];
    if (primaryItems.length >= 4) {
      return primaryItems.slice(0, 12);
    }
    const fallbackItems =
      fallbackQuery.data?.items.filter(
        (p) =>
          p.id !== currentProductId &&
          !primaryItems.some((existing) => existing.id === p.id),
      ) ?? [];
    return [...primaryItems, ...fallbackItems].slice(0, 12);
  }, [primaryQuery.data, fallbackQuery.data, currentProductId]);

  const scrollByStep = (direction: "prev" | "next") => {
    const el = trackRef.current;
    if (!el) return;
    const step = 280;
    const maxScroll = el.scrollWidth - el.clientWidth;

    if (direction === "next") {
      if (el.scrollLeft >= maxScroll - 8) {
        el.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        el.scrollBy({ left: step, behavior: "smooth" });
      }
    } else if (el.scrollLeft <= 8) {
      el.scrollTo({ left: maxScroll, behavior: "smooth" });
    } else {
      el.scrollBy({ left: -step, behavior: "smooth" });
    }
  };

  useEffect(() => {
    if (isPaused || items.length <= 1) return;
    const timer = window.setInterval(() => {
      scrollByStep("next");
    }, 3500);
    return () => window.clearInterval(timer);
  }, [isPaused, items.length]);

  const isLoading = primaryQuery.isLoading && fallbackQuery.isLoading;

  if (!isLoading && items.length === 0) return null;

  return (
    <section
      className="border-t border-gray-200/80 pt-10 dark:border-gray-800"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
    >
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
            {t({ name: "Recommended For You", arName: "مقترحة لك" })}
          </span>
          <h2 className="mt-1 text-2xl font-extrabold text-gray-900 dark:text-white">
            {t({ name: "Products You May Like", arName: "منتجات قد تعجبك" })}
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => scrollByStep("prev")}
            aria-label={t({ name: "Previous products", arName: "المنتجات السابقة" })}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-700 shadow-xs transition-colors hover:border-blue-500 hover:text-blue-600 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-200 dark:hover:border-blue-500"
          >
            <ChevronLeft className="h-4 w-4 rtl:rotate-180" />
          </button>
          <button
            type="button"
            onClick={() => scrollByStep("next")}
            aria-label={t({ name: "Next products", arName: "المنتجات التالية" })}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-700 shadow-xs transition-colors hover:border-blue-500 hover:text-blue-600 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-200 dark:hover:border-blue-500"
          >
            <ChevronRight className="h-4 w-4 rtl:rotate-180" />
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex gap-4 overflow-hidden">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-72 w-60 shrink-0 animate-pulse rounded-2xl bg-gray-200/70 dark:bg-gray-800/60"
            />
          ))}
        </div>
      ) : (
        <div
          ref={trackRef}
          className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {items.map((item) => (
            <div key={item.id} className="w-60 shrink-0 snap-start sm:w-64">
              <ProductCard product={item} />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
