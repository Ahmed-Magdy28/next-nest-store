import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { AuthUserDto } from "@repo/shared/dtos/auth";

interface AuthState {
  user: AuthUserDto | null;
  isHydrated: boolean;

  setUser: (user: AuthUserDto | null) => void;
  clear: () => void;
  setHydrated: (value: boolean) => void;
}

/**
 * Client-side auth state.
 *
 * Persisted to localStorage so the UI shows the user immediately on reload.
 * The actual source of truth is still the backend `GET /auth/me`.
 */
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isHydrated: false,

      setUser: (user) => set({ user }),
      clear: () => set({ user: null }),
      setHydrated: (value) => set({ isHydrated: value }),
    }),
    {
      name: "auth-store",
      partialize: (state) => ({ user: state.user }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    },
  ),
);
