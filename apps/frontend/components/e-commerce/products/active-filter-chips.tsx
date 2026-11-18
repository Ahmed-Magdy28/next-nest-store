"use client";

import { X } from "lucide-react";

import { useCategoriesTree } from "../../../hooks/use-categories";
import { useLocalized } from "../../../i18n/use-localized";

interface ActiveFilterChipsProps {
  search: string;
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  isAvailable?: boolean;
  onDiscount?: boolean;
  isNew?: boolean;
  hideDiscountFilter?: boolean;
  hideNewArrivalsFilter?: boolean;
  onRemove: (key: string) => void;
  onResetAll: () => void;
}

/**
 * Displays removable pills for every active catalog filter above the product grid.
 */
export function ActiveFilterChips({
  search,
  categoryId,
  minPrice,
  maxPrice,
  isAvailable,
  onDiscount,
  isNew,
  hideDiscountFilter,
  hideNewArrivalsFilter,
  onRemove,
  onResetAll,
}: ActiveFilterChipsProps) {
  const { t } = useLocalized();
  const { data: tree } = useCategoriesTree();

  const matchedCategory = (() => {
    if (!categoryId || !tree) return undefined;
    for (const cat of tree) {
      if (cat.id === categoryId) return cat;
      const child = cat.children.find((c) => c.id === categoryId);
      if (child) return child;
    }
    return undefined;
  })();
  const categoryName = matchedCategory ? t(matchedCategory) : undefined;

  const chips: { key: string; label: string }[] = [];
  if (search) chips.push({ key: "search", label: `"${search}"` });
  if (categoryName) chips.push({ key: "categoryId", label: categoryName });
  if (minPrice !== undefined || maxPrice !== undefined) {
    const priceLabel =
      minPrice !== undefined && maxPrice !== undefined
        ? `$${minPrice} – $${maxPrice}`
        : minPrice !== undefined
          ? `${t({ name: "From", arName: "من" })} $${minPrice}`
          : `${t({ name: "Up to", arName: "حتى" })} $${maxPrice}`;
    chips.push({ key: "price", label: priceLabel });
  }
  if (isAvailable) {
    chips.push({
      key: "isAvailable",
      label: t({ name: "In Stock", arName: "متوفر" }),
    });
  }
  if (!hideDiscountFilter && onDiscount) {
    chips.push({
      key: "onDiscount",
      label: t({ name: "On Sale", arName: "عروض" }),
    });
  }
  if (!hideNewArrivalsFilter && isNew) {
    chips.push({
      key: "isNew",
      label: t({ name: "New Arrivals", arName: "وصل حديثاً" }),
    });
  }

  if (chips.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      {chips.map((chip) => (
        <button
          key={chip.key}
          type="button"
          onClick={() => onRemove(chip.key)}
          className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50/80 px-3 py-1 text-xs font-semibold text-blue-700 transition-colors hover:bg-blue-100 dark:border-blue-900 dark:bg-blue-950/60 dark:text-blue-300"
        >
          <span>{chip.label}</span>
          <X className="h-3 w-3" />
        </button>
      ))}
      {chips.length > 1 && (
        <button
          type="button"
          onClick={onResetAll}
          className="text-xs font-semibold text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white"
        >
          {t({ name: "Clear all", arName: "مسح الكل" })}
        </button>
      )}
    </div>
  );
}
