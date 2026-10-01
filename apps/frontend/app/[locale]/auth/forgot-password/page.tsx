// apps/frontend/app/[locale]/auth/forgot-password/page.tsx
"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "../../../../i18n/routing";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, ArrowLeft, Loader2, CheckCircle2 } from "lucide-react";

import { forgotPasswordSchema } from "@repo/shared/schemas/auth";
import type { ForgotPasswordDto } from "@repo/shared/dtos/auth";

import { useForgotPassword } from "../../../../hooks/use-auth";

export default function ForgotPasswordPage() {
  const t = useTranslations("Auth");
  const forgot = useForgotPassword();
  const [sent, setSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordDto>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (data: ForgotPasswordDto) => {
    await forgot.mutateAsync(data, {
      onSuccess: () => setSent(true),
    });
  };

  return (
    <div className="flex min-h-[80vh] w-full items-center justify-center bg-slate-50 p-4 dark:bg-gray-950">
      <div className="w-full max-w-sm space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-md dark:border-gray-800 dark:bg-gray-900">
        <Link
          href="/auth/login"
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-900 dark:text-gray-400 dark:hover:text-white"
        >
          <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
          <span>{t("backToLogin")}</span>
        </Link>

        {sent ? (
          <div className="space-y-4 text-center">
            <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-500" />
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">
              {t("checkEmail")}
            </h1>
            <p className="text-sm text-slate-500 dark:text-gray-400">
              {t("checkEmailDesc")}
            </p>
          </div>
        ) : (
          <>
            <div className="space-y-1">
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                {t("forgotPassword")}
              </h1>
              <p className="text-sm text-slate-500 dark:text-gray-400">
                {t("forgotPasswordDesc")}
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
                  <p className="text-xs text-rose-600">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={forgot.isPending}
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700 disabled:opacity-60 cursor-pointer"
              >
                {forgot.isPending && (
                  <Loader2 className="h-4 w-4 animate-spin" />
                )}
                <span>
                  {forgot.isPending ? t("sending") : t("sendResetLink")}
                </span>
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
