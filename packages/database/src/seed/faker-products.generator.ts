import { faker } from "@faker-js/faker";
import {
  type ProductSeed,
  type ProductVariantSeed,
  productImage,
  productGallery,
  slugify,
} from "./helpers";

interface CategoryBlueprint {
  slug: string;
  parentSlug?: string;
  categoryType: "clothing" | "tech" | "appliance" | "book" | "shoes";
  minPrice: number;
  maxPrice: number;
  brands: { en: string; ar: string }[];
  models: { en: string; ar: string }[];
}

const CATEGORY_BLUEPRINTS: CategoryBlueprint[] = [
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

  // ── Men's Fashion ──────────────────────────────────────
  {
    slug: "men-tshirts",
    parentSlug: "men-fashion",
    categoryType: "clothing",
    minPrice: 15,
    maxPrice: 65,
    brands: [
      { en: "Nike", ar: "نايكي" },
      { en: "Adidas", ar: "أديداس" },
      { en: "Zara Man", ar: "زارا رجالي" },
      { en: "Tommy Hilfiger", ar: "تومي هيلفيغر" },
      { en: "Calvin Klein", ar: "كالفن كلاين" },
    ],
    models: [
      { en: "Heavyweight Cotton Oversized T-Shirt", ar: "تيشيرت قطني أوفر سايز سميك وفاخر" },
      { en: "Dri-FIT Athletic Performance Tee", ar: "تيشيرت رياضي بتقنية طرد العرق والتهوية" },
      { en: "Classic Slim-Fit Pique Polo Shirt", ar: "قميص بولو كلاسيكي بقصة مجسمة أنيقة" },
      { en: "Vintage Washed Graphic Print Crewneck", ar: "تيشيرت فينتاج بطباعة جرافيك عصرية" },
    ],
  },
  {
    slug: "men-jeans",
    parentSlug: "men-fashion",
    categoryType: "clothing",
    minPrice: 35,
    maxPrice: 120,
    brands: [
      { en: "Levi's", ar: "ليفايز" },
      { en: "Diesel", ar: "ديزل" },
      { en: "Wrangler", ar: "رانجلر" },
      { en: "Jack & Jones", ar: "جاك آند جونز" },
    ],
    models: [
      { en: "511 Slim Fit Stretch Denim Jeans", ar: "بنطال جينز قصة سليم 511 مع مرونة فائقة" },
      { en: "501 Original Straight Fit Blue Jeans", ar: "بنطلون جينز أوريجينال بقصة مستقيمة كلاسيكية" },
      { en: "Streetwear Relaxed Fit Cargo Jeans", ar: "جينز كارجو ستريت وير بقصة فضفاضة وجيوب عملية" },
      { en: "Tapered Distressed Ripped Denim", ar: "بنطال جينز ممزق أنيق بقصة ضيقة عند الكاحل" },
    ],
  },
  {
    slug: "men-underwear",
    parentSlug: "men-fashion",
    categoryType: "clothing",
    minPrice: 18,
    maxPrice: 45,
    brands: [
      { en: "Calvin Klein", ar: "كالفن كلاين" },
      { en: "Puma", ar: "بوما" },
      { en: "Under Armour", ar: "أندر آرمر" },
    ],
    models: [
      { en: "Modern Cotton Boxer Briefs 3-Pack", ar: "طقم سراويل بوكسر قطنية مريحة 3 قطع" },
      { en: "Microfiber Seamless Breathable Trunks", ar: "سراويل مايكروفايبر مانعة للاحتكاك ومرنة" },
      { en: "Tech Mesh Athletic Sports Boxer Briefs", ar: "بوكسر رياضي شبكي يسمح بمرور الهواء" },
    ],
  },
  {
    slug: "men-shorts",
    parentSlug: "men-fashion",
    categoryType: "clothing",
    minPrice: 20,
    maxPrice: 75,
    brands: [
      { en: "Nike", ar: "نايكي" },
      { en: "Adidas Originals", ar: "أديداس أوريجينالز" },
      { en: "Pull&Bear", ar: "بول آند بير" },
    ],
    models: [
      { en: "Club Fleece Everyday Casual Shorts", ar: "شورت صوف خفيف يومي مريح بحزام مطاطي" },
      { en: "Stretch Chino Summer Walk Shorts", ar: "شورت تشينو صيفي أنيق بقماش مطاطي" },
      { en: "Quick-Dry Swimming Boardshorts", ar: "شورت سباحة سريع الجفاف بطبعة عصرية" },
    ],
  },
  {
    slug: "men-shoes",
    parentSlug: "men-fashion",
    categoryType: "shoes",
    minPrice: 45,
    maxPrice: 210,
    brands: [
      { en: "Nike", ar: "نايكي" },
      { en: "Adidas", ar: "أديداس" },
      { en: "New Balance", ar: "نيو بالانس" },
      { en: "Clarks", ar: "كلاركس" },
    ],
    models: [
      { en: "Air Max Pulse Cushioned Sneakers", ar: "حذاء رياضي إير ماكس بوسادة هوائية فائقة" },
      { en: "Samba Classic Leather Sneakers", ar: "سنيكرز سامبا جلد كلاسيكي بتصميم أيقوني" },
      { en: "574 Core Heritage Walking Shoes", ar: "حذاء مشي مريح نيو بالانس 574 هيريتدج" },
      { en: "Desert Boot Genuine Suede Loafers", ar: "حذاء شمواه صحراوي فاخر للمناسبات" },
    ],
  },

  // ── Women's Fashion ────────────────────────────────────
  {
    slug: "women-tshirts",
    parentSlug: "women-fashion",
    categoryType: "clothing",
    minPrice: 15,
    maxPrice: 55,
    brands: [
      { en: "Zara", ar: "زارا" },
      { en: "Mango", ar: "مانجو" },
      { en: "H&M", ar: "إتش آند إم" },
      { en: "Bershka", ar: "بيرشكا" },
    ],
    models: [
      { en: "Soft Ribbed Crop Baby Tee", ar: "تيشيرت كروب ناعم مضلع بقصة مريحة" },
      { en: "Relaxed Fit Organic Cotton Graphic Tee", ar: "تيشيرت قطن عضوي فضفاض بطبعة ورود أنيقة" },
      { en: "V-Neck Short Sleeve Casual Top", ar: "بلوزة يومية بياقة سبعة وخامة انسيابية" },
    ],
  },
  {
    slug: "women-dresses",
    parentSlug: "women-fashion",
    categoryType: "clothing",
    minPrice: 35,
    maxPrice: 180,
    brands: [
      { en: "Zara", ar: "زارا" },
      { en: "Mango", ar: "مانجو" },
      { en: "ASOS", ar: "أسوس" },
      { en: "Massimo Dutti", ar: "ماسيمو دوتي" },
    ],
    models: [
      { en: "Flowy Floral Tiered Maxi Dress", ar: "فستان ماكسي طويل مورد بأكمام منسدلة" },
      { en: "Elegance Satin Slip Evening Dress", ar: "فستان سهرة ستان ناعم وأنيق للمناسبات" },
      { en: "Ribbed Knit Bodycon Midi Dress", ar: "فستان تريكو ميدي مجسم بتصميم عصري" },
      { en: "Linen Blend Belted Shirt Dress", ar: "فستان قميص كتان مع حزام خصر ربيعي" },
    ],
  },
  {
    slug: "women-jeans",
    parentSlug: "women-fashion",
    categoryType: "clothing",
    minPrice: 35,
    maxPrice: 110,
    brands: [
      { en: "Levi's", ar: "ليفايز" },
      { en: "Zara", ar: "زارا" },
      { en: "Stradivarius", ar: "ستراديفاريوس" },
    ],
    models: [
      { en: "High-Waist Wide-Leg Denim Trousers", ar: "بنطلون جينز واسع بخصر عالٍ وتصميم تريندي" },
      { en: "Vintage Mom Fit High Rise Jeans", ar: "جينز مام فيت عالي الخصر بقصة مريحة كلاسيكية" },
      { en: "Sculpting Skinny Jeans with Stretch", ar: "بنطال جينز سكيني مطاطي مريح ومحدد للقوام" },
    ],
  },
  {
    slug: "women-shoes",
    parentSlug: "women-fashion",
    categoryType: "shoes",
    minPrice: 35,
    maxPrice: 175,
    brands: [
      { en: "Steve Madden", ar: "ستيف مادن" },
      { en: "Aldo", ar: "ألدو" },
      { en: "Nike", ar: "نايكي" },
      { en: "Mango", ar: "مانجو" },
    ],
    models: [
      { en: "Chunky Platform Retro Sneakers", ar: "سنيكرز بلاتفورم مريح بنعل سميك وتصميم عصري" },
      { en: "Block Heel Leather Ankle Boots", ar: "بوت جلد بكعب عريض مربع ومريح للمشي" },
      { en: "Strappy Square-Toe Heeled Sandals", ar: "صندل أنيق بسيور ناعمة ومقدمة مربعة" },
      { en: "Soft Leather Pointed Ballet Flats", ar: "حذاء فلات باليه جلد ناعم بمقدمة مدببة" },
    ],
  },
  {
    slug: "women-bags",
    parentSlug: "women-fashion",
    categoryType: "clothing",
    minPrice: 30,
    maxPrice: 220,
    brands: [
      { en: "Guess", ar: "جيس" },
      { en: "Michael Kors", ar: "مايكل كورس" },
      { en: "Aldo", ar: "ألدو" },
      { en: "Zara", ar: "زارا" },
    ],
    models: [
      { en: "Quilted Faux Leather Crossbody Bag", ar: "حقيبة كروس جلد مبطن بسلسلة ذهبية أنيقة" },
      { en: "Large Canvas Everyday Tote Bag", ar: "حقيبة يد توت واسعة من الكانفاس للعمل والجامعة" },
      { en: "Croissant Leather Shoulder Bag", ar: "حقيبة كتف جلد كرواسون بتصميم عصري مميز" },
      { en: "Mini structured Evening Clutch", ar: "كلتش سهرة صغير ولامع مزود بحمالة كتف" },
    ],
  },

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

  // ── Books ──────────────────────────────────────────────
  {
    slug: "programming-books",
    parentSlug: "books",
    categoryType: "book",
    minPrice: 25,
    maxPrice: 75,
    brands: [
      { en: "O'Reilly Media", ar: "دار أوريلي" },
      { en: "No Starch Press", ar: "نو ستارش برس" },
      { en: "Addison-Wesley", ar: "أديسون ويسلي" },
      { en: "Pragmatic Bookshelf", ar: "براجماتيك" },
    ],
    models: [
      { en: "Designing Data-Intensive Applications", ar: "تصميم التطبيقات كثيفة البيانات" },
      { en: "Clean Architecture: A Craftsman's Guide", ar: "المعمارية النظيفة: دليل الحرفي البرمجي" },
      { en: "The Rust Programming Language (2nd Edition)", ar: "لغة البرمجة رست: الدليل العملي الكامل" },
      { en: "Learning TypeScript: Scalable JavaScript", ar: "تعلم تايب سكريبت لتطوير أنظمة متماسكة" },
    ],
  },
  {
    slug: "novels",
    parentSlug: "books",
    categoryType: "book",
    minPrice: 12,
    maxPrice: 35,
    brands: [
      { en: "Penguin Classics", ar: "بينجوين كلاسيكس" },
      { en: "HarperCollins", ar: "هاربر كولينز" },
      { en: "Tor Books", ar: "تور بوكس" },
    ],
    models: [
      { en: "Dune: Deluxe Collector's Illustrated Edition", ar: "رواية كثيب: الطبعة المصورة الفاخرة" },
      { en: "The Silent Patient Psychological Thriller", ar: "المريض الصامت: رواية تشويق وإثارة نفسية" },
      { en: "The Midnight Library Bestselling Novel", ar: "مكتبة منتصف الليل: رحلة بين الاختيارات الممكنة" },
      { en: "Project Hail Mary Sci-Fi Adventure", ar: "مشروع هيل ماري: مغامرة خيال علمي شيقة" },
    ],
  },
  {
    slug: "self-development",
    parentSlug: "books",
    categoryType: "book",
    minPrice: 14,
    maxPrice: 38,
    brands: [
      { en: "Avery Publishing", ar: "إيفري" },
      { en: "Portfolio Books", ar: "بورتفوليو" },
      { en: "Harper Business", ar: "هاربر بيزنس" },
    ],
    models: [
      { en: "Atomic Habits: Proven Tiny Changes Guide", ar: "العادات الذرية: بناء عادات حسنة والتخلص من السيئة" },
      { en: "The Psychology of Money: Timeless Wealth Lessons", ar: "سيكولوجية المال: دروس خالدة في الثروة والسعادة" },
      { en: "Deep Work: Rules for Focused Success", ar: "العمل العميق: قواعد النجاح المركز في عالم مشتت" },
      { en: "Thinking, Fast and Slow by Daniel Kahneman", ar: "التفكير بسرعة وببطء لدانيال كانيمان" },
    ],
  },
];

