"use client";

import Image from "next/image";
import { Link } from "../../../i18n/routing";
import { Loader2, ShoppingCart, Trash2 } from "lucide-react";
import type { WishlistItemDto } from "@repo/shared/dtos/e-commerce";
import { useLocalized } from "../../../i18n/use-localized";

interface WishlistItemCardProps {
  item: WishlistItemDto;
  onRemove: () => void;
  onMoveToCart: () => void;
  isRemoving?: boolean;
  isMoving?: boolean;
}

export function WishlistItemCard({
  item,
  onRemove,
  onMoveToCart,
  isRemoving = false,
  isMoving = false,
}: WishlistItemCardProps) {
  const { t } = useLocalized();

  return (
    <div className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-gray-200 bg-white p-3 sm:p-4 shadow-xs transition hover:shadow-md dark:border-gray-800 dark:bg-gray-900">
      {/* Product Image */}
      <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-800">
        <Image
          src={item.product.mainImage}
          alt={t(item.product)}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />

        {/* Remove from wishlist button */}
        <button
          type="button"
          onClick={onRemove}
          disabled={isRemoving}
          className="absolute top-2.5 end-2.5 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-rose-500 shadow-sm backdrop-blur-xs hover:bg-rose-50 transition dark:bg-gray-900/90 dark:hover:bg-rose-950/40 cursor-pointer disabled:opacity-50"
          aria-label={t({ name: "Remove from wishlist", arName: "إزالة من المفضلة" })}
        >
          <Trash2 className="h-4 w-4" />
        </button>

        {item.product.onDiscount && (
          <span className="absolute top-2.5 start-2.5 rounded-md bg-rose-600 px-2 py-0.5 text-[10px] font-bold text-white shadow-xs">
            {t({ name: "Sale", arName: "تخفيض" })}
          </span>
        )}
      </div>

      {/* Product Info */}
      <div className="mt-3 flex-1 flex flex-col justify-between">
        <div>
          <Link
            href={`/products/${item.product.slug}`}
            className="line-clamp-2 text-sm font-semibold text-gray-900 hover:text-blue-600 dark:text-white dark:hover:text-blue-400"
          >
            {t(item.product)}
          </Link>
          <p className="mt-1 text-xs text-gray-400">{item.product.sku}</p>
        </div>

        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-base font-bold text-gray-900 dark:text-white">
            ${item.product.discountPrice.toFixed(2)}
          </span>
          {item.product.onDiscount && (
            <span className="text-xs text-gray-400 line-through">
              ${item.product.regularPrice.toFixed(2)}
            </span>
          )}
        </div>
      </div>

      {/* Action: Move to Cart */}
      <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-800">
        <button
          type="button"
          onClick={onMoveToCart}
          disabled={isMoving || !item.product.isAvailable}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-blue-700 disabled:opacity-50 transition cursor-pointer"
        >
          {isMoving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              <ShoppingCart className="h-3.5 w-3.5" />
              <span>
                {item.product.isAvailable
                  ? t({ name: "Move to Cart", arName: "نقل إلى السلة" })
                  : t({ name: "Out of Stock", arName: "نفد من المخزون" })}
              </span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
