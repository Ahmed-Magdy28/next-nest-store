/**
 * صور منتجات بجودة ثابتة من picsum.photos
 * استخدام seed ثابت عشان الصورة متتغيرش كل مرة.
 */
export function productImage(seed: string, size = 800): string {
  return `https://picsum.photos/seed/${encodeURIComponent(seed)}/${size}/${size}`;
}

export function productGallery(seed: string, count = 3, size = 800): string[] {
  return Array.from({ length: count }, (_, i) =>
    productImage(`${seed}-${i + 1}`, size),
  );
}

/**
 * صور الفئات من picsum (مش هتحتاج صور حقيقية دلوقتي).
 */
export function categoryImage(seed: string, size = 400): string {
  return `https://picsum.photos/seed/cat-${encodeURIComponent(seed)}/${size}/${size}`;
}

/**
 * slugify بسيط (بيدعم الإنجليزي والعربي).
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
 * SKU generator
 */
export function makeSku(prefix: string, index: number): string {
  return `${prefix}-${String(index).padStart(4, "0")}`;
}

export interface ProductVariantSeed {
  sku: string;
  name: string;
  arName?: string;
  size?: string;
  attributes?: Record<string, any>;
  regularPrice?: number;
  discountPrice?: number;
  stockQuantity?: number;
  mainImage?: string;
  imageGallery?: string[];
}

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
  dimensions?: Record<string, any>;
  mainImage: string;
  imageGallery?: string[];
  categorySlugs?: string[];
  isNew?: boolean;
  variants?: ProductVariantSeed[];
}
