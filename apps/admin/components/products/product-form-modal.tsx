"use client";

import { useTranslations } from "next-intl";
import { Loader2, Plus, Trash2, X } from "lucide-react";
import type { CategoryDto, ProductDto } from "@repo/shared/dtos/e-commerce";

export interface VariantFormItem {
  id: string;
  name: string;
  arName: string;
  sku: string;
  size: string;
  color: string;
  regularPrice: string;
  discountPrice: string;
  stockQuantity: string;
}

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  editingProduct: ProductDto | null;
  isLoadingDetails: boolean;
  isPending: boolean;
  categories: CategoryDto[];

  // Form states and handlers
  name: string;
  setName: (v: string) => void;
  arName: string;
  setArName: (v: string) => void;
  slug: string;
  setSlug: (v: string) => void;
  sku: string;
  setSku: (v: string) => void;
  regularPrice: string;
  setRegularPrice: (v: string) => void;
  discountPrice: string;
  setDiscountPrice: (v: string) => void;
  stockQuantity: string;
  setStockQuantity: (v: string) => void;
  selectedCategoryIds: string[];
  toggleCategorySelection: (id: string) => void;
  mainImage: string;
  setMainImage: (v: string) => void;
  imageGallery: string[];
  galleryInput: string;
  setGalleryInput: (v: string) => void;
  addGalleryImage: () => void;
  removeGalleryImage: (idx: number) => void;
  description: string;
  setDescription: (v: string) => void;
  arDescription: string;
  setArDescription: (v: string) => void;
  isActive: boolean;
  setIsActive: (v: boolean) => void;
  isAvailable: boolean;
  setIsAvailable: (v: boolean) => void;

  // Variants
  variants: VariantFormItem[];
  addVariant: () => void;
  removeVariant: (id: string) => void;
  updateVariant: (id: string, field: keyof VariantFormItem, val: string) => void;
}

