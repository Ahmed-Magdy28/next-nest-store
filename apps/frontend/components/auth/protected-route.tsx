// apps/frontend/components/auth/protected-route.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "../../i18n/routing";

import { tokenStorage } from "../../lib/api/common/token-storage";
import { useMe } from "../../hooks/use-auth";

interface ProtectedRouteProps {
  children: React.ReactNode;
  /** لو محدد، يمنع غير الأدمن */
  adminOnly?: boolean;
}

export function ProtectedRoute({
  children,
  adminOnly = false,
}: ProtectedRouteProps) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const { data: user, isLoading, isError } = useMe();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    if (!tokenStorage.hasAccessToken()) {
      router.replace("/auth/login");
      return;
    }
    if (adminOnly && user && user.role !== "ADMIN") {
      router.replace("/");
    }
  }, [mounted, router, user, adminOnly]);

  // While SSR-ing or waiting for initial mount, render spinner consistently
  if (!mounted || isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />
      </div>
    );
  }

  if (!tokenStorage.hasAccessToken() || isError || !user) {
    return null; // Will redirect in useEffect
  }

  return <>{children}</>;
}
