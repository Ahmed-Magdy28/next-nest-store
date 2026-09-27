import { productImage, productGallery, type ProductSeed } from "../helpers";

export const homeAppliancesProducts: ProductSeed[] = [
  // ═══════════════════════════════════════════════════════
  // Refrigerators
  // ═══════════════════════════════════════════════════════
  {
    name: "Samsung 500L Refrigerator",
    arName: "ثلاجة سامسونج 500 لتر",
    slug: "samsung-500l-fridge",
    sku: "APP-FRG-SAMS500",
    regularPrice: 1299.99,
    discountPrice: 1099.99,
    onDiscount: true,
    discountType: "FIXED",
    discountValue: 200,
    description: "500L Samsung refrigerator with digital inverter.",
    arDescription: "ثلاجة سامسونج 500 لتر بضاغط رقمي.",
    mainImage: productImage("fridge-samsung-500"),
    imageGallery: productGallery("fridge-samsung-500", 2),
    isNew: true,
    categorySlugs: ["refrigerators"],
  },
  {
    name: "LG 400L Refrigerator",
    arName: "ثلاجة إل جي 400 لتر",
    slug: "lg-400l-fridge",
    sku: "APP-FRG-LG400",
    regularPrice: 999.99,
    discountPrice: 899.99,
    onDiscount: true,
    discountType: "FIXED",
    discountValue: 100,
    description: "400L LG refrigerator with smart inverter.",
    arDescription: "ثلاجة إل جي 400 لتر بمحول ذكي.",
    mainImage: productImage("fridge-lg-400"),
    imageGallery: productGallery("fridge-lg-400", 2),
    categorySlugs: ["refrigerators"],
  },

  // ═══════════════════════════════════════════════════════
  // Washing Machines
  // ═══════════════════════════════════════════════════════
  {
    name: "Samsung 8kg Front Load Washer",
    arName: "غسالة سامسونج 8 كيلو أمامية",
    slug: "samsung-8kg-front-washer",
    sku: "APP-WSH-SAMS8",
    regularPrice: 799.99,
    discountPrice: 699.99,
    onDiscount: true,
    discountType: "FIXED",
    discountValue: 100,
    description: "8kg front-load washing machine with EcoBubble.",
    arDescription: "غسالة أمامية 8 كيلو مع تقنية EcoBubble.",
    mainImage: productImage("washer-samsung-8"),
    imageGallery: productGallery("washer-samsung-8", 2),
    categorySlugs: ["washing-machines"],
  },
  {
    name: "LG 7kg Top Load Washer",
    arName: "غسالة إل جي 7 كيلو علوية",
    slug: "lg-7kg-top-washer",
    sku: "APP-WSH-LG7",
    regularPrice: 599.99,
    discountPrice: 549.99,
    onDiscount: true,
    discountType: "FIXED",
    discountValue: 50,
    description: "7kg top-load washing machine.",
    arDescription: "غسالة علوية 7 كيلو.",
    mainImage: productImage("washer-lg-7"),
    imageGallery: productGallery("washer-lg-7", 2),
    categorySlugs: ["washing-machines"],
  },

  // ═══════════════════════════════════════════════════════
  // Ovens & Stoves
  // ═══════════════════════════════════════════════════════
  {
    name: "5-Burner Gas Stove",
    arName: "بوتاجاز 5 شعلات",
    slug: "5-burner-gas-stove",
    sku: "APP-OVN-5BRN",
    regularPrice: 549.99,
    discountPrice: 449.99,
    onDiscount: true,
    discountType: "FIXED",
    discountValue: 100,
    description: "5-burner gas stove with auto-ignition.",
    arDescription: "بوتاجاز 5 شعلات مع إشعال ذاتي.",
    mainImage: productImage("stove-5burner"),
    imageGallery: productGallery("stove-5burner", 2),
    categorySlugs: ["ovens-stoves"],
  },
  {
    name: "Electric Oven 60L",
    arName: "فرن كهربائي 60 لتر",
    slug: "electric-oven-60l",
    sku: "APP-OVN-EL60",
    regularPrice: 299.99,
    discountPrice: 249.99,
    onDiscount: true,
    discountType: "FIXED",
    discountValue: 50,
    description: "60L electric oven with convection.",
    arDescription: "فرن كهربائي 60 لتر مع حمل حراري.",
    mainImage: productImage("oven-electric-60"),
    imageGallery: productGallery("oven-electric-60", 2),
    categorySlugs: ["ovens-stoves"],
  },

  // ═══════════════════════════════════════════════════════
  // Food Processors
  // ═══════════════════════════════════════════════════════
  {
    name: "KitchenAid Food Processor",
    arName: "محضر طعام كيتشن إيد",
    slug: "kitchenaid-food-processor",
    sku: "APP-FPR-KA",
    regularPrice: 249.99,
    discountPrice: 219.99,
    onDiscount: true,
    discountType: "FIXED",
    discountValue: 30,
    description: "KitchenAid food processor with multiple blades.",
    arDescription: "محضر طعام كيتشن إيد مع شفرات متعددة.",
    mainImage: productImage("food-processor-ka"),
    imageGallery: productGallery("food-processor-ka", 2),
    categorySlugs: ["food-processors"],
  },

  // ═══════════════════════════════════════════════════════
  // Air Fryers
  // ═══════════════════════════════════════════════════════
  {
    name: "Philips Air Fryer XXL",
    arName: "قلاية فيليبس الهوائية XXL",
    slug: "philips-air-fryer-xxl",
    sku: "APP-AFR-PHXXL",
    regularPrice: 349.99,
    discountPrice: 299.99,
    onDiscount: true,
    discountType: "FIXED",
    discountValue: 50,
    description: "Philips Air Fryer XXL with Fat Removal technology.",
    arDescription: "قلاية فيليبس الهوائية XXL مع تقنية إزالة الدهون.",
    mainImage: productImage("air-fryer-philips"),
    imageGallery: productGallery("air-fryer-philips", 2),
    isNew: true,
    categorySlugs: ["fryers"],
  },
  {
    name: "Ninja Air Fryer 5.5L",
    arName: "قلاية نينجا الهوائية 5.5 لتر",
    slug: "ninja-air-fryer-5-5l",
    sku: "APP-AFR-NINJA55",
    regularPrice: 199.99,
    discountPrice: 179.99,
    onDiscount: true,
    discountType: "FIXED",
    discountValue: 20,
    description: "Ninja Air Fryer with 5.5L capacity.",
    arDescription: "قلاية نينجا الهوائية بسعة 5.5 لتر.",
    mainImage: productImage("air-fryer-ninja"),
    imageGallery: productGallery("air-fryer-ninja", 2),
    categorySlugs: ["fryers"],
  },

  // ═══════════════════════════════════════════════════════
  // Microwaves
  // ═══════════════════════════════════════════════════════
  {
    name: "Panasonic Microwave 32L",
    arName: "ميكروويف باناسونيك 32 لتر",
    slug: "panasonic-microwave-32l",
    sku: "APP-MWV-PAN32",
    regularPrice: 249.99,
    discountPrice: 219.99,
    onDiscount: true,
    discountType: "FIXED",
    discountValue: 30,
    description: "32L Panasonic microwave with inverter.",
    arDescription: "ميكروويف باناسونيك 32 لتر مع محول.",
    mainImage: productImage("microwave-panasonic"),
    imageGallery: productGallery("microwave-panasonic", 2),
    categorySlugs: ["microwaves"],
  },

  // ═══════════════════════════════════════════════════════
  // Dishwashers
  // ═══════════════════════════════════════════════════════
  {
    name: "Bosch Dishwasher 12 Sets",
    arName: "غسالة أطباق بوش 12 طقم",
    slug: "bosch-dishwasher-12",
    sku: "APP-DSH-BOSCH12",
    regularPrice: 899.99,
    discountPrice: 799.99,
    onDiscount: true,
    discountType: "FIXED",
    discountValue: 100,
    description: "Bosch dishwasher with 12 place settings.",
    arDescription: "غسالة أطباق بوش بـ 12 طقم.",
    mainImage: productImage("dishwasher-bosch"),
    imageGallery: productGallery("dishwasher-bosch", 2),
    categorySlugs: ["dishwashers"],
  },

  // ═══════════════════════════════════════════════════════
  // Vacuum Cleaners
  // ═══════════════════════════════════════════════════════
  {
    name: "Dyson V15 Detect",
    arName: "دايسون V15 ديتكت",
    slug: "dyson-v15-detect",
    sku: "APP-VAC-DYSON15",
    regularPrice: 749.99,
    discountPrice: 649.99,
    onDiscount: true,
    discountType: "FIXED",
    discountValue: 100,
    description: "Dyson V15 Detect cordless vacuum with laser.",
    arDescription: "مكنسة دايسون V15 ديتكت اللاسلكية مع ليزر.",
    mainImage: productImage("vacuum-dyson-v15"),
    imageGallery: productGallery("vacuum-dyson-v15", 2),
    isNew: true,
    categorySlugs: ["vacuum-cleaners"],
  },
];
