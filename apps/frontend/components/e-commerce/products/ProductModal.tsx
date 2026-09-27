"use client";

import Image from "next/image";
import { Product } from "@repo/shared/interfaces/shop";
import { X, Star, ShoppingBag, Heart, ShieldCheck, Truck } from "lucide-react";

interface ProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart?: (product: Product) => void;
}

export function ProductModal({
  product,
  isOpen,
  onClose,
  onAddToCart,
}: ProductModalProps) {
  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="relative z-10 w-full max-w-3xl overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-gray-900 border border-gray-100 dark:border-gray-800">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-20 rounded-full bg-gray-100 p-2 text-gray-500 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Image */}
          <div className="relative aspect-square w-full bg-gray-100 dark:bg-gray-800">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover object-center"
            />
          </div>

          {/* Info */}
          <div className="flex flex-col p-6 sm:p-8">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="uppercase tracking-wider text-blue-600 dark:text-blue-400">
                {product.category.name}
              </span>
              <span className="text-gray-400 font-mono">
                SKU: {product.SKU}
              </span>
            </div>

            <h2 className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
              {product.name}
            </h2>

            {/* Rating */}
            <div className="mt-3 flex items-center gap-2">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                <span className="text-sm font-bold text-gray-900 dark:text-white">
                  {product.rating}
                </span>
              </div>
              <span className="text-xs text-gray-400">•</span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {product.reviewsCount} reviews
              </span>
            </div>

            {/* Price */}
            <div className="mt-4 flex items-baseline gap-3">
              <span className="text-3xl font-bold text-gray-900 dark:text-white">
                ${product.price.toFixed(2)}
              </span>
              {product.originalPrice && (
                <span className="text-sm text-gray-400 line-through">
                  ${product.originalPrice.toFixed(2)}
                </span>
              )}
            </div>

            <p className="mt-4 text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
              {product.description ||
                "High-quality product engineered for reliability and long-lasting performance."}
            </p>

            {/* Actions */}
            <div className="mt-auto pt-6 flex items-center gap-3">
              <button
                disabled={!product.inStock}
                onClick={() => {
                  onAddToCart?.(product);
                  onClose();
                }}
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-blue-700 active:scale-95 disabled:bg-gray-300"
              >
                <ShoppingBag className="h-4 w-4" />
                <span>{product.inStock ? "Add to Cart" : "Out of Stock"}</span>
              </button>

              <button className="rounded-xl border border-gray-200 p-3 text-gray-600 transition hover:bg-gray-50 dark:border-gray-800 dark:text-gray-300 dark:hover:bg-gray-800">
                <Heart className="h-5 w-5" />
              </button>
            </div>

            {/* Badges */}
            <div className="mt-6 border-t border-gray-100 pt-4 dark:border-gray-800 grid grid-cols-2 gap-3 text-xs text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <Truck className="h-4 w-4 text-blue-500" />
                <span>Fast Delivery</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-blue-500" />
                <span>2 Year Warranty</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
