import { defineRouting } from "next-intl/routing";
import { createNavigation } from "next-intl/navigation";
import { defaultLocaleForWebsite } from "@repo/shared/constants/shop.constants";

const defaultLocale =
  process.env.DEFAULT_LOCALE === "ar" ||
  process.env.NEXT_PUBLIC_DEFAULT_LOCALE === "ar"
    ? "ar"
    : process.env.DEFAULT_LOCALE === "en" ||
        process.env.NEXT_PUBLIC_DEFAULT_LOCALE === "en"
      ? "en"
      : defaultLocaleForWebsite;

export const routing = defineRouting({
  locales: ["ar", "en"],
  defaultLocale,
  localePrefix: "as-needed",
});

export const { Link, redirect, usePathname, useRouter } =
  createNavigation(routing);
