import type { CategoryBlueprint } from "./blueprint.types";

/** Electronics category blueprints. */
export const electronicsBlueprints: CategoryBlueprint[] = [
  // ── Electronics ────────────────────────────────────────
  {
    slug: "laptops",
    parentSlug: "electronics",
    categoryType: "tech",
    minPrice: 499,
    maxPrice: 2299,
    brands: [
      { en: "ASUS", ar: "أسوس" },
      { en: "Lenovo", ar: "لينوفو" },
      { en: "HP", ar: "إتش بي" },
      { en: "Dell", ar: "ديل" },
      { en: "Acer", ar: "إيسر" },
    ],
    models: [
      { en: "ROG Zephyrus G14 Gaming Laptop", ar: "لابتوب ألعاب روج زيفيروس 14 بوصة" },
      { en: "ThinkPad X1 Carbon Gen 11 Ultrabook", ar: "لابتوب ثينك باد إكس 1 كاربون خفيف ونحيف" },
      { en: "Spectre x360 2-in-1 Touch Convertible", ar: "لابتوب سبكتر 360 متعدد الاستخدامات يعمل باللمس" },
      { en: "Predator Helios 16 High-Performance", ar: "لابتوب بريداتور هليوس 16 عالي الأداء" },
    ],
  },
  {
    slug: "smartphones",
    parentSlug: "electronics",
    categoryType: "tech",
    minPrice: 299,
    maxPrice: 1399,
    brands: [
      { en: "Samsung", ar: "سامسونج" },
      { en: "Google", ar: "جوجل" },
      { en: "Xiaomi", ar: "شاومي" },
      { en: "OnePlus", ar: "وان بلس" },
    ],
    models: [
      { en: "Galaxy S24 Ultra 5G AI Phone", ar: "هاتف جالاكسي إس 24 ألترا يدعم الذكاء الاصطناعي" },
      { en: "Pixel 9 Pro Super Actua Display", ar: "هاتف بكسل 9 برو مع كاميرا احترافية فائقة" },
      { en: "14 Ultra Leica Quad Camera", ar: "هاتف شاومي 14 ألترا بعدسات لايكا الرباعية" },
      { en: "OnePlus 12 Snapdragon 8 Gen 3", ar: "هاتف وان بلس 12 بمعالج قوي وشحن فائق السرعة" },
    ],
  },
  {
    slug: "tvs-monitors",
    parentSlug: "electronics",
    categoryType: "tech",
    minPrice: 199,
    maxPrice: 1899,
    brands: [
      { en: "LG", ar: "إل جي" },
      { en: "Samsung", ar: "سامسونج" },
      { en: "Sony", ar: "سوني" },
      { en: "BenQ", ar: "بينكيو" },
    ],
    models: [
      { en: "OLED evo C3 55-inch 4K Smart TV", ar: "شاشة أوليد ذكية 55 بوصة بدقة 4K ومعدل 120 هرتز" },
      { en: "Odyssey OLED G9 49-inch Curved Monitor", ar: "شاشة ألعاب منحنية عريضة أوديسي 49 بوصة" },
      { en: "Bravia XR 65-inch Full Array LED", ar: "تلفزيون برافيا ذكي 65 بوصة بمعالج إكس آر" },
      { en: "MOBIUZ 27-inch 165Hz QHD Gaming Monitor", ar: "شاشة ألعاب 27 بوصة عالية السرعة 165 هرتز" },
    ],
  },
  {
    slug: "tablets",
    parentSlug: "electronics",
    categoryType: "tech",
    minPrice: 149,
    maxPrice: 1099,
    brands: [
      { en: "Samsung", ar: "سامسونج" },
      { en: "Apple", ar: "آبل" },
      { en: "Lenovo", ar: "لينوفو" },
      { en: "Xiaomi", ar: "شاومي" },
    ],
    models: [
      { en: "Galaxy Tab S9 FE with S-Pen Included", ar: "تابلت جالاكسي تاب إس 9 إف إي مع قلم ذكي" },
      { en: "Pad 6 Pro 11-inch 144Hz Tablet", ar: "تابلت شاومي باد 6 برو بشاشة سلسة 144 هرتز" },
      { en: "Tab P12 Matte 12.7-inch Large Screen", ar: "تابلت لينوفو بي 12 شاشة كبيرة غير لامعة للقراءة" },
    ],
  },
  {
    slug: "headphones",
    parentSlug: "electronics",
    categoryType: "tech",
    minPrice: 39,
    maxPrice: 399,
    brands: [
      { en: "Sony", ar: "سوني" },
      { en: "Bose", ar: "بوز" },
      { en: "Sennheiser", ar: "سنهايزر" },
      { en: "JBL", ar: "جي بي إل" },
      { en: "Anker Soundcore", ar: "أنكر ساوندكور" },
    ],
    models: [
      { en: "WH-1000XM5 Noise Canceling Headphones", ar: "سماعات رأس لاسلكية عازلة للضوضاء دبليو إتش 1000" },
      { en: "QuietComfort Ultra Spatial Audio Earbuds", ar: "سماعات أذن كوايت كومفورت مع صوت مكاني مميز" },
      { en: "Momentum 4 Wireless Audiophile Headset", ar: "سماعات مومنتوم 4 اللاسلكية ببطارية تدوم 60 ساعة" },
      { en: "Space One Active Noise Cancelling", ar: "سماعات سبيس ون بعزل صوتي نقي وتصميم مريح" },
    ],
  },
  {
    slug: "cameras",
    parentSlug: "electronics",
    categoryType: "tech",
    minPrice: 299,
    maxPrice: 2499,
    brands: [
      { en: "Sony", ar: "سوني" },
      { en: "Canon", ar: "كانون" },
      { en: "Fujifilm", ar: "فوجي فيلم" },
      { en: "DJI", ar: "دي جي آي" },
      { en: "GoPro", ar: "جو برو" },
    ],
    models: [
      { en: "Alpha a7 IV Full-Frame Hybrid Camera", ar: "كاميرا ألفا 7 الجيل الرابع بإطار كامل للمحترفين" },
      { en: "EOS R6 Mark II Mirrorless Camera Body", ar: "كاميرا كانون إي أو إس آر 6 ميرورليس المتطورة" },
      { en: "Osmo Pocket 3 4K 120fps Gimbal Camera", ar: "كاميرا جيب أوسمو بوكيت 3 بمثبت ثلاثي المحاور" },
      { en: "HERO12 Black Waterproof Action Cam", ar: "كاميرا الحركة هيرو 12 سوداء مقاومة للماء بدقة 5.3K" },
    ],
  },

];
