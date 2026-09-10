import { Category } from "./categories";

export interface Product {
  id: string;
  name: string;
  category: Category;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewsCount: number;
  image: string;
  description?: string;
  isNew?: boolean;
  inStock: boolean;
  SKU: string;
}
