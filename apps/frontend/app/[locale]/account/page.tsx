"use client";

import Link from "next/link";
import { Package, Heart, Settings, User } from "lucide-react";

import { ProtectedRoute } from "../../../components/auth/protected-route";
import { useMe } from "../../../hooks/use-auth";

export default function AccountPage() {
  return (
    <ProtectedRoute>
      <AccountContent />
    </ProtectedRoute>
  );
}

function AccountContent() {
  const { data: user } = useMe();

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8 dark:bg-gray-950">
      <div className="mx-auto max-w-4xl space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            My Account
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Welcome back, {user?.username}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <AccountCard
            href="/account/profile"
            icon={User}
            label="Profile"
            desc="Manage your personal info"
          />
          <AccountCard
            href="/account/orders"
            icon={Package}
            label="Orders"
            desc="View your order history"
          />
          <AccountCard
            href="/account/wishlist"
            icon={Heart}
            label="Wishlist"
            desc="Your saved products"
          />
          <AccountCard
            href="/account/settings"
            icon={Settings}
            label="Settings"
            desc="Security & preferences"
          />
        </div>
      </div>
    </div>
  );
}

function AccountCard({
  href,
  icon: Icon,
  label,
  desc,
}: {
  href: string;
  icon: any;
  label: string;
  desc: string;
}) {
  return (
    <Link
      href={href}
      className="group rounded-2xl border border-gray-200 bg-white p-5 transition hover:-translate-y-0.5 hover:border-blue-500 hover:shadow-md dark:border-gray-800 dark:bg-gray-900"
    >
      <Icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
      <p className="mt-3 font-semibold text-gray-900 dark:text-white">
        {label}
      </p>
      <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">{desc}</p>
    </Link>
  );
}
