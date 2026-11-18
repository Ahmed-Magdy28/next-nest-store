"use client";

import { useMemo, useState } from "react";
import { useCategoriesTree } from "../../../hooks/use-categories";
import { CategoryCard } from "../../../components/e-commerce/categories/category-card";
import { CategoriesHeader } from "../../../components/e-commerce/categories/categories-header";
import {
  CategoriesEmptyState,
  CategoriesLoadingGrid,
} from "../../../components/e-commerce/categories/categories-grid-states";

/**
 * Storefront categories directory page with search filtering across
 * both main categories and subcategories in English and Arabic.
 */
export default function CategoriesPage() {
  const { data: categories, isLoading } = useCategoriesTree();
  const [search, setSearch] = useState("");

  const totalCategories = categories?.length ?? 0;
  const totalSubcategories = useMemo(
    () =>
      categories?.reduce((sum, cat) => sum + (cat.children?.length ?? 0), 0) ??
      0,
    [categories],
  );

  const filteredCategories = useMemo(() => {
    if (!categories) return [];
    const q = search.trim().toLowerCase();
    if (!q) return categories;

    return categories
      .map((cat) => {
        const parentMatches =
          cat.name.toLowerCase().includes(q) ||
          cat.arName.toLowerCase().includes(q);
        const matchingChildren = cat.children.filter(
          (child) =>
            child.name.toLowerCase().includes(q) ||
            child.arName.toLowerCase().includes(q),
        );

        if (parentMatches) return cat;
        if (matchingChildren.length > 0) {
          return { ...cat, children: matchingChildren };
        }
        return null;
      })
      .filter((cat): cat is NonNullable<typeof cat> => cat !== null);
  }, [categories, search]);

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-8 dark:bg-gray-950">
      <div className="mx-auto max-w-7xl space-y-8">
        <CategoriesHeader
          isLoading={isLoading}
          totalCategories={totalCategories}
          totalSubcategories={totalSubcategories}
          search={search}
          onSearchChange={setSearch}
        />

        {isLoading ? (
          <CategoriesLoadingGrid />
        ) : filteredCategories.length === 0 ? (
          <CategoriesEmptyState
            hasSearch={Boolean(search)}
            onClearSearch={() => setSearch("")}
          />
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredCategories.map((cat) => (
              <CategoryCard key={cat.id} category={cat} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
