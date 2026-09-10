"use client";

import { Link } from "../../i18n/routing";
import { ShopName } from "@repo/shared/constants";

import { ShoppingBag } from "lucide-react";
import NavBar from "./NavBar";
import HeaderProfile from "../profile/HeaderProfile";

// Mock user state — replace with your actual Auth hook/context (e.g., NextAuth, Clerk, or custom context)

export function Header() {
  // Replace this mock state with your Auth Provider hook (e.g., const { user, logout } = useAuth())

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-md dark:border-gray-800 dark:bg-gray-950/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left Side: Brand Logo */}
        <div className="flex items-center gap-8">
          <Link
            href="/"
            className="flex items-center gap-2 text-xl font-bold tracking-tight text-gray-900 dark:text-white"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md shadow-blue-500/20">
              <ShoppingBag className="h-5 w-5" />
            </div>
            <span>{ShopName}</span>
          </Link>
        </div>

        <NavBar />
        {/* Right Side: Account & Actions */}
        <HeaderProfile />
      </div>
    </header>
  );
}
