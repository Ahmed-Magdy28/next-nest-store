"use client";

import { X } from "lucide-react";
import { useTranslations } from "next-intl";

import { useCategoriesTree } from "../../../hooks/use-categories";
import { useLocalized } from "../../../i18n/use-localized";
import { PriceFilterSection } from "./price-filter-section";

interface ProductFiltersProps {
  categoryId?: string;
  onCategoryChange: (value: string | undefined) => void;
  minPrice?: number;
  maxPrice?: number;
  onPriceChange: (min?: number, max?: number) => void;
  isAvailable?: boolean;
  onIsAvailableChange: (value: boolean | undefined) => void;
  onDiscount?: boolean;
  onOnDiscountChange?: (value: boolean | undefined) => void;
  isNew?: boolean;
  onIsNewChange?: (value: boolean | undefined) => void;
  hideDiscountFilter?: boolean;
  hideNewArrivalsFilter?: boolean;
  onReset: () => void;
}

/**
 * Sidebar filter panel supporting category selection, price range presets/inputs,
 * stock availability, and promotional flags.
 */
export function ProductFilters({
  categoryId,
  onCategoryChange,
  minPrice,
  maxPrice,
  onPriceChange,
  isAvailable,
  onIsAvailableChange,
  onDiscount,
  onOnDiscountChange,
  isNew,
  onIsNewChange,
  hideDiscountFilter,
  hideNewArrivalsFilter,
  onReset,
}: ProductFiltersProps) {
  const t = useTranslations("ProductFilters");
  const { data: categories, isLoading } = useCategoriesTree();
  const { t: tLocalized } = useLocalized();

  const hasFilters =
    !!categoryId ||
    minPrice !== undefined ||
    maxPrice !== undefined ||
    isAvailable === true ||
    (!hideDiscountFilter && onDiscount !== undefined) ||
    (!hideNewArrivalsFilter && isNew !== undefined);

  return (
    <aside className="space-y-5 rounded-2xl border border-gray-200/80 bg-white p-5 shadow-xs dark:border-gray-800 dark:bg-gray-900">
      <div>
        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300">
          {t("category")}
        </label>
        <select
          value={categoryId ?? ""}
          onChange={(e) => onCategoryChange(e.target.value || undefined)}
          disabled={isLoading}
          className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:bg-white dark:border-gray-800 dark:bg-gray-950 dark:text-white dark:focus:bg-gray-900"
        >
          <option value="">{t("allCategories")}</option>
          {categories?.map((cat) => (
            <optgroup key={cat.id} label={tLocalized(cat)}>
              <option value={cat.id}>{tLocalized(cat)}</option>
              {cat.children.map((child) => (
                <option key={child.id} value={child.id}>
                  — {tLocalized(child)}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
      </div>

      <PriceFilterSection
        key={`${minPrice ?? ""}-${maxPrice ?? ""}`}
        minPrice={minPrice}
        maxPrice={maxPrice}
        onPriceChange={onPriceChange}
      />

      <div className="space-y-2.5 border-t border-gray-100 pt-4 dark:border-gray-800">
        <span className="block text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300">
          {t("filters")}
        </span>

        <label className="flex cursor-pointer items-center gap-2.5 text-sm text-gray-700 dark:text-gray-200">
          <input
            type="checkbox"
            checked={isAvailable === true}
            onChange={(e) =>
              onIsAvailableChange(e.target.checked ? true : undefined)
            }
            className="h-4 w-4 rounded border-gray-300 text-blue-600"
          />
          {tLocalized({ name: "In Stock Only", arName: "المتوفر فقط" })}
        </label>

        {!hideDiscountFilter && onOnDiscountChange && (
          <label className="flex cursor-pointer items-center gap-2.5 text-sm text-gray-700 dark:text-gray-200">
            <input
              type="checkbox"
              checked={onDiscount === true}
              onChange={(e) =>
                onOnDiscountChange(e.target.checked ? true : undefined)
              }
              className="h-4 w-4 rounded border-gray-300 text-blue-600"
            />
            {t("onDiscount")}
          </label>
        )}

        {!hideNewArrivalsFilter && onIsNewChange && (
          <label className="flex cursor-pointer items-center gap-2.5 text-sm text-gray-700 dark:text-gray-200">
            <input
              type="checkbox"
              checked={isNew === true}
              onChange={(e) =>
                onIsNewChange(e.target.checked ? true : undefined)
              }
              className="h-4 w-4 rounded border-gray-300 text-blue-600"
            />
            {t("newArrivals")}
          </label>
        )}
      </div>

      {hasFilters && (
        <button
          type="button"
          onClick={onReset}
          className="inline-flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-xl border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-800 dark:text-gray-200 dark:hover:bg-gray-800"
        >
          <X className="h-3.5 w-3.5" />
          {t("reset")}
        </button>
      )}
    </aside>
  );
}
