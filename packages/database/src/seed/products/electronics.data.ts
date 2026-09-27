import { productImage, productGallery, type ProductSeed } from "../helpers";

export const electronicsProducts: ProductSeed[] = [
  // ═══════════════════════════════════════════════════════
  // Laptops
  // ═══════════════════════════════════════════════════════
  {
    name: "MacBook Pro 16",
    arName: "ماك بوك برو 16",
    slug: "macbook-pro-16",
    sku: "MBP-16-001",
    regularPrice: 2499.99,
    discountPrice: 2299.99,
    onDiscount: true,
    discountType: "FIXED",
    discountValue: 200,
    description: "Apple MacBook Pro 16-inch with M3 Pro chip.",
    arDescription: "آبل ماك بوك برو 16 بوصة مع شريحة M3 Pro.",
    mainImage: productImage("macbook-pro-16"),
    imageGallery: productGallery("macbook-pro-16", 3),
    isNew: true,
    categorySlugs: ["laptops"],
    variants: [
      {
        sku: "MBP-16-001-512",
        name: "512GB / 18GB RAM",
        arName: "٥١٢ جيجا / ١٨ رام",
        attributes: { storage: "512GB", ram: "18GB" },
        regularPrice: 2499.99,
        discountPrice: 2299.99,
        stockQuantity: 15,
      },
      {
        sku: "MBP-16-001-1TB",
        name: "1TB / 36GB RAM",
        arName: "١ تيرا / ٣٦ رام",
        attributes: { storage: "1TB", ram: "36GB" },
        regularPrice: 2899.99,
        discountPrice: 2699.99,
        stockQuantity: 10,
      },
    ],
  },
  {
    name: "Dell XPS 15",
    arName: "ديل إكس بي إس 15",
    slug: "dell-xps-15",
    sku: "DELL-XPS-15",
    regularPrice: 1899.99,
    discountPrice: 1749.99,
    onDiscount: true,
    discountType: "FIXED",
    discountValue: 150,
    description: "Dell XPS 15 with OLED 3.5K display and Intel Core i7.",
    arDescription: "ديل إكس بي إس 15 بشاشة أوليد 3.5K ومعالج إنتل كور i7.",
    mainImage: productImage("dell-xps-15"),
    imageGallery: productGallery("dell-xps-15", 2),
    isNew: false,
    categorySlugs: ["laptops"],
  },

  // ═══════════════════════════════════════════════════════
  // Smartphones
  // ═══════════════════════════════════════════════════════
  {
    name: "iPhone 15 Pro",
    arName: "آيفون 15 برو",
    slug: "iphone-15-pro",
    sku: "IPH-15P-001",
    regularPrice: 1199.99,
    discountPrice: 1099.99,
    onDiscount: true,
    discountType: "FIXED",
    discountValue: 100,
    description: "Latest iPhone with Titanium design and A17 Pro chip.",
    arDescription: "أحدث آيفون بتصميم التيتانيوم ومعالج A17 Pro.",
    mainImage: productImage("iphone-15-pro"),
    imageGallery: productGallery("iphone-15-pro", 3),
    isNew: true,
    categorySlugs: ["smartphones"],
    variants: [
      {
        sku: "IPH-15P-128-BLK",
        name: "128GB - Black Titanium",
        arName: "١٢٨ جيجا - تيتانيوم أسود",
        attributes: { storage: "128GB", color: "Black Titanium" },
        stockQuantity: 25,
      },
      {
        sku: "IPH-15P-256-NAT",
        name: "256GB - Natural Titanium",
        arName: "٢٥٦ جيجا - تيتانيوم طبيعي",
        attributes: { storage: "256GB", color: "Natural Titanium" },
        stockQuantity: 20,
      },
    ],
  },
  {
    name: "Samsung Galaxy S24 Ultra",
    arName: "سامسونج جالاكسي إس 24 ألترا",
    slug: "samsung-galaxy-s24-ultra",
    sku: "SAM-S24U-001",
    regularPrice: 1299.99,
    discountPrice: 1199.99,
    onDiscount: true,
    discountType: "FIXED",
    discountValue: 100,
    description: "Galaxy S24 Ultra with Galaxy AI and S Pen built-in.",
    arDescription:
      "جالاكسي إس 24 ألترا مع ذكاء جالاكسي الاصطناعي وقلم S Pen مدمج.",
    mainImage: productImage("samsung-s24-ultra"),
    imageGallery: productGallery("samsung-s24-ultra", 2),
    isNew: true,
    categorySlugs: ["smartphones"],
  },

  // ═══════════════════════════════════════════════════════
  // Headphones
  // ═══════════════════════════════════════════════════════
  {
    name: "Sony WH-1000XM5 Wireless Headphones",
    arName: "سماعات سوني WH-1000XM5 اللاسلكية",
    slug: "sony-wh1000xm5",
    sku: "SNY-WH-XM5",
    regularPrice: 399.99,
    discountPrice: 349.99,
    onDiscount: true,
    discountType: "FIXED",
    discountValue: 50,
    description: "Industry-leading noise cancelling wireless headphones.",
    arDescription: "سماعات لاسلكية رائدة في إلغاء الضوضاء.",
    mainImage: productImage("sony-wh1000xm5"),
    imageGallery: productGallery("sony-wh1000xm5", 2),
    categorySlugs: ["headphones"],
  },

  // ═══════════════════════════════════════════════════════
  // Tablets
  // ═══════════════════════════════════════════════════════
  {
    name: "iPad Pro 12.9",
    arName: "آيباد برو 12.9",
    slug: "ipad-pro-12-9",
    sku: "IPAD-PRO-129",
    regularPrice: 1099.99,
    discountPrice: 999.99,
    onDiscount: true,
    discountType: "FIXED",
    discountValue: 100,
    description: "iPad Pro with Liquid Retina XDR display and M2 chip.",
    arDescription: "آيباد برو بشاشة ليكويد ريتينا XDR وشريحة M2.",
    mainImage: productImage("ipad-pro-129"),
    imageGallery: productGallery("ipad-pro-129", 2),
    categorySlugs: ["tablets"],
  },
];
