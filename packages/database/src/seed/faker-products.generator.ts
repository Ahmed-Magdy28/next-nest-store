import { faker } from "@faker-js/faker";
import {
  ALL_CATEGORY_BLUEPRINTS,
  EDITION_SUFFIXES,
} from "./blueprints";
import { buildProductVariants } from "./faker-variants.builder";
import {
  type ProductSeed,
  productGallery,
  productImage,
  slugify,
} from "./helpers";

/**
 * Generates deterministic, realistic product catalog items with Faker
 * across all category blueprints until `targetCount` products are created.
 */
export function generateFakerProducts(targetCount = 562): ProductSeed[] {
  faker.seed(2026);

  const generatedProducts: ProductSeed[] = [];
  let globalIndex = 1;
  let round = 0;

  while (generatedProducts.length < targetCount) {
    const suffix = EDITION_SUFFIXES[round % EDITION_SUFFIXES.length]!;

    for (const blueprint of ALL_CATEGORY_BLUEPRINTS) {
      if (generatedProducts.length >= targetCount) break;

      const categorySlugs = blueprint.parentSlug
        ? [blueprint.slug, blueprint.parentSlug]
        : [blueprint.slug];

      for (let i = 0; i < blueprint.models.length; i++) {
        if (generatedProducts.length >= targetCount) break;

        const model = blueprint.models[i]!;
        const brand = blueprint.brands[(i + round) % blueprint.brands.length]!;
        const fullName = suffix.en
          ? `${brand.en} ${model.en} (${suffix.en})`
          : `${brand.en} ${model.en}`;
        const fullArName = suffix.ar
          ? `${brand.ar} - ${model.ar} (${suffix.ar})`
          : `${brand.ar} - ${model.ar}`;

        const slug = `${slugify(fullName)}-${faker.string.alphanumeric(4).toLowerCase()}`;
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

        const hasDiscount = faker.datatype.boolean(0.4);
        const discountValue = hasDiscount
          ? faker.helpers.arrayElement([10, 15, 20, 25, 30])
          : undefined;
        const discountPrice =
          discountValue !== undefined
            ? Number((regularPrice * (1 - discountValue / 100)).toFixed(2))
            : regularPrice;

        const imageSeed = `faker-${blueprint.slug}-${globalIndex}`;
        const variants = buildProductVariants(
          blueprint,
          sku,
          regularPrice,
          discountPrice,
        );

        generatedProducts.push({
          name: fullName,
          arName: fullArName,
          slug,
          sku,
          regularPrice,
          discountPrice,
          onDiscount: hasDiscount,
          discountType: hasDiscount ? "PERCENTAGE" : undefined,
          discountValue,
          discountStartDate: hasDiscount
            ? new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
            : undefined,
          discountEndDate: hasDiscount
            ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
            : undefined,
          description: `${fullName}. Built with premium materials for maximum durability and everyday excellence. ${faker.commerce.productDescription()}`,
          arDescription: `${fullArName}. صُمم بأعلى معايير الجودة ليوفر أداءً استثنائياً وتجربة استخدام راقية مع ضمان الوكيل المعتمد.`,
          weight: Number(
            faker.number.float({ min: 0.2, max: 8.5, fractionDigits: 2 }),
          ),
          dimensions: {
            width: faker.number.int({ min: 10, max: 60 }),
            height: faker.number.int({ min: 10, max: 90 }),
            length: faker.number.int({ min: 10, max: 60 }),
            unit: "cm",
          },
          mainImage: productImage(imageSeed, 800),
          imageGallery: productGallery(imageSeed, 3, 800),
          categorySlugs,
          isNew: faker.datatype.boolean(0.35),
          variants: variants.length ? variants : undefined,
        });

        globalIndex++;
      }
    }

    round++;
  }

  return generatedProducts;
}
