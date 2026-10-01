import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";

import type { Prisma } from "@repo/database";
import type {
  ProductDto,
  ProductListItemDto,
  CreateProductDto,
  UpdateProductDto,
  ListProductsQueryDto,
  PaginatedResultDto,
  CategoryDto,
} from "@repo/shared/dtos";

import {
  MAX_PRODUCT_IN_STORE,
  MAX_PRODUCT_PER_CATEGORY,
  MAX_PRODUCT_UPLOAD_PER_ONCE,
} from "@repo/shared/constants";

import { ProductsRepository } from "./repositories/products.repository";
import { CategoriesRepository } from "../categories/repositories/categories.repository";
import { ProductMapper } from "./mappers/product.mapper";
import { CategoryMapper } from "../categories/mappers/category.mapper";
import { WishlistRepository } from "../wishlist/repositories/wishlist.repository";

@Injectable()
export class ProductsService {
  constructor(
    private readonly productsRepository: ProductsRepository,
    private readonly categoriesRepository: CategoriesRepository,
    private readonly wishlistRepository: WishlistRepository,
  ) {}

  // ─── Read ───────────────────────────────────────────────

  async findAll(
    query: ListProductsQueryDto,
    userId: string | null = null,
  ): Promise<PaginatedResultDto<ProductListItemDto>> {
    const { page, limit, sortBy, sortOrder } = query;
    const skip = (page - 1) * limit;

    const where = await this.buildWhere(query);
    const orderBy = this.buildOrderBy(sortBy, sortOrder);

    const [items, total, wishlistSet] = await Promise.all([
      this.productsRepository.findMany({ skip, take: limit, where, orderBy }),
      this.productsRepository.count(where),
      userId
        ? this.wishlistRepository.findProductIdsByUserId(userId)
        : Promise.resolve(new Set<string>()),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      items: items.map((p) =>
        ProductMapper.toListItemDto(p, wishlistSet.has(p.id)),
      ),
      meta: {
        total,
        page,
        limit,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    };
  }

  async findById(
    id: string,
    userId: string | null = null,
  ): Promise<ProductDto> {
    const product = await this.productsRepository.findById(id);
    if (!product) {
      throw new NotFoundException("Product not found");
    }

    const isInWishlist = userId
      ? (await this.wishlistRepository.findProductIdsByUserId(userId)).has(id)
      : false;

    return ProductMapper.toDto(product, isInWishlist);
  }

  async findBySlug(
    slug: string,
    userId: string | null = null,
  ): Promise<ProductDto> {
    const product = await this.productsRepository.findBySlug(slug);
    if (!product) {
      throw new NotFoundException("Product not found");
    }

    const isInWishlist = userId
      ? (await this.wishlistRepository.findProductIdsByUserId(userId)).has(
          product.id,
        )
      : false;

    return ProductMapper.toDto(product, isInWishlist);
  }

  // ─── Categories of a product ────────────────────────────

  async findCategoriesById(id: string): Promise<CategoryDto[]> {
    const product = await this.productsRepository.findById(id);
    if (!product) {
      throw new NotFoundException("Product not found");
    }
    return product.categories.map((pc) => CategoryMapper.toDto(pc.category));
  }

  async findCategoriesBySlug(slug: string): Promise<CategoryDto[]> {
    const product = await this.productsRepository.findBySlug(slug);
    if (!product) {
      throw new NotFoundException("Product not found");
    }
    return product.categories.map((pc) => CategoryMapper.toDto(pc.category));
  }

  // ─── Write (Admin only) ─────────────────────────────────

  async create(data: CreateProductDto): Promise<ProductDto> {
    await this.validateStoreLimit();
    await this.validateSlugAndSku(data.slug, data.sku);
    if (data.categoryIds?.length) {
      await this.validateCategories(data.categoryIds);
    }

    const createData = this.buildCreateData(data);

    const product = await this.productsRepository.create(createData);
    return ProductMapper.toDto(product);
  }

  async update(id: string, data: UpdateProductDto): Promise<ProductDto> {
    const existing = await this.productsRepository.findById(id);
    if (!existing) {
      throw new NotFoundException("Product not found");
    }

    if (data.slug && data.slug !== existing.slug) {
      const exists = await this.productsRepository.existsBySlug(data.slug, id);
      if (exists) {
        throw new ConflictException("Product slug already exists");
      }
    }
    if (data.sku && data.sku !== existing.sku) {
      const exists = await this.productsRepository.existsBySku(data.sku, id);
      if (exists) {
        throw new ConflictException("Product SKU already exists");
      }
    }

    if (data.categoryIds?.length) {
      await this.validateCategories(data.categoryIds, id);
    }

    const updateData = this.buildUpdateData(data);

    const product = await this.productsRepository.update(id, updateData);
    return ProductMapper.toDto(product);
  }

  async delete(id: string): Promise<void> {
    const product = await this.productsRepository.findById(id);
    if (!product) {
      throw new NotFoundException("Product not found");
    }
    await this.productsRepository.delete(id);
  }

  // ─── Bulk upload ────────────────────────────────────────

  async bulkCreate(products: CreateProductDto[]): Promise<{ created: number }> {
    // 1. نتحقق من الحد الأقصى للـ bulk
    if (products.length > MAX_PRODUCT_UPLOAD_PER_ONCE) {
      throw new BadRequestException(
        `Cannot upload more than ${MAX_PRODUCT_UPLOAD_PER_ONCE} products at once.`,
      );
    }

    // 2. نتحقق من الـ store limit
    const totalInStore = await this.productsRepository.countAll();
    if (totalInStore + products.length > MAX_PRODUCT_IN_STORE) {
      throw new ConflictException(
        `Store cannot hold more than ${MAX_PRODUCT_IN_STORE} products. Current: ${totalInStore}, tried to add: ${products.length}.`,
      );
    }

    // 3. نتحقق من الـ slugs و skus (لازم يكونوا unique داخل الـ bulk)
    const slugs = new Set<string>();
    const skus = new Set<string>();
    for (const p of products) {
      if (slugs.has(p.slug)) {
        throw new ConflictException(`Duplicate slug in bulk: ${p.slug}`);
      }
      slugs.add(p.slug);

      if (skus.has(p.sku)) {
        throw new ConflictException(`Duplicate SKU in bulk: ${p.sku}`);
      }
      skus.add(p.sku);
    }

    // 4. نتحقق إن الـ slugs و skus مش موجودين في الـ DB
    for (const p of products) {
      const slugExists = await this.productsRepository.existsBySlug(p.slug);
      if (slugExists) {
        throw new ConflictException(`Product slug already exists: ${p.slug}`);
      }
      const skuExists = await this.productsRepository.existsBySku(p.sku);
      if (skuExists) {
        throw new ConflictException(`Product SKU already exists: ${p.sku}`);
      }
    }

    // 5. نتحقق من الـ categories
    for (const p of products) {
      if (p.categoryIds?.length) {
        await this.validateCategories(p.categoryIds);
      }
    }

    // 6. نبني الـ create data (مع الـ relations)
    const createData = products.map((p) => this.buildCreateData(p));

    // 7. نستخدم bulkCreate (transaction)
    const result = await this.productsRepository.bulkCreate(createData);

    return { created: result.count };
  }

  // ─── Helpers ────────────────────────────────────────────

  private async buildWhere(
    query: ListProductsQueryDto,
  ): Promise<Prisma.ProductWhereInput> {
    const {
      search,
      categoryId,
      includeDescendants,
      isNew,
      onDiscount,
      isActive,
      isAvailable,
      minPrice,
      maxPrice,
    } = query;

    const where: Prisma.ProductWhereInput = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { arName: { contains: search, mode: "insensitive" } },
        { sku: { contains: search, mode: "insensitive" } },
        { slug: { contains: search, mode: "insensitive" } },
      ];
    }

    if (categoryId) {
      const categoryIds = includeDescendants
        ? await this.categoriesRepository.findAllDescendantIds(categoryId)
        : [categoryId];

      where.categories = {
        some: { categoryId: { in: categoryIds } },
      };
    }

    if (isNew !== undefined) where.isNew = isNew;
    if (onDiscount !== undefined) where.onDiscount = onDiscount;
    if (isActive !== undefined) where.isActive = isActive;
    if (isAvailable !== undefined) where.isAvailable = isAvailable;

    if (minPrice !== undefined || maxPrice !== undefined) {
      where.discountPrice = {};
      if (minPrice !== undefined) where.discountPrice.gte = minPrice;
      if (maxPrice !== undefined) where.discountPrice.lte = maxPrice;
    }

    return where;
  }

