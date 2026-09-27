"use client";

import Image from "next/image";
import type { ProductVariantDto } from "@repo/shared/dtos/e-commerce";
import { useLocalized } from "../../../i18n/use-localized";

interface VariantSelectorProps {
  variants: ProductVariantDto[];
  selectedVariantId: string | null;
  onSelect: (variant: ProductVariantDto) => void;
}

export function VariantSelector({
  variants,
  selectedVariantId,
  onSelect,
}: VariantSelectorProps) {
  const { t } = useLocalized();

  if (variants.length === 0) return null;

  const selected = variants.find((v) => v.id === selectedVariantId);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300">
          {t({ name: "Choose variant", arName: "اختر النوع" })}
        </label>
        {selected && (
          <span className="text-xs text-gray-500">{t(selected)}</span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {variants.map((variant) => {
          const isSelected = variant.id === selectedVariantId;
          const isDisabled = !variant.isAvailable || variant.stockQuantity <= 0;

          const price = variant.discountPrice ?? variant.regularPrice;
          const hasPrice = price !== null;

          return (
            <button
              key={variant.id}
              type="button"
              disabled={isDisabled}
              onClick={() => onSelect(variant)}
              className={`relative rounded-lg border p-3 text-left text-sm transition ${
                isSelected
                  ? "border-blue-600 bg-blue-50 ring-2 ring-blue-500/30 dark:bg-blue-950/40"
                  : "border-gray-200 hover:border-gray-300 dark:border-gray-800 dark:hover:border-gray-700"
              } ${isDisabled ? "cursor-not-allowed opacity-50" : ""}`}
            >
              {variant.mainImage && (
                <div className="relative mb-2 aspect-square w-full overflow-hidden rounded-md bg-gray-100 dark:bg-gray-800">
                  <Image
                    src={variant.mainImage}
                    alt={t(variant)}
                    fill
                    sizes="120px"
                    className="object-cover"
                  />
                </div>
              )}

              <div className="space-y-1">
                <p className="line-clamp-2 font-medium text-gray-900 dark:text-white">
                  {t(variant)}
                </p>

                {Object.keys(variant.attributes).length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {Object.entries(variant.attributes).map(([key, value]) => (
                      <span
                        key={key}
                        className="rounded bg-gray-100 px-1.5 py-0.5 text-[10px] font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-300"
                      >
                        {String(value)}
                      </span>
                    ))}
                  </div>
                )}

                {hasPrice && (
                  <p className="text-xs font-semibold text-gray-700 dark:text-gray-200">
                    ${Number(price).toFixed(2)}
                  </p>
                )}

                {isDisabled && (
                  <p className="text-[10px] font-medium text-rose-600">
                    {t({ name: "Out of stock", arName: "نفدت الكمية" })}
                  </p>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
