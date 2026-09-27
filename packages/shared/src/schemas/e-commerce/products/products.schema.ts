import { z } from "zod";
import {
  DEFAULT_PAGE,
  DEFAULT_PRODUCT_LIMIT_PER_PAGE,
  MAX_PRODUCT_LIMIT_PER_PAGE,
  MAX_PRODUCT_UPLOAD_PER_ONCE,
} from "../../../constants";

// ─── Boolean helpers ────────────────────────────────────

/**
 * Parses optional boolean from query string.
 * - undefined/null/"" → undefined (no filter)
 * - "true"/true → true
 * - "false"/false → false
 */
const optionalBoolean = z.preprocess((val) => {
  if (val === undefined || val === null || val === "") return undefined;
  if (val === "true" || val === true) return true;
  if (val === "false" || val === false) return false;
  return val;
}, z.boolean().optional());

/**
 * Parses boolean from query string with a default.
 * - undefined/null/"" → defaultValue
 * - "true"/true → true
 * - "false"/false → false
 */
const defaultBoolean = (defaultValue: boolean) =>
  z.preprocess((val) => {
    if (val === undefined || val === null || val === "") return defaultValue;
    if (val === "true" || val === true) return true;
    if (val === "false" || val === false) return false;
    return val;
  }, z.boolean());

// ─── Variant ────────────────────────────────────────────

const variantSchema = z.object({
  sku: z.string().min(1),
  name: z.string().min(1),
  arName: z.string().optional(),
  size: z.string().optional(),
  attributes: z.record(z.string(), z.any()),
  regularPrice: z.number().positive().optional(),
  discountPrice: z.number().positive().optional(),
  stockQuantity: z.number().int().min(0).optional(),
  mainImage: z.string().url().optional(),
  imageGallery: z.array(z.string().url()).optional(),
});

// ─── Create / Update ────────────────────────────────────

export const createProductSchema = z.object({
  name: z.string().min(2).max(200),
  arName: z.string().min(2).max(200),
  slug: z
    .string()
    .min(2)
    .max(200)
    .regex(/^[a-z0-9-]+$/),
  sku: z.string().min(1).max(100),
  regularPrice: z.number().positive(),
  discountPrice: z.number().positive().optional(),
  onDiscount: z.boolean().optional(),
  discountType: z.enum(["PERCENTAGE", "FIXED"]).optional(),
  discountValue: z.number().positive().optional(),
  discountStartDate: z.string().datetime().optional(),
  discountEndDate: z.string().datetime().optional(),
  description: z.string().optional(),
  arDescription: z.string().optional(),
  weight: z.number().positive().optional(),
  dimensions: z.record(z.string(), z.any()).optional(),
  mainImage: z.string().url(),
  imageGallery: z.array(z.string().url()).optional(),
  categoryIds: z.array(z.string().uuid()).optional(),
  variants: z.array(variantSchema).optional(),
});

export const updateProductSchema = createProductSchema.partial();

export const bulkCreateProductsSchema = z.object({
  products: z
    .array(createProductSchema)
    .min(1)
    .max(MAX_PRODUCT_UPLOAD_PER_ONCE),
});

// ─── List ───────────────────────────────────────────────

export const listProductsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(DEFAULT_PAGE),
  limit: z.coerce
    .number()
    .int()
    .min(1)
    .max(MAX_PRODUCT_LIMIT_PER_PAGE)
    .default(DEFAULT_PRODUCT_LIMIT_PER_PAGE),

  search: z.string().trim().min(1).optional(),
  categoryId: z.string().uuid().optional(),
  includeDescendants: defaultBoolean(true),
  isNew: optionalBoolean,
  onDiscount: optionalBoolean,
  isActive: optionalBoolean,
  isAvailable: optionalBoolean,
  minPrice: z.coerce.number().positive().optional(),
  maxPrice: z.coerce.number().positive().optional(),

  sortBy: z
    .enum(["createdAt", "updatedAt", "price", "name"])
    .default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export const listProductsByCategoryQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(DEFAULT_PAGE),
  limit: z.coerce
    .number()
    .int()
    .min(1)
    .max(MAX_PRODUCT_LIMIT_PER_PAGE)
    .default(DEFAULT_PRODUCT_LIMIT_PER_PAGE),
  includeDescendants: defaultBoolean(true), // ← جديد
});