  private buildOrderBy(
    sortBy: ListProductsQueryDto["sortBy"],
    sortOrder: ListProductsQueryDto["sortOrder"],
  ): Prisma.ProductOrderByWithRelationInput {
    switch (sortBy) {
      case "price":
        return { discountPrice: sortOrder };
      case "name":
        return { name: sortOrder };
      case "updatedAt":
        return { updatedAt: sortOrder };
      case "createdAt":
      default:
        return { createdAt: sortOrder };
    }
  }

  private async validateStoreLimit(): Promise<void> {
    const total = await this.productsRepository.countAll();
    if (total >= MAX_PRODUCT_IN_STORE) {
      throw new ConflictException(
        `Store has reached the maximum of ${MAX_PRODUCT_IN_STORE} products.`,
      );
    }
  }

  private async validateSlugAndSku(slug: string, sku: string): Promise<void> {
    const slugExists = await this.productsRepository.existsBySlug(slug);
    if (slugExists) {
      throw new ConflictException("Product slug already exists");
    }

    const skuExists = await this.productsRepository.existsBySku(sku);
    if (skuExists) {
      throw new ConflictException("Product SKU already exists");
    }
  }

  private async validateCategories(
    categoryIds: string[],
    excludeProductId?: string,
  ): Promise<void> {
    for (const categoryId of categoryIds) {
      const category = await this.categoriesRepository.findById(categoryId);
      if (!category) {
        throw new BadRequestException(`Category ${categoryId} not found`);
      }

      const count =
        await this.categoriesRepository.countProductsByCategoryId(categoryId);

      const belongsToCategory =
        excludeProductId &&
        (await this.productBelongsToCategory(excludeProductId, categoryId));

      const effectiveCount = belongsToCategory ? count - 1 : count;

      if (effectiveCount >= MAX_PRODUCT_PER_CATEGORY) {
        throw new ConflictException(
          `Category "${category.name}" has reached the maximum of ${MAX_PRODUCT_PER_CATEGORY} products.`,
        );
      }
    }
  }

