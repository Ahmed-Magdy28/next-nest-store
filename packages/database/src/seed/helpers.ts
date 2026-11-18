import { CATEGORY_IMAGE_MAP, PRODUCT_IMAGE_POOL } from "./image-maps";

function hashSeed(seed: string): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }
  return hash;
}

/**
 * Returns a deterministic Unsplash product image URL for a given seed.
 */
export function productImage(seed: string, size = 800): string {
  const url =
    PRODUCT_IMAGE_POOL[hashSeed(seed) % PRODUCT_IMAGE_POOL.length] ??
    PRODUCT_IMAGE_POOL[0];
  return `${url}?auto=format&fit=crop&w=${size}&h=${size}&q=80`;
}

/**
 * Returns a list of deterministic product gallery URLs for a given seed.
 */
export function productGallery(seed: string, count = 3, size = 800): string[] {
  return Array.from({ length: count }, (_, i) =>
    productImage(`${seed}-${i + 1}`, size),
  );
}

/**
 * Returns a verified Unsplash category image URL for a given `imageSeed`.
 */
export function categoryImage(seed: string, size = 400): string {
  const baseUrl =
    CATEGORY_IMAGE_MAP[seed] ??
    "https://images.unsplash.com/photo-1498049794561-7780e7231661";
  return `${baseUrl}?auto=format&fit=crop&w=${size}&h=${size}&q=80`;
}

/**
 * Converts a string into a URL-safe slug (supports English and Arabic).
 */
export function slugify(text: string): string {
  return text
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[\s_]+/g, "-")
    .replace(/[^\w\u0600-\u06FF-]+/g, "")
    .replace(/--+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Generates a padded SKU string from a prefix and numeric index.
 */
export function makeSku(prefix: string, index: number): string {
  return `${prefix}-${String(index).padStart(4, "0")}`;
}

/** Variant payload used when seeding products. */
export interface ProductVariantSeed {
  sku: string;
  name: string;
  arName?: string;
  size?: string;
  attributes?: Record<string, unknown>;
  regularPrice?: number;
  discountPrice?: number;
  stockQuantity?: number;
  mainImage?: string;
  imageGallery?: string[];
}

/** Product payload used when seeding products. */
export interface ProductSeed {
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
  dimensions?: Record<string, unknown>;
  mainImage: string;
  imageGallery?: string[];
  categorySlugs?: string[];
  isNew?: boolean;
  variants?: ProductVariantSeed[];
}
