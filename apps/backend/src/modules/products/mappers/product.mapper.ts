import type { Prisma } from "@repo/database";
import type {
  ProductDto,
  ProductListItemDto,
  ProductVariantDto,
} from "@repo/shared/dtos/e-commerce";
import { ProductVariantType } from "@repo/shared/types/e-commerce";

// ✅ نوع explicit للـ product مع كل الـ relations الممكنة
type ProductWithRelations = Prisma.ProductGetPayload<{
  include: {
    categories: {
      include: { category: true };
    };
    variants: true;
  };
}>;

// type ProductVariant = Prisma.ProductVariantGetPayload<{}>;

export class ProductMapper {
  // ─── Variant ───────────────────────────────────────────

  static toVariantDto(variant: ProductVariantType): ProductVariantDto {
    return {
      id: variant.id,
      productId: variant.productId,
      sku: variant.sku,
      name: variant.name,
      arName: variant.arName,
      size: variant.size,
      attributes: (variant.attributes ?? {}) as Record<string, string>,
      regularPrice: variant.regularPrice ? Number(variant.regularPrice) : null,
      discountPrice: variant.discountPrice
        ? Number(variant.discountPrice)
        : null,
      stockQuantity: variant.stockQuantity,
      isAvailable: variant.isAvailable,
      mainImage: variant.mainImage,
      imageGallery: variant.imageGallery,
      isActive: variant.isActive,
      sortOrder: variant.sortOrder,
    };
  }

  // ─── Product (full) ────────────────────────────────────

  static toDto(
    product: ProductWithRelations,
    isInWishlist: boolean = false,
  ): ProductDto {
    return {
      id: product.id,
      name: product.name,
      arName: product.arName,
      slug: product.slug,
      sku: product.sku,
      isNew: product.isNew,
      isActive: product.isActive,
      isAvailable: product.isAvailable,
      regularPrice: Number(product.regularPrice),
      discountPrice: Number(product.discountPrice),
      onDiscount: product.onDiscount,
      discountType: product.discountType,
      discountValue: product.discountValue
        ? Number(product.discountValue)
        : null,
      discountStartDate: product.discountStartDate,
      discountEndDate: product.discountEndDate,
      description: product.description,
      arDescription: product.arDescription,
      weight: product.weight,
      dimensions: product.dimensions,
      mainImage: product.mainImage,
      imageGallery: product.imageGallery,
      isInWishlist,
      categories: product.categories.map((pc) => ({
        id: pc.category.id,
        name: pc.category.name,
        arName: pc.category.arName,
      })),
      variants: product.variants.map((v) => ProductMapper.toVariantDto(v)),
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    };
  }

  // ─── Product (list item) ───────────────────────────────

  static toListItemDto(
    product: ProductWithRelations,
    isInWishlist: boolean = false,
  ): ProductListItemDto {
    return {
      id: product.id,
      name: product.name,
      arName: product.arName,
      slug: product.slug,
      mainImage: product.mainImage,
      regularPrice: Number(product.regularPrice),
      discountPrice: Number(product.discountPrice),
      onDiscount: product.onDiscount,
      isNew: product.isNew,
      isAvailable: product.isAvailable,
      isInWishlist,
      categories: product.categories.map((pc) => ({
        id: pc.category.id,
        name: pc.category.name,
        arName: pc.category.arName,
        slug: pc.category.slug,
      })),
    };
  }
}
