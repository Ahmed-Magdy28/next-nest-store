"use client";

import { useState, useEffect } from "react";
import { Link, usePathname } from "../../i18n/routing";
import { ShopName } from "@repo/shared/constants";
import { ShoppingBag, Menu } from "lucide-react";
import NavBar from "./NavBar";
import HeaderProfile from "../profile/HeaderProfile";
import MobileNavDrawer from "./MobileNavDrawer";

export function Header() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const pathname = usePathname();

  // Close drawer whenever route changes
  useEffect(() => {
    setIsDrawerOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-200 bg-white/80 backdrop-blur-md dark:border-gray-800 dark:bg-gray-950/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-3 sm:px-6 lg:px-8">
        {/* Left Side: Brand Logo */}
        <div className="flex items-center gap-4 sm:gap-8 min-w-0">
          <Link
            href="/"
            className="flex items-center gap-2 text-lg sm:text-xl font-bold tracking-tight text-gray-900 dark:text-white shrink-0"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md shadow-blue-500/20">
              <ShoppingBag className="h-5 w-5" />
            </div>
            <span className="truncate max-w-[140px] sm:max-w-none">{ShopName}</span>
          </Link>
        </div>

        {/* Center: Desktop Navigation Links */}
        <NavBar />

        {/* Right Side: Account, Cart & Mobile Menu Toggle */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <HeaderProfile />

          {/* Mobile Menu Hamburger Button */}
          <button
            type="button"
            onClick={() => setIsDrawerOpen(true)}
            aria-label="Open menu"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-100 md:hidden dark:border-gray-800 dark:text-gray-200 dark:hover:bg-gray-900 transition-colors"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Slide-over Mobile Drawer */}
      <MobileNavDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />
    </header>
  );
}
