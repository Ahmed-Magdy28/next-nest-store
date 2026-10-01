// apps/frontend/app/[locale]/auth/sign-up/page.tsx
"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "../../../../i18n/routing";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Mail, Lock, User, Loader2 } from "lucide-react";

import { registerSchema } from "@repo/shared/schemas/auth";
import type { RegisterDto } from "@repo/shared/dtos/auth";

import { useRegister } from "../../../../hooks/use-auth";

export default function SignUpPage() {
  const t = useTranslations("Auth");
  const router = useRouter();
  const registerMutation = useRegister();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterDto>({
    resolver: zodResolver(registerSchema),
    defaultValues: { username: "", email: "", password: "" },
  });

  const onSubmit = async (data: RegisterDto) => {
    await registerMutation.mutateAsync(data, {
      onSuccess: () => router.push("/"),
    });
  };

  return (
    <div className="flex min-h-[80vh] w-full items-center justify-center bg-slate-50 p-4 dark:bg-gray-950">
      <div className="w-full max-w-sm space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-md dark:border-gray-800 dark:bg-gray-900">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            {t("createAccount")}
          </h1>
          <p className="text-sm text-slate-500 dark:text-gray-400">
            {t("createAccountDesc")}
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Username */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-gray-300">
              {t("username")}
            </label>
            <div className="relative">
              <User className="absolute start-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                {...register("username")}
                type="text"
                placeholder={t("usernamePlaceholder")}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 ps-10 pe-4 text-sm text-slate-900 transition-all focus:border-transparent focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 dark:border-gray-800 dark:bg-gray-950 dark:text-white"
              />
            </div>
            {errors.username && (
              <p className="text-xs text-rose-600">{errors.username.message}</p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-gray-300">
              {t("email")}
            </label>
            <div className="relative">
              <Mail className="absolute start-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                {...register("email")}
                type="email"
                placeholder={t("emailPlaceholder")}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 ps-10 pe-4 text-sm text-slate-900 transition-all focus:border-transparent focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 dark:border-gray-800 dark:bg-gray-950 dark:text-white"
              />
            </div>
            {errors.email && (
              <p className="text-xs text-rose-600">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-gray-300">
              {t("password")}
            </label>
            <div className="relative">
              <Lock className="absolute start-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                {...register("password")}
                type={showPassword ? "text" : "password"}
                placeholder={t("passwordPlaceholder")}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 ps-10 pe-10 text-sm text-slate-900 transition-all focus:border-transparent focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 dark:border-gray-800 dark:bg-gray-950 dark:text-white"
              />
              <button
                type="button"
                onClick={() => setShowPassword((p) => !p)}
                className="absolute end-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
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

          <button
            type="submit"
            disabled={registerMutation.isPending}
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700 disabled:opacity-60 cursor-pointer"
          >
            {registerMutation.isPending && (
              <Loader2 className="h-4 w-4 animate-spin" />
            )}
            <span>
              {registerMutation.isPending ? t("creatingAccount") : t("signUp")}
            </span>
          </button>
        </form>

        <p className="text-center text-sm text-slate-500 dark:text-gray-400">
          <Link
            href="/auth/login"
            className="font-medium text-blue-600 hover:underline"
          >
            {t("signIn")}
          </Link>
        </p>
      </div>
    </div>
  );
}
