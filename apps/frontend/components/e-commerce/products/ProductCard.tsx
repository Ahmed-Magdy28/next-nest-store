"use client";

import Image from "next/image";
import { Link } from "../../../i18n/routing";
import { Heart } from "lucide-react";

import type { ProductListItemDto } from "@repo/shared/dtos/e-commerce";

import { AddToCartButton } from "./add-to-cart-button";
import { useLocalized } from "../../../i18n/use-localized";
import {
  useAddToWishlist,
  useRemoveFromWishlist,
  useIsInWishlist,
} from "../../../hooks/use-wishlist";

interface ProductCardProps {
  product: ProductListItemDto;
  href?: string;
  onAddToCart?: (product: ProductListItemDto) => void;
  onToggleWishlist?: (product: ProductListItemDto) => void;
  priority?: boolean;
}

export function ProductCard({
  product,
  href,
  onAddToCart,
  onToggleWishlist,
  priority = false,
}: ProductCardProps) {
  const productHref = href ?? `/products/${product.slug}`;
  const { t } = useLocalized();

  const addToWishlist = useAddToWishlist();
  const removeFromWishlist = useRemoveFromWishlist();
  const isWishlistedHook = useIsInWishlist(product.id);
  const isInWishlist = product.isInWishlist ?? isWishlistedHook;

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onToggleWishlist) {
      onToggleWishlist(product);
      return;
    }
    if (isInWishlist) {
      removeFromWishlist.mutate(product.id);
    } else {
      addToWishlist.mutate(product.id);
    }
  };

  const hasDiscount =
    product.onDiscount && product.discountPrice < product.regularPrice;

  const displayPrice = hasDiscount
    ? product.discountPrice
    : product.regularPrice;

  const firstCategory = product.categories[0];

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-gray-200/80 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-gray-300 hover:shadow-xl dark:border-gray-800/80 dark:bg-gray-900/90 dark:hover:border-gray-700">
      <Link href={productHref} className="flex flex-1 flex-col">
        {/* Image */}
        <div className="relative aspect-square w-full overflow-hidden bg-gray-50 dark:bg-gray-800/50">
          <Image
            src={product.mainImage}
            alt={t(product)}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority={priority}
            loading={priority ? "eager" : "lazy"}
            className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
          />

          {/* Badges */}
          <div className="absolute start-2.5 sm:start-3 top-2.5 sm:top-3 flex flex-col gap-1 sm:gap-1.5 z-10">
            {product.isNew && (
              <span className="rounded-md bg-blue-600/95 px-2 py-0.5 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-white shadow-xs backdrop-blur-xs">
                New
              </span>
            )}
            {hasDiscount && (
              <span className="rounded-md bg-rose-500/95 px-2 py-0.5 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-white shadow-xs backdrop-blur-xs">
                Sale
              </span>
            )}
            {!product.isAvailable && (
              <span className="rounded-md bg-gray-800/90 px-2 py-0.5 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-white shadow-xs backdrop-blur-xs">
                Out of Stock
              </span>
            )}
          </div>
        </div>

        {/* Body */}
        <div className="flex flex-1 flex-col p-3.5 sm:p-5">
          <div className="flex items-center justify-between text-[10px] sm:text-xs font-semibold">
            <span className="truncate uppercase tracking-wider text-blue-600 dark:text-blue-400 font-bold">
              {firstCategory ? t(firstCategory) : "Store Item"}
            </span>
          </div>

          <h3 className="mt-1.5 line-clamp-2 text-xs sm:text-sm font-semibold text-gray-900 group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400 transition-colors leading-snug">
            {t(product)}
          </h3>

          {/* Price */}
          <div className="mt-auto flex items-baseline gap-2 pt-3 sm:pt-4">
            <span className="text-sm sm:text-lg font-black text-gray-900 dark:text-white">
              ${displayPrice.toFixed(2)}
            </span>
            {hasDiscount && (
              <span className="text-[11px] sm:text-xs text-gray-400 line-through">
                ${product.regularPrice.toFixed(2)}
              </span>
            )}
          </div>
        </div>
      </Link>

      {/* Wishlist Button */}
      <button
        type="button"
        onClick={handleWishlistToggle}
        aria-label="Toggle wishlist"
        className={`absolute end-2.5 sm:end-3 top-2.5 sm:top-3 z-10 rounded-full p-2 backdrop-blur-md shadow-xs transition-all hover:scale-110 cursor-pointer ${
          isInWishlist
            ? "bg-rose-500 text-white shadow-rose-500/25"
            : "bg-white/85 text-gray-600 hover:bg-white hover:text-rose-500 dark:bg-gray-900/85 dark:text-gray-300 dark:hover:bg-gray-800"
        }`}
      >
        <Heart
          className={`h-4 w-4 ${isInWishlist ? "fill-current" : ""}`}
        />
      </button>

      {/* Add to Cart Button */}
      <div className="px-3.5 pb-3.5 sm:px-5 sm:pb-5">
        <AddToCartButton
          isAvailable={product.isAvailable}
          onAdd={() => onAddToCart?.(product)}
        />
      </div>
    </div>
  );
}
