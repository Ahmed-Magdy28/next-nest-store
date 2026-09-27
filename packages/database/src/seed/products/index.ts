import { electronicsProducts } from "./electronics.data.js";
import { gamingProducts } from "./gaming.data.js";
import { homeAppliancesProducts } from "./home-appliances.data.js";
import { menClothingProducts } from "./men-clothing.data.js";
import { womenClothingProducts } from "./women-clothing.data.js";

export * from "./electronics.data.js";
export * from "./gaming.data.js";
export * from "./home-appliances.data.js";
export * from "./men-clothing.data.js";
export * from "./women-clothing.data.js";

export const allProducts = [
  ...gamingProducts,
  ...electronicsProducts,
  ...homeAppliancesProducts,
  ...menClothingProducts,
  ...womenClothingProducts,
];
