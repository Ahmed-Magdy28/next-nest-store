"use client";

import { useState } from "react";
import { ShoppingBag, Truck, Check, Package } from "lucide-react";

type CartState = "idle" | "adding" | "added";

interface AddToCartButtonProps {
  onAdd: () => void | Promise<unknown>;
  disabled?: boolean;
  isAvailable?: boolean;
  className?: string;
  labelAdd?: string;
  labelAdding?: string;
  labelAdded?: string;
}

export function AddToCartButton({
  onAdd,
  disabled = false,
  isAvailable = true,
  className = "",
  labelAdd = "Add to Cart",
  labelAdding = "Shipping...",
  labelAdded = "Added!",
}: AddToCartButtonProps) {
  const [state, setState] = useState<CartState>("idle");

  const handleClick = async (e: React.MouseEvent) => {
    // 🛑 مهم جدًا: نمنع الـ Link يشتغل (الكارد كله ملفوف بـ Link)
    e.preventDefault();
    e.stopPropagation();

    if (state !== "idle" || disabled || !isAvailable) return;

    setState("adding");
    try {
      await onAdd(); // ← يستنى الـ mutateAsync فعليًا
      setState("added");
      setTimeout(() => setState("idle"), 1400);
    } catch (err) {
      console.error("[AddToCart] failed:", err);
      setState("idle");
    }
  };

  const isDisabled = disabled || !isAvailable || state !== "idle";

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isDisabled}
      className={[
        "group/btn relative inline-flex w-full items-center justify-center gap-1.5 overflow-hidden rounded-lg px-3.5 py-2 text-xs font-semibold text-white shadow-sm transition-all duration-300",
        state === "added" ? "bg-emerald-600" : "bg-blue-600 hover:bg-blue-700",
        "disabled:cursor-not-allowed disabled:bg-gray-300 dark:disabled:bg-gray-700",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {/* 📦 أيقونة الباكدج الصغيرة بتطير ناحية الشاحنة */}
      {state === "adding" && (
        <Package
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 animate-fly-to-truck text-white/95"
        />
      )}

      {/* خط الطريق */}
      <span
        aria-hidden
        className={[
          "pointer-events-none absolute inset-x-3 bottom-1 h-px rounded-full bg-white/40 transition-opacity duration-300",
          state === "adding" ? "opacity-100" : "opacity-0",
        ].join(" ")}
      />

      {/* المحتوى */}
      <span className="relative z-10 flex items-center gap-1.5">
        {state === "idle" && (
          <>
            <ShoppingBag className="h-3.5 w-3.5 transition-transform group-hover/btn:-translate-y-0.5" />
            <span>{isAvailable ? labelAdd : "Out of Stock"}</span>
          </>
        )}

        {state === "adding" && (
          <>
            <Truck className="h-4 w-4 animate-truck-drive" />
            <span>{labelAdding}</span>
          </>
        )}

        {state === "added" && (
          <>
            <Check className="h-3.5 w-3.5 animate-check-pop" />
            <span>{labelAdded}</span>
          </>
        )}
      </span>
    </button>
  );
}
