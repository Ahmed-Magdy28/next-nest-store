"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Heart, ShieldCheck, Truck } from "lucide-react";

import type {
  ProductDto,
  ProductVariantDto,
} from "@repo/shared/dtos/e-commerce";
import { VariantSelector } from "./variant-selector";
import { AddToCartButton } from "./add-to-cart-button";
import { useLocalized } from "../../../i18n/use-localized";

interface ProductInfoProps {
  product: ProductDto;
  onAddToCart: (product: ProductDto, variant: ProductVariantDto | null) => void;
  onToggleWishlist: (product: ProductDto) => void;
}

export function ProductInfo({
  product,
  onAddToCart,
  onToggleWishlist,
}: ProductInfoProps) {
  const hasVariants = product.variants.length > 0;
  const { t } = useLocalized();

  const defaultVariant = useMemo(
    () =>
      product.variants.find((v) => v.isAvailable && v.stockQuantity > 0) ??
      product.variants[0] ??
      null,
    [product.variants],
  );

  const [userSelectedVariant, setUserSelectedVariant] =
    useState<ProductVariantDto | null>(null);
  const [prevProductId, setPrevProductId] = useState(product.id);

  if (prevProductId !== product.id) {
    setPrevProductId(product.id);
    setUserSelectedVariant(null);
  }

  const selectedVariant = userSelectedVariant ?? defaultVariant;

  const displayPrice = useMemo(() => {
    if (selectedVariant) {
      const vPrice =
        selectedVariant.discountPrice ?? selectedVariant.regularPrice;
      if (vPrice !== null) return Number(vPrice);
    }
    return product.onDiscount && product.discountPrice < product.regularPrice
      ? product.discountPrice
      : product.regularPrice;
  }, [selectedVariant, product]);

  const regularPriceForDisplay = useMemo(() => {
    if (
      selectedVariant?.regularPrice !== null &&
      selectedVariant?.regularPrice !== undefined
    ) {
      return Number(selectedVariant.regularPrice);
    }
    return product.regularPrice;
  }, [selectedVariant, product]);

  const hasDiscount = displayPrice < regularPriceForDisplay;

  const isAvailable = selectedVariant
    ? selectedVariant.isAvailable && selectedVariant.stockQuantity > 0
    : product.isAvailable;

  const canAddToCart =
    isAvailable && (!hasVariants || selectedVariant !== null);

  return (
    <div className="flex flex-col space-y-6">
      {/* Categories */}
      {product.categories.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-wider">
          {product.categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/categories/${cat.id}`}
              className="rounded-md bg-blue-50 px-2 py-1 text-blue-700 hover:bg-blue-100 dark:bg-blue-950/50 dark:text-blue-400"
            >
              {t(cat)}
            </Link>
          ))}
        </div>
      )}

      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
          {t(product)}
        </h1>
        <p className="mt-1 font-mono text-xs text-gray-400">
          SKU: {selectedVariant?.sku ?? product.sku}
        </p>
      </div>

      <div className="flex items-baseline gap-3">
        <span className="text-4xl font-bold text-gray-900 dark:text-white">
          ${displayPrice.toFixed(2)}
        </span>
        {hasDiscount && (
          <span className="text-lg text-gray-400 line-through">
            ${regularPriceForDisplay.toFixed(2)}
          </span>
        )}
        {hasDiscount && (
          <span className="rounded-md bg-rose-100 px-2 py-1 text-xs font-bold text-rose-700 dark:bg-rose-950 dark:text-rose-300">
            Save ${(regularPriceForDisplay - displayPrice).toFixed(2)}
          </span>
        )}
      </div>

      {(product.description || product.arDescription) && (
        <p className="leading-relaxed text-gray-600 dark:text-gray-300">
          {t(product, "description")}
        </p>
      )}

      {hasVariants && (
        <VariantSelector
          variants={product.variants}
          selectedVariantId={selectedVariant?.id ?? null}
          onSelect={setUserSelectedVariant}
        />
      )}

      <div className="flex items-center gap-2 text-sm">
        {isAvailable ? (
          <>
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <span className="font-medium text-emerald-700 dark:text-emerald-400">
              In stock
              {selectedVariant && ` (${selectedVariant.stockQuantity})`}
            </span>
          </>
        ) : (
          <>
            <span className="h-2 w-2 rounded-full bg-rose-500" />
            <span className="font-medium text-rose-700 dark:text-rose-400">
              Out of stock
            </span>
          </>
        )}
      </div>

      <div className="flex items-center gap-3 pt-2">
        <div className="flex-1">
          <AddToCartButton
            isAvailable={canAddToCart}
            onAdd={() => onAddToCart(product, selectedVariant)}
            className="py-3! text-sm! rounded-xl!"
            labelAdding="Shipping..."
            labelAdded="Added to cart!"
          />
        </div>

        <button
          type="button"
          onClick={() => onToggleWishlist(product)}
          aria-label="Toggle wishlist"
          className={`rounded-xl border p-3 transition ${
            product.isInWishlist
              ? "border-rose-500 bg-rose-50 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400"
              : "border-gray-200 text-gray-600 hover:bg-gray-50 dark:border-gray-800 dark:text-gray-300 dark:hover:bg-gray-800"
          }`}
        >
          <Heart
            className={`h-5 w-5 ${product.isInWishlist ? "fill-current" : ""}`}
          />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3 border-t border-gray-100 pt-6 dark:border-gray-800">
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
          <Truck className="h-4 w-4 text-blue-500" />
          Fast Delivery
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
          <ShieldCheck className="h-4 w-4 text-blue-500" />
          Secure Checkout
        </div>
      </div>
    </div>
  );
}
