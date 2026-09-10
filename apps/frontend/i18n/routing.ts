import { defineRouting } from "next-intl/routing";
import { createNavigation } from "next-intl/navigation";
import { defaultLocaleForWebsite } from "@repo/shared/constants/shop.constants";

export const routing = defineRouting({
  locales: ["ar", "en"],
  defaultLocale: defaultLocaleForWebsite,
  localePrefix: "as-needed", // يزيل /ar/ من الروابط إذا كانت هي اللغة الافتراضية
});

export const { Link, redirect, usePathname, useRouter } =
  createNavigation(routing);
