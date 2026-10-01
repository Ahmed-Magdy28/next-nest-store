"use client";

import { useAuth } from "./providers/auth-provider";
import { ThemeToggle } from "./theme-toggle";
import { LocaleSwitcher } from "./locale-switcher";
import { useTranslations } from "next-intl";
import { LogOut, UserCircle2, Menu, Store } from "lucide-react";

interface HeaderProps {
  title?: string;
  onOpenMobileSidebar?: () => void;
}

export function Header({ title, onOpenMobileSidebar }: HeaderProps) {
  const { user, logout } = useAuth();
  const tNav = useTranslations("Nav");

  return (
    <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30">
      {/* Left: Hamburger on mobile + Title/Brand */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onOpenMobileSidebar}
          className="lg:hidden p-2 -ms-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors cursor-pointer"
          aria-label="Open sidebar menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 lg:hidden">
          <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-xs">
            <Store className="w-4 h-4" />
          </div>
          <span className="font-bold text-sm text-slate-900 dark:text-white sm:inline-block">
            {process.env.NEXT_PUBLIC_ADMIN_SITE_TITLE ||
              process.env.ADMIN_SITE_TITLE ||
              "Admin Dashboard"}
          </span>
        </div>

        {title && (
          <h1 className="hidden lg:block text-lg font-bold text-slate-900 dark:text-white">
            {title}
          </h1>
        )}
      </div>

      {/* Right: Controls & User */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Language & Theme Controls */}
        <LocaleSwitcher />
        <ThemeToggle />

        {/* User Info & Logout */}
        {user && (
          <div className="flex items-center gap-2 sm:gap-3 ps-2 sm:ps-3 border-s border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <UserCircle2 className="w-7 h-7 sm:w-8 sm:h-8 text-slate-400 dark:text-slate-500" />
              <div className="hidden sm:block text-start">
                <span className="block text-xs font-semibold text-slate-900 dark:text-white leading-tight">
                  {user.username}
                </span>
                <span className="block text-[10px] text-indigo-600 dark:text-indigo-400 font-medium">
                  {user.role}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={logout}
              className="p-1.5 sm:p-2 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-rose-50 dark:hover:bg-rose-950/40 hover:text-rose-600 dark:hover:text-rose-400 text-slate-500 transition-colors cursor-pointer"
              title={tNav("logout")}
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
