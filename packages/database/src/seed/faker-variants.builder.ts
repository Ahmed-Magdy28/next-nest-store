import { faker } from "@faker-js/faker";
import type { ProductVariantSeed } from "../helpers";
import {
  BOOK_EDITIONS,
  CLOTHING_SIZES,
  COLOR_VARIANTS,
  SHOE_SIZES_MEN,
  SHOE_SIZES_WOMEN,
  STORAGE_VARIANTS,
  type CategoryBlueprint,
} from "./blueprint.types";

/**
 * Generates realistic product variants (clothing sizes, shoe sizes,
 * tech storage/color options, book editions, or appliance finishes).
 */
export function buildProductVariants(
  blueprint: CategoryBlueprint,
  sku: string,
  regularPrice: number,
  discountPrice: number,
): ProductVariantSeed[] {
  const variants: ProductVariantSeed[] = [];

  if (blueprint.categoryType === "clothing") {
    const selectedColors = faker.helpers.arrayElements([...COLOR_VARIANTS], 2);
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
      }
    }
  } else if (blueprint.categoryType === "shoes") {
    const sizes = blueprint.slug.includes("women")
      ? SHOE_SIZES_WOMEN.slice(0, 3)
      : SHOE_SIZES_MEN.slice(0, 3);
    const selectedColors = faker.helpers.arrayElements([...COLOR_VARIANTS], 2);
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
    const selectedColors = faker.helpers.arrayElements(
      COLOR_VARIANTS.slice(0, 3),
      2,
    );
    for (const color of selectedColors) {
      const storage = STORAGE_VARIANTS[vIndex % STORAGE_VARIANTS.length]!;
      const priceModifier = vIndex === 1 ? 0 : 50;
      variants.push({
        sku: `${sku}-V${vIndex}`,
        name: `${color.en} (${storage.en})`,
        arName: `${color.ar} (${storage.ar})`,
        attributes: { color: color.en, storage: storage.en },
        regularPrice: regularPrice + priceModifier,
        discountPrice: discountPrice + priceModifier,
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

  return variants;
}
