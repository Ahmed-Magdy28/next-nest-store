import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  if (
    !locale ||
    !routing.locales.includes(locale as (typeof routing.locales)[number])
  ) {
    locale = routing.defaultLocale;
  }

  const messages = await loadMessages(locale);

  return {
    locale,
    messages,
  };
});

/**
 * كل ملف JSON لازم يكون عنده root key واحد فقط:
 *   messages/{locale}/home.json  →  { "Home": { ... } }
 *   messages/{locale}/header.json → { "Header": {...}, "Nav": {...} }
 *
 * التحميل بيتم بشكل متسلسل عشان نضمن ترتيب ثابت ونمنع overwrites.
 */
const MESSAGE_FILES = [
  "common",
  "validation",
  "header",
  "footer",
  "home",
  "products",
  "categories",
  "cart",
  "wishlist",
  "auth",
  "account",
] as const;

async function loadMessages(locale: string) {
  const merged: Record<string, unknown> = {};

  // ⚠️ sequential load for deterministic order
  for (const file of MESSAGE_FILES) {
    try {
      const mod = await import(`../messages/${locale}/${file}.json`);
      const content = (mod.default ?? mod) as Record<string, unknown>;

      // لو الملف فاضي، تجاهله
      if (!content || Object.keys(content).length === 0) continue;

      Object.assign(merged, content);
    } catch {
      // في dev، خليها warning. في prod ممكن تخليها error.
      if (process.env.NODE_ENV !== "production") {
        console.warn(`[i18n] Missing: messages/${locale}/${file}.json`);
      }
    }
  }

  return merged;
}
