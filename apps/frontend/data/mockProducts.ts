import { Category, Product } from "@repo/shared/interfaces/shop";

const categoryElectronics: Category = {
  id: "cat-1",
  name: "Electronics",
  slug: "electronics",
  image:
    "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=600&q=80",
};

const categoryAccessories: Category = {
  id: "cat-2",
  name: "Accessories",
  slug: "accessories",
  image:
    "https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=600&q=80",
};

const categoryClothing: Category = {
  id: "cat-3",
  name: "Clothing",
  slug: "clothing",
  image:
    "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=600&q=80",
};

export const MOCK_CATEGORIES: Category[] = [
  categoryElectronics,
  categoryAccessories,
  categoryClothing,
];

export const MOCK_PRODUCTS: Product[] = [
  {
    id: "prod-101",
    SKU: "EL-HPH-001",
    name: "Wireless Noise-Canceling Headphones",
    category: categoryElectronics,
    price: 249.99,
    originalPrice: 299.99,
    rating: 4.8,
    reviewsCount: 128,
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80",
    description:
      "Premium noise-canceling headphones featuring 30-hour battery life, active noise cancellation, and spatial audio support.",
    isNew: true,
    inStock: true,
  },
  {
    id: "prod-102",
    SKU: "AC-WTC-002",
    name: "Minimalist Leather Watch",
    category: categoryAccessories,
    price: 120.0,
    rating: 4.6,
    reviewsCount: 85,
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80",
    description:
      "Classic design with a genuine leather strap, sapphire crystal glass, and 5 ATM water resistance.",
    inStock: true,
  },
  {
    id: "prod-103",
    SKU: "EL-KBD-003",
    name: "Ergonomic Mechanical Keyboard",
    category: categoryElectronics,
    price: 159.5,
    originalPrice: 180.0,
    rating: 4.9,
    reviewsCount: 210,
    image:
      "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&q=80",
    description:
      "RGB backlighting, hot-swappable tactile switches, and wireless Bluetooth 5.0 connection.",
    inStock: true,
  },
  {
    id: "prod-104",
    SKU: "CL-HD-004",
    name: "Organic Cotton Casual Hoodie",
    category: categoryClothing,
    price: 65.0,
    rating: 4.4,
    reviewsCount: 42,
    image:
      "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=600&q=80",
    description:
      "100% organic cotton hoodie designed for ultimate everyday comfort and durability.",
    inStock: true,
  },
  {
    id: "prod-105",
    SKU: "AC-BTL-005",
    name: "Stainless Steel Thermal Water Bottle",
    category: categoryAccessories,
    price: 34.99,
    rating: 4.7,
    reviewsCount: 319,
    image:
      "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&q=80",
    description:
      "Double-wall vacuum insulation keeps drinks cold for 24 hours or hot for 12 hours.",
    isNew: true,
    inStock: true,
  },
  {
    id: "prod-106",
    SKU: "EL-MSE-006",
    name: "Pro Gaming Wireless Mouse",
    category: categoryElectronics,
    price: 79.99,
    originalPrice: 99.99,
    rating: 4.8,
    reviewsCount: 156,
    image:
      "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=600&q=80",
    description:
      "Ultra-lightweight gaming mouse with 26,000 DPI optical sensor and sub-1ms response time.",
    inStock: true,
  },
];
