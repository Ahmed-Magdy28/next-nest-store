"use client";

import { useLocale, useTranslations } from "next-intl";
import { useRouter, usePathname } from "../i18n/routing";
import { Globe } from "lucide-react";

export function LocaleSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations("Common");

  const toggleLocale = () => {
    const nextLocale = locale === "ar" ? "en" : "ar";
    router.replace(pathname, { locale: nextLocale });
  };

  return (
    <button
      type="button"
      onClick={toggleLocale}
      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-xs font-medium cursor-pointer"
      title="Switch Language"
    >
      <Globe className="w-3.5 h-3.5 text-slate-500" />
      <span>{locale === "ar" ? t("english") : t("arabic")}</span>
    </button>
  );
}
