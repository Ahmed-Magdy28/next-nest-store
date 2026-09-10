"use client";

import { useState } from "react";
import { Link } from "../../i18n/routing";
import { useTranslations } from "next-intl";
import { navMenuData } from "@repo/shared/constants";
import { NavMenuDataType } from "@repo/shared/types";
import { Menu, X } from "lucide-react";

type NavLocation = "left" | "center" | "right";

interface NavBarProps {
  /** Alignment for desktop navigation links. Defaults to "center" */
  location?: NavLocation;
}

// Configurable default alignment setting
const DEFAULT_NAV_LOCATION: NavLocation = "center";

// Map alignment positions to flexbox utility classes
const LOCATION_CLASSES: Record<NavLocation, string> = {
  left: "justify-start",
  center: "justify-center",
  right: "justify-end",
};

export default function NavBar({
  location = DEFAULT_NAV_LOCATION,
}: NavBarProps) {
  const t = useTranslations("Nav");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => setIsMobileMenuOpen((prev) => !prev);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  const getNavTitle = (title: string) => (t.has(title) ? t(title) : title);

  return (
    <>
      {/* ---------------- Desktop Navigation ---------------- */}
      <nav
        className={`hidden md:flex md:flex-1 md:items-center md:gap-6 text-sm font-medium text-gray-600 dark:text-gray-300 ${LOCATION_CLASSES[location]}`}
      >
        {navMenuData.map((item: NavMenuDataType) => (
          <Link
            key={item.title}
            href={item.href}
            className="transition-colors hover:text-blue-600 dark:hover:text-white"
          >
            {getNavTitle(item.title)}
          </Link>
        ))}
      </nav>

      {/* ---------------- Mobile Toggle Button ---------------- */}
      <div className="flex items-center md:hidden">
        <button
          type="button"
          onClick={toggleMobileMenu}
          aria-expanded={isMobileMenuOpen}
          aria-label="Toggle Navigation Menu"
          className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 transition"
        >
          {isMobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* ---------------- Mobile Navigation Drawer ---------------- */}
      {isMobileMenuOpen && (
        <>
          {/* Backdrop Overlay */}
          <div
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs md:hidden"
            onClick={closeMobileMenu}
          />

          {/* Slide-down Drawer Container */}
          <div className="absolute left-0 top-full z-50 w-full border-b border-gray-200 bg-white/95 px-6 py-4 shadow-xl backdrop-blur-md dark:border-gray-800 dark:bg-gray-950/95 md:hidden">
            <nav className="flex flex-col gap-2 font-medium text-gray-600 dark:text-gray-300">
              {navMenuData.map((item: NavMenuDataType) => (
                <Link
                  key={item.title}
                  href={item.href}
                  onClick={closeMobileMenu}
                  className="rounded-lg px-3 py-2.5 text-base transition-colors hover:bg-gray-100 hover:text-blue-600 dark:hover:bg-gray-800/60 dark:hover:text-white"
                >
                  {getNavTitle(item.title)}
                </Link>
              ))}
            </nav>
          </div>
        </>
      )}
    </>
  );
}
