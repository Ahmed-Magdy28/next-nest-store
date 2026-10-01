/**
 * Centralised query keys.
 *
 * Using a factory keeps cache invalidation predictable and prevents typos.
 */

export const queryKeys = {
  // Auth
  me: ["auth", "me"] as const,
  profile: ["users", "profile"] as const,
  sessions: ["auth", "sessions"] as const,
  addresses: ["addresses"] as const,

  // Products
  products: {
    all: ["products"] as const,
    list: (params?: Record<string, unknown>) =>
      ["products", "list", params ?? {}] as const,
    detail: (slug: string) => ["products", "detail", slug] as const,
    featured: ["products", "featured"] as const,
    newArrivals: ["products", "new-arrivals"] as const,
    deals: ["products", "deals"] as const,
  },

  // Categories
  categories: {
    all: ["categories"] as const,
    tree: ["categories", "tree"] as const,
    list: (params?: Record<string, unknown>) =>
      ["categories", "list", params ?? {}] as const,
    detail: (slug: string) => ["categories", "detail", slug] as const,
    products: (slug: string, params?: Record<string, unknown>) =>
      ["categories", "products", slug, params ?? {}] as const,
  },

  // Cart
  cart: ["cart"] as const,

  // Wishlist
  wishlist: ["wishlist"] as const,

  // Reviews
  reviews: {
    product: (productId: string, params?: Record<string, unknown>) =>
      ["reviews", "product", productId, params ?? {}] as const,
    summary: (productId: string) => ["reviews", "summary", productId] as const,
  },

  // Orders
  orders: {
    all: ["orders"] as const,
    myList: (params?: Record<string, unknown>) =>
      ["orders", "my", params ?? {}] as const,
    myDetail: (id: string) => ["orders", "my", id] as const,
  },
} as const;
