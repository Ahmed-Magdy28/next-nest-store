"use client";

import type {
  ProductDto,
  ProductListItemDto,
} from "@repo/shared/dtos/e-commerce";

import { ProductCard } from "./ProductCard";
import { useAddToCart } from "../../../hooks/use-cart";

type ProductLike = ProductListItemDto | ProductDto;

interface ProductGridProps {
  products: ProductLike[];
  onAddToCart?: (product: ProductLike) => void | Promise<unknown>;
  onToggleWishlist?: (product: ProductLike) => void;
  emptyMessage?: string;
}

export function ProductGrid({
  products,
  onAddToCart,
  onToggleWishlist,
  emptyMessage = "No products found. Try adjusting your filters.",
}: ProductGridProps) {
  const addToCart = useAddToCart();

  const handleAdd =
    onAddToCart ??
    ((product: ProductLike) =>
      addToCart.mutateAsync({
        productId: product.id,
        quantity: 1,
      }));

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-white p-12 text-center dark:border-gray-800 dark:bg-gray-900">
        <p className="text-lg font-semibold text-gray-900 dark:text-white">
          No products
        </p>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {emptyMessage}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product as ProductListItemDto}
          onAddToCart={handleAdd}
          onToggleWishlist={onToggleWishlist}
        />
      ))}
    </div>
  );
}
