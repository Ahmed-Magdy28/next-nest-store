"use client";

import { useTranslations } from "next-intl";
import { Edit2, Trash2, Loader2 } from "lucide-react";
import type { CouponDto, PaginatedResultDto } from "@repo/shared/dtos/e-commerce";
import { Pagination } from "../common/pagination";

interface CouponTableProps {
  couponsData?: PaginatedResultDto<CouponDto>;
  isLoading: boolean;
  page: number;
  onPageChange: (page: number) => void;
  onEdit: (coupon: CouponDto) => void;
  onDelete: (id: string) => void;
}

export function CouponTable({
  couponsData,
  isLoading,
  page,
  onPageChange,
  onEdit,
  onDelete,
}: CouponTableProps) {
  const t = useTranslations("Coupons");
  const tCommon = useTranslations("Common");

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[700px] text-start text-sm">
          <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs uppercase font-medium border-b border-slate-200 dark:border-slate-800">
            <tr>
              <th className="px-6 py-3.5 text-start">{t("code")}</th>
              <th className="px-6 py-3.5 text-start">{t("type")}</th>
              <th className="px-6 py-3.5 text-start">{t("value")}</th>
              <th className="px-6 py-3.5 text-start">{t("usedCount")}</th>
              <th className="px-6 py-3.5 text-start">{t("endDate")}</th>
              <th className="px-6 py-3.5 text-start">{tCommon("status")}</th>
              <th className="px-6 py-3.5 text-end">{tCommon("actions")}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
            {isLoading ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-6 py-8 text-center text-slate-500"
                >
                  <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-indigo-600" />
                  <span>{tCommon("loading")}</span>
                </td>
              </tr>
            ) : !couponsData?.items?.length ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-6 py-8 text-center text-slate-500"
                >
                  {tCommon("noData")}
                </td>
              </tr>
            ) : (
              couponsData.items.map((coupon) => (
                <tr
                  key={coupon.id}
                  className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors"
                >
                  <td className="px-6 py-4 font-mono font-bold text-slate-900 dark:text-white">
                    {coupon.code}
                  </td>
                  <td className="px-6 py-4 text-xs font-semibold text-slate-600 dark:text-slate-400">
                    {coupon.type === "PERCENTAGE"
                      ? t("percentage")
                      : t("fixed")}
                  </td>
                  <td className="px-6 py-4 font-bold text-indigo-600 dark:text-indigo-400">
                    {coupon.type === "PERCENTAGE"
                      ? `${coupon.value}%`
                      : `${coupon.value} ${tCommon("currency")}`}
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-500">
                    {coupon.usedCount} / {coupon.usageLimit ?? "∞"}
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-500">
                    {coupon.endDate
                      ? new Date(coupon.endDate).toLocaleDateString()
                      : "No expiry"}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        coupon.isActive
                          ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400"
                          : "bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400"
                      }`}
                    >
                      {coupon.isActive
                        ? tCommon("active")
                        : tCommon("inactive")}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-end">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => onEdit(coupon)}
                        className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 cursor-pointer"
                        title={tCommon("edit")}
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (confirm(tCommon("confirmDelete"))) {
                            onDelete(coupon.id);
                          }
                        }}
                        className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/50 dark:hover:text-rose-400 text-slate-600 dark:text-slate-300 cursor-pointer"
                        title={tCommon("delete")}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Pagination
        meta={couponsData?.meta}
        page={page}
        onPageChange={onPageChange}
        itemLabel={t("code")}
      />
    </div>
  );
}
