import { productGallery, productImage, type ProductSeed } from "../helpers.js";

export const gamingProducts: ProductSeed[] = [
  // ═══════════════════════════════════════════════════════
  // PS5 Consoles
  // ═══════════════════════════════════════════════════════
  {
    name: "PlayStation 5 Slim Disc Edition",
    arName: "بلايستيشن 5 سليم نسخة الأقراص",
    slug: "ps5-slim-disc",
    sku: "PS5-SLIM-DISC-001",
    regularPrice: 499.99,
    discountPrice: 479.99,
    onDiscount: true,
    discountType: "FIXED",
    discountValue: 20,
    description:
      "The PlayStation 5 Slim with disc drive. 1TB SSD, 4K gaming, ray tracing, and DualSense controller.",
    arDescription:
      "بلايستيشن 5 سليم مع مشغل أقراص. ذاكرة 1 تيرا، دقة 4K، تتبع الأشعة، ويد تحكم DualSense.",
    mainImage: productImage("ps5-slim-disc"),
    imageGallery: productGallery("ps5-slim-disc", 3),
    isNew: true,
    categorySlugs: ["playstation-5"], // ← سنضيف هذا الحقل
  },
  {
    name: "PlayStation 5 Slim Digital Edition",
    arName: "بلايستيشن 5 سليم النسخة الرقمية",
    slug: "ps5-slim-digital",
    sku: "PS5-SLIM-DIG-001",
    regularPrice: 449.99,
    discountPrice: 449.99,
    description:
      "Digital-only PS5 Slim. Perfect for those who buy games digitally.",
    arDescription: "بلايستيشن 5 سليم النسخة الرقمية للتحميل فقط.",
    mainImage: productImage("ps5-slim-digital"),
    imageGallery: productGallery("ps5-slim-digital", 2),
    isNew: true,
    categorySlugs: ["playstation-5"],
  },
  {
    name: "PlayStation 5 Pro",
    arName: "بلايستيشن 5 برو",
    slug: "ps5-pro",
    sku: "PS5-PRO-001",
    regularPrice: 699.99,
    discountPrice: 699.99,
    description:
      "The most powerful PlayStation yet. 2TB SSD, enhanced ray tracing, and 8K support.",
    arDescription:
      "أقوى جهاز بلايستيشن حتى الآن. ذاكرة 2 تيرا، تتبع أشعة محسّن، ودعم 8K.",
    mainImage: productImage("ps5-pro"),
    imageGallery: productGallery("ps5-pro", 3),
    isNew: true,
    categorySlugs: ["playstation-5"],
  },

  // ═══════════════════════════════════════════════════════
  // PS4 Consoles
  // ═══════════════════════════════════════════════════════
  {
    name: "PlayStation 4 Pro 1TB",
    arName: "بلايستيشن 4 برو 1 تيرا",
    slug: "ps4-pro-1tb",
    sku: "PS4-PRO-001",
    regularPrice: 299.99,
    discountPrice: 279.99,
    onDiscount: true,
    discountType: "FIXED",
    discountValue: 20,
    description: "PS4 Pro with 1TB storage. 4K HDR gaming support.",
    arDescription: "بلايستيشن 4 برو بذاكرة 1 تيرا. دعم 4K HDR.",
    mainImage: productImage("ps4-pro"),
    imageGallery: productGallery("ps4-pro", 2),
    categorySlugs: ["playstation-4"],
  },
  {
    name: "PlayStation 4 Slim 500GB",
    arName: "بلايستيشن 4 سليم 500 جيجا",
    slug: "ps4-slim-500gb",
    sku: "PS4-SLIM-001",
    regularPrice: 199.99,
    discountPrice: 199.99,
    description: "PS4 Slim with 500GB storage.",
    arDescription: "بلايستيشن 4 سليم بذاكرة 500 جيجا.",
    mainImage: productImage("ps4-slim"),
    imageGallery: productGallery("ps4-slim", 2),
    categorySlugs: ["playstation-4"],
  },

  // ═══════════════════════════════════════════════════════
  // Xbox Consoles
  // ═══════════════════════════════════════════════════════
  {
    name: "Xbox Series X 1TB",
    arName: "إكس بوكس سيريس إكس 1 تيرا",
    slug: "xbox-series-x-1tb",
    sku: "XBOX-SX-001",
    regularPrice: 499.99,
    discountPrice: 499.99,
    description: "The fastest, most powerful Xbox ever. 4K gaming at 120fps.",
    arDescription: "أسرع وأقوى إكس بوكس. ألعاب 4K بمعدل 120 إطار.",
    mainImage: productImage("xbox-series-x"),
    imageGallery: productGallery("xbox-series-x", 3),
    isNew: true,
    categorySlugs: ["xbox-series"],
  },
  {
    name: "Xbox Series S 512GB",
    arName: "إكس بوكس سيريس إس 512 جيجا",
    slug: "xbox-series-s-512",
    sku: "XBOX-SS-001",
    regularPrice: 299.99,
    discountPrice: 299.99,
    description: "All-digital Xbox Series S. Compact and affordable.",
    arDescription: "إكس بوكس سيريس إس الرقمي. حجم صغير وسعر مناسب.",
    mainImage: productImage("xbox-series-s"),
    imageGallery: productGallery("xbox-series-s", 2),
    categorySlugs: ["xbox-series"],
  },
  {
    name: "Xbox One X 1TB",
    arName: "إكس بوكس ون إكس 1 تيرا",
    slug: "xbox-one-x-1tb",
    sku: "XBOX-ONEX-001",
    regularPrice: 349.99,
    discountPrice: 299.99,
    onDiscount: true,
    discountType: "PERCENTAGE",
    discountValue: 14,
    description: "Xbox One X with 1TB storage. 4K gaming.",
    arDescription: "إكس بوكس ون إكس بذاكرة 1 تيرا. ألعاب 4K.",
    mainImage: productImage("xbox-one-x"),
    imageGallery: productGallery("xbox-one-x", 2),
    categorySlugs: ["xbox-one"],
  },

  // ═══════════════════════════════════════════════════════
  // Nintendo
  // ═══════════════════════════════════════════════════════
  {
    name: "Nintendo Switch OLED",
    arName: "نينتندو سويتش OLED",
    slug: "nintendo-switch-oled",
    sku: "NSW-OLED-001",
    regularPrice: 349.99,
    discountPrice: 349.99,
    description: "Nintendo Switch with vibrant 7-inch OLED screen.",
    arDescription: "نينتندو سويتش بشاشة OLED مقاس 7 بوصة.",
    mainImage: productImage("nintendo-switch-oled"),
    imageGallery: productGallery("nintendo-switch-oled", 3),
    categorySlugs: ["nintendo-switch"],
  },

  // ═══════════════════════════════════════════════════════
  // Gaming Accessories
  // ═══════════════════════════════════════════════════════
  {
    name: "DualSense Wireless Controller",
    arName: "يد تحكم DualSense اللاسلكية",
    slug: "dualsense-controller",
    sku: "ACC-DS-001",
    regularPrice: 69.99,
    discountPrice: 64.99,
    onDiscount: true,
    discountType: "FIXED",
    discountValue: 5,
    description:
      "The DualSense wireless controller for PS5 with haptic feedback.",
    arDescription: "يد تحكم DualSense اللاسلكية لـ PS5 مع ردود فعل لمسية.",
    mainImage: productImage("dualsense"),
    imageGallery: productGallery("dualsense", 2),
    categorySlugs: ["gaming-accessories"],
    variants: [
      {
        sku: "ACC-DS-WHITE",
        name: "White",
        arName: "أبيض",
        attributes: { color: "white" },
        regularPrice: 69.99,
        discountPrice: 64.99,
        stockQuantity: 50,
      },
      {
        sku: "ACC-DS-BLACK",
        name: "Midnight Black",
        arName: "أسود",
        attributes: { color: "black" },
        regularPrice: 69.99,
        discountPrice: 64.99,
        stockQuantity: 30,
      },
      {
        sku: "ACC-DS-RED",
        name: "Cosmic Red",
        arName: "أحمر",
        attributes: { color: "red" },
        regularPrice: 74.99,
        discountPrice: 74.99,
        stockQuantity: 15,
      },
    ],
  },
  {
    name: "PULSE 3D Wireless Headset",
    arName: "سماعة PULSE 3D اللاسلكية",
    slug: "pulse-3d-headset",
    sku: "ACC-PULSE-001",
    regularPrice: 99.99,
    discountPrice: 89.99,
    onDiscount: true,
    discountType: "FIXED",
    discountValue: 10,
    description: "Officially licensed PS5 wireless headset with 3D audio.",
    arDescription: "سماعة لاسلكية رسمية لـ PS5 بصوت ثلاثي الأبعاد.",
    mainImage: productImage("pulse-3d"),
    imageGallery: productGallery("pulse-3d", 2),
    categorySlugs: ["gaming-accessories"],
  },
];
