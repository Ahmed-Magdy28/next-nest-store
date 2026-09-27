"use client";

import Image from "next/image";
import Link from "next/link";
import { Trash2, Plus, Minus, ShoppingBag, ChevronLeft } from "lucide-react";

import {
  useCart,
  useUpdateCartItem,
  useRemoveCartItem,
  useClearCart,
} from "../../../../hooks/use-cart";
import { useLocalized } from "../../../../i18n/use-localized";

export default function CartPage() {
  const { data: cart, isLoading } = useCart();
  const updateItem = useUpdateCartItem();
  const removeItem = useRemoveCartItem();
  const clearCart = useClearCart();
  const { t } = useLocalized();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8 dark:bg-gray-950">
        <div className="mx-auto max-w-4xl space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-24 animate-pulse rounded-2xl bg-gray-200 dark:bg-gray-800"
            />
          ))}
        </div>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 p-8 dark:bg-gray-950">
        <div className="text-center">
          <ShoppingBag className="mx-auto h-16 w-16 text-gray-300 dark:text-gray-700" />
          <h1 className="mt-4 text-2xl font-bold text-gray-900 dark:text-white">
            {t({ name: "Your cart is empty", arName: "سلتك فارغة" })}
          </h1>
          <Link
            href="/products"
            className="mt-6 inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            <ChevronLeft className="h-4 w-4 rtl:rotate-180" />
            {t({ name: "Continue shopping", arName: "تابع التسوق" })}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8 dark:bg-gray-950">
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {t({ name: "Shopping Cart", arName: "سلة التسوق" })}
          </h1>
          <button
            onClick={() => clearCart.mutate()}
            className="text-sm font-medium text-rose-600 hover:underline"
          >
            {t({ name: "Clear all", arName: "إفراغ السلة" })}
          </button>
        </div>

        <div className="space-y-3">
          {cart.items.map((item) => (
            <div
              key={item.id}
              className="flex gap-4 rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900"
            >
              <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800">
                <Image
                  src={item.product.mainImage}
                  alt={t(item.product)}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="flex flex-1 flex-col">
                <Link
                  href={`/products/${item.product.slug}`}
                  className="font-medium text-gray-900 hover:underline dark:text-white"
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
                  onClick={() => removeItem.mutate(item.id)}
                  className="text-gray-400 hover:text-rose-500"
                >
                  <Trash2 className="h-4 w-4" />
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      updateItem.mutate({
                        itemId: item.id,
                        body: { quantity: item.quantity - 1 },
                      })
                    }
                    disabled={item.quantity <= 1}
                    className="rounded-md border border-gray-200 p-1 hover:bg-gray-50 disabled:opacity-40 dark:border-gray-700 dark:hover:bg-gray-800"
                  >
                    <Minus className="h-3 w-3" />
                  </button>
                  <span className="w-8 text-center text-sm font-semibold">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() =>
                      updateItem.mutate({
                        itemId: item.id,
                        body: { quantity: item.quantity + 1 },
                      })
                    }
                    disabled={item.quantity >= item.currentStock}
                    className="rounded-md border border-gray-200 p-1 hover:bg-gray-50 disabled:opacity-40 dark:border-gray-700 dark:hover:bg-gray-800"
                  >
                    <Plus className="h-3 w-3" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
          <div className="flex items-center justify-between text-lg font-bold text-gray-900 dark:text-white">
            <span>{t({ name: "Subtotal", arName: "المجموع الفرعي" })}</span>
            <span>${cart.subtotal.toFixed(2)}</span>
          </div>
          <button className="mt-4 w-full rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white hover:bg-blue-700">
            {t({ name: "Checkout", arName: "إتمام الشراء" })}
          </button>
        </div>
      </div>
    </div>
  );
}
