import type { CategoryBlueprint } from "./blueprint.types";

/** Home appliances category blueprints. */
export const appliancesBlueprints: CategoryBlueprint[] = [
  // ── Home Appliances ────────────────────────────────────
  {
    slug: "refrigerators",
    parentSlug: "home-appliances",
    categoryType: "appliance",
    minPrice: 499,
    maxPrice: 1899,
    brands: [
      { en: "LG", ar: "إل جي" },
      { en: "Samsung", ar: "سامسونج" },
      { en: "Bosch", ar: "بوش" },
    ],
    models: [
      { en: "InstaView French Door Smart Refrigerator", ar: "ثلاجة إنستافيو ذكية 4 أبواب مع موزع ثلج" },
      { en: "Twin Cooling Plus Bottom Freezer Fridge", ar: "ثلاجة بفريزر سفلي ونظام تبريد مزدوج متطور" },
      { en: "Serie 6 NoFrost Stainless Steel Fridge", ar: "ثلاجة بوش ستانلس ستيل مانعة للتجمد موفرة للطاقة" },
    ],
  },
  {
    slug: "washing-machines",
    parentSlug: "home-appliances",
    categoryType: "appliance",
    minPrice: 399,
    maxPrice: 1299,
    brands: [
      { en: "LG", ar: "إل جي" },
      { en: "Samsung", ar: "سامسونج" },
      { en: "Bosch", ar: "بوش" },
    ],
    models: [
      { en: "AI DD Steam Front Load Washer 9KG", ar: "غسالة ملابس ذكية بالبخار حمولة 9 كجم" },
      { en: "EcoBubble QuickDrive Washing Machine 8KG", ar: "غسالة إيكو بابل بتقنية الغسيل السريع الموفر" },
      { en: "Serie 8 Heat Pump Tumble Dryer", ar: "مجفف ملابس بوش بالمضخة الحرارية عالي الكفاءة" },
    ],
  },
  {
    slug: "ovens-stoves",
    parentSlug: "home-appliances",
    categoryType: "appliance",
    minPrice: 299,
    maxPrice: 1499,
    brands: [
      { en: "Bosch", ar: "بوش" },
      { en: "Electrolux", ar: "إلكترولوكس" },
      { en: "Whirlpool", ar: "ويرلبول" },
    ],
    models: [
      { en: "Built-In Convection Electric Wall Oven", ar: "فرن بلت إن كهربائي بتوزيع حراري هوائي" },
      { en: "4-Burner Induction Cooktop with Booster", ar: "مسطح حثي 4 شعلات بتقنية التسخين السريع" },
      { en: "Dual Fuel Freestanding Cooking Range", ar: "بوتاجاز هجين غاز وكهرباء بمقابض تحكم دقيقة" },
    ],
  },
  {
    slug: "food-processors",
    parentSlug: "home-appliances",
    categoryType: "appliance",
    minPrice: 45,
    maxPrice: 350,
    brands: [
      { en: "KitchenAid", ar: "كيتشن إيد" },
      { en: "Braun", ar: "براون" },
      { en: "Philips", ar: "فيلبس" },
      { en: "Kenwood", ar: "كينوود" },
    ],
    models: [
      { en: "MultiQuick 9 Hand Blender and Chopper", ar: "خلاط يدوي براون ملتي كويك مع قطاعة متكاملة" },
      { en: "Classic Stand Mixer with Dough Hook", ar: "عجانة كيتشن إيد الكلاسيكية بوعاء 4.8 لتر" },
      { en: "MultiPro Compact All-in-One Processor", ar: "محضر طعام كينوود الشامل مع ملحقات التقطيع" },
    ],
  },
  {
    slug: "fryers",
    parentSlug: "home-appliances",
    categoryType: "appliance",
    minPrice: 49,
    maxPrice: 220,
    brands: [
      { en: "Ninja", ar: "نينجا" },
      { en: "Philips", ar: "فيلبس" },
      { en: "Cosori", ar: "كوسوري" },
      { en: "Tefal", ar: "تيفال" },
    ],
    models: [
      { en: "Air Fryer XXL DualZone 2-Basket 9.5L", ar: "قلاية هوائية بسلتين منفصلتين سعة 9.5 لتر" },
      { en: "Airfryer Rapid Combi Smart Connected", ar: "قلاية فيليبس الذكية المتصلة بالواي فاي" },
      { en: "TurboBlaze 6.0-Quart Fast Air Fryer", ar: "قلاية كوسوري السريعة بتقنية المحرك الدوار" },
    ],
  },
  {
    slug: "microwaves",
    parentSlug: "home-appliances",
    categoryType: "appliance",
    minPrice: 79,
    maxPrice: 299,
    brands: [
      { en: "Panasonic", ar: "باناسونيك" },
      { en: "LG", ar: "إل جي" },
      { en: "Samsung", ar: "سامسونج" },
    ],
    models: [
      { en: "Inverter Countertop Microwave Oven 32L", ar: "ميكروويف باناسونيك بالإنفرتر الذكي سعة 32 لتر" },
      { en: "NeoChef Smart Inverter Microwave with Grill", ar: "ميكروويف إل جي نيو شيف مع شواية صحية" },
      { en: "Ceramic Enamel Solo Microwave 28L", ar: "ميكروويف سامسونج بتجويف سيراميك مقاوم للخدش" },
    ],
  },
  {
    slug: "dishwashers",
    parentSlug: "home-appliances",
    categoryType: "appliance",
    minPrice: 349,
    maxPrice: 1199,
    brands: [
      { en: "Bosch", ar: "بوش" },
      { en: "Siemens", ar: "سيمنز" },
      { en: "Beko", ar: "بيكو" },
    ],
    models: [
      { en: "Serie 4 SuperSilence Built-in Dishwasher", ar: "غسالة أطباق بوش فائقة الهدوء بثلاثة رفوف" },
      { en: "iQ300 Free-standing Dishwasher 14 Place", ar: "غسالة صحون سيمنز 14 فرد بنظام تجفيف سريع" },
      { en: "HygieneIntense CornerIntense Dishwasher", ar: "غسالة أطباق بيكو بنظام تعقيم حراري متكامل" },
    ],
  },
  {
    slug: "vacuum-cleaners",
    parentSlug: "home-appliances",
    categoryType: "appliance",
    minPrice: 69,
    maxPrice: 899,
    brands: [
      { en: "Dyson", ar: "دايسون" },
      { en: "Roborock", ar: "روبوروك" },
      { en: "Shark", ar: "شارك" },
      { en: "Philips", ar: "فيلبس" },
    ],
    models: [
      { en: "V15 Detect Cordless Vacuum Cleaner", ar: "مكنسة دايسون في 15 اللاسلكية بمستشعر ليزر" },
      { en: "S8 Pro Ultra Robot Vacuum and Mop Dock", ar: "روبوت روبوروك الذكي لكنس ومسح الأرضيات ذاتياً" },
      { en: "Stratis Anti Hair Wrap Pet Stick Vacuum", ar: "مكنسة شارك مانعة لتشابك شعر الحيوانات الأليفة" },
    ],
  },

];
