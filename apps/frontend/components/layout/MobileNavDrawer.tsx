"use client";

import { useEffect } from "react";
import { Link } from "../../i18n/routing";
import { useTranslations } from "next-intl";
import { ShopName } from "@repo/shared/constants";
import { navMenuData } from "@repo/shared/constants";
import type { NavMenuDataType } from "@repo/shared/types";
import {
  X,
  ShoppingBag,
  LayoutDashboard,
  Settings,
  Heart,
  LogOut,
  ChevronRight,
  LogIn,
  UserPlus,
  Loader2,
} from "lucide-react";
import { LanguageSwitcher } from "../common/toggleLanguage";
import { ThemeToggle } from "../common/theme-toggle";
import { useLogout, useMe } from "../../hooks/use-auth";
import { useAuthStore } from "../../lib/stores/auth-store";

interface MobileNavDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileNavDrawer({
  isOpen,
  onClose,
}: MobileNavDrawerProps) {
  const tHeader = useTranslations("Header");
  const tNav = useTranslations("Nav");

  const isHydrated = useAuthStore((s) => s.isHydrated);
  const storeUser = useAuthStore((s) => s.user);
  const { data: apiUser } = useMe();
  const user = isHydrated ? apiUser ?? storeUser : null;

  const logout = useLogout();

  // Prevent background scrolling when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  const getNavTitle = (title: string) =>
    tNav.has(title) ? tNav(title) : title;

  return (
    <div
      className={`fixed inset-0 z-50 transition-visibility duration-300 ${
        isOpen ? "pointer-events-auto visible" : "pointer-events-none invisible"
      }`}
      aria-hidden={!isOpen}
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        className={`fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Drawer Panel */}
      <aside
        className={`fixed inset-y-0 end-0 flex h-full w-[85vw] max-w-sm flex-col border-s border-gray-200 bg-white shadow-2xl transition-transform duration-300 ease-in-out dark:border-gray-800 dark:bg-gray-950 ${
          isOpen ? "translate-x-0" : "translate-x-full rtl:-translate-x-full"
        }`}
      >
        {/* Drawer Header */}
        <div className="flex h-16 items-center justify-between border-b border-gray-100 px-5 dark:border-gray-800">
          <Link
            href="/"
            onClick={onClose}
            className="flex items-center gap-2.5 text-lg font-bold tracking-tight text-gray-900 dark:text-white"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white shadow-sm shadow-blue-500/20">
              <ShoppingBag className="h-4 w-4" />
            </div>
            <span className="truncate">{ShopName}</span>
          </Link>

          <button
            onClick={onClose}
            aria-label={tHeader("close")}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:border-gray-800 dark:text-gray-400 dark:hover:bg-gray-900 dark:hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-6">
          {/* User / Authentication Card */}
          {user ? (
            <div className="rounded-2xl border border-gray-200/80 bg-gray-50/70 p-3.5 dark:border-gray-800 dark:bg-gray-900/60">
              <div className="flex items-center gap-3 pb-3 border-b border-gray-200/60 dark:border-gray-800">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white shadow-sm">
                  {user.username.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-gray-900 dark:text-white">
                    {user.username}
                  </p>
                  <p className="truncate text-xs text-gray-500 dark:text-gray-400">
                    {user.email}
                  </p>
                </div>
              </div>

              <div className="mt-2 space-y-1">
                {user.role === "ADMIN" && (
                  <Link
                    href="/admin"
                    onClick={onClose}
                    className="flex items-center justify-between rounded-lg px-2.5 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                  >
                    <div className="flex items-center gap-2.5">
                      <LayoutDashboard className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      <span>{tHeader("dashboard")}</span>
                    </div>
                    <ChevronRight className="h-4 w-4 text-gray-400 rtl:rotate-180" />
                  </Link>
                )}

                <Link
                  href="/wishlist"
                  onClick={onClose}
                  className="flex items-center justify-between rounded-lg px-2.5 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                >
                  <div className="flex items-center gap-2.5">
                    <Heart className="h-4 w-4 text-gray-500" />
                    <span>Wishlist</span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-gray-400 rtl:rotate-180" />
                </Link>

                <Link
                  href="/account/orders"
                  onClick={onClose}
                  className="flex items-center justify-between rounded-lg px-2.5 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                >
                  <div className="flex items-center gap-2.5">
                    <ShoppingBag className="h-4 w-4 text-gray-500" />
                    <span>{tHeader("myOrders")}</span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-gray-400 rtl:rotate-180" />
                </Link>

                <Link
                  href="/account/settings"
                  onClick={onClose}
                  className="flex items-center justify-between rounded-lg px-2.5 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                >
                  <div className="flex items-center gap-2.5">
                    <Settings className="h-4 w-4 text-gray-500" />
                    <span>{tHeader("accountSettings")}</span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-gray-400 rtl:rotate-180" />
                </Link>

                <button
                  onClick={() => {
                    logout.mutate();
                    onClose();
                  }}
                  disabled={logout.isPending}
                  className="flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-60 dark:text-red-400 dark:hover:bg-red-950/40"
                >
                  <div className="flex items-center gap-2.5">
                    {logout.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <LogOut className="h-4 w-4" />
                    )}
                    <span>{tHeader("signOut")}</span>
                  </div>
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-2 rounded-2xl border border-gray-200/80 bg-gray-50/70 p-3.5 dark:border-gray-800 dark:bg-gray-900/60">
              <Link
                href="/auth/sign-up"
                onClick={onClose}
                className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
              >
                <UserPlus className="h-4 w-4" />
                <span>{tHeader("getStarted")}</span>
              </Link>
              <Link
                href="/auth/login"
                onClick={onClose}
                className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700/80"
              >
                <LogIn className="h-4 w-4" />
                <span>{tHeader("signIn")}</span>
              </Link>
            </div>
          )}

          {/* Store Navigation Links */}
          <div>
            <p className="px-2 pb-2 text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
              {tHeader("navigation")}
            </p>
            <nav className="space-y-1">
              {navMenuData.map((item: NavMenuDataType) => (
                <Link
                  key={item.title}
                  href={item.href}
                  onClick={onClose}
                  className="flex items-center justify-between rounded-xl px-3 py-2.5 text-base font-medium text-gray-700 transition hover:bg-gray-100 hover:text-blue-600 dark:text-gray-200 dark:hover:bg-gray-900 dark:hover:text-blue-400"
                >
                  <span>{getNavTitle(item.title)}</span>
                  <ChevronRight className="h-4 w-4 text-gray-400 rtl:rotate-180" />
                </Link>
              ))}
            </nav>
          </div>
        </div>

        {/* Drawer Footer: Preferences */}
        <div className="border-t border-gray-100 bg-gray-50/50 p-4 dark:border-gray-800 dark:bg-gray-900/40">
          <p className="pb-2 text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
            {tHeader("preferences")}
          </p>
          <div className="flex items-center justify-between gap-3">
            <LanguageSwitcher />
            <ThemeToggle />
          </div>
        </div>
      </aside>
    </div>
  );
}
