import { locales } from "../types/shop/common";
import { NavMenuDataType } from "../types/shop/navMenuDataType";

export const ShopName = "NextNest Shop";
export const ShopDescription = "Your one-stop shop for all things NextNest!";
// export const websiteUrl = "https://www.nextnestshop.com";
export const websiteTitle = "NextNest Shop";
export const websiteDescription =
  "Discover the best products at NextNest Shop!";

export const cacheTimeInMinutes = 5; // Cache time in minutes for API responses
// the default locale for the application, used when no specific locale is provided or detected
export const defaultLocaleForWebsite: locales = "en"; // Default locale for the application

// TODO: Add more navigation items as needed
export const navMenuData: NavMenuDataType[] = [
  {
    title: "Products",
    href: "/products",
  },
  {
    title: "Categories",
    href: "/categories",
  },
  {
    title: "Deals",
    href: "/deals",
  },
  { title: "New Arrivals", href: "/new-arrivals" },
  { title: "Best Sellers", href: "/best-sellers" },
];
