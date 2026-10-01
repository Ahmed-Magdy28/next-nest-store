"use client";

import { useTranslations } from "next-intl";
import { Package, Edit2, Trash2, Loader2, Tag } from "lucide-react";
import type { ProductDto, PaginatedResultDto } from "@repo/shared/dtos/e-commerce";
import { Pagination } from "../common/pagination";

interface ProductTableProps {
  productsData?: PaginatedResultDto<ProductDto>;
  isLoading: boolean;
  page: number;
  onPageChange: (page: number) => void;
  onEdit: (product: ProductDto) => void;
  onDelete: (id: string) => void;
}

export function ProductTable({
  productsData,
  isLoading,
  page,
  onPageChange,
  onEdit,
  onDelete,
}: ProductTableProps) {
  const t = useTranslations("Products");
  const tCommon = useTranslations("Common");

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-start text-sm min-w-[700px]">
          <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs uppercase font-medium border-b border-slate-200 dark:border-slate-800">
            <tr>
              <th className="px-6 py-3.5 text-start">{t("product")}</th>
              <th className="px-6 py-3.5 text-start">{t("category")}</th>
              <th className="px-6 py-3.5 text-start">{t("price")}</th>
              <th className="px-6 py-3.5 text-start">{t("stock")}</th>
              <th className="px-6 py-3.5 text-start">{t("status")}</th>
              <th className="px-6 py-3.5 text-end">{tCommon("actions")}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
            {isLoading ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-slate-400">
                  <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
                  <span>{tCommon("loading")}</span>
                </td>
              </tr>
            ) : productsData?.items?.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-slate-400">
                  <Package className="w-8 h-8 mx-auto mb-2 opacity-40" />
                  <span>{t("noProducts")}</span>
                </td>
              </tr>
            ) : (
              productsData?.items?.map((product: ProductDto) => {
                const hasVariants = Boolean(
                  product.variants && product.variants.length > 0
                );
                const totalStock = hasVariants
                  ? product.variants!.reduce(
                      (acc: number, v: any) =>
                        acc + (v.stockQuantity ?? 0),
                      0
                    )
                  : 0;

                return (
                  <tr
                    key={product.id}
                    className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 overflow-hidden shrink-0 flex items-center justify-center">
                          {product.mainImage ? (
                            <img
                              src={product.mainImage}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Package className="w-5 h-5 text-slate-400" />
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900 dark:text-white line-clamp-1">
                            {product.name}
                          </p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-xs text-slate-400 font-mono">
                              {product.sku}
                            </span>
                            {product.variants &&
                              product.variants.length > 1 && (
                                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium">
                                  <Tag className="w-2.5 h-2.5" />
                                  {product.variants.length} variants
                                </span>
                              )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {product.categories &&
                        product.categories.length > 0 ? (
                          product.categories.map((c: any) => (
                            <span
                              key={c.id || c.categoryId}
                              className="px-2 py-0.5 rounded-full text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                            >
                              {c.name || "Linked Category"}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-slate-400">None</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-baseline gap-2">
                        <span className="font-semibold text-slate-900 dark:text-white">
                          $
                          {Number(
                            product.discountPrice ?? product.regularPrice
                          ).toFixed(2)}
                        </span>
                        {product.discountPrice &&
                          Number(product.discountPrice) <
                            Number(product.regularPrice) && (
                            <span className="text-xs text-slate-400 line-through">
                              ${Number(product.regularPrice).toFixed(2)}
                            </span>
                          )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {hasVariants ? (
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                            totalStock > 5
                              ? "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300"
                              : totalStock > 0
                                ? "bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300"
                                : "bg-rose-50 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300"
                          }`}
                        >
                          {totalStock > 0
                            ? `${totalStock} ${t("units")}`
                            : t("outOfStock")}
                        </span>
                      ) : (
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                            product.isAvailable
                              ? "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300"
                              : "bg-rose-50 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300"
                          }`}
                        >
                          {product.isAvailable ? t("inStock") : t("outOfStock")}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                          product.isActive
                            ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800"
                            : "bg-slate-100 dark:bg-slate-800 text-slate-500"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            product.isActive
                              ? "bg-emerald-500"
                              : "bg-slate-400"
                          }`}
                        />
                        {product.isActive ? t("active") : t("draft")}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-end">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          title="Edit"
                          onClick={() => onEdit(product)}
                          className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          title="Delete"
                          onClick={() => {
                            if (confirm(tCommon("confirmDelete"))) {
                              onDelete(product.id);
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

      <Pagination
        meta={productsData?.meta}
        page={page}
        onPageChange={onPageChange}
        itemLabel={t("product")}
      />
    </div>
  );
}
