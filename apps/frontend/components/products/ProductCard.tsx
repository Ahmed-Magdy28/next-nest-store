"use client";

import Image from "next/image";
import { Product } from "@repo/shared/interfaces/shop";
import { Star, ShoppingBag, Heart } from "lucide-react";

interface ProductCardProps {
  product: Product;
  onCardClick: (product: Product) => void;
  onAddToCart?: (product: Product) => void;
}

export function ProductCard({
  product,
  onCardClick,
  onAddToCart,
}: ProductCardProps) {
  return (
    <div
      onClick={() => onCardClick(product)}
      className="group cursor-pointer relative flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-gray-800 dark:bg-gray-900"
    >
      {/* Image Container */}
      <div className="relative aspect-square w-full overflow-hidden bg-gray-100 dark:bg-gray-800">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
        />

        {/* Badges */}
        <div className="absolute left-3 top-3 flex flex-col gap-1.5">
          {product.isNew && (
            <span className="rounded-md bg-blue-600 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
              New
            </span>
          )}
          {product.originalPrice && (
            <span className="rounded-md bg-rose-500 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
              Sale
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
          }}
          className="absolute right-3 top-3 rounded-full bg-white/80 p-2 text-gray-700 backdrop-blur-md hover:bg-white hover:text-rose-500 dark:bg-gray-900/80 dark:text-gray-200"
        >
          <Heart className="h-4 w-4" />
        </button>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center justify-between text-xs font-semibold">
          <span className="uppercase tracking-wider text-blue-600 dark:text-blue-400">
            {product.category.name}
          </span>
          <span className="text-gray-400 font-mono text-[11px]">
            {product.SKU}
          </span>
        </div>

        <h3 className="mt-1 font-semibold text-gray-900 line-clamp-1 dark:text-white group-hover:underline">
          {product.name}
        </h3>

        {/* Rating */}
        <div className="mt-2 flex items-center gap-1.5">
          <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
          <span className="text-xs font-bold text-gray-900 dark:text-white">
            {product.rating}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            ({product.reviewsCount})
          </span>
        </div>

        {/* Price & Add to Cart */}
        <div className="mt-auto pt-4 flex items-center justify-between border-t border-gray-100 dark:border-gray-800/80">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-gray-900 dark:text-white">
              ${product.price.toFixed(2)}
            </span>
            {product.originalPrice && (
              <span className="text-xs text-gray-400 line-through">
                ${product.originalPrice.toFixed(2)}
              </span>
            )}
          </div>

          <button
            disabled={!product.inStock}
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart?.(product);
            }}
            className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3.5 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:bg-gray-300"
          >
            <ShoppingBag className="h-3.5 w-3.5" />
            <span>Add</span>
          </button>
        </div>
      </div>
    </div>
  );
}
