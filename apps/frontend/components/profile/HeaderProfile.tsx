"use client";

import { useState } from "react";
import { Link } from "../../i18n/routing";
import { useTranslations } from "next-intl";
import {
  LogOut,
  Settings,
  ShoppingBag,
  Heart,
  ChevronDown,
  LayoutDashboard,
  Loader2,
} from "lucide-react";

import { LanguageSwitcher } from "../common/toggleLanguage";
import { ThemeToggle } from "../common/theme-toggle";

import { useLogout, useMe } from "../../hooks/use-auth";
import { useAuthStore } from "../../lib/stores/auth-store";
import { CartIcon } from "../e-commerce/cart/CartIcon";

export default function HeaderProfile() {
  const t = useTranslations("Header");
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const isHydrated = useAuthStore((s) => s.isHydrated);
  const storeUser = useAuthStore((s) => s.user);

  const { data: apiUser, isLoading } = useMe();
  const user = apiUser ?? storeUser;

  const logout = useLogout();

  // ✅ قبل الـ hydration: نعرض skeleton بسيط
  // ده بيمنع hydration mismatch لأن السيرفر والكلينت هيعرضوا نفس الحاجة
  if (!isHydrated) {
    return (
      <div className="flex items-center gap-2 sm:gap-3">
        <div className="hidden md:flex items-center gap-2">
          <LanguageSwitcher />
          <ThemeToggle />
        </div>
        <CartIcon />
        <div className="hidden md:block h-5 w-px bg-gray-200 dark:bg-gray-800" />
        <div className="hidden md:block h-9 w-24 animate-pulse rounded-full bg-gray-200 dark:bg-gray-800" />
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 sm:gap-3">
      <div className="hidden md:flex items-center gap-2">
        <LanguageSwitcher />
        <ThemeToggle />
      </div>

      <CartIcon />

      <div className="hidden md:block h-5 w-px bg-gray-200 dark:bg-gray-800" />

      {isLoading && !user ? (
        <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
      ) : user ? (
        <div className="relative">
          <button
            onClick={() => setIsUserMenuOpen((p) => !p)}
            className="flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 p-1 sm:pe-3 text-sm font-medium text-gray-700 transition hover:bg-gray-100 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800"
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-xs font-semibold text-white">
              {user.username.charAt(0).toUpperCase()}
            </div>
            <span className="hidden sm:inline-block">{user.username}</span>
            <ChevronDown
              className={`hidden sm:inline-block h-4 w-4 text-gray-500 transition-transform ${
                isUserMenuOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {isUserMenuOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setIsUserMenuOpen(false)}
              />
              <div className="absolute end-0 z-50 mt-2 w-56 origin-top-right rtl:origin-top-left rounded-xl border border-gray-100 bg-white p-1.5 shadow-xl ring-1 ring-black/5 dark:border-gray-800 dark:bg-gray-900">
                <div className="border-b border-gray-100 px-3 py-2 dark:border-gray-800">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {user.username}
                  </p>
                  <p className="truncate text-xs text-gray-500 dark:text-gray-400">
                    {user.email}
                  </p>
                </div>
                <div className="py-1">
                  {user.role === "ADMIN" && (
                    <Link
                      href="/admin"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
                    >
                      <LayoutDashboard className="h-4 w-4 text-gray-500" />
                      {t("dashboard")}
                    </Link>
                  )}
                  <Link
                    href="/wishlist"
                    onClick={() => setIsUserMenuOpen(false)}
                    className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
                  >
                    <Heart className="h-4 w-4 text-gray-500" />
                    {t("wishlist")}
                  </Link>
                  <Link
                    href="/account/orders"
                    onClick={() => setIsUserMenuOpen(false)}
                    className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
                  >
                    <ShoppingBag className="h-4 w-4 text-gray-500" />
                    {t("myOrders")}
                  </Link>
                  <Link
                    href="/account/settings"
                    onClick={() => setIsUserMenuOpen(false)}
                    className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
                  >
                    <Settings className="h-4 w-4 text-gray-500" />
                    {t("accountSettings")}
                  </Link>
                </div>
                <div className="border-t border-gray-100 pt-1 dark:border-gray-800">
                  <button
                    onClick={() => logout.mutate()}
                    disabled={logout.isPending}
                    className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-60 dark:text-red-400 dark:hover:bg-red-950/50"
                  >
                    {logout.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <LogOut className="h-4 w-4" />
                    )}
                    {t("signOut")}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      ) : (
        <div className="hidden md:flex items-center gap-2">
          <Link
            href="/auth/login"
            className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-200 dark:hover:text-white"
          >
            {t("signIn")}
          </Link>
          <Link
            href="/auth/sign-up"
            className="rounded-lg bg-blue-600 px-3.5 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
          >
            {t("getStarted")}
          </Link>
        </div>
      )}
    </div>
  );
}
