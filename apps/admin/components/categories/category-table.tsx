"use client";

import { useTranslations } from "next-intl";
import {
  Layers,
  Edit2,
  Trash2,
  Loader2,
  FolderTree,
  CornerDownRight,
  FolderPlus,
} from "lucide-react";
import type { CategoryDto } from "@repo/shared/dtos/e-commerce";

interface CategoryTableProps {
  categories: CategoryDto[];
  categoryMap: Map<string, CategoryDto>;
  isLoading: boolean;
  onAddSubcategory: (parent: CategoryDto) => void;
  onEdit: (cat: CategoryDto) => void;
  onDelete: (id: string) => void;
}

export function CategoryTable({
  categories,
  categoryMap,
  isLoading,
  onAddSubcategory,
  onEdit,
  onDelete,
}: CategoryTableProps) {
  const t = useTranslations("Categories");
  const tCommon = useTranslations("Common");

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-start text-sm min-w-[600px]">
          <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs uppercase font-medium border-b border-slate-200 dark:border-slate-800">
            <tr>
              <th className="px-6 py-3.5 text-start">{t("name")}</th>
              <th className="px-6 py-3.5 text-start">{t("slug")}</th>
              <th className="px-6 py-3.5 text-start">{t("parent")}</th>
              <th className="px-6 py-3.5 text-end">{tCommon("actions")}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
            {isLoading ? (
              <tr>
                <td colSpan={4} className="py-12 text-center text-slate-400">
                  <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
                  <span>{tCommon("loading")}</span>
                </td>
              </tr>
            ) : categories.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-12 text-center text-slate-400">
                  <FolderTree className="w-8 h-8 mx-auto mb-2 opacity-40" />
                  <span>No categories found</span>
                </td>
              </tr>
            ) : (
              categories.map((cat: CategoryDto) => {
                const parentCat = cat.parentId
                  ? categoryMap.get(cat.parentId)
                  : null;
                return (
                  <tr
                    key={cat.id}
                    className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">
                      <div className="flex items-center gap-3">
                        {cat.parentId ? (
                          <CornerDownRight className="w-4 h-4 text-indigo-500 ms-3 shrink-0" />
                        ) : (
                          <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center shrink-0">
                            <Layers className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                          </div>
                        )}
                        <div>
                          <div className="flex items-center gap-2">
                            <span>{cat.name}</span>
                            {cat.arName && (
                              <span className="text-xs text-slate-400 font-normal">
                                ({cat.arName})
                              </span>
                            )}
                          </div>
                          {cat.parentId && parentCat && (
                            <span className="text-[11px] text-slate-400">
                              Subcategory of: {parentCat.name}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-500 font-mono text-xs">
                      {cat.slug}
                    </td>
                    <td className="px-6 py-4 text-slate-500">
                      {parentCat ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300">
                          <CornerDownRight className="w-3 h-3" />
                          {parentCat.name}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                          Top-Level
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-end">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          title="Add subcategory under this"
                          onClick={() => onAddSubcategory(cat)}
                          className="p-1.5 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 rounded-lg transition-colors cursor-pointer"
                        >
                          <FolderPlus className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          title="Edit"
                          onClick={() => onEdit(cat)}
                          className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          title="Delete"
                          onClick={() => {
                            if (confirm(tCommon("confirmDelete"))) {
                              onDelete(cat.id);
                            }
                          }}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
