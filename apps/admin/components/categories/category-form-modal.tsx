"use client";

import { useTranslations } from "next-intl";
import { Loader2, X } from "lucide-react";
import type { CategoryDto } from "@repo/shared/dtos/e-commerce";

interface CategoryFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  editingCategory: CategoryDto | null;
  isPending: boolean;
  categoryList: CategoryDto[];

  name: string;
  setName: (v: string) => void;
  arName: string;
  setArName: (v: string) => void;
  slug: string;
  setSlug: (v: string) => void;
  parentId: string;
  setParentId: (v: string) => void;
  image: string;
  setImage: (v: string) => void;
}

export function CategoryFormModal({
  isOpen,
  onClose,
  onSubmit,
  editingCategory,
  isPending,
  categoryList,

  name,
  setName,
  arName,
  setArName,
  slug,
  setSlug,
  parentId,
  setParentId,
  image,
  setImage,
}: CategoryFormModalProps) {
  const t = useTranslations("Categories");
  const tCommon = useTranslations("Common");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-md w-full p-4 sm:p-6 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            {editingCategory
              ? t("editCategory")
              : parentId
                ? "Add Subcategory"
                : t("newCategory")}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-4 mt-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              {t("name")} *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (!editingCategory) {
                  setSlug(
                    e.target.value
                      .toLowerCase()
                      .replace(/[^a-z0-9]+/g, "-")
                      .replace(/^-+|-+$/g, "")
                  );
                }
              }}
              placeholder="e.g. Laptops or Accessories"
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              {t("arabicName")}
            </label>
            <input
              type="text"
              value={arName}
              onChange={(e) => setArName(e.target.value)}
              placeholder="الاسم بالعربية (اختياري)"
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              {t("slug")} *
            </label>
            <input
              type="text"
              required
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="e.g. laptops"
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              {t("parent")} (Optional - makes this a Subcategory)
            </label>
            <select
              value={parentId}
              onChange={(e) => setParentId(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white"
            >
              <option value="">None (Top-Level Category)</option>
              {categoryList
                .filter((c: CategoryDto) => c.id !== editingCategory?.id)
                .map((cat: CategoryDto) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.parentId ? `↳ ${cat.name} (Sub)` : cat.name}
                  </option>
                ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              {t("image")} (URL)
            </label>
            <input
              type="url"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="https://images.unsplash.com/..."
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white"
            />
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
                {editingCategory
                  ? tCommon("update")
                  : parentId
                    ? "Create Subcategory"
                    : tCommon("create")}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
