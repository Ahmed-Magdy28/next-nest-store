import { DiscountType } from "@repo/database";
import {
  bulkCreateProductsSchema,
  listProductsByCategoryQuerySchema,
  listProductsQuerySchema,
} from "../../../schemas";
import { z } from "zod";

// TODO: fix the DiscountType

export interface ProductVariantDto {
  id: string;
  productId: string;
  sku: string;
  name: string;
  arName: string | null;
  size: string | null;
  attributes: Record<string, any>;
  regularPrice: number | null;
  discountPrice: number | null;
  stockQuantity: number;
  isAvailable: boolean;
  mainImage: string | null;
  imageGallery: string[];
  isActive: boolean;
  sortOrder: number;
}

export interface ProductDto {
  id: string;
  name: string;
  arName: string;
  slug: string;
  sku: string;
  isNew: boolean;
  isActive: boolean;
  isAvailable: boolean;
  regularPrice: number;
  discountPrice: number;
  onDiscount: boolean;
  discountType: DiscountType | null;
  discountValue: number | null;
  discountStartDate: Date | null;
  discountEndDate: Date | null;
  description: string | null;
  arDescription: string | null;
  weight: number | null;
  dimensions: any;
  mainImage: string;
  imageGallery: string[];
  categories: { id: string; name: string; arName: string }[];
  variants: ProductVariantDto[];
  isInWishlist: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// اللي بيتبعت للعميل (catalog)
export interface ProductListItemDto {
  id: string;
  name: string;
  arName: string;
  slug: string;
  sku?: string;
  mainImage: string;
  regularPrice: number;
  discountPrice: number;
  onDiscount: boolean;
  isNew: boolean;
  isAvailable: boolean;
  isActive: boolean;
  categories: { id: string; name: string; arName: string; slug: string }[];
  isInWishlist: boolean;
  variants?: ProductVariantDto[];
}

export interface CreateProductDto {
  name: string;
  arName: string;
  slug: string;
  sku: string;
  regularPrice: number;
  discountPrice?: number;
  onDiscount?: boolean;
  discountType?: "PERCENTAGE" | "FIXED";
  discountValue?: number;
  discountStartDate?: string;
  discountEndDate?: string;
  description?: string;
  arDescription?: string;
  weight?: number;
  dimensions?: Record<string, any>;
  mainImage: string;
  imageGallery?: string[];
  categoryIds?: string[];
  variants?: CreateVariantDto[];
}

export interface CreateVariantDto {
  sku: string;
  name: string;
  arName?: string;
  size?: string;
  attributes: Record<string, any>;
  regularPrice?: number;
  discountPrice?: number;
  stockQuantity?: number;
  mainImage?: string;
  imageGallery?: string[];
}
export type UpdateProductDto = Partial<CreateProductDto>;
export type ListProductsQueryDto = z.infer<typeof listProductsQuerySchema>;
export type ListProductsByCategoryQueryDto = z.infer<
  typeof listProductsByCategoryQuerySchema
>;
export type BulkCreateProductsDto = z.infer<typeof bulkCreateProductsSchema>;
