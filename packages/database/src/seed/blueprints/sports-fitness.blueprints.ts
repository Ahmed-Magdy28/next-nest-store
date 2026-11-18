import type { CategoryBlueprint } from "./blueprint.types";

/** Sports and fitness category blueprints. */
export const sportsFitnessBlueprints: CategoryBlueprint[] = [
  // ── Sports & Fitness ───────────────────────────────────
  {
    slug: "gym-equipment",
    parentSlug: "sports-fitness",
    categoryType: "appliance",
    minPrice: 39,
    maxPrice: 899,
    brands: [
      { en: "Bowflex", ar: "بوفليكس" },
      { en: "NordicTrack", ar: "نورديك تراك" },
      { en: "Technogym", ar: "تكنوجيم" },
    ],
    models: [
      { en: "SelectTech Adjustable Dumbbell Pair 24kg", ar: "طقم دمبل قابل للتعديل حتى 24 كجم" },
      { en: "Foldable Smart Home Treadmill", ar: "جهاز مشي منزلي ذكي قابل للطي" },
      { en: "Heavy Duty Adjustable Weight Bench", ar: "بنش تمارين رياضية قابل للتعديل" },
    ],
  },
  {
    slug: "sportswear",
    parentSlug: "sports-fitness",
    categoryType: "clothing",
    minPrice: 25,
    maxPrice: 120,
    brands: [
      { en: "Nike", ar: "نايك" },
      { en: "Adidas", ar: "أديداس" },
      { en: "Under Armour", ar: "أندر آرمور" },
    ],
    models: [
      { en: "Dri-FIT Pro Training Compression Tee", ar: "تيشيرت تمارين رياضية طارد للعرق" },
      { en: "Aeroready Woven Track Jacket", ar: "جاكيت رياضي خفيف للتدريب" },
    ],
  },
  {
    slug: "running-shoes",
    parentSlug: "sports-fitness",
    categoryType: "shoes",
    minPrice: 75,
    maxPrice: 240,
    brands: [
      { en: "Nike", ar: "نايك" },
      { en: "ASICS", ar: "أسيكس" },
      { en: "HOKA", ar: "هوكا" },
    ],
    models: [
      { en: "Pegasus 41 Carbon Foam Running Shoe", ar: "حذاء جري مريح بوسادة هوائية متطورة" },
      { en: "Gel-Kayano Stability Marathon Sneaker", ar: "حذاء ماراثون خفيف الوزن" },
    ],
  },
  {
    slug: "bicycles",
    parentSlug: "sports-fitness",
    categoryType: "appliance",
    minPrice: 199,
    maxPrice: 1299,
    brands: [
      { en: "Trek", ar: "تريك" },
      { en: "Xiaomi", ar: "شاومي" },
      { en: "Giant", ar: "جاينت" },
    ],
    models: [
      { en: "Electric Scooter Pro 4 Long Range", ar: "سكوتر كهربائي بعيد المدى" },
      { en: "29er Aluminum Mountain Bike 21-Speed", ar: "دراجة هوائية جبلية 21 سرعة" },
    ],
  },

];