const CLOTHING_SIZES = ["S", "M", "L", "XL"];
const SHOE_SIZES_MEN = ["40", "41", "42", "43", "44"];
const SHOE_SIZES_WOMEN = ["36", "37", "38", "39", "40"];

const COLOR_VARIANTS = [
  { en: "Midnight Black", ar: "أسود ليلي", hex: "#111827" },
  { en: "Pure White", ar: "أبيض ناصع", hex: "#FFFFFF" },
  { en: "Navy Blue", ar: "أزرق كحلي", hex: "#1E3A8A" },
  { en: "Heather Gray", ar: "رمادي حجري", hex: "#6B7280" },
  { en: "Forest Green", ar: "أخضر زيتوني", hex: "#065F46" },
];

const STORAGE_VARIANTS = [
  { en: "128GB Storage", ar: "سعة 128 جيجابايت" },
  { en: "256GB Storage", ar: "سعة 256 جيجابايت" },
  { en: "512GB Storage", ar: "سعة 512 جيجابايت" },
];

const BOOK_EDITIONS = [
  { en: "Hardcover Edition", ar: "نسخة غلاف فني مقوى" },
  { en: "Paperback Edition", ar: "نسخة غلاف ورقي عادي" },
];

/**
 * Generate rich, realistic product catalog items with Faker
 */
