"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useCart } from "../../../hooks/use-cart";

export function CartIcon() {
  const { data: cart } = useCart();
  const count = cart?.itemsCount ?? 0;

  return (
    <Link
      href="/cart"
      className="relative rounded-lg p-2 text-gray-600 transition hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
      aria-label="Shopping cart"
    >
      <ShoppingCart className="h-5 w-5" />

      {count > 0 && (
        <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-blue-600 px-1 text-[10px] font-bold text-white shadow-md animate-in zoom-in">
          {count > 99 ? "99+" : count}
        </span>
      )}
    </Link>
  );
}
