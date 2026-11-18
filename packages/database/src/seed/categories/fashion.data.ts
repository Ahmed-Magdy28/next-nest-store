import type { CategorySeed } from "../categories.data";

/** Men's and Women's Fashion category trees. */
export const fashionCategories: CategorySeed[] = [
  {
    name: "Men's Fashion",
    arName: "أزياء رجالية",
    slug: "men-fashion",
    imageSeed: "men-fashion",
    children: [
      { name: "Men's T-Shirts", arName: "تيشيرتات رجالية", slug: "men-tshirts", imageSeed: "men-tshirts" },
      { name: "Men's Jeans", arName: "بناطيل جينز رجالية", slug: "men-jeans", imageSeed: "men-jeans" },
      { name: "Men's Underwear", arName: "ملابس داخلية رجالية", slug: "men-underwear", imageSeed: "men-underwear" },
      { name: "Men's Shorts", arName: "شورتات رجالية", slug: "men-shorts", imageSeed: "men-shorts" },
      { name: "Men's Shoes", arName: "أحذية رجالية", slug: "men-shoes", imageSeed: "men-shoes" },
    ],
  },
  {
    name: "Women's Fashion",
    arName: "أزياء نسائية",
    slug: "women-fashion",
    imageSeed: "women-fashion",
    children: [
      { name: "Women's T-Shirts", arName: "تيشيرتات نسائية", slug: "women-tshirts", imageSeed: "women-tshirts" },
      { name: "Women's Dresses", arName: "فساتين نسائية", slug: "women-dresses", imageSeed: "women-dresses" },
      { name: "Women's Jeans", arName: "بناطيل جينز نسائية", slug: "women-jeans", imageSeed: "women-jeans" },
      { name: "Women's Shoes", arName: "أحذية نسائية", slug: "women-shoes", imageSeed: "women-shoes" },
      { name: "Women's Bags", arName: "حقائب نسائية", slug: "women-bags", imageSeed: "women-bags" },
    ],
  },
];
