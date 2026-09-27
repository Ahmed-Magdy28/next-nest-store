import { ListCategoriesQueryDto } from "../../../schemas/e-commerce/categories";

export interface CategoryDto {
  id: string;
  name: string;
  arName: string;
  slug: string;
  image: string | null;
  parentId: string | null;
  isActive: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CategoryTreeDto extends CategoryDto {
  children: CategoryTreeDto[];
}

export interface CreateCategoryDto {
  name: string;
  arName: string;
  slug: string;
  image?: string;
  parentId?: string;
  isActive?: boolean;
  sortOrder?: number;
}

export interface UpdateCategoryDto extends Partial<CreateCategoryDto> {}
export type { ListCategoriesQueryDto };
