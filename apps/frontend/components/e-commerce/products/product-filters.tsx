"use client";

import { Search, X } from "lucide-react";
import { useCategoriesTree } from "../../../hooks/use-categories";
import { useLocalized } from "../../../i18n/use-localized";

interface ProductFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;

  categoryId?: string;
  onCategoryChange: (value: string | undefined) => void;

  onDiscount?: boolean;
  onOnDiscountChange: (value: boolean | undefined) => void;

  isNew?: boolean;
  onIsNewChange: (value: boolean | undefined) => void;

  sortBy: "createdAt" | "updatedAt" | "price" | "name";
  onSortByChange: (value: "createdAt" | "updatedAt" | "price" | "name") => void;

  sortOrder: "asc" | "desc";
  onSortOrderChange: (value: "asc" | "desc") => void;

  onReset: () => void;
}

export function ProductFilters({
  search,
  onSearchChange,
  categoryId,
  onCategoryChange,
  onDiscount,
  onOnDiscountChange,
  isNew,
  onIsNewChange,
  sortBy,
  onSortByChange,
  sortOrder,
  onSortOrderChange,
  onReset,
}: ProductFiltersProps) {
  const { data: categories, isLoading } = useCategoriesTree();
  const { t } = useLocalized();

  const hasFilters =
    !!search || !!categoryId || onDiscount !== undefined || isNew !== undefined;

  return (
    <aside className="space-y-6 rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
      {/* Search */}
      <div>
        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300">
          Search
        </label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search products..."
            className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pl-9 pr-3 text-sm outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20 dark:border-gray-800 dark:bg-gray-950 dark:focus:bg-gray-900"
          />
        </div>
      </div>

      {/* Category */}
      <div>
        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300">
          Category
        </label>
        <select
          value={categoryId ?? ""}
          onChange={(e) => onCategoryChange(e.target.value || undefined)}
          disabled={isLoading}
          className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:bg-white dark:border-gray-800 dark:bg-gray-950 dark:focus:bg-gray-900"
        >
          <option value="">All categories</option>
          {categories?.map((cat) => (
            <optgroup key={cat.id} label={t(cat)}>
              <option value={cat.id}>{t(cat)}</option>
              {cat.children.map((child) => (
                <option key={child.id} value={child.id}>
                  — {t(child)}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
      </div>

      {/* Flags */}
      <div className="space-y-2">
        <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300">
          Filters
        </label>

        <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-200">
          <input
            type="checkbox"
            checked={onDiscount === true}
            onChange={(e) =>
              onOnDiscountChange(e.target.checked ? true : undefined)
            }
            className="h-4 w-4 rounded border-gray-300 text-blue-600"
          />
          On discount
        </label>

        <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-200">
          <input
            type="checkbox"
            checked={isNew === true}
            onChange={(e) => onIsNewChange(e.target.checked ? true : undefined)}
            className="h-4 w-4 rounded border-gray-300 text-blue-600"
          />
          New arrivals
        </label>
      </div>

      {/* Sort */}
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300">
            Sort by
          </label>
          <select
            value={sortBy}
            onChange={(e) => onSortByChange(e.target.value as typeof sortBy)}
            className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm outline-none focus:border-blue-500 dark:border-gray-800 dark:bg-gray-950"
          >
            <option value="createdAt">Newest</option>
            <option value="updatedAt">Recently updated</option>
            <option value="price">Price</option>
            <option value="name">Name</option>
          </select>
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300">
            Order
          </label>
          <select
            value={sortOrder}
            onChange={(e) =>
              onSortOrderChange(e.target.value as typeof sortOrder)
            }
            className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm outline-none focus:border-blue-500 dark:border-gray-800 dark:bg-gray-950"
          >
            <option value="desc">Descending</option>
            <option value="asc">Ascending</option>
          </select>
        </div>
      </div>

      {/* Reset */}
      {hasFilters && (
        <button
          type="button"
          onClick={onReset}
          className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-800 dark:text-gray-200 dark:hover:bg-gray-800"
        >
          <X className="h-3.5 w-3.5" />
          Reset filters
        </button>
      )}
    </aside>
  );
}
