"use client";

import { useTranslations } from "next-intl";
import { Eye, Loader2 } from "lucide-react";
import type { OrderDto, PaginatedResultDto } from "@repo/shared/dtos/e-commerce";
import { Pagination } from "../common/pagination";

interface OrderTableProps {
  ordersData?: PaginatedResultDto<OrderDto>;
  isLoading: boolean;
  page: number;
  onPageChange: (page: number) => void;
  onViewOrder: (order: OrderDto) => void;
}

export function OrderTable({
  ordersData,
  isLoading,
  page,
  onPageChange,
  onViewOrder,
}: OrderTableProps) {
  const t = useTranslations("Orders");
  const tCommon = useTranslations("Common");

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-start text-sm min-w-[700px]">
          <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs uppercase font-medium border-b border-slate-200 dark:border-slate-800">
            <tr>
              <th className="px-6 py-3.5 text-start">{t("orderNumber")}</th>
              <th className="px-6 py-3.5 text-start">{t("customer")}</th>
              <th className="px-6 py-3.5 text-start">{t("total")}</th>
              <th className="px-6 py-3.5 text-start">{t("orderStatus")}</th>
              <th className="px-6 py-3.5 text-start">{t("paymentStatus")}</th>
              <th className="px-6 py-3.5 text-start">{tCommon("date")}</th>
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
            ) : !ordersData?.items?.length ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-6 py-8 text-center text-slate-500"
                >
                  {tCommon("noData")}
                </td>
              </tr>
            ) : (
              ordersData.items.map((order) => (
                <tr
                  key={order.id}
                  className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors"
                >
                  <td className="px-6 py-4 font-mono font-medium text-slate-900 dark:text-white">
                    {order.orderNumber}
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-semibold text-slate-900 dark:text-white">
                      {order.customerName}
                    </div>
                    <div className="text-xs text-slate-500">
                      {order.customerEmail}
                    </div>
                    <div className="text-[11px] text-slate-400">
                      {order.customerPhone}
                    </div>
                  </td>
                  <td className="px-6 py-4 font-semibold text-slate-900 dark:text-white">
                    {order.total} {tCommon("currency")}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        order.status === "DELIVERED"
                          ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300"
                          : order.status === "CANCELLED"
                            ? "bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300"
                            : "bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300"
                      }`}
                    >
                      {t(`status.${order.status}`)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        order.paymentStatus === "PAID"
                          ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                      }`}
                    >
                      {t(`payment.${order.paymentStatus}`)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-500">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-end">
                    <button
                      type="button"
                      onClick={() => onViewOrder(order)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>{t("details")}</span>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Pagination
        meta={ordersData?.meta}
        page={page}
        onPageChange={onPageChange}
        itemLabel={t("orderNumber")}
      />
    </div>
  );
}
