import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

let defaultLocale =
  process.env.DEFAULT_LOCALE ||
  process.env.NEXT_PUBLIC_DEFAULT_LOCALE ||
  "en";

let adminSiteTitle =
  process.env.ADMIN_SITE_TITLE ||
  process.env.NEXT_PUBLIC_ADMIN_SITE_TITLE ||
  "Admin Dashboard";

try {
  const candidatePaths = [
    resolve(process.cwd(), "../../.env"),
    resolve(process.cwd(), ".env"),
  ];
  for (const envPath of candidatePaths) {
    if (existsSync(envPath)) {
      const content = readFileSync(envPath, "utf8");
      const mLocale = content.match(/^DEFAULT_LOCALE=["']?([a-zA-Z]+)["']?/m);
      if (mLocale && mLocale[1]) {
        defaultLocale = mLocale[1];
      }
      const mTitle = content.match(/^ADMIN_SITE_TITLE=["']?([^"'\r\n]+)["']?/m);
      if (mTitle && mTitle[1]) {
        adminSiteTitle = mTitle[1];
      }
      if (mLocale && mTitle) {
        break;
      }
    }
  }
} catch {
  // fallback
}

process.env.DEFAULT_LOCALE = defaultLocale;
process.env.NEXT_PUBLIC_DEFAULT_LOCALE = defaultLocale;
process.env.ADMIN_SITE_TITLE = adminSiteTitle;
process.env.NEXT_PUBLIC_ADMIN_SITE_TITLE = adminSiteTitle;

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const nextConfig: NextConfig = {
  output: "standalone",
  env: {
    DEFAULT_LOCALE: defaultLocale,
    NEXT_PUBLIC_DEFAULT_LOCALE: defaultLocale,
    ADMIN_SITE_TITLE: adminSiteTitle,
    NEXT_PUBLIC_ADMIN_SITE_TITLE: adminSiteTitle,
  },
};

export default withNextIntl(nextConfig);
