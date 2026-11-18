import type { CategorySeed } from "../categories.data";

/** Sports, Beauty, Furniture, and Toys & Baby category trees. */
export const lifestyleCategories: CategorySeed[] = [
  {
    name: "Sports & Fitness",
    arName: "الرياضة واللياقة",
    slug: "sports-fitness",
    imageSeed: "sports-fitness",
    children: [
      { name: "Gym Equipment", arName: "معدات الجيم", slug: "gym-equipment", imageSeed: "gym-equipment" },
      { name: "Sportswear", arName: "ملابس رياضية", slug: "sportswear", imageSeed: "sportswear" },
      { name: "Running Shoes", arName: "أحذية جري", slug: "running-shoes", imageSeed: "running-shoes" },
      { name: "Bicycles & Scooters", arName: "دراجات وسكوتر", slug: "bicycles", imageSeed: "bicycles" },
    ],
  },
  {
    name: "Beauty & Personal Care",
    arName: "الجمال والعناية الشخصية",
    slug: "beauty-care",
    imageSeed: "beauty-care",
    children: [
      { name: "Skincare", arName: "العناية بالبشرة", slug: "skincare", imageSeed: "skincare" },
      { name: "Perfumes", arName: "عطور", slug: "perfumes", imageSeed: "perfumes" },
      { name: "Hair Care", arName: "العناية بالشعر", slug: "hair-care", imageSeed: "hair-care" },
      { name: "Grooming Tools", arName: "أدوات الحلاقة والعناية", slug: "grooming", imageSeed: "grooming" },
    ],
  },
  {
    name: "Furniture & Home Decor",
    arName: "الأثاث والديكور",
    slug: "furniture-decor",
    imageSeed: "furniture-decor",
    children: [
      { name: "Office Furniture", arName: "أثاث مكتبي", slug: "office-furniture", imageSeed: "office-furniture" },
      { name: "Smart Lighting", arName: "إضاءة ذكية ومصابيح", slug: "lighting", imageSeed: "lighting" },
      { name: "Bedding & Mattresses", arName: "مفروشات ومراتب", slug: "bedding", imageSeed: "bedding" },
      { name: "Wall Art & Decor", arName: "ديكور منزلي", slug: "home-decor", imageSeed: "home-decor" },
    ],
  },
  {
    name: "Toys & Baby",
    arName: "ألعاب ومستلزمات الأطفال",
    slug: "toys-baby",
    imageSeed: "toys-baby",
    children: [
      { name: "Board Games & Puzzles", arName: "ألعاب لوحية وألغاز", slug: "board-games", imageSeed: "board-games" },
      { name: "Action Figures", arName: "مجسمات وألعاب", slug: "action-figures", imageSeed: "action-figures" },
      { name: "Baby Gear & Strollers", arName: "عربات ومستلزمات الأطفال", slug: "baby-gear", imageSeed: "baby-gear" },
    ],
  },
];
