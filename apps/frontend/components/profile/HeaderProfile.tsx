"use client";

import { useState } from "react";
import { Link } from "../../i18n/routing";
import { useTranslations } from "next-intl";
import {
  LogOut,
  Settings,
  ShoppingBag,
  Menu,
  X,
  ChevronDown,
  LayoutDashboard,
} from "lucide-react";
import { LanguageSwitcher } from "../common/toggleLanguage";
import { ThemeToggle } from "../common/theme-toggle";
import Image from "next/image";

type UserProfile = {
  name: string;
  email: string;
  avatarUrl?: string;
  role?: "ADMIN" | "USER";
} | null;

export default function HeaderProfile() {
  const t = useTranslations("Header");
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [user, setUser] = useState<UserProfile>({
    name: "Ahmed",
    email: "ahmed@example.com",
    role: "USER",
  });

  const handleLogout = () => {
    setIsUserMenuOpen(false);
    setUser(null);
  };

  return (
    <div className="flex items-center gap-2 sm:gap-3">
      {/* 1. أدوات النظام: التبديل بين اللغات والـ Theme */}
      <div className="flex items-center gap-2">
        <LanguageSwitcher />
        <ThemeToggle />
      </div>

      <div className="h-5 w-[1px] bg-gray-200 dark:bg-gray-800" />

      {/* 2. حساب المستخدم أو أزرار تسجيل الدخول */}
      {user ? (
        <div className="relative">
          <button
            onClick={() => setIsUserMenuOpen((prev) => !prev)}
            className="flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 p-1 pr-3 text-sm font-medium text-gray-700 transition hover:bg-gray-100 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800"
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-xs font-semibold text-white">
              {user.avatarUrl ? (
                <Image
                  src={user.avatarUrl}
                  alt={user.name}
                  className="h-7 w-7 rounded-full object-cover"
                />
              ) : (
                user.name.charAt(0).toUpperCase()
              )}
            </div>
            <span className="hidden sm:inline-block">{user.name}</span>
            <ChevronDown
              className={`h-4 w-4 text-gray-500 transition-transform ${
                isUserMenuOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* القائمة المنسدلة */}
          {isUserMenuOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setIsUserMenuOpen(false)}
              />

              <div className="absolute right-0 z-50 mt-2 w-56 origin-top-right rounded-xl border border-gray-100 bg-white p-1.5 shadow-xl ring-1 ring-black/5 dark:border-gray-800 dark:bg-gray-900">
                <div className="border-b border-gray-100 px-3 py-2 dark:border-gray-800">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {user.name}
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
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/50"
                  >
                    <LogOut className="h-4 w-4" />
                    {t("signOut")}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      ) : (
        /* تسجيل الدخول عند عدم وجود حساب */
        <div className="flex items-center gap-2">
          <Link
            href="/auth/login"
            className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-200 dark:hover:text-white"
          >
            {t("signIn")}
          </Link>
          <Link
            href="/auth/sign-up"
            className="rounded-lg bg-blue-600 px-3.5 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          >
            {t("getStarted")}
          </Link>
        </div>
      )}

      {/* 3. زر القائمة في الشاشات الصغيرة */}
      <button
        onClick={() => setIsMobileMenuOpen((prev) => !prev)}
        className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 md:hidden dark:text-gray-300 dark:hover:bg-gray-800"
        aria-label="Toggle Navigation Menu"
      >
        {isMobileMenuOpen ? (
          <X className="h-5 w-5" />
        ) : (
          <Menu className="h-5 w-5" />
        )}
      </button>
    </div>
  );
}
