"use client";

import { ProductCard } from "./ProductCard";
import { Product } from "@repo/shared/interfaces/shop";

interface ProductGridProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onAddToCart?: (product: Product) => void;
}

export function ProductGrid({
  products,
  onSelectProduct,
  onAddToCart,
}: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-white p-12 text-center dark:border-gray-800 dark:bg-gray-900">
        <p className="text-lg font-semibold text-gray-900 dark:text-white">
          No products found
        </p>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Try adjusting your search query or filters.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onCardClick={onSelectProduct}
          onAddToCart={onAddToCart}
        />
      ))}
    </div>
  );
}
