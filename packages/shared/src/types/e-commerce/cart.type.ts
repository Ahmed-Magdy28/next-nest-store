import type { Prisma } from "@repo/database";

/**
 * Cart with all relations needed for mapping to CartDto.
 */
export type CartWithRelations = Prisma.CartGetPayload<{
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
        variant: {
          select: {
            id: true;
            name: true;
            arName: true;
            size: true;
            attributes: true;
            regularPrice: true;
            discountPrice: true;
            stockQuantity: true;
            isActive: true;
            isAvailable: true;
          };
        };
      };
    };
  };
}>;

export type CartItemWithRelations = CartWithRelations["items"][number];
