"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "../../../../i18n/routing";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Mail, Lock, Loader2 } from "lucide-react";

import { loginSchema } from "@repo/shared/schemas/auth";
import type { LoginDto } from "@repo/shared/dtos/auth";

import { useLogin } from "../../../../hooks/use-auth";

export default function LoginPage() {
  const t = useTranslations("Auth");
  const router = useRouter();
  const login = useLogin();
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginDto>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  // Pre-fill email if remembered
  useEffect(() => {
    const savedEmail = localStorage.getItem("remembered_email");
    if (savedEmail) {
      setValue("email", savedEmail);
      setRememberMe(true);
    }
  }, [setValue]);

  const onSubmit = async (data: LoginDto) => {
    if (rememberMe) {
      localStorage.setItem("remembered_email", data.email);
    } else {
      localStorage.removeItem("remembered_email");
    }

    await login.mutateAsync(data, {
      onSuccess: () => router.push("/"),
    });
  };

  return (
    <div className="flex min-h-[80vh] w-full items-center justify-center bg-slate-50 p-4 dark:bg-gray-950">
      <div className="w-full max-w-sm space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-md dark:border-gray-800 dark:bg-gray-900">
        {/* Header */}
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            {t("signIn")}
          </h1>
          <p className="text-sm text-slate-500 dark:text-gray-400">
            {t("signInDesc")}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
                className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 ps-10 pe-10 text-sm text-slate-900 transition-all focus:border-transparent focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 dark:border-gray-800 dark:bg-gray-900 dark:text-white"
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

          {/* Remember me & Forgot password */}
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 cursor-pointer select-none text-slate-600 dark:text-gray-300">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800"
              />
              <span>{t("rememberMe")}</span>
            </label>

            <Link
              href="/auth/forgot-password"
              className="font-medium text-blue-600 hover:underline"
            >
              {t("forgotPassword")}
            </Link>
          </div>

          <button
            type="submit"
            disabled={login.isPending}
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700 disabled:opacity-60 cursor-pointer"
          >
            {login.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            <span>{login.isPending ? t("signingIn") : t("signIn")}</span>
          </button>
        </form>

        <p className="text-center text-sm text-slate-500 dark:text-gray-400">
          <Link
            href="/auth/sign-up"
            className="font-medium text-blue-600 hover:underline"
          >
            {t("signUp")}
          </Link>
        </p>
      </div>
    </div>
  );
}
