import type { CategorySeed } from "../categories.data";

/** Home Appliances and Books category trees. */
export const homeBooksCategories: CategorySeed[] = [
  {
    name: "Home Appliances",
    arName: "أجهزة منزلية",
    slug: "home-appliances",
    imageSeed: "home-appliances",
    children: [
      { name: "Refrigerators", arName: "ثلاجات", slug: "refrigerators", imageSeed: "refrigerators" },
      { name: "Washing Machines", arName: "غسالات", slug: "washing-machines", imageSeed: "washing-machines" },
      { name: "Ovens & Stoves", arName: "بوتاجازات وأفران", slug: "ovens-stoves", imageSeed: "ovens" },
      { name: "Food Processors", arName: "محضرات طعام", slug: "food-processors", imageSeed: "food-processors" },
      { name: "Fryers", arName: "قلايات", slug: "fryers", imageSeed: "fryers" },
      { name: "Microwaves", arName: "ميكروويف", slug: "microwaves", imageSeed: "microwaves" },
      { name: "Dishwashers", arName: "غسالات أطباق", slug: "dishwashers", imageSeed: "dishwashers" },
      { name: "Vacuum Cleaners", arName: "مكانس كهربائية", slug: "vacuum-cleaners", imageSeed: "vacuums" },
    ],
  },
  {
    name: "Books",
    arName: "كتب",
    slug: "books",
    imageSeed: "books",
    children: [
      { name: "Programming Books", arName: "كتب برمجة", slug: "programming-books", imageSeed: "prog-books" },
      { name: "Novels", arName: "روايات", slug: "novels", imageSeed: "novels" },
      { name: "Self Development", arName: "تطوير الذات", slug: "self-development", imageSeed: "self-dev" },
      { name: "Business & Finance", arName: "كتب المال والأعمال", slug: "business-books", imageSeed: "business-books" },
      { name: "Arabic Literature", arName: "الأدب العربي", slug: "arabic-literature", imageSeed: "arabic-literature" },
    ],
  },
];
