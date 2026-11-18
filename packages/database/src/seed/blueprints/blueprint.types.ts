/**
 * Blueprint definition for generating Faker products within a category.
 */
export interface CategoryBlueprint {
  slug: string;
  parentSlug?: string;
  categoryType: "clothing" | "tech" | "appliance" | "book" | "shoes";
  minPrice: number;
  maxPrice: number;
  brands: { en: string; ar: string }[];
  models: { en: string; ar: string }[];
}

export const CLOTHING_SIZES = ["S", "M", "L", "XL"] as const;
export const SHOE_SIZES_MEN = ["40", "41", "42", "43", "44"] as const;
export const SHOE_SIZES_WOMEN = ["36", "37", "38", "39", "40"] as const;

export const COLOR_VARIANTS = [
  { en: "Midnight Black", ar: "أسود ليلي", hex: "#111827" },
  { en: "Pure White", ar: "أبيض ناصع", hex: "#FFFFFF" },
  { en: "Navy Blue", ar: "أزرق كحلي", hex: "#1E3A8A" },
  { en: "Heather Gray", ar: "رمادي حجري", hex: "#6B7280" },
  { en: "Forest Green", ar: "أخضر زيتوني", hex: "#065F46" },
] as const;

export const STORAGE_VARIANTS = [
  { en: "128GB Storage", ar: "سعة 128 جيجابايت" },
  { en: "256GB Storage", ar: "سعة 256 جيجابايت" },
  { en: "512GB Storage", ar: "سعة 512 جيجابايت" },
] as const;

export const BOOK_EDITIONS = [
  { en: "Hardcover Edition", ar: "نسخة غلاف فني مقوى" },
  { en: "Paperback Edition", ar: "نسخة غلاف ورقي عادي" },
] as const;

export const EDITION_SUFFIXES = [
  { en: "", ar: "" },
  { en: "Pro Edition", ar: "إصدار برو" },
  { en: "Plus", ar: "بلس" },
  { en: "Max", ar: "ماكس" },
  { en: "Lite", ar: "لايت" },
  { en: "2026 Edition", ar: "إصدار 2026" },
  { en: "Series II", ar: "الجيل الثاني" },
  { en: "Ultra", ar: "ألترا" },
  { en: "Studio", ar: "ستوديو" },
  { en: "Prime", ar: "برايم" },
] as const;
