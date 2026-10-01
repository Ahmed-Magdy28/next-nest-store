"use client";

import { Link } from "../../../../i18n/routing";
import { Heart, ChevronLeft, LogIn } from "lucide-react";

import {
  useWishlist,
  useRemoveFromWishlist,
  useClearWishlist,
  useMoveWishlistItemToCart,
} from "../../../../hooks/use-wishlist";
import { useLocalized } from "../../../../i18n/use-localized";
import { tokenStorage } from "../../../../lib/api/common/token-storage";
import { WishlistItemCard } from "../../../../components/e-commerce/wishlist/wishlist-item-card";

export default function WishlistPage() {
  const { data: wishlist, isLoading } = useWishlist();
  const removeItem = useRemoveFromWishlist();
  const clearWishlist = useClearWishlist();
  const moveToCart = useMoveWishlistItemToCart();
  const { t } = useLocalized();

  const isAuthenticated = tokenStorage.hasAccessToken();

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center p-4 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-50 text-rose-500 dark:bg-rose-950/40">
          <Heart className="h-8 w-8" />
        </div>
        <h1 className="mt-4 text-2xl font-bold text-gray-900 dark:text-white">
          {t({ name: "My Wishlist", arName: "قائمة المفضلة" })}
        </h1>
        <p className="mt-2 max-w-sm text-sm text-gray-500 dark:text-gray-400">
          {t({
            name: "Please sign in to view and save your favorite products to your wishlist.",
            arName: "يرجى تسجيل الدخول لعرض وحفظ منتجاتك المفضلة في قائمة رغباتك.",
          })}
        </p>
        <Link
          href="/auth/login"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition"
        >
          <LogIn className="h-4 w-4" />
          <span>{t({ name: "Sign In", arName: "تسجيل الدخول" })}</span>
        </Link>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50/60 p-4 sm:p-8 dark:bg-gray-950">
        <div className="mx-auto max-w-6xl space-y-4">
          <div className="h-8 w-48 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-800" />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-72 animate-pulse rounded-2xl bg-gray-200 dark:bg-gray-800"
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!wishlist || wishlist.items.length === 0) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center p-4 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-50 text-rose-400 dark:bg-rose-950/30">
          <Heart className="h-8 w-8" />
        </div>
        <h1 className="mt-4 text-2xl font-bold text-gray-900 dark:text-white">
          {t({ name: "Your wishlist is empty", arName: "قائمة المفضلة فارغة" })}
        </h1>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          {t({
            name: "Explore our products and tap the heart icon to save what you love.",
            arName: "تصفح منتجاتنا واضغط على أيقونة القلب لحفظ المنتجات التي تعجبك.",
          })}
        </p>
        <Link
          href="/products"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition"
        >
          <ChevronLeft className="h-4 w-4 rtl:rotate-180" />
          <span>{t({ name: "Explore Products", arName: "استكشف المنتجات" })}</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/60 py-8 px-4 sm:px-6 lg:px-8 dark:bg-gray-950">
      <div className="mx-auto max-w-6xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
              {t({ name: "My Wishlist", arName: "قائمة المفضلة" })}
            </h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {wishlist.itemsCount}{" "}
              {t({ name: "items saved", arName: "منتجات محفوظة" })}
            </p>
          </div>

          <button
            onClick={() => clearWishlist.mutate()}
            disabled={clearWishlist.isPending}
            className="text-sm font-medium text-rose-600 hover:underline dark:text-rose-400 disabled:opacity-50 cursor-pointer"
          >
            {t({ name: "Clear all", arName: "إفراغ القائمة" })}
          </button>
        </div>

        {/* Grid of Wishlist Items */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {wishlist.items.map((item) => (
            <WishlistItemCard
              key={item.id}
              item={item}
              onRemove={() => removeItem.mutate(item.productId)}
              onMoveToCart={() => moveToCart.mutate(item.productId)}
              isRemoving={removeItem.isPending}
              isMoving={moveToCart.isPending}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
