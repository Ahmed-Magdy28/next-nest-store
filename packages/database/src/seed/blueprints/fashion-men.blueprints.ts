import type { CategoryBlueprint } from "./blueprint.types";

/** Men's fashion category blueprints. */
export const fashionMenBlueprints: CategoryBlueprint[] = [
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

];
