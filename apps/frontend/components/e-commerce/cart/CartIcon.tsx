"use client";

import { Link } from "../../../i18n/routing";
import { ShoppingCart } from "lucide-react";
import { useCart } from "../../../hooks/use-cart";

export function CartIcon() {
  const { data: cart } = useCart();
  const count = cart?.itemsCount ?? 0;

  return (
    <Link
      href="/cart"
      className="relative rounded-lg p-2 text-gray-600 transition hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 cursor-pointer"
      aria-label="Shopping cart"
    >
      <ShoppingCart className="h-5 w-5" />

      {count > 0 && (
        <span className="absolute -top-1 -end-1 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-blue-600 px-1 text-[10px] font-bold text-white shadow-sm">
          {count > 99 ? "99+" : count}
        </span>
      )}
    </Link>
  );
}
