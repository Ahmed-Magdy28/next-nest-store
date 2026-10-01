import createNextIntlPlugin from "next-intl/plugin";
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

let defaultLocale =
  process.env.DEFAULT_LOCALE ||
  process.env.NEXT_PUBLIC_DEFAULT_LOCALE ||
  "en";

let shippingCost = process.env.SHIPPING_COST || "5";
let shippingFreeThreshold = process.env.SHIPPING_FREE_THRESHOLD || "100";
let taxRateInPercentage =
  process.env.TAX_RATE_IN_PERCENTAGE || process.env.TAX_RATE || "12";

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
      const mShip = content.match(/^SHIPPING_COST=["']?([^"'\r\n]+)["']?/m);
      if (mShip && mShip[1]) {
        shippingCost = mShip[1];
      }
      const mFree = content.match(
        /^SHIPPING_FREE_THRESHOLD=["']?([^"'\r\n]+)["']?/m,
      );
      if (mFree && mFree[1]) {
        shippingFreeThreshold = mFree[1];
      }
      const mTax = content.match(
        /^(?:TAX_RATE_IN_PERCENTAGE|TAX_RATE)=["']?([^"'\r\n]+)["']?/m,
      );
      if (mTax && mTax[1]) {
        taxRateInPercentage = mTax[1];
      }
    }
  }
} catch {
  // fallback
}

process.env.DEFAULT_LOCALE = defaultLocale;
process.env.NEXT_PUBLIC_DEFAULT_LOCALE = defaultLocale;

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone", // ← مطلوب للـ deploy
  env: {
    DEFAULT_LOCALE: defaultLocale,
    NEXT_PUBLIC_DEFAULT_LOCALE: defaultLocale,
    NEXT_PUBLIC_SHIPPING_COST: shippingCost,
    NEXT_PUBLIC_SHIPPING_FREE_THRESHOLD: shippingFreeThreshold,
    NEXT_PUBLIC_TAX_RATE_IN_PERCENTAGE: taxRateInPercentage,
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "picsum.photos" },
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "*.vercel.app" },
    ],
  },
};

export default withNextIntl(nextConfig);
