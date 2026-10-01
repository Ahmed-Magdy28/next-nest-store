"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { ordersApi } from "@/lib/api";
import { Search } from "lucide-react";
import { toast } from "sonner";
import type { OrderDto } from "@repo/shared/dtos/e-commerce";
import { OrderTable } from "@/components/orders/order-table";
import {
  OrderDetailsModal,
  ORDER_STATUSES,
  PAYMENT_STATUSES,
} from "@/components/orders/order-details-modal";

export default function OrdersPage() {
  const t = useTranslations("Orders");
  const tCommon = useTranslations("Common");
  const queryClient = useQueryClient();

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<string>("");
  const [paymentStatus, setPaymentStatus] = useState<string>("");
  const [selectedOrder, setSelectedOrder] = useState<OrderDto | null>(null);

  const { data: ordersData, isLoading } = useQuery({
    queryKey: ["admin", "orders", page, status, paymentStatus, search],
    queryFn: () =>
      ordersApi.getOrders({
        page,
        limit: 10,
        status: status || undefined,
        paymentStatus: paymentStatus || undefined,
        search: search || undefined,
      }),
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: any }) =>
      ordersApi.updateStatus(id, { status }),
    onSuccess: (updated: OrderDto) => {
      toast.success(t("statusUpdated"));
      queryClient.invalidateQueries({ queryKey: ["admin", "orders"] });
      setSelectedOrder(updated);
    },
    onError: (err: any) =>
      toast.error(err?.message || "Failed to update status"),
  });

  const updatePaymentMutation = useMutation({
    mutationFn: ({ id, paymentStatus }: { id: string; paymentStatus: any }) =>
      ordersApi.updatePaymentStatus(id, { paymentStatus }),
    onSuccess: (updated: OrderDto) => {
      toast.success(t("paymentUpdated"));
      queryClient.invalidateQueries({ queryKey: ["admin", "orders"] });
      setSelectedOrder(updated);
    },
    onError: (err: any) =>
      toast.error(err?.message || "Failed to update payment status"),
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          {t("title")}
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          {t("subtitle")}
        </p>
      </div>

      {/* Filters */}
      <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row gap-4">
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
            className="w-full ps-10 pe-4 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>

        {/* Status Filter */}
        <div className="min-w-[150px]">
          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(1);
            }}
            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white"
          >
            <option value="">
              {t("orderStatus")}: {tCommon("all")}
            </option>
            {ORDER_STATUSES.map((s) => (
              <option key={s} value={s}>
                {t(`status.${s}`)}
              </option>
            ))}
          </select>
        </div>

        {/* Payment Status Filter */}
        <div className="min-w-[150px]">
          <select
            value={paymentStatus}
            onChange={(e) => {
              setPaymentStatus(e.target.value);
              setPage(1);
            }}
            className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white"
          >
            <option value="">
              {t("paymentStatus")}: {tCommon("all")}
            </option>
            {PAYMENT_STATUSES.map((p) => (
              <option key={p} value={p}>
                {t(`payment.${p}`)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <OrderTable
        ordersData={ordersData}
        isLoading={isLoading}
        page={page}
        onPageChange={setPage}
        onViewOrder={setSelectedOrder}
      />

      {/* Order Details Modal */}
      <OrderDetailsModal
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
        onUpdateStatus={(newStatus) =>
          selectedOrder &&
          updateStatusMutation.mutate({
            id: selectedOrder.id,
            status: newStatus,
          })
        }
        onUpdatePayment={(newPayment) =>
          selectedOrder &&
          updatePaymentMutation.mutate({
            id: selectedOrder.id,
            paymentStatus: newPayment,
          })
        }
        isUpdatingStatus={updateStatusMutation.isPending}
        isUpdatingPayment={updatePaymentMutation.isPending}
      />
    </div>
  );
}
