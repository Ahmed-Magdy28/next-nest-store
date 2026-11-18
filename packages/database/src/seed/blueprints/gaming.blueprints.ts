import type { CategoryBlueprint } from "./blueprint.types";

/** Gaming category blueprints. */
export const gamingBlueprints: CategoryBlueprint[] = [
  // ── Gaming ─────────────────────────────────────────────
  {
    slug: "playstation-5",
    parentSlug: "gaming",
    categoryType: "tech",
    minPrice: 49,
    maxPrice: 599,
    brands: [
      { en: "Sony", ar: "سوني" },
      { en: "PlayStation", ar: "بلايستيشن" },
      { en: "Razer", ar: "رايزر" },
      { en: "SteelSeries", ar: "ستيل سيريز" },
    ],
    models: [
      { en: "DualSense Edge Wireless Controller", ar: "يد تحكم لاسلكية دوال سينس إيدج" },
      { en: "Pulse Elite Wireless Headset", ar: "سماعة رأس لاسلكية بلس إليت" },
      { en: "PlayStation VR2 Horizon Bundle", ar: "نظارة الواقع الافتراضي بلايستيشن في آر 2" },
      { en: "M.2 NVMe SSD 2TB Heatsink", ar: "وحدة تخزين إم 2 سريعة 2 تيرابايت مع مشتت" },
    ],
  },
  {
    slug: "playstation-4",
    parentSlug: "gaming",
    categoryType: "tech",
    minPrice: 25,
    maxPrice: 299,
    brands: [
      { en: "Sony", ar: "سوني" },
      { en: "HORI", ar: "هوري" },
      { en: "Nacon", ar: "ناكون" },
    ],
    models: [
      { en: "DualShock 4 V2 Midnight Black", ar: "يد تحكم دوال شوك 4 الإصدار الثاني" },
      { en: "Dual Charging Dock Station", ar: "قاعدة شحن مزدوجة لوحدات التحكم" },
      { en: "Fighting Commander Arcade Pad", ar: "لوحة تحكم احترافية لألعاب القتال" },
    ],
  },
  {
    slug: "xbox-series",
    parentSlug: "gaming",
    categoryType: "tech",
    minPrice: 59,
    maxPrice: 499,
    brands: [
      { en: "Microsoft", ar: "مايكروسوفت" },
      { en: "Seagate", ar: "سيجيت" },
      { en: "Turtle Beach", ar: "تيرتل بيتش" },
    ],
    models: [
      { en: "Xbox Elite Series 2 Controller Core", ar: "يد تحكم إكس بوكس إليت سيريس 2 كور" },
      { en: "Storage Expansion Card 1TB NVMe", ar: "بطاقة توسعة التخزين 1 تيرابايت" },
      { en: "Stealth 600 Gen 2 MAX Headset", ar: "سماعة ألعاب ستيلث 600 اللاسلكية" },
      { en: "Wireless Controller Pulse Red", ar: "ذراع تحكم لاسلكي باللون الأحمر" },
    ],
  },
  {
    slug: "xbox-one",
    parentSlug: "gaming",
    categoryType: "tech",
    minPrice: 20,
    maxPrice: 199,
    brands: [
      { en: "Microsoft", ar: "مايكروسوفت" },
      { en: "PowerA", ar: "باور إيه" },
    ],
    models: [
      { en: "Enhanced Wired Gaming Controller", ar: "يد تحكم سلكية متطورة مع أزرار خلفية" },
      { en: "Play & Charge Battery Kit", ar: "طقم بطارية شحن ولعب سريع" },
      { en: "Stereo Chat Headset", ar: "سماعة محادثة ستيريو خفيفة" },
    ],
  },
  {
    slug: "nintendo-switch",
    parentSlug: "gaming",
    categoryType: "tech",
    minPrice: 19,
    maxPrice: 349,
    brands: [
      { en: "Nintendo", ar: "نينتندو" },
      { en: "SanDisk", ar: "سان ديسك" },
      { en: "8BitDo", ar: "إيت بيت دو" },
    ],
    models: [
      { en: "Joy-Con Pair Neon Purple & Orange", ar: "زوج أذرع جوي كون نيون بنفسجي وبرتقالي" },
      { en: "Pro Controller Wireless Gamepad", ar: "يد تحكم نينتندو برو اللاسلكية" },
      { en: "Ultimate Bluetooth Controller with Dock", ar: "ذراع تحكم بلوتوث ألتميت مع منصة شحن" },
      { en: "MicroSDXC 512GB Apex Legends Edition", ar: "بطاقة ذاكرة مايكرو 512 جيجابايت سريعة" },
    ],
  },
  {
    slug: "gaming-accessories",
    parentSlug: "gaming",
    categoryType: "tech",
    minPrice: 29,
    maxPrice: 249,
    brands: [
      { en: "Logitech G", ar: "لوجيتك جي" },
      { en: "Corsair", ar: "كورسير" },
      { en: "HyperX", ar: "هايبر إكس" },
      { en: "Elgato", ar: "إلجاتو" },
    ],
    models: [
      { en: "PRO X SUPERLIGHT Wireless Gaming Mouse", ar: "ماوس ألعاب لاسلكي خفيف فائق السرعة" },
      { en: "K70 RGB PRO Mechanical Keyboard", ar: "كيبورد ميكانيكي مضيء بإضاءة آر جي بي" },
      { en: "Cloud III Wireless Surround Headset", ar: "سماعة كلاود 3 اللاسلكية بنظام صوت محيطي" },
      { en: "Stream Deck MK.2 Production Console", ar: "جهاز التحكم بالبث ستريم دك 15 مفتاح" },
    ],
  },

];
