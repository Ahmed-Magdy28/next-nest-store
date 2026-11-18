import type { CategoryBlueprint } from "./blueprint.types";

/** Additional gaming and electronics category blueprints. */
export const gamingElecNewBlueprints: CategoryBlueprint[] = [
  // ── Gaming (New) ───────────────────────────────────────
  {
    slug: "pc-gaming",
    parentSlug: "gaming",
    categoryType: "tech",
    minPrice: 89,
    maxPrice: 1899,
    brands: [
      { en: "ASUS ROG", ar: "أسوس روج" },
      { en: "MSI", ar: "إم إس آي" },
      { en: "NVIDIA", ar: "إنفيديا" },
    ],
    models: [
      { en: "GeForce RTX 4070 Ti Super Graphics Card", ar: "كارت شاشة للألعاب RTX 4070 Ti" },
      { en: "ROG Strix Liquid Cooled Gaming Desktop", ar: "جهاز كمبيوتر ألعاب احترافي مبرد بالسائل" },
      { en: "240Hz Fast IPS Esports Gaming Monitor", ar: "شاشة ألعاب سريعة 240 هرتز" },
    ],
  },
  {
    slug: "vr-headsets",
    parentSlug: "gaming",
    categoryType: "tech",
    minPrice: 299,
    maxPrice: 999,
    brands: [
      { en: "Meta", ar: "ميتا" },
      { en: "HTC Vive", ar: "إتش تي سي فايف" },
    ],
    models: [
      { en: "Quest 3 Mixed Reality VR Headset 512GB", ar: "نظارة واقع افتراضي ومختلط 512 جيجابايت" },
      { en: "Vive XR Elite All-in-One Headset", ar: "نظارة واقع افتراضي متكاملة فائقة الدقة" },
    ],
  },

  // ── Electronics (New) ──────────────────────────────────
  {
    slug: "smartwatches",
    parentSlug: "electronics",
    categoryType: "tech",
    minPrice: 99,
    maxPrice: 799,
    brands: [
      { en: "Apple", ar: "أبل" },
      { en: "Samsung", ar: "سامسونج" },
      { en: "Garmin", ar: "جارمن" },
    ],
    models: [
      { en: "Watch Series 10 GPS Titanium", ar: "ساعة ذكية سيريس 10 تيتانيوم" },
      { en: "Galaxy Watch Ultra LTE", ar: "جالاكسي واتش ألترا الرياضية" },
      { en: "Forerunner 965 AMOLED Running Watch", ar: "ساعة جري ذكية بشاشة أموليد" },
    ],
  },
  {
    slug: "networking",
    parentSlug: "electronics",
    categoryType: "tech",
    minPrice: 49,
    maxPrice: 499,
    brands: [
      { en: "TP-Link", ar: "تي بي لينك" },
      { en: "ASUS", ar: "أسوس" },
      { en: "Netgear", ar: "نت جير" },
    ],
    models: [
      { en: "Wi-Fi 7 Tri-Band Mesh Router System", ar: "نظام راوتر ميش واي فاي 7 ثلاثي النطاق" },
      { en: "AX6000 Dual-Band Gaming Router", ar: "راوتر ألعاب فائق السرعة AX6000" },
    ],
  },

];
