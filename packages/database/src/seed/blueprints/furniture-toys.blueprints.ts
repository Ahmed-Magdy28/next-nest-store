import type { CategoryBlueprint } from "./blueprint.types";

/** Furniture, home decor, and toys & baby category blueprints. */
export const furnitureToysBlueprints: CategoryBlueprint[] = [
  // ── Furniture & Home Decor ─────────────────────────────
  {
    slug: "office-furniture",
    parentSlug: "furniture-decor",
    categoryType: "appliance",
    minPrice: 129,
    maxPrice: 699,
    brands: [
      { en: "Herman Miller", ar: "هيرمان ميلر" },
      { en: "IKEA", ar: "إيكيا" },
      { en: "FlexiSpot", ar: "فليكسي سبوت" },
    ],
    models: [
      { en: "Ergonomic Mesh Executive Office Chair", ar: "كرسي مكتب طبي شبكي مريح للظهر" },
      { en: "Motorized Standing Desk 160x80cm", ar: "مكتب كهربائي قابل لتعديل الارتفاع" },
    ],
  },
  {
    slug: "lighting",
    parentSlug: "furniture-decor",
    categoryType: "tech",
    minPrice: 24,
    maxPrice: 189,
    brands: [
      { en: "Philips Hue", ar: "فيليبس هيو" },
      { en: "Govee", ar: "جوفي" },
    ],
    models: [
      { en: "Smart RGBIC Floor Corner Lamp", ar: "مصباح أرضي ذكي بإضاءة ملونة" },
      { en: "Matter Smart LED Lightstrip 5m", ar: "شريط إضاءة LED ذكي 5 أمتار" },
    ],
  },
  {
    slug: "bedding",
    parentSlug: "furniture-decor",
    categoryType: "clothing",
    minPrice: 35,
    maxPrice: 349,
    brands: [
      { en: "Brooklinen", ar: "بروكلينن" },
      { en: "Casper", ar: "كاسبر" },
    ],
    models: [
      { en: "100% Egyptian Cotton 4-Piece Sheet Set", ar: "طقم ملاءات قطن مصري 4 قطع" },
      { en: "Cooling Memory Foam Ergonomic Pillow", ar: "وسادة ميموري فوم طبية مبردة" },
    ],
  },
  {
    slug: "home-decor",
    parentSlug: "furniture-decor",
    categoryType: "appliance",
    minPrice: 20,
    maxPrice: 199,
    brands: [
      { en: "Umbra", ar: "أومبرا" },
      { en: "West Elm", ar: "ويست إلم" },
    ],
    models: [
      { en: "Minimalist Framed Abstract Canvas Set", ar: "طقم لوحات جدارية عصرية مؤطرة" },
      { en: "Handcrafted Ceramic Vase Collection", ar: "مجموعة مزهريات سيراميك يدوية" },
    ],
  },

  // ── Toys & Baby ────────────────────────────────────────
  {
    slug: "board-games",
    parentSlug: "toys-baby",
    categoryType: "book",
    minPrice: 18,
    maxPrice: 89,
    brands: [
      { en: "Hasbro", ar: "هاسبرو" },
      { en: "Catan Studio", ar: "كاتان" },
    ],
    models: [
      { en: "Settlers of Catan Strategy Board Game", ar: "لعبة كاتان الاستراتيجية اللوحية" },
      { en: "1000-Piece Panoramic World Map Puzzle", ar: "لغز خريطة العالم 1000 قطعة" },
    ],
  },
  {
    slug: "action-figures",
    parentSlug: "toys-baby",
    categoryType: "appliance",
    minPrice: 19,
    maxPrice: 179,
    brands: [
      { en: "LEGO", ar: "ليجو" },
      { en: "Bandai", ar: "بانداي" },
    ],
    models: [
      { en: "Technic Super Car Building Block Set", ar: "مجموعة تركيب سيارة رياضية 1500 قطعة" },
      { en: "Collector's Articulated Mecha Figure", ar: "مجسم روبوت قابل للحركة لهواة الجمع" },
    ],
  },
  {
    slug: "baby-gear",
    parentSlug: "toys-baby",
    categoryType: "appliance",
    minPrice: 49,
    maxPrice: 499,
    brands: [
      { en: "Chicco", ar: "شيكو" },
      { en: "Graco", ar: "جراكو" },
    ],
    models: [
      { en: "Compact Fold Lightweight Travel Stroller", ar: "عربة أطفال خفيفة قابلة للطي للسفر" },
      { en: "360-Degree Isofix Convertible Car Seat", ar: "مقعد سيارة للأطفال دوار 360 درجة" },
];
