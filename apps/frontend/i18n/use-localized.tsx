"use client";

import { useLocale } from "next-intl";
import type { ReactNode } from "react";

type Locale = "ar" | "en";

// ─────────────────────────────────────────────────────────
//  Pure function
// ─────────────────────────────────────────────────────────

/**
 * يرجع القيمة المناسبة حسب اللغة.
 *
 * @example
 *   localized(product, "name", "ar")           // "ماك بوك"
 *   localized(product, "description", "ar")    // "وصف..."
 */
export function localized<T extends object>(
  obj: T | null | undefined,
  key: string,
  locale: Locale,
): string {
  if (!obj) return "";

  // name → arName  |  description → arDescription
  const arKey = `ar${key.charAt(0).toUpperCase()}${key.slice(1)}`;

  const enValue = (obj as Record<string, unknown>)[key];
  const arValue = (obj as Record<string, unknown>)[arKey];

  if (locale === "ar") {
    if (typeof arValue === "string" && arValue.trim() !== "") {
      return arValue;
    }
  }

  return typeof enValue === "string" ? enValue : "";
}

// ─────────────────────────────────────────────────────────
//  React Hook
// ─────────────────────────────────────────────────────────

export function useLocalized() {
  const locale = useLocale() as Locale;

  /**
   * يختار القيمة المناسبة حسب اللغة الحالية.
   */
  const t = <T extends object>(
    obj: T | null | undefined,
    key: string = "name",
  ): string => localized(obj, key, locale);

  return {
    t,
    locale,
    isArabic: locale === "ar",
  };
}

// ─────────────────────────────────────────────────────────
//  <Localized> Component
// ─────────────────────────────────────────────────────────

interface LocalizedProps<T extends object> {
  of: T | null | undefined;
  field?: string;
  fallback?: ReactNode;
}

/**
 * @example
 *   <Localized of={product} />
 *   <Localized of={product} field="description" />
 *   <Localized of={category} fallback="—" />
 */
export function Localized<T extends object>({
  of,
  field = "name",
  fallback = null,
}: LocalizedProps<T>) {
  const { t } = useLocalized();
  const value = t(of, field);

  if (!value) return <>{fallback}</>;
  return <>{value}</>;
}
