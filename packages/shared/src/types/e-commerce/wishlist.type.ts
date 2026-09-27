import type { Prisma } from "@repo/database";

export type WishlistWithRelations = Prisma.WishlistGetPayload<{
  include: {
    items: {
      include: {
        product: {
          select: {
            id: true;
            name: true;
            arName: true;
            slug: true;
            sku: true;
            mainImage: true;
            regularPrice: true;
            discountPrice: true;
            onDiscount: true;
            isActive: true;
            isAvailable: true;
            deletedAt: true;
          };
        };
      };
    };
  };
}>;

export type WishlistItemWithRelations = WishlistWithRelations["items"][number];
