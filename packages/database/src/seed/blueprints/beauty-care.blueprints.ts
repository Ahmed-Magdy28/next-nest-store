import type { CategoryBlueprint } from "./blueprint.types";

/** Beauty and personal care category blueprints. */
export const beautyCareBlueprints: CategoryBlueprint[] = [
  // ── Beauty & Personal Care ─────────────────────────────
  {
    slug: "skincare",
    parentSlug: "beauty-care",
    categoryType: "appliance",
    minPrice: 15,
    maxPrice: 95,
    brands: [
      { en: "La Roche-Posay", ar: "لاروش بوزيه" },
      { en: "CeraVe", ar: "سيرافي" },
      { en: "The Ordinary", ar: "ذا أورديناري" },
    ],
    models: [
      { en: "Hyaluronic Acid 2% + B5 Hydrating Serum", ar: "سيروم حمض الهيالورونيك المرطب للبشرة" },
      { en: "Daily Moisturizing Facial Cleanser", ar: "غسول وجه مرطب للاستخدام اليومي" },
    ],
  },
  {
    slug: "perfumes",
    parentSlug: "beauty-care",
    categoryType: "appliance",
    minPrice: 45,
    maxPrice: 220,
    brands: [
      { en: "Dior", ar: "ديور" },
      { en: "YSL", ar: "إيف سان لوران" },
      { en: "Lattafa", ar: "لطافة" },
    ],
    models: [
      { en: "Eau de Parfum Intense 100ml", ar: "عطر أو دو بارفان مركز 100 مل" },
      { en: "Oud & Amber Signature Fragrance", ar: "عطر العود والعنبر الفاخر" },
    ],
  },
  {
    slug: "hair-care",
    parentSlug: "beauty-care",
    categoryType: "appliance",
    minPrice: 18,
    maxPrice: 399,
    brands: [
      { en: "Dyson", ar: "دايسون" },
      { en: "Kérastase", ar: "كيراستاس" },
    ],
    models: [
      { en: "Supersonic Ionic Hair Dryer", ar: "مجفف شعر أيوني سريع الاحترافية" },
      { en: "Argan Repair Nourishing Hair Mask", ar: "ماسك مغذي للشعر بزيت الأرجان" },
    ],
  },
  {
    slug: "grooming",
    parentSlug: "beauty-care",
    categoryType: "tech",
    minPrice: 29,
    maxPrice: 249,
    brands: [
      { en: "Philips", ar: "فيليبس" },
      { en: "Braun", ar: "براون" },
    ],
    models: [
      { en: "Series 9 Pro Wet & Dry Electric Shaver", ar: "ماكينة حلاقة كهربائية مقاومة للماء" },
      { en: "All-in-One Precision Beard Trimmer Kit", ar: "طقم تشذيب اللحية والشعر المتكامل" },
    ],
  },

];
