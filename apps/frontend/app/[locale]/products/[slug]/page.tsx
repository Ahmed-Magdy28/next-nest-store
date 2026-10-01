"use client";

import { use } from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

import { useProduct } from "../../../../hooks/use-products";
import { useAddToCart } from "../../../../hooks/use-cart";
import {
  useAddToWishlist,
  useRemoveFromWishlist,
} from "../../../../hooks/use-wishlist";
import { ProductGallery } from "../../../../components/e-commerce/products/product-gallery";
import { ProductInfo } from "../../../../components/e-commerce/products/product-info";
import { ProductReviews } from "../../../../components/e-commerce/reviews/product-reviews";

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export default function ProductDetailsPage({ params }: PageProps) {
  const { slug } = use(params);
  const { data: product, isLoading, isError, error } = useProduct(slug);
  const addToCart = useAddToCart();
  const addToWishlist = useAddToWishlist();
  const removeFromWishlist = useRemoveFromWishlist();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8 dark:bg-gray-950">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
            <div className="aspect-square animate-pulse rounded-2xl bg-gray-200 dark:bg-gray-800" />
            <div className="space-y-4">
              <div className="h-8 w-3/4 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
              <div className="h-12 w-1/3 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
              <div className="h-24 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 p-8 dark:bg-gray-950">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Product not found
          </h1>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            {error instanceof Error
              ? error.message
              : "The product you're looking for doesn't exist."}
          </p>
          <Link
            href="/products"
            className="mt-6 inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8 dark:bg-gray-950">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Breadcrumb */}
        <Link
          href="/products"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to products
        </Link>

        {/* Main */}
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          <ProductGallery
            mainImage={product.mainImage}
            imageGallery={product.imageGallery}
            alt={product.name}
          />

          <ProductInfo
            product={product}
            onAddToCart={async (p, variant) => {
              await addToCart.mutateAsync({
                productId: p.id,
                variantId: variant?.id,
                quantity: 1,
              });
            }}
            onToggleWishlist={(p) => {
              if (p.isInWishlist) {
                removeFromWishlist.mutate(p.id);
              } else {
                addToWishlist.mutate(p.id);
              }
            }}
          />
        </div>

        {/* Product Reviews */}
        <ProductReviews productId={product.id} />
      </div>
    </div>
  );
}
