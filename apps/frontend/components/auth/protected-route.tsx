// apps/frontend/components/auth/protected-route.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

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
  const { data: user, isLoading, isError } = useMe();

  useEffect(() => {
    if (!tokenStorage.hasAccessToken()) {
      router.replace("/auth/login");
      return;
    }
    if (adminOnly && user && user.role !== "ADMIN") {
      router.replace("/");
    }
  }, [router, user, adminOnly]);

  if (!tokenStorage.hasAccessToken()) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />
      </div>
    );
  }

  if (isError || !user) {
    return null; // الـ useEffect هيعمل redirect
  }

  return <>{children}</>;
}
