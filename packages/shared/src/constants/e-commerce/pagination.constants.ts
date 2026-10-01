// ═══════════════════════════════════════════════════════════════
// Shared
// ═══════════════════════════════════════════════════════════════

/** Default page number for paginated endpoints */
export const DEFAULT_PAGE = 1;

// ═══════════════════════════════════════════════════════════════
// Categories
// ═══════════════════════════════════════════════════════════════

/** Default number of categories per page */
export const DEFAULT_CATEGORIES_LIMIT_PER_PAGE = 5;

/** Max number of categories per page (hard cap on `limit` query param) */
export const MAX_CATEGORIES_LIMIT = 500;

/** Max number of direct children a category can have */
export const MAX_CHILDREN_CATEGORY_PER_PARENT_CATEGORY = 15;

// ═══════════════════════════════════════════════════════════════
// Products
// ═══════════════════════════════════════════════════════════════

/** Default number of products per page in list endpoints */
export const DEFAULT_PRODUCT_LIMIT_PER_PAGE = 15;

/** Max number of products per page (hard cap on `limit` query param) */
export const MAX_PRODUCT_LIMIT_PER_PAGE = 100;

/** Max number of products allowed in the entire store */
export const MAX_PRODUCT_IN_STORE = 1000;

/** Max number of products that can be uploaded in a single bulk request */
export const MAX_PRODUCT_UPLOAD_PER_ONCE = 500;

/** Max number of products directly linked to a single category (descendants not counted) */
export const MAX_PRODUCT_PER_CATEGORY = 200;

// ═══════════════════════════════════════════════════════════════
// Defaults
// ═══════════════════════════════════════════════════════════════

export const PAGINATION_DEFAULT = {
  page: DEFAULT_PAGE,
  limit: DEFAULT_CATEGORIES_LIMIT_PER_PAGE,
} as const;
