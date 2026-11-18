import { techGamingCategories } from "./categories/tech-gaming.data";
import { fashionCategories } from "./categories/fashion.data";
import { homeBooksCategories } from "./categories/home-books.data";
import { lifestyleCategories } from "./categories/lifestyle.data";

/** Seed definition for a main category or subcategory. */
export interface CategorySeed {
  name: string;
  arName: string;
  slug: string;
  imageSeed: string;
  children?: CategorySeed[];
}

/** Complete category tree (10 main categories, 54 subcategories). */
export const categoriesData: CategorySeed[] = [
  ...techGamingCategories,
  ...fashionCategories,
  ...homeBooksCategories,
  ...lifestyleCategories,
];
