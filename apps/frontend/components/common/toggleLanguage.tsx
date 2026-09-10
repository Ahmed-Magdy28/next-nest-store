"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "../../i18n/routing";

export function LanguageSwitcher({
  currentLang,
}: {
  currentLang?: "ar" | "en";
} = {}) {
  const activeLocale = useLocale();
  const locale = currentLang || (activeLocale as "ar" | "en");
  const router = useRouter();
  const pathname = usePathname();

  const toggleLanguage = () => {
    const nextLocale = locale === "ar" ? "en" : "ar";
    router.replace(pathname, { locale: nextLocale });
  };

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center gap-1 px-3 py-1.5 text-sm font-semibold rounded-lg border border-gray-200 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-800 transition cursor-pointer"
    >
      {locale === "ar" ? "English" : "العربية"}
    </button>
  );
}
