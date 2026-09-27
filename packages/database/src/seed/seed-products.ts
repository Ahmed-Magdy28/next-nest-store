import type { PrismaClient } from "../../prisma/generated";
import { DiscountType } from "../../prisma/generated";
import { allProducts } from "./products";
import type { ProductSeed } from "./helpers";
import { CreateProductDto } from "../../../shared/dist/dtos/e-commerce/products/product.dto";

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
  console.log(`🌱 Seeding ${allProducts.length} products...`);

  let created = 0;

  for (const product of allProducts) {
    const data = buildProductData(product, slugToId);

    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {},
      create: data,
    });

    created++;
    if (created % 10 === 0) {
      console.log(`  ↳ ${created}/${allProducts.length}`);
    }
  }

  console.log(`✅ Seeded ${created} products`);
}