  private async productBelongsToCategory(
    productId: string,
    categoryId: string,
  ): Promise<boolean> {
    const product = await this.productsRepository.findById(productId);
    return (
      product?.categories.some((pc) => pc.categoryId === categoryId) ?? false
    );
  }

  private buildCreateData(data: CreateProductDto): Prisma.ProductCreateInput {
    const { categoryIds, variants, discountPrice, ...rest } = data;

    return {
      ...rest,
      discountPrice: discountPrice ?? data.regularPrice,
      discountStartDate: data.discountStartDate
        ? new Date(data.discountStartDate)
        : null,
      discountEndDate: data.discountEndDate
        ? new Date(data.discountEndDate)
        : null,
      categories: categoryIds?.length
        ? {
            create: categoryIds.map((categoryId) => ({ categoryId })),
          }
        : undefined,
      variants: {
        create: variants?.length
          ? variants.map((v) => ({
              ...v,
              attributes: v.attributes ?? {},
              imageGallery: v.imageGallery ?? [],
            }))
          : [
              {
                sku: `${data.sku}-DEFAULT`,
                name: data.name,
                arName: data.arName,
                regularPrice: data.regularPrice,
                discountPrice: discountPrice ?? data.regularPrice,
                stockQuantity: 10,
                isAvailable: true,
                isActive: true,
                attributes: {},
                imageGallery: [],
              },
            ],
      },
    };
  }

  private buildUpdateData(data: UpdateProductDto): Prisma.ProductUpdateInput {
    const { categoryIds, variants, discountPrice, ...rest } = data;

    const updateData: Prisma.ProductUpdateInput = { ...rest };

    if (discountPrice !== undefined) {
      updateData.discountPrice = discountPrice;
    }

    if (data.discountStartDate) {
      updateData.discountStartDate = new Date(data.discountStartDate);
    }
    if (data.discountEndDate) {
      updateData.discountEndDate = new Date(data.discountEndDate);
    }

    if (categoryIds) {
      updateData.categories = {
        deleteMany: {},
        create: categoryIds.map((categoryId) => ({ categoryId })),
      };
    }

    if (variants && variants.length > 0) {
      updateData.variants = {
        updateMany: {
          where: {
            sku: { notIn: variants.map((v) => v.sku) },
          },
          data: {
            isActive: false,
          },
        },
        upsert: variants.map((v) => ({
          where: { sku: v.sku },
          update: {
            name: v.name,
            arName: v.arName,
            size: v.size,
            regularPrice: v.regularPrice,
            discountPrice: v.discountPrice,
            stockQuantity: v.stockQuantity ?? 0,
            attributes: v.attributes ?? {},
            mainImage: v.mainImage,
            imageGallery: v.imageGallery ?? [],
            isActive: true,
          },
          create: {
            sku: v.sku,
            name: v.name,
            arName: v.arName,
            size: v.size,
            regularPrice: v.regularPrice,
            discountPrice: v.discountPrice,
            stockQuantity: v.stockQuantity ?? 0,
            attributes: v.attributes ?? {},
            mainImage: v.mainImage,
            imageGallery: v.imageGallery ?? [],
            isActive: true,
          },
        })),
      };
    }

    return updateData;
  }
}