export function ProductFormModal({
  isOpen,
  onClose,
  onSubmit,
  editingProduct,
  isLoadingDetails,
  isPending,
  categories,

  name,
  setName,
  arName,
  setArName,
  slug,
  setSlug,
  sku,
  setSku,
  regularPrice,
  setRegularPrice,
  discountPrice,
  setDiscountPrice,
  stockQuantity,
  setStockQuantity,
  selectedCategoryIds,
  toggleCategorySelection,
  mainImage,
  setMainImage,
  imageGallery,
  galleryInput,
  setGalleryInput,
  addGalleryImage,
  removeGalleryImage,
  description,
  setDescription,
  arDescription,
  setArDescription,
  isActive,
  setIsActive,
  isAvailable,
  setIsAvailable,

  variants,
  addVariant,
  removeVariant,
  updateVariant,
}: ProductFormModalProps) {
  const t = useTranslations("Products");
  const tCommon = useTranslations("Common");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-3xl w-full p-4 sm:p-6 animate-in fade-in zoom-in-95 duration-150 my-8 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              {editingProduct ? t("editProduct") : t("newProduct")}
            </h2>
            {isLoadingDetails && (
              <span className="inline-flex items-center text-xs text-indigo-600 dark:text-indigo-400 gap-1.5 font-medium">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                {tCommon("loading")}
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-5 mt-4">
          {/* Basic Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                {t("name")} (English) *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (!editingProduct) {
                    setSlug(
                      e.target.value
                        .toLowerCase()
                        .replace(/[^a-z0-9]+/g, "-")
                        .replace(/^-+|-+$/g, "")
                    );
                  }
                }}
                placeholder="e.g. Wireless Headphones"
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                {t("arabicName")} (Arabic)
              </label>
              <input
                type="text"
                value={arName}
                onChange={(e) => setArName(e.target.value)}
                placeholder="الاسم بالعربية"
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Slug *
              </label>
              <input
                type="text"
                required
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="e.g. wireless-headphones"
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Base SKU (Optional)
              </label>
              <input
                type="text"
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                placeholder="e.g. HEADPHONES-PRO-01"
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                {t("regularPrice")} ($) *
              </label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                required
                value={regularPrice}
                onChange={(e) => setRegularPrice(e.target.value)}
                placeholder="99.99"
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                {t("discountPrice")} ($)
              </label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                value={discountPrice}
                onChange={(e) => setDiscountPrice(e.target.value)}
                placeholder="79.99"
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Base Stock Quantity *
              </label>
              <input
                type="number"
                min="0"
                required
                value={stockQuantity}
                onChange={(e) => setStockQuantity(e.target.value)}
                placeholder="10"
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white"
              />
            </div>
          </div>

          {/* Hierarchical Categories & Subcategories Linking */}
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-2">
              Link Categories & Subcategories * ({selectedCategoryIds.length}{" "}
              selected)
            </label>
            <div className="max-h-44 overflow-y-auto p-3 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl space-y-1.5">
              {categories.length === 0 ? (
                <div className="p-3 text-center text-xs text-slate-400">
                  No categories found. You can create categories in the
                  Categories page!
                </div>
              ) : (
                categories.map((cat: any) => {
                  const isSelected = selectedCategoryIds.includes(cat.id);
                  return (
                    <label
                      key={cat.id}
                      className={`flex items-center gap-2.5 p-2 rounded-lg cursor-pointer transition-colors text-xs font-medium ${
                        isSelected
                          ? "bg-indigo-50 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800"
                          : "hover:bg-slate-100 dark:hover:bg-slate-700/50 text-slate-700 dark:text-slate-300"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleCategorySelection(cat.id)}
                        className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                      />
                      <span className={cat.isSub ? "ps-2" : "font-semibold"}>
                        {cat.label || cat.name}
                      </span>
                      {cat.isSub && (
                        <span className="text-[10px] bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 px-1.5 py-0.5 rounded font-mono">
                          Sub
                        </span>
                      )}
                    </label>
                  );
                })
              )}
            </div>
          </div>

          {/* Product Variants Section */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-semibold text-slate-900 dark:text-white uppercase tracking-wider">
                  Product Variants ({variants.length})
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Optional: add custom sizes, colors, and stock configurations.
                </p>
              </div>
              <button
                type="button"
                onClick={addVariant}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:hover:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Variant</span>
              </button>
            </div>

            {variants.length === 0 ? (
              <div className="text-center py-3 text-xs text-slate-400">
                No custom variants added. A standard default variant with stock
                of{" "}
                <span className="font-semibold text-slate-600 dark:text-slate-300">
                  {stockQuantity || "10"}
                </span>{" "}
                will be used automatically.
              </div>
            ) : (
              <div className="space-y-3 max-h-56 overflow-y-auto pe-1">
                {variants.map((v, index) => (
                  <div
                    key={v.id}
                    className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/70 rounded-xl space-y-2 relative"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                        Variant #{index + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeVariant(v.id)}
                        className="p-1 text-slate-400 hover:text-rose-600 rounded transition-colors cursor-pointer"
                        title="Remove Variant"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      <div>
                        <label className="block text-[10px] text-slate-500 mb-0.5">
                          Name
                        </label>
                        <input
                          type="text"
                          value={v.name}
                          onChange={(e) =>
                            updateVariant(v.id, "name", e.target.value)
                          }
                          placeholder="e.g. Red / XL"
                          className="w-full px-2 py-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] text-slate-500 mb-0.5">
                          SKU
                        </label>
                        <input
                          type="text"
                          value={v.sku}
                          onChange={(e) =>
                            updateVariant(v.id, "sku", e.target.value)
                          }
                          placeholder="SKU-RED-XL"
                          className="w-full px-2 py-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] text-slate-500 mb-0.5">
                          Size
                        </label>
                        <input
                          type="text"
                          value={v.size}
                          onChange={(e) =>
                            updateVariant(v.id, "size", e.target.value)
                          }
                          placeholder="e.g. XL, 42"
                          className="w-full px-2 py-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] text-slate-500 mb-0.5">
                          Color
                        </label>
                        <input
                          type="text"
                          value={v.color}
                          onChange={(e) =>
                            updateVariant(v.id, "color", e.target.value)
                          }
                          placeholder="e.g. Red, Black"
                          className="w-full px-2 py-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 pt-1">
                      <div>
                        <label className="block text-[10px] text-slate-500 mb-0.5">
                          Stock
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={v.stockQuantity}
                          onChange={(e) =>
                            updateVariant(v.id, "stockQuantity", e.target.value)
                          }
                          className="w-full px-2 py-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] text-slate-500 mb-0.5">
                          Price ($)
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          value={v.regularPrice}
                          onChange={(e) =>
                            updateVariant(v.id, "regularPrice", e.target.value)
                          }
                          placeholder={regularPrice || "Price"}
                          className="w-full px-2 py-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] text-slate-500 mb-0.5">
                          Discount ($)
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          value={v.discountPrice}
                          onChange={(e) =>
                            updateVariant(v.id, "discountPrice", e.target.value)
                          }
                          placeholder={discountPrice || "Discount"}
                          className="w-full px-2 py-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Main Image */}
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              {t("image")} (Main Image URL) *
            </label>
            <div className="flex gap-3 items-center">
              <input
                type="url"
                value={mainImage}
                onChange={(e) => setMainImage(e.target.value)}
                placeholder="https://images.unsplash.com/photo-..."
                className="flex-1 px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white"
              />
              {mainImage && (
                <div className="w-10 h-10 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 shrink-0 bg-slate-100 dark:bg-slate-800">
                  <img
                    src={mainImage}
                    alt="Main Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Image Gallery */}
          <div className="space-y-2">
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300">
              {t("imageGallery")} ({imageGallery.length})
            </label>
            <div className="flex gap-2">
              <input
                type="url"
                value={galleryInput}
                onChange={(e) => setGalleryInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addGalleryImage();
                  }
                }}
                placeholder="https://images.unsplash.com/... (Image URL)"
                className="flex-1 px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white"
              />
              <button
                type="button"
                onClick={addGalleryImage}
                className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold rounded-xl cursor-pointer transition-colors"
              >
                {t("addImage")}
              </button>
            </div>
            {imageGallery.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {imageGallery.map((imgUrl, idx) => (
                  <div
                    key={`${imgUrl}-${idx}`}
                    className="relative group w-14 h-14 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 shrink-0"
                  >
                    <img
                      src={imgUrl}
                      alt={`Gallery ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeGalleryImage(idx)}
                      className="absolute inset-0 bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
                      title="Remove image"
                    >
                      <Trash2 className="w-4 h-4 text-rose-400" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Descriptions (English & Arabic) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                {t("description")} (English)
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Product description in English..."
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                {t("arDescription")} (Arabic)
              </label>
              <textarea
                rows={3}
                dir="rtl"
                value={arDescription}
                onChange={(e) => setArDescription(e.target.value)}
                placeholder="وصف المنتج باللغة العربية..."
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white resize-none"
              />
            </div>
          </div>

          <div className="flex items-center gap-6 pt-2">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-700 dark:text-slate-300">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="rounded text-indigo-600 w-4 h-4"
              />
              <span>Active in store</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-700 dark:text-slate-300">
              <input
                type="checkbox"
                checked={isAvailable}
                onChange={(e) => setIsAvailable(e.target.checked)}
                className="rounded text-indigo-600 w-4 h-4"
              />
              <span>Available for order</span>
            </label>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-sm font-semibold border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
            >
              {tCommon("cancel")}
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold transition-colors disabled:opacity-50 cursor-pointer flex items-center gap-2"
            >
              {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>
                {editingProduct ? tCommon("update") : tCommon("create")}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
