// apps/frontend/components/providers/auth-provider.tsx
"use client";

import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";

import type { JwtUser } from "@repo/shared/interfaces";

import { queryKeys } from "../../lib/api/e-commerce/query-keys";
import { tokenStorage } from "../../lib/api/common/token-storage";
import { useAuthStore } from "../../lib/stores/auth-store";
import { authApi } from "../../lib/api/auth";

/**
 * Auth bootstrap:
 * - لو فيه access token، بنجيب الـ user من /auth/me.
 * - لو التوكن expired، الـ apiClient هيعمل refresh تلقائيًا.
 * - لو فشل كل حاجة، بنمسح التوكن.
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const qc = useQueryClient();
  const setUser = useAuthStore((s) => s.setUser);
  const clear = useAuthStore((s) => s.clear);

  useEffect(() => {
    let cancelled = false;

    async function bootstrap() {
      if (!tokenStorage.hasAccessToken()) return;

      try {
        const user = await authApi.me();
        if (cancelled) return;
        setUser(user as any);
        qc.setQueryData(queryKeys.me, user);
      } catch {
        if (cancelled) return;
        tokenStorage.clear();
        clear();
      }
    }

    bootstrap();
    return () => {
      cancelled = true;
    };
  }, [qc, setUser, clear]);

  return <>{children}</>;
}
