"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";

import type { ProductListItemDto } from "@repo/shared/dtos/e-commerce";

import { AddToCartButton } from "./add-to-cart-button";
import { useLocalized } from "../../../i18n/use-localized";

interface ProductCardProps {
  product: ProductListItemDto;
  href?: string;
  onAddToCart?: (product: ProductListItemDto) => void;
  onToggleWishlist?: (product: ProductListItemDto) => void;
}

export function ProductCard({
  product,
  href,
  onAddToCart,
  onToggleWishlist,
}: ProductCardProps) {
  const productHref = href ?? `/products/${product.slug}`;
  const { t } = useLocalized();

  const hasDiscount =
    product.onDiscount && product.discountPrice < product.regularPrice;

  const displayPrice = hasDiscount
    ? product.discountPrice
    : product.regularPrice;

  const firstCategory = product.categories[0];

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-gray-800 dark:bg-gray-900">
      <Link href={productHref} className="flex flex-1 flex-col">
        {/* Image */}
        <div className="relative aspect-square w-full overflow-hidden bg-gray-100 dark:bg-gray-800">
          <Image
            src={product.mainImage}
            alt={t(product)}
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
            {hasDiscount && (
              <span className="rounded-md bg-rose-500 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                Sale
              </span>
            )}
            {!product.isAvailable && (
              <span className="rounded-md bg-gray-700 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                Out of Stock
              </span>
            )}
          </div>
        </div>

        {/* Body */}
        <div className="flex flex-1 flex-col p-5">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="uppercase tracking-wider text-blue-600 dark:text-blue-400">
              {firstCategory ? t(firstCategory) : "Uncategorized"}
            </span>
          </div>

          <h3 className="mt-1 line-clamp-1 font-semibold text-gray-900 group-hover:underline dark:text-white">
            {t(product)}
          </h3>

          {/* Price */}
          <div className="mt-auto flex items-baseline gap-2 pt-4">
            <span className="text-lg font-bold text-gray-900 dark:text-white">
              ${displayPrice.toFixed(2)}
            </span>
            {hasDiscount && (
              <span className="text-xs text-gray-400 line-through">
                ${product.regularPrice.toFixed(2)}
              </span>
            )}
          </div>
        </div>
      </Link>

      {/* Wishlist Button */}
      <button
        type="button"
        onClick={() => onToggleWishlist?.(product)}
        aria-label="Toggle wishlist"
        className={`absolute right-3 top-3 rounded-full p-2 backdrop-blur-md transition ${
          product.isInWishlist
            ? "bg-rose-500/90 text-white hover:bg-rose-600"
            : "bg-white/80 text-gray-700 hover:bg-white hover:text-rose-500 dark:bg-gray-900/80 dark:text-gray-200"
        }`}
      >
        <Heart
          className={`h-4 w-4 ${product.isInWishlist ? "fill-current" : ""}`}
        />
      </button>

      {/* Add to Cart Button */}
      <div className="px-5 pb-5">
        <AddToCartButton
          isAvailable={product.isAvailable}
          onAdd={() => onAddToCart?.(product)}
        />
      </div>
    </div>
  );
}
