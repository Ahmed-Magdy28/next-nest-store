"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import type {
  LoginDto,
  RegisterDto,
  ForgotPasswordDto,
  ResetPasswordDto,
} from "@repo/shared/dtos/auth";
import type { JwtUser } from "@repo/shared/interfaces";

import { authApi } from "../lib/api/auth";
import { tokenStorage } from "../lib/api/common/token-storage";
import { queryKeys } from "../lib/api/e-commerce/query-keys";
import { useAuthStore } from "../lib/stores/auth-store";
import { cacheTimeInMinutes } from "@repo/shared/constants/e-commerce";
import { mergeCart, setStoredGuestToken } from "../lib/api/e-commerce/cart";

// ─── Read ───────────────────────────────────────────────

export function useMe() {
  const hasToken = tokenStorage.hasAccessToken();

  return useQuery<JwtUser>({
    queryKey: queryKeys.me,
    queryFn: authApi.me,
    enabled: hasToken,
    staleTime: 1000 * 60 * cacheTimeInMinutes,
    retry: false,
  });
}

// ─── Register ───────────────────────────────────────────

export function useRegister() {
  const qc = useQueryClient();
  const setUser = useAuthStore((s) => s.setUser);

  return useMutation({
    mutationFn: async (body: RegisterDto) => {
      const authRes = await authApi.register(body);
      let mergedCart = null;
      try {
        const res = await mergeCart();
        mergedCart = res.cart;
      } catch (err) {
        console.error("Cart merge error on register:", err);
      }
      return { ...authRes, cart: mergedCart };
    },
    onSuccess: (data) => {
      setUser(data.user);
      qc.setQueryData(queryKeys.me, data.user);
      if (data.cart) {
        qc.setQueryData(queryKeys.cart, data.cart);
      }
      qc.invalidateQueries({ queryKey: queryKeys.cart });
      toast.success("تم إنشاء الحساب بنجاح 🎉");
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "فشل التسجيل");
    },
  });
}

// ─── Login ──────────────────────────────────────────────

export function useLogin() {
  const qc = useQueryClient();
  const setUser = useAuthStore((s) => s.setUser);

  return useMutation({
    mutationFn: async (body: LoginDto) => {
      const authRes = await authApi.login(body);
      let mergedCart = null;
      try {
        const res = await mergeCart();
        mergedCart = res.cart;
      } catch (err) {
        console.error("Cart merge error on login:", err);
      }
      return { ...authRes, cart: mergedCart };
    },
    onSuccess: (data) => {
      setUser(data.user);
      qc.setQueryData(queryKeys.me, data.user);
      if (data.cart) {
        qc.setQueryData(queryKeys.cart, data.cart);
      }
      qc.invalidateQueries({ queryKey: queryKeys.cart });
      toast.success(`أهلاً بيك يا ${data.user.username} 👋`);
    },
    onError: (error) => {
      toast.error(
        error instanceof Error
          ? error.message
          : "البريد الإلكتروني أو كلمة المرور غير صحيحة",
      );
    },
  });
}

// ─── Logout ─────────────────────────────────────────────

export function useLogout() {
  const qc = useQueryClient();
  const router = useRouter();
  const clear = useAuthStore((s) => s.clear);

  return useMutation({
    mutationFn: () => authApi.logout(),
    onSuccess: () => {
      clear();
      setStoredGuestToken(null);
      qc.clear();
      toast.success("تم تسجيل الخروج");
      router.push("/");
      router.refresh();
    },
  });
}

// ─── Forgot password ────────────────────────────────────

export function useForgotPassword() {
  return useMutation({
    mutationFn: (body: ForgotPasswordDto) => authApi.forgotPassword(body),
    onSuccess: () => {
      toast.success("تم إرسال رابط إعادة التعيين لو الإيميل موجود");
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "فشل الإرسال");
    },
  });
}

// ─── Reset password ─────────────────────────────────────

export function useResetPassword() {
  const router = useRouter();

  return useMutation({
    mutationFn: (body: ResetPasswordDto) => authApi.resetPassword(body),
    onSuccess: () => {
      toast.success("تم تغيير كلمة المرور بنجاح");
      router.push("/auth/login");
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "فشل التغيير");
    },
  });
}
