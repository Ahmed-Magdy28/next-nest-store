import type { CategorySeed } from "../categories.data";

/** Gaming and Electronics category trees. */
export const techGamingCategories: CategorySeed[] = [
  {
    name: "Gaming",
    arName: "الألعاب",
    slug: "gaming",
    imageSeed: "gaming",
    children: [
      { name: "PlayStation 5", arName: "بلايستيشن 5", slug: "playstation-5", imageSeed: "ps5" },
      { name: "PlayStation 4", arName: "بلايستيشن 4", slug: "playstation-4", imageSeed: "ps4" },
      { name: "Xbox Series X|S", arName: "إكس بوكس سيريس", slug: "xbox-series", imageSeed: "xbox-series" },
      { name: "Xbox One", arName: "إكس بوكس ون", slug: "xbox-one", imageSeed: "xbox-one" },
      { name: "Nintendo Switch", arName: "نينتندو سويتش", slug: "nintendo-switch", imageSeed: "nintendo" },
      { name: "Gaming Accessories", arName: "ملحقات الألعاب", slug: "gaming-accessories", imageSeed: "gaming-acc" },
      { name: "PC Gaming", arName: "ألعاب الكمبيوتر", slug: "pc-gaming", imageSeed: "pc-gaming" },
      { name: "VR Headsets", arName: "نظارات الواقع الافتراضي", slug: "vr-headsets", imageSeed: "vr-headsets" },
    ],
  },
  {
    name: "Electronics",
    arName: "الإلكترونيات",
    slug: "electronics",
    imageSeed: "electronics",
    children: [
      { name: "Laptops", arName: "لابتوبات", slug: "laptops", imageSeed: "laptops" },
      { name: "Smartphones", arName: "هواتف ذكية", slug: "smartphones", imageSeed: "smartphones" },
      { name: "TVs & Monitors", arName: "تلفزيونات وشاشات", slug: "tvs-monitors", imageSeed: "tvs" },
      { name: "Tablets", arName: "تابلت", slug: "tablets", imageSeed: "tablets" },
      { name: "Headphones", arName: "سماعات", slug: "headphones", imageSeed: "headphones" },
      { name: "Cameras", arName: "كاميرات", slug: "cameras", imageSeed: "cameras" },
      { name: "Smartwatches", arName: "ساعات ذكية", slug: "smartwatches", imageSeed: "smartwatches" },
      { name: "Networking & Routers", arName: "أجهزة الشبكات والراوتر", slug: "networking", imageSeed: "networking" },
    ],
  },
];
