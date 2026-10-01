"use client";

import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { categoriesApi } from "@/lib/api";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import type { CategoryDto } from "@repo/shared/dtos/e-commerce";
import { CategoryTable } from "@/components/categories/category-table";
import { CategoryFormModal } from "@/components/categories/category-form-modal";

export default function CategoriesPage() {
  const t = useTranslations("Categories");
  const tCommon = useTranslations("Common");
  const queryClient = useQueryClient();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryDto | null>(null);
  const [filterType, setFilterType] = useState<"all" | "parents" | "subs">("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Form State
  const [name, setName] = useState("");
  const [arName, setArName] = useState("");
  const [slug, setSlug] = useState("");
  const [parentId, setParentId] = useState("");
  const [image, setImage] = useState("");

  const { data: categories, isLoading } = useQuery({
    queryKey: ["admin", "categories"],
    queryFn: () => categoriesApi.getCategories(),
  });

  const categoryList = useMemo(() => {
    return (
      Array.isArray(categories) ? categories : (categories as any)?.items || []
    ) as CategoryDto[];
  }, [categories]);

  const categoryMap = useMemo(() => {
    const map = new Map<string, CategoryDto>();
    categoryList.forEach((c: CategoryDto) => map.set(c.id, c));
    return map;
  }, [categoryList]);

  const filteredCategories = useMemo(() => {
    return categoryList.filter((c: CategoryDto) => {
      if (filterType === "parents" && c.parentId) return false;
      if (filterType === "subs" && !c.parentId) return false;
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        return (
          c.name.toLowerCase().includes(term) ||
          c.arName?.toLowerCase().includes(term) ||
          c.slug.toLowerCase().includes(term)
        );
      }
      return true;
    });
  }, [categoryList, filterType, searchTerm]);

  const createMutation = useMutation({
    mutationFn: (data: any) => categoriesApi.createCategory(data),
    onSuccess: () => {
      toast.success(t("createSuccess"));
      queryClient.invalidateQueries({ queryKey: ["admin", "categories"] });
      closeModal();
    },
    onError: (err: any) =>
      toast.error(err?.message || "Failed to create category"),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      categoriesApi.updateCategory(id, data),
    onSuccess: () => {
      toast.success(t("updateSuccess"));
      queryClient.invalidateQueries({ queryKey: ["admin", "categories"] });
      closeModal();
    },
    onError: (err: any) =>
      toast.error(err?.message || "Failed to update category"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => categoriesApi.deleteCategory(id),
    onSuccess: () => {
      toast.success(t("deleteSuccess"));
      queryClient.invalidateQueries({ queryKey: ["admin", "categories"] });
    },
    onError: (err: any) =>
      toast.error(err?.message || "Failed to delete category"),
  });

  const openCreateModal = (parent?: CategoryDto) => {
    setEditingCategory(null);
    setName("");
    setArName("");
    setSlug("");
    setParentId(parent?.id ?? "");
    setImage("");
    setIsModalOpen(true);
  };

  const openEditModal = (cat: CategoryDto) => {
    setEditingCategory(cat);
    setName(cat.name);
    setArName(cat.arName ?? "");
    setSlug(cat.slug);
    setParentId(cat.parentId ?? "");
    setImage(cat.image ?? "");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanSlug = (slug.trim() || name.trim())
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    const payload: any = {
      name: name.trim(),
      arName: arName.trim() || name.trim(),
      slug: cleanSlug || `cat-${Date.now()}`,
    };

    if (parentId && parentId.trim() !== "") {
      payload.parentId = parentId.trim();
    }
    if (image && image.trim() !== "") {
      payload.image = image.trim();
    }

    if (editingCategory) {
      updateMutation.mutate({ id: editingCategory.id, data: payload });
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
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => openCreateModal()}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold transition-colors shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{t("newCategory")}</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setFilterType("all")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
              filterType === "all"
                ? "bg-indigo-600 text-white"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
            }`}
          >
            All Categories ({categoryList.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterType("parents")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
              filterType === "parents"
                ? "bg-indigo-600 text-white"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
            }`}
          >
            Top-Level Only
          </button>
          <button
            type="button"
            onClick={() => setFilterType("subs")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
              filterType === "subs"
                ? "bg-indigo-600 text-white"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
            }`}
          >
            Subcategories Only
          </button>
        </div>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={tCommon("search")}
          className="w-full sm:w-64 px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white"
        />
      </div>

      {/* Category Table */}
      <CategoryTable
        categories={filteredCategories}
        categoryMap={categoryMap}
        isLoading={isLoading}
        onAddSubcategory={openCreateModal}
        onEdit={openEditModal}
        onDelete={(id) => deleteMutation.mutate(id)}
      />

      {/* Category Create / Edit Modal */}
      <CategoryFormModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSubmit={handleSubmit}
        editingCategory={editingCategory}
        isPending={createMutation.isPending || updateMutation.isPending}
        categoryList={categoryList}
        name={name}
        setName={setName}
        arName={arName}
        setArName={setArName}
        slug={slug}
        setSlug={setSlug}
        parentId={parentId}
        setParentId={setParentId}
        image={image}
        setImage={setImage}
      />
    </div>
  );
}
