import { defineRouting } from "next-intl/routing";
import { createNavigation } from "next-intl/navigation";

const defaultLocale =
  process.env.DEFAULT_LOCALE === "ar" ||
  process.env.NEXT_PUBLIC_DEFAULT_LOCALE === "ar"
    ? "ar"
    : "en";

export const routing = defineRouting({
  locales: ["ar", "en"],
  defaultLocale,
  localePrefix: "as-needed",
});

export const { Link, redirect, usePathname, useRouter } =
  createNavigation(routing);
