import { z } from "zod";
import {
  DEFAULT_CATEGORIES_LIMIT_PER_PAGE,
  DEFAULT_PAGE,
  MAX_CATEGORIES_LIMIT,
} from "../../../constants";

const optionalBoolean = z.preprocess((val) => {
  if (val === undefined || val === null || val === "") return undefined;
  if (val === "true" || val === true) return true;
  if (val === "false" || val === false) return false;
  return val;
}, z.boolean().optional());

export const createCategorySchema = z.object({
  name: z.string().min(2).max(100),
  arName: z.string().min(2).max(100),
  slug: z
    .string()
    .min(2)
    .max(100)
    .regex(/^[a-z0-9-]+$/),
  image: z.string().url().optional(),
  parentId: z.string().uuid().optional(),
  isActive: z.boolean().optional(),
  sortOrder: z.number().int().min(0).optional(),
});

export const listCategoriesQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(DEFAULT_PAGE),
  limit: z.coerce
    .number()
    .int()
    .min(1)
    .max(MAX_CATEGORIES_LIMIT)
    .default(DEFAULT_CATEGORIES_LIMIT_PER_PAGE),
  parentId: z.string().uuid().optional(),
  isActive: optionalBoolean, // ← جديد
  search: z.string().trim().min(1).optional(),
});

export const updateCategorySchema = createCategorySchema.partial();
export type ListCategoriesQueryDto = z.infer<typeof listCategoriesQuerySchema>;
