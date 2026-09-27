import type { PrismaClient } from "../../prisma/generated";
import { categoriesData, type CategorySeed } from "./categories.data";
import { categoryImage } from "./helpers";

/**
 * يعمل upsert لكل الفئات ويرجّع map { slug → id }
 */
export async function seedCategories(prisma: PrismaClient) {
  console.log("🌱 Seeding categories...");

  const slugToId = new Map<string, string>();

  // Pass 1: roots
  for (const root of categoriesData) {
    const category = await prisma.category.upsert({
      where: { slug: root.slug },
      update: {
        name: root.name,
        arName: root.arName,
        image: categoryImage(root.imageSeed),
      },
      create: {
        name: root.name,
        arName: root.arName,
        slug: root.slug,
        image: categoryImage(root.imageSeed),
        isActive: true,
        sortOrder: 0,
      },
    });
    slugToId.set(root.slug, category.id);
  }

  // Pass 2: children
  for (const root of categoriesData) {
    if (!root.children) continue;
    const parentId = slugToId.get(root.slug)!;

    let i = 0;
    for (const child of root.children) {
      const category = await prisma.category.upsert({
        where: { slug: child.slug },
        update: {
          name: child.name,
          arName: child.arName,
          parentId,
          image: categoryImage(child.imageSeed),
          sortOrder: i,
        },
        create: {
          name: child.name,
          arName: child.arName,
          slug: child.slug,
          parentId,
          image: categoryImage(child.imageSeed),
          isActive: true,
          sortOrder: i,
        },
      });
      slugToId.set(child.slug, category.id);
      i++;
    }
  }

  console.log(`✅ Seeded ${slugToId.size} categories`);
  return slugToId;
}
