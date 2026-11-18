import type { PrismaClient } from "../../prisma/generated";
import { DiscountType } from "../../prisma/generated";
import { allProducts } from "./products";
import { generateFakerProducts } from "./faker-products.generator";
import type { ProductSeed } from "./helpers";
import type { CreateProductDto } from "@repo/shared/dtos/e-commerce";

/**
 * يحوّل الـ ProductSeed + categorySlugs لـ Prisma input
 */
function buildProductData(product: ProductSeed, slugToId: Map<string, string>) {
  const categoryIds = (product.categorySlugs ?? [])
    .map((slug) => slugToId.get(slug))
    .filter((id): id is string => !!id);

  const {
    categoryIds: _,
    categorySlugs: __,
    variants,
    discountPrice,
    ...rest
  } = product as CreateProductDto & { categorySlugs?: string[] };

  return {
    ...rest,
    discountPrice: discountPrice ?? product.regularPrice,
    discountType: (product.discountType as DiscountType | undefined) ?? null,
    discountStartDate: product.discountStartDate
      ? new Date(product.discountStartDate)
      : null,
    discountEndDate: product.discountEndDate
      ? new Date(product.discountEndDate)
      : null,
    categories: categoryIds.length
      ? { create: categoryIds.map((categoryId) => ({ categoryId })) }
      : undefined,
    variants: variants?.length
      ? {
          create: variants.map((v) => ({
            ...v,
            attributes: v.attributes ?? {},
            imageGallery: v.imageGallery ?? [],
          })),
        }
      : undefined,
  };
}

export async function seedProducts(
  prisma: PrismaClient,
  slugToId: Map<string, string>,
) {
  const targetFakerCount = Math.max(0, 600 - allProducts.length);
  const fakerProducts = generateFakerProducts(targetFakerCount);
  const totalProducts = [...allProducts, ...fakerProducts];

  console.log(
    `🌱 Seeding ${totalProducts.length} products (${allProducts.length} curated + ${fakerProducts.length} Faker generated)...`,
  );

  const batchSize = 10;
  let created = 0;

  for (let i = 0; i < totalProducts.length; i += batchSize) {
    const batch = totalProducts.slice(i, i + batchSize);
    await Promise.all(
      batch.map((product) => {
        const data = buildProductData(product, slugToId);
        return prisma.product.upsert({
          where: { slug: product.slug },
          update: {
            mainImage: data.mainImage,
            imageGallery: data.imageGallery,
          },
          create: data,
        });
      }),
    );

    created += batch.length;
    if (created % 50 === 0 || created === totalProducts.length) {
      console.log(`  ↳ ${created}/${totalProducts.length}`);
    }
  }

  console.log(`✅ Seeded ${created} products`);
}
