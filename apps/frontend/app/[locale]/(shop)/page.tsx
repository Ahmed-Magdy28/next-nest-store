"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Product } from "@repo/shared/interfaces/shop";
import { ProductGrid } from "../../../components/products/product-grid";
import { MOCK_PRODUCTS } from "../../../data/mockProducts";
import { ProductModal } from "../../../components/products/ProductModal";

export default function ShopPage() {
  const t = useTranslations("Shop");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Shop Products
            {t("title")}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Browse our catalog of items.
            {t("description")}
          </p>
        </div>

        <ProductGrid
          products={MOCK_PRODUCTS}
          onSelectProduct={(product) => setSelectedProduct(product)}
          onAddToCart={(product) => console.log("Added to cart:", product)}
        />

        <ProductModal
          product={selectedProduct}
          isOpen={!!selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={(product) => console.log("Added from modal:", product)}
        />
      </div>
    </div>
  );
}
