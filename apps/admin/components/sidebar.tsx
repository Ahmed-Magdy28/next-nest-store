"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "../i18n/routing";
import {
  LayoutDashboard,
  Package,
  Layers,
  ShoppingBag,
  TicketPercent,
  MessageSquareCheck,
  Store,
  X,
} from "lucide-react";

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const t = useTranslations("Nav");
  const pathname = usePathname();

  const navItems = [
    { href: "/", label: t("dashboard"), icon: LayoutDashboard },
    { href: "/products", label: t("products"), icon: Package },
    { href: "/categories", label: t("categories"), icon: Layers },
    { href: "/orders", label: t("orders"), icon: ShoppingBag },
    { href: "/coupons", label: t("coupons"), icon: TicketPercent },
    { href: "/reviews", label: t("reviews"), icon: MessageSquareCheck },
  ];

  const renderNav = (isMobile = false) => (
    <nav className="p-4 space-y-1.5 flex-1 overflow-y-auto">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive =
          item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => {
              if (isMobile && onClose) onClose();
            }}
            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
              isActive
                ? "bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-semibold shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900/80 hover:text-slate-900 dark:hover:text-slate-200"
            }`}
          >
            <Icon
              className={`w-4 h-4 ${
                isActive
                  ? "text-indigo-600 dark:text-indigo-400"
                  : "text-slate-400 dark:text-slate-500"
              }`}
            />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );

  return (
    <>
      {/* ─── Desktop Sidebar ───────────────────────────────────── */}
      <aside className="hidden lg:flex w-64 shrink-0 border-e border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 flex-col min-h-screen sticky top-0 h-screen">
        {/* Brand */}
        <div className="h-16 flex items-center px-6 border-b border-slate-200 dark:border-slate-800 gap-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold shadow-md shadow-indigo-600/20 shrink-0">
            <Store className="w-5 h-5" />
          </div>
          <div>
            <span className="font-bold text-base text-slate-900 dark:text-white block leading-tight">
              {process.env.NEXT_PUBLIC_ADMIN_SITE_TITLE ||
                process.env.ADMIN_SITE_TITLE ||
                "Admin Dashboard"}
            </span>
            <span className="text-[11px] text-slate-500 font-medium block">
              Control Center
            </span>
          </div>
        </div>

        {/* Desktop Nav */}
        {renderNav(false)}

        {/* Footer Info */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-400 text-center">
          v1.0.0 • Next Nest Store
        </div>
      </aside>

      {/* ─── Mobile Slide-Over Drawer ─────────────────────────── */}
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
            onClick={onClose}
          />

          {/* Drawer */}
          <aside className="fixed inset-y-0 start-0 z-50 w-72 max-w-[85vw] bg-white dark:bg-slate-950 border-e border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col h-full animate-in slide-in-from-start duration-200">
            {/* Header */}
            <div className="h-16 flex items-center justify-between px-5 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold shadow-md shadow-indigo-600/20 shrink-0">
                  <Store className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-bold text-sm text-slate-900 dark:text-white block leading-tight">
                    {process.env.NEXT_PUBLIC_ADMIN_SITE_TITLE ||
                      process.env.ADMIN_SITE_TITLE ||
                      "Admin Dashboard"}
                  </span>
                  <span className="text-[10px] text-slate-500 font-medium block">
                    Control Center
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900 cursor-pointer"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile Nav */}
            {renderNav(true)}

            {/* Footer */}
            <div className="p-4 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-400 text-center">
              v1.0.0 • Next Nest Store
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
