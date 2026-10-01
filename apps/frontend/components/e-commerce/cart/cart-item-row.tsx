"use client";

import Image from "next/image";
import { Link } from "../../../i18n/routing";
import { Trash2, Plus, Minus } from "lucide-react";
import type { CartItemDto } from "@repo/shared/dtos/e-commerce";
import { useLocalized } from "../../../i18n/use-localized";

interface CartItemRowProps {
  item: CartItemDto;
  onUpdateQuantity: (quantity: number) => void;
  onRemove: () => void;
}

export function CartItemRow({
  item,
  onUpdateQuantity,
  onRemove,
}: CartItemRowProps) {
  const { t } = useLocalized();

  return (
    <div className="flex gap-3 sm:gap-4 rounded-2xl border border-gray-200 bg-white p-3 sm:p-4 dark:border-gray-800 dark:bg-gray-900">
      <div className="relative h-16 w-16 sm:h-20 sm:w-20 shrink-0 overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800">
        <Image
          src={item.product.mainImage}
          alt={t(item.product)}
          fill
          sizes="(max-width: 640px) 64px, 80px"
          className="object-cover"
        />
      </div>

      <div className="flex flex-1 flex-col min-w-0">
        <Link
          href={`/products/${item.product.slug}`}
          className="font-medium text-xs sm:text-base text-gray-900 hover:underline dark:text-white line-clamp-2"
        >
          {t(item.product)}
        </Link>
        {item.variant && (
          <p className="text-xs text-gray-500">{t(item.variant)}</p>
        )}
        <p className="mt-1 text-sm font-semibold text-gray-900 dark:text-white">
          ${item.currentPrice.toFixed(2)}
        </p>
      </div>

      <div className="flex flex-col items-end justify-between">
        <button
          onClick={onRemove}
          className="text-gray-400 hover:text-rose-500 cursor-pointer"
          aria-label="Remove item"
        >
          <Trash2 className="h-4 w-4" />
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onUpdateQuantity(item.quantity - 1)}
            disabled={item.quantity <= 1}
            className="rounded-md border border-gray-200 p-1 hover:bg-gray-50 disabled:opacity-40 dark:border-gray-700 dark:hover:bg-gray-800 cursor-pointer disabled:cursor-not-allowed"
          >
            <Minus className="h-3 w-3" />
          </button>
          <span className="w-8 text-center text-sm font-semibold">
            {item.quantity}
          </span>
          <button
            onClick={() => onUpdateQuantity(item.quantity + 1)}
            disabled={item.quantity >= item.currentStock}
            className="rounded-md border border-gray-200 p-1 hover:bg-gray-50 disabled:opacity-40 dark:border-gray-700 dark:hover:bg-gray-800 cursor-pointer disabled:cursor-not-allowed"
          >
            <Plus className="h-3 w-3" />
          </button>
        </div>
      </div>
    </div>
  );
}