export function generateFakerProducts(): ProductSeed[] {
  // Deterministic seed ensures consistent, idempotent data generation
  faker.seed(2026);

  const generatedProducts: ProductSeed[] = [];
  let globalIndex = 1;

  for (const blueprint of CATEGORY_BLUEPRINTS) {
    const parent = blueprint.parentSlug;
    const categorySlugs = parent
      ? [blueprint.slug, parent]
      : [blueprint.slug];

    // For each model defined in the blueprint, generate a rich product
    for (let i = 0; i < blueprint.models.length; i++) {
      const model = blueprint.models[i];
      const brand = blueprint.brands[i % blueprint.brands.length];
      const fullName = `${brand.en} ${model.en}`;
      const fullArName = `${brand.ar} - ${model.ar}`;

      const rawSlug = slugify(`${brand.en}-${model.en}`);
      const slug = `${rawSlug}-${faker.string.alphanumeric(4).toLowerCase()}`;
      const skuPrefix = blueprint.slug
        .split("-")
        .map((w) => w[0]?.toUpperCase() ?? "X")
        .join("");
      const sku = `FKR-${skuPrefix}-${String(globalIndex).padStart(4, "0")}`;

      const regularPrice = Number(
        faker.commerce.price({
          min: blueprint.minPrice,
          max: blueprint.maxPrice,
          dec: 2,
        }),
      );

      // ~40% discount probability
      const hasDiscount = faker.datatype.boolean(0.4);
      let discountPrice = regularPrice;
      let onDiscount = false;
      let discountType: "PERCENTAGE" | "FIXED" | undefined = undefined;
      let discountValue: number | undefined = undefined;
      let discountStartDate: string | undefined = undefined;
      let discountEndDate: string | undefined = undefined;

      if (hasDiscount) {
        const discountPercentage = faker.helpers.arrayElement([10, 15, 20, 25, 30]);
        const calculatedDiscount = Number(
          (regularPrice * (1 - discountPercentage / 100)).toFixed(2),
        );
        discountPrice = calculatedDiscount;
        onDiscount = true;
        discountType = "PERCENTAGE";
        discountValue = discountPercentage;
        discountStartDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
        discountEndDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
      }

      const imageSeed = `faker-${blueprint.slug}-${globalIndex}`;
      const mainImage = productImage(imageSeed, 800);
      const imageGallery = productGallery(imageSeed, 3, 800);

      const description = `${fullName}. Built with premium materials for maximum durability and everyday excellence. Features high performance, modern aesthetic, and standard manufacturer warranty. ${faker.commerce.productDescription()}`;
      const arDescription = `${fullArName}. صُمم بأعلى معايير الجودة ليوفر أداءً استثنائياً وتجربة استخدام راقية مع ضمان الوكيل المعتمد. يجمع بين الكفاءة العالية والمتانة والراحة للاستخدام اليومي.`;

      const weight = Number(
        faker.number.float({ min: 0.2, max: 8.5, fractionDigits: 2 }),
      );
      const dimensions = {
        width: faker.number.int({ min: 10, max: 60 }),
        height: faker.number.int({ min: 10, max: 90 }),
        length: faker.number.int({ min: 10, max: 60 }),
        unit: "cm",
      };

      // Generate realistic variants depending on category type
      const variants: ProductVariantSeed[] = [];

      if (blueprint.categoryType === "clothing") {
        const selectedColors = faker.helpers.arrayElements(COLOR_VARIANTS, 2);
        let variantNum = 1;
        for (const color of selectedColors) {
          for (const size of CLOTHING_SIZES.slice(0, 3)) {
            variants.push({
              sku: `${sku}-${color.en.slice(0, 3).toUpperCase()}-${size}`,
              name: `${color.en} / Size ${size}`,
              arName: `${color.ar} / مقاس ${size}`,
              size,
              attributes: { color: color.en, hex: color.hex, size },
              regularPrice,
              discountPrice,
              stockQuantity: faker.number.int({ min: 15, max: 85 }),
            });
            variantNum++;
          }
        }
      } else if (blueprint.categoryType === "shoes") {
        const sizes =
          blueprint.slug.includes("women")
            ? SHOE_SIZES_WOMEN.slice(0, 3)
            : SHOE_SIZES_MEN.slice(0, 3);
        const selectedColors = faker.helpers.arrayElements(COLOR_VARIANTS, 2);
        for (const color of selectedColors) {
          for (const size of sizes) {
            variants.push({
              sku: `${sku}-${color.en.slice(0, 3).toUpperCase()}-EU${size}`,
              name: `${color.en} / EU ${size}`,
              arName: `${color.ar} / مقاس ${size}`,
              size,
              attributes: { color: color.en, size: `EU ${size}` },
              regularPrice,
              discountPrice,
              stockQuantity: faker.number.int({ min: 10, max: 50 }),
            });
          }
        }
      } else if (blueprint.categoryType === "tech") {
        let vIndex = 1;
        const selectedColors = faker.helpers.arrayElements(COLOR_VARIANTS.slice(0, 3), 2);
        for (const color of selectedColors) {
          const storage = STORAGE_VARIANTS[vIndex % STORAGE_VARIANTS.length];
          const variantPriceModifier = vIndex === 1 ? 0 : 50;
          variants.push({
            sku: `${sku}-V${vIndex}`,
            name: `${color.en} (${storage.en})`,
            arName: `${color.ar} (${storage.ar})`,
            attributes: { color: color.en, storage: storage.en },
            regularPrice: regularPrice + variantPriceModifier,
            discountPrice: discountPrice + variantPriceModifier,
            stockQuantity: faker.number.int({ min: 8, max: 40 }),
          });
          vIndex++;
        }
      } else if (blueprint.categoryType === "book") {
        BOOK_EDITIONS.forEach((edition, idx) => {
          const priceOffset = idx === 0 ? 10 : 0;
          variants.push({
            sku: `${sku}-ED${idx + 1}`,
            name: edition.en,
            arName: edition.ar,
            attributes: { format: edition.en },
            regularPrice: regularPrice + priceOffset,
            discountPrice: discountPrice + priceOffset,
            stockQuantity: faker.number.int({ min: 20, max: 120 }),
          });
        });
      } else if (blueprint.categoryType === "appliance") {
        const finishes = [
          { en: "Stainless Steel Finish", ar: "ستانلس ستيل فضي" },
          { en: "Matte Black Edition", ar: "نسخة سوداء غير لامعة" },
        ];
        finishes.forEach((finish, idx) => {
          variants.push({
            sku: `${sku}-FIN${idx + 1}`,
            name: finish.en,
            arName: finish.ar,
            attributes: { finish: finish.en },
            regularPrice,
            discountPrice,
            stockQuantity: faker.number.int({ min: 5, max: 30 }),
          });
        });
      }

      generatedProducts.push({
        name: fullName,
        arName: fullArName,
        slug,
        sku,
        regularPrice,
        discountPrice,
        onDiscount,
        discountType,
        discountValue,
        discountStartDate,
        discountEndDate,
        description,
        arDescription,
        weight,
        dimensions,
        mainImage,
        imageGallery,
        categorySlugs,
        isNew: faker.datatype.boolean(0.35),
        variants: variants.length ? variants : undefined,
      });

      globalIndex++;
    }
  }

  return generatedProducts;
}
