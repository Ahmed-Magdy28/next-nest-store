"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { authApi, tokenStorage } from "../../lib/api";
import { useRouter, usePathname } from "../../i18n/routing";
import type { JwtUser } from "@repo/shared/interfaces";

interface AuthContextType {
  user: JwtUser | null | undefined;
  isLoading: boolean;
  isAuthenticated: boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  isAuthenticated: false,
  logout: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const queryClient = useQueryClient();

  const [isMounted, setIsMounted] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    setToken(tokenStorage.getAccessToken());
    setIsMounted(true);
  }, []);

  const {
    data: user,
    isLoading: isUserLoading,
    isError,
  } = useQuery({
    queryKey: ["auth", "me"],
    queryFn: () => authApi.getMe(),
    enabled: isMounted && !!token,
    retry: false,
  });

  const logoutMutation = useMutation({
    mutationFn: () => authApi.logout(),
    onSettled: () => {
      setToken(null);
      queryClient.clear();
      router.push("/login");
    },
  });

  const isAuthenticated = isMounted && !!token && !!user && !isError;
  const isLoading = !isMounted || (!!token && isUserLoading);

  useEffect(() => {
    if (!isMounted) return;

    // If not authenticated and not on login page, redirect
    if (!isLoading && !isAuthenticated && pathname !== "/login") {
      router.push("/login");
    }
    // If authenticated and on login page, redirect to dashboard
    if (!isLoading && isAuthenticated && pathname === "/login") {
      router.push("/");
    }
  }, [isMounted, isLoading, isAuthenticated, pathname, router]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated,
        logout: () => logoutMutation.mutate(),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
