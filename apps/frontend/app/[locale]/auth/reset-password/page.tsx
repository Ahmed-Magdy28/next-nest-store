"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Lock, Loader2 } from "lucide-react";
import { z } from "zod";

import { passwordSchema } from "@repo/shared/schemas/common";
import type { ResetPasswordDto } from "@repo/shared/dtos/auth";

import { useResetPassword } from "../../../../hooks/use-auth";

// token بيجي من URL، فبنبنيه لوحده
const resetFormSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords don't match",
  });

type ResetFormValues = z.infer<typeof resetFormSchema>;

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const reset = useResetPassword();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetFormValues>({
    resolver: zodResolver(resetFormSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  const onSubmit = async (data: ResetFormValues) => {
    const body: ResetPasswordDto = { token, password: data.password };
    await reset.mutateAsync(body);
  };

  if (!token) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center">
        <p className="text-sm text-rose-600">Invalid or missing reset token.</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-[80vh] w-full items-center justify-center bg-slate-50 p-4 dark:bg-gray-950">
      <div className="w-full max-w-sm space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-md dark:border-gray-800 dark:bg-gray-900">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Reset password
          </h1>
          <p className="text-sm text-slate-500 dark:text-gray-400">
            Enter your new password below.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-gray-300">
              New password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                {...register("password")}
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-10 pr-10 text-sm text-slate-900 transition-all focus:border-transparent focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 dark:border-gray-800 dark:bg-gray-950 dark:text-white"
              />
              <button
                type="button"
                onClick={() => setShowPassword((p) => !p)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-xs text-rose-600">{errors.password.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-gray-300">
              Confirm password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                {...register("confirmPassword")}
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-10 pr-4 text-sm text-slate-900 transition-all focus:border-transparent focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 dark:border-gray-800 dark:bg-gray-950 dark:text-white"
              />
            </div>
            {errors.confirmPassword && (
              <p className="text-xs text-rose-600">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={reset.isPending}
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700 disabled:opacity-60"
          >
            {reset.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            {reset.isPending ? "Resetting..." : "Reset password"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[80vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      }
    >
      <ResetPasswordContent />
    </Suspense>
  );
}
