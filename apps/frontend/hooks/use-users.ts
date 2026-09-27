"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import type {
  UpdateMeDto,
  UpdateUsernameDto,
  UpdateEmailDto,
} from "@repo/shared/dtos/users";
import type { ChangePasswordDto } from "@repo/shared/dtos/auth";

import { queryKeys } from "../lib/api/e-commerce/query-keys";
import { useAuthStore } from "../lib/stores/auth-store";
import { usersApi } from "../lib/api/users/users";

export function useProfile() {
  return useQuery({
    queryKey: queryKeys.profile,
    queryFn: usersApi.me,
    staleTime: 1000 * 60 * 5,
  });
}

export function useUpdateProfile() {
  const qc = useQueryClient();
  const setUser = useAuthStore((s) => s.setUser);

  return useMutation({
    mutationFn: (body: UpdateMeDto) => usersApi.updateMe(body),
    onSuccess: (data) => {
      qc.setQueryData(queryKeys.profile, data.user);
      qc.setQueryData(queryKeys.me, data.user);
      setUser(data.user as any);
      if (data.verificationToken) {
        toast.info("Check console for verification token (dev only)");
        console.info("Verification token:", data.verificationToken);
      }
      toast.success("Profile updated");
    },
    onError: (e) =>
      toast.error(e instanceof Error ? e.message : "Update failed"),
  });
}

export function useUpdateUsername() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: UpdateUsernameDto) => usersApi.updateUsername(body),
    onSuccess: (data) => {
      qc.setQueryData(queryKeys.profile, data.user);
      qc.setQueryData(queryKeys.me, data.user);
      toast.success("Username updated");
    },
    onError: (e) =>
      toast.error(e instanceof Error ? e.message : "Update failed"),
  });
}

export function useRequestEmailChange() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: UpdateEmailDto) => usersApi.requestEmailChange(body),
    onSuccess: (data) => {
      qc.setQueryData(queryKeys.profile, data.user);
      if (data.verificationToken) {
        toast.info("Verification token logged to console (dev)");
        console.info("Verification token:", data.verificationToken);
      }
      toast.success("Verification email sent");
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Failed"),
  });
}

export function useChangePassword() {
  const router = useRouter();
  return useMutation({
    mutationFn: (body: ChangePasswordDto) => usersApi.changePassword(body),
    onSuccess: () => {
      toast.success("Password changed. Please log in again.");
      // الباك اند بيلغي كل الجلسات
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      useAuthStore.getState().clear();
      router.push("/auth/login");
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Failed"),
  });
}
