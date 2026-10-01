"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { ArrowRight, Loader2 } from "lucide-react";
import type { OrderDto } from "@repo/shared/dtos/e-commerce";

interface RecentOrdersTableProps {
  orders?: OrderDto[];
  isLoading: boolean;
}

export function RecentOrdersTable({
  orders,
  isLoading,
}: RecentOrdersTableProps) {
  const t = useTranslations("Dashboard");
  const tCommon = useTranslations("Common");
  const tOrders = useTranslations("Orders");

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
      <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            {t("recentOrders")}
          </h2>
          <span className="text-xs text-slate-500">
            Latest {orders?.length ?? 0} placed orders
          </span>
        </div>
        <Link
          href="/orders"
          className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
        >
          <span>{t("viewAll")}</span>
          <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[650px] text-start text-sm">
          <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs uppercase font-medium border-b border-slate-200 dark:border-slate-800">
            <tr>
              <th className="px-6 py-3.5 text-start">
                {tOrders("orderNumber")}
              </th>
              <th className="px-6 py-3.5 text-start">
                {tOrders("customer")}
              </th>
              <th className="px-6 py-3.5 text-start">{tOrders("total")}</th>
              <th className="px-6 py-3.5 text-start">
                {tOrders("orderStatus")}
              </th>
              <th className="px-6 py-3.5 text-start">
                {tOrders("paymentStatus")}
              </th>
              <th className="px-6 py-3.5 text-start">{tCommon("date")}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
            {isLoading ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-6 py-8 text-center text-slate-500"
                >
                  <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-indigo-600" />
                  <span>{tCommon("loading")}</span>
                </td>
              </tr>
            ) : !orders?.length ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-6 py-8 text-center text-slate-500"
                >
                  {tCommon("noData")}
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr
                  key={order.id}
                  className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors"
                >
                  <td className="px-6 py-4 font-mono font-medium text-slate-900 dark:text-white">
                    {order.orderNumber}
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-slate-900 dark:text-white">
                      {order.customerName}
                    </div>
                    <div className="text-xs text-slate-500">
                      {order.customerEmail}
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
                      {order.status}
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
                      {order.paymentStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-500">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
