"use client";

import {
  useCart,
  useUpdateCartItem,
  useRemoveCartItem,
  useClearCart,
} from "../../../../hooks/use-cart";
import { useLocalized } from "../../../../i18n/use-localized";
import { CartEmptyState } from "../../../../components/e-commerce/cart/cart-empty-state";
import { CartItemRow } from "../../../../components/e-commerce/cart/cart-item-row";
import { CartSummaryCard } from "../../../../components/e-commerce/cart/cart-summary-card";

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
    return <CartEmptyState />;
  }

  const shippingCost = Number(process.env.NEXT_PUBLIC_SHIPPING_COST || 5);
  const freeThreshold = Number(
    process.env.NEXT_PUBLIC_SHIPPING_FREE_THRESHOLD || 100,
  );
  const taxRate = Number(
    process.env.NEXT_PUBLIC_TAX_RATE_IN_PERCENTAGE || 12,
  );

  const isFreeShipping = cart.subtotal >= freeThreshold;
  const shipping = isFreeShipping ? 0 : shippingCost;
  const tax = (cart.subtotal * taxRate) / 100;
  const total = cart.subtotal + shipping + tax;
  const remainingForFreeShipping = Math.max(0, freeThreshold - cart.subtotal);

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8 dark:bg-gray-950">
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {t({ name: "Shopping Cart", arName: "سلة التسوق" })}
          </h1>
          <button
            onClick={() => clearCart.mutate()}
            className="text-sm font-medium text-rose-600 hover:underline cursor-pointer"
          >
            {t({ name: "Clear all", arName: "إفراغ السلة" })}
          </button>
        </div>

        <div className="space-y-3">
          {cart.items.map((item) => (
            <CartItemRow
              key={item.id}
              item={item}
              onUpdateQuantity={(quantity) =>
                updateItem.mutate({ itemId: item.id, body: { quantity } })
              }
              onRemove={() => removeItem.mutate(item.id)}
            />
          ))}
        </div>

        <CartSummaryCard
          subtotal={cart.subtotal}
          shipping={shipping}
          tax={tax}
          total={total}
          taxRate={taxRate}
          isFreeShipping={isFreeShipping}
          freeThreshold={freeThreshold}
          remainingForFreeShipping={remainingForFreeShipping}
        />
      </div>
    </div>
  );
}
