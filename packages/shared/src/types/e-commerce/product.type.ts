import type { Prisma } from "@repo/database";

export type ProductWithRelations = Prisma.ProductGetPayload<{
  include: {
    categories: {
      include: { category: true };
    };
    variants: true;
  };
}>;

export type ProductVariantType = Prisma.ProductVariantGetPayload<{}>;
