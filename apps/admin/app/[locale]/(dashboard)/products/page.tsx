"use client";

import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { productsApi, categoriesApi } from "@/lib/api";
import { Plus, Search } from "lucide-react";
import { toast } from "sonner";
import type { ProductDto, CategoryDto } from "@repo/shared/dtos/e-commerce";
import { ProductTable } from "@/components/products/product-table";
import {
  ProductFormModal,
  type VariantFormItem,
} from "@/components/products/product-form-modal";

export default function ProductsPage() {
  const t = useTranslations("Products");
  const tCommon = useTranslations("Common");
  const queryClient = useQueryClient();

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductDto | null>(null);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);

  // Form State
  const [name, setName] = useState("");
  const [arName, setArName] = useState("");
  const [slug, setSlug] = useState("");
  const [sku, setSku] = useState("");
  const [description, setDescription] = useState("");
  const [arDescription, setArDescription] = useState("");
  const [regularPrice, setRegularPrice] = useState("");
  const [discountPrice, setDiscountPrice] = useState("");
  const [stockQuantity, setStockQuantity] = useState("10");
  const [mainImage, setMainImage] = useState("");
  const [imageGallery, setImageGallery] = useState<string[]>([]);
  const [galleryInput, setGalleryInput] = useState("");
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);
  const [isAvailable, setIsAvailable] = useState(true);
  const [isActive, setIsActive] = useState(true);
  const [variants, setVariants] = useState<VariantFormItem[]>([]);

  // Queries
  const { data: productsData, isLoading } = useQuery({
    queryKey: ["admin", "products", page, search],
    queryFn: () => productsApi.getProducts({ page, limit: 10, search }),
  });

  const { data: categories } = useQuery({
    queryKey: ["admin", "categories", "list"],
    queryFn: () => categoriesApi.getCategories(),
  });

  // Map categories with parent hierarchy
  const formattedCategories = useMemo(() => {
    const list = (
      Array.isArray(categories) ? categories : (categories as any)?.items || []
    ) as CategoryDto[];
    if (!list || list.length === 0) return [];
    const map = new Map<string, CategoryDto>();
    list.forEach((c: CategoryDto) => map.set(c.id, c));

    return list.map((cat: CategoryDto) => {
      const parent = cat.parentId ? map.get(cat.parentId) : null;
      return {
        ...cat,
        label: parent ? `${parent.name} > ${cat.name}` : cat.name,
        isSub: !!cat.parentId,
      };
    });
  }, [categories]);

  // Mutations
  const createMutation = useMutation({
    mutationFn: (data: any) => productsApi.createProduct(data),
    onSuccess: () => {
      toast.success(t("createSuccess"));
      queryClient.invalidateQueries({ queryKey: ["admin", "products"] });
      closeModal();
    },
    onError: (err: any) =>
      toast.error(
        err?.message || "Failed to create product. Check that fields are filled."
      ),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      productsApi.updateProduct(id, data),
    onSuccess: () => {
      toast.success(t("updateSuccess"));
      queryClient.invalidateQueries({ queryKey: ["admin", "products"] });
      closeModal();
    },
    onError: (err: any) =>
      toast.error(err?.message || "Failed to update product"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => productsApi.deleteProduct(id),
    onSuccess: () => {
      toast.success(t("deleteSuccess"));
      queryClient.invalidateQueries({ queryKey: ["admin", "products"] });
    },
    onError: (err: any) =>
      toast.error(err?.message || "Failed to delete product"),
  });

  const openCreateModal = () => {
    const list = (
      Array.isArray(categories) ? categories : (categories as any)?.items || []
    ) as CategoryDto[];
    setEditingProduct(null);
    setIsLoadingDetails(false);
    setName("");
    setArName("");
    setSlug("");
    setSku("");
    setDescription("");
    setArDescription("");
    setRegularPrice("");
    setDiscountPrice("");
    setStockQuantity("10");
    setMainImage("");
    setImageGallery([]);
    setGalleryInput("");
    setSelectedCategoryIds(list[0]?.id ? [list[0].id] : []);
    setIsAvailable(true);
    setIsActive(true);
    setVariants([]);
    setIsModalOpen(true);
  };

  const openEditModal = async (p: ProductDto | any) => {
    setIsModalOpen(true);
    setIsLoadingDetails(true);

    setEditingProduct(p);
    setName(p.name ?? "");
    setArName(p.arName ?? "");
    setSlug(p.slug ?? "");
    setSku(p.sku ?? "");
    setDescription(p.description ?? "");
    setArDescription(p.arDescription ?? "");
    setRegularPrice(p.regularPrice ? String(p.regularPrice) : "");
    setDiscountPrice(p.discountPrice ? String(p.discountPrice) : "");
    setMainImage(p.mainImage ?? "");
    setImageGallery(p.imageGallery ?? []);
    setGalleryInput("");
    setSelectedCategoryIds(
      p.categories?.map((c: any) => c.categoryId || c.id) || []
    );
    setIsAvailable(p.isAvailable ?? true);
    setIsActive(p.isActive ?? true);

    const initialStock =
      p.variants?.reduce(
        (sum: number, v: any) => sum + (v.stockQuantity ?? 0),
        0
      ) ?? 10;
    setStockQuantity(String(initialStock));

    if (p.variants && p.variants.length > 0) {
      setVariants(
        p.variants.map((v: any) => ({
          id: v.id || `var-${Math.random()}`,
          name: v.name ?? "",
          arName: v.arName ?? "",
          sku: v.sku ?? "",
          size: v.size ?? "",
          color: (v.attributes as any)?.color ?? "",
          regularPrice: v.regularPrice ? String(v.regularPrice) : "",
          discountPrice: v.discountPrice ? String(v.discountPrice) : "",
          stockQuantity: String(v.stockQuantity ?? 10),
        }))
      );
    } else {
      setVariants([]);
    }

    try {
      const full = await productsApi.getProduct(p.id);
      if (full) {
        setEditingProduct(full);
        setName(full.name ?? "");
        setArName(full.arName ?? "");
        setSlug(full.slug ?? "");
        setSku(full.sku ?? "");
        setDescription(full.description ?? "");
        setArDescription(full.arDescription ?? "");
        setRegularPrice(full.regularPrice ? String(full.regularPrice) : "");
        setDiscountPrice(
          full.discountPrice ? String(full.discountPrice) : ""
        );
        setMainImage(full.mainImage ?? "");
        setImageGallery(full.imageGallery ?? []);
        setSelectedCategoryIds(
          full.categories?.map((c: any) => c.id || c.categoryId) || []
        );
        setIsAvailable(full.isAvailable ?? true);
        setIsActive(full.isActive ?? true);

        if (full.variants && full.variants.length > 0) {
          setVariants(
            full.variants.map((v: any) => ({
              id: v.id || `var-${Math.random()}`,
              name: v.name ?? "",
              arName: v.arName ?? "",
              sku: v.sku ?? "",
              size: v.size ?? "",
              color: (v.attributes as any)?.color ?? "",
              regularPrice: v.regularPrice ? String(v.regularPrice) : "",
              discountPrice: v.discountPrice ? String(v.discountPrice) : "",
              stockQuantity: String(v.stockQuantity ?? 10),
            }))
          );
          const fullStock = full.variants.reduce(
            (sum: number, v: any) => sum + (v.stockQuantity ?? 0),
            0
          );
          setStockQuantity(String(fullStock));
        }
      }
    } catch (err) {
      console.error("Failed to load full product details:", err);
    } finally {
      setIsLoadingDetails(false);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
    setIsLoadingDetails(false);
  };

  const toggleCategorySelection = (catId: string) => {
    setSelectedCategoryIds((prev) =>
      prev.includes(catId) ? prev.filter((id) => id !== catId) : [...prev, catId]
    );
  };

  const addGalleryImage = () => {
    const url = galleryInput.trim();
    if (!url) return;
    try {
      new URL(url);
      if (!imageGallery.includes(url)) {
        setImageGallery((prev) => [...prev, url]);
      }
      setGalleryInput("");
    } catch {
      toast.error("Please enter a valid image URL");
    }
  };

  const removeGalleryImage = (index: number) => {
    setImageGallery((prev) => prev.filter((_, i) => i !== index));
  };

  const addVariant = () => {
    const count = variants.length + 1;
    const baseSku = sku.trim() || (name ? name.slice(0, 3).toUpperCase() : "PROD");
    setVariants((prev) => [
      ...prev,
      {
        id: `var-${Date.now()}-${count}`,
        name: `Option ${count}`,
        arName: `خيار ${count}`,
        sku: `${baseSku}-VAR-${count}`,
        size: "",
        color: "",
        regularPrice: regularPrice || "",
        discountPrice: discountPrice || "",
        stockQuantity: "10",
      },
    ]);
  };

  const removeVariant = (id: string) => {
    setVariants((prev) => prev.filter((v) => v.id !== id));
  };

  const updateVariant = (
    id: string,
    field: keyof VariantFormItem,
    val: string
  ) => {
    setVariants((prev) =>
      prev.map((v) => (v.id === id ? { ...v, [field]: val } : v))
    );
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const cleanSlug = (slug.trim() || name.trim())
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    const cleanSku = (
      sku.trim() || `SKU-${Date.now().toString().slice(-6)}`
    ).toUpperCase();
    const regular = Number(regularPrice);
    const discount = discountPrice ? Number(discountPrice) : undefined;
    const defaultImg =
      mainImage.trim() ||
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800";

    const payload: any = {
      name: name.trim(),
      arName: arName.trim() || name.trim(),
      slug: cleanSlug || `prod-${Date.now()}`,
      sku: cleanSku,
      regularPrice: regular,
      mainImage: defaultImg,
      categoryIds: selectedCategoryIds,
      isAvailable,
      isActive,
    };

    if (imageGallery.length > 0) {
      payload.imageGallery = imageGallery.filter((url) => Boolean(url.trim()));
    } else {
      payload.imageGallery = [];
    }

    if (discount !== undefined && !isNaN(discount)) {
      payload.discountPrice = discount;
    }
    if (description.trim()) {
      payload.description = description.trim();
    }
    if (arDescription.trim()) {
      payload.arDescription = arDescription.trim();
    }

    if (variants.length > 0) {
      payload.variants = variants.map((v) => {
        const vReg = v.regularPrice ? Number(v.regularPrice) : regular;
        const vDisc = v.discountPrice ? Number(v.discountPrice) : undefined;
        const attrs: Record<string, any> = {};
        if (v.size.trim()) attrs.size = v.size.trim();
        if (v.color.trim()) attrs.color = v.color.trim();

        return {
          sku: (v.sku.trim() || `${cleanSku}-VAR-${Date.now()}`).toUpperCase(),
          name: v.name.trim() || name.trim(),
          arName:
            v.arName.trim() || v.name.trim() || arName.trim() || name.trim(),
          ...(v.size.trim() ? { size: v.size.trim() } : {}),
          regularPrice: vReg,
          ...(vDisc !== undefined && !isNaN(vDisc)
            ? { discountPrice: vDisc }
            : {}),
          stockQuantity: Number(v.stockQuantity) || 0,
          attributes: attrs,
          isAvailable: true,
        };
      });
    } else {
      payload.variants = [
        {
          sku: `${cleanSku}-DEFAULT`,
          name: name.trim(),
          arName: arName.trim() || name.trim(),
          regularPrice: regular,
          ...(discount !== undefined && !isNaN(discount)
            ? { discountPrice: discount }
            : {}),
          stockQuantity: Number(stockQuantity) || 10,
          attributes: {},
          isAvailable: true,
        },
      ];
    }

    if (editingProduct) {
      updateMutation.mutate({ id: editingProduct.id, data: payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            {t("title")}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {t("subtitle")}
          </p>
        </div>
        <button
          type="button"
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold transition-colors shadow-xs cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>{t("newProduct")}</span>
        </button>
      </div>

      {/* Filter / Search Bar */}
      <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute start-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder={tCommon("search")}
            className="w-full ps-10 pe-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>
      </div>

      {/* Product Table with Pagination */}
      <ProductTable
        productsData={productsData}
        isLoading={isLoading}
        page={page}
        onPageChange={setPage}
        onEdit={openEditModal}
        onDelete={(id) => deleteMutation.mutate(id)}
      />

      {/* Product Create / Edit Modal */}
      <ProductFormModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSubmit={handleFormSubmit}
        editingProduct={editingProduct}
        isLoadingDetails={isLoadingDetails}
        isPending={createMutation.isPending || updateMutation.isPending}
        categories={formattedCategories}
        name={name}
        setName={setName}
        arName={arName}
        setArName={setArName}
        slug={slug}
        setSlug={setSlug}
        sku={sku}
        setSku={setSku}
        regularPrice={regularPrice}
        setRegularPrice={setRegularPrice}
        discountPrice={discountPrice}
        setDiscountPrice={setDiscountPrice}
        stockQuantity={stockQuantity}
        setStockQuantity={setStockQuantity}
        selectedCategoryIds={selectedCategoryIds}
        toggleCategorySelection={toggleCategorySelection}
        mainImage={mainImage}
        setMainImage={setMainImage}
        imageGallery={imageGallery}
        galleryInput={galleryInput}
        setGalleryInput={setGalleryInput}
        addGalleryImage={addGalleryImage}
        removeGalleryImage={removeGalleryImage}
        description={description}
        setDescription={setDescription}
        arDescription={arDescription}
        setArDescription={setArDescription}
        isActive={isActive}
        setIsActive={setIsActive}
        isAvailable={isAvailable}
        setIsAvailable={setIsAvailable}
        variants={variants}
        addVariant={addVariant}
        removeVariant={removeVariant}
        updateVariant={updateVariant}
      />
    </div>
  );
}
