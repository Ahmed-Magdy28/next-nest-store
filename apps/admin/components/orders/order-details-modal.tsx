"use client";

import { useTranslations } from "next-intl";
import { X } from "lucide-react";
import type { OrderDto } from "@repo/shared/dtos/e-commerce";

export const ORDER_STATUSES = [
  "PENDING",
  "CONFIRMED",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
  "REFUNDED",
] as const;

export const PAYMENT_STATUSES = [
  "UNPAID",
  "PAID",
  "FAILED",
  "REFUNDED",
] as const;

interface OrderDetailsModalProps {
  order: OrderDto | null;
  onClose: () => void;
  onUpdateStatus: (status: string) => void;
  onUpdatePayment: (paymentStatus: string) => void;
  isUpdatingStatus: boolean;
  isUpdatingPayment: boolean;
}

export function OrderDetailsModal({
  order,
  onClose,
  onUpdateStatus,
  onUpdatePayment,
  isUpdatingStatus,
  isUpdatingPayment,
}: OrderDetailsModalProps) {
  const t = useTranslations("Orders");
  const tCommon = useTranslations("Common");

  if (!order) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl p-4 sm:p-6 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800 mb-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>{t("details")}:</span>
              <span className="font-mono text-indigo-600 dark:text-indigo-400">
                {order.orderNumber}
              </span>
            </h3>
            <span className="text-xs text-slate-500">
              {new Date(order.createdAt).toLocaleString()}
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Actions (Update Status & Payment) */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl mb-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              {t("updateOrderStatus")}
            </label>
            <select
              value={order.status}
              onChange={(e) => onUpdateStatus(e.target.value)}
              disabled={isUpdatingStatus}
              className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white"
            >
              {ORDER_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {t(`status.${s}`)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              {t("updatePaymentStatus")}
            </label>
            <select
              value={order.paymentStatus}
              onChange={(e) => onUpdatePayment(e.target.value)}
              disabled={isUpdatingPayment}
              className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white"
            >
              {PAYMENT_STATUSES.map((p) => (
                <option key={p} value={p}>
                  {t(`payment.${p}`)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Customer & Shipping info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800">
            <h4 className="text-xs font-bold text-slate-400 uppercase mb-2">
              {t("customer")}
            </h4>
            <div className="font-semibold text-slate-900 dark:text-white">
              {order.customerName}
            </div>
            <div className="text-sm text-slate-500">{order.customerEmail}</div>
            <div className="text-sm text-slate-500">{order.customerPhone}</div>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800">
            <h4 className="text-xs font-bold text-slate-400 uppercase mb-2">
              {t("shippingAddress")}
            </h4>
            <div className="text-sm text-slate-700 dark:text-slate-300">
              {typeof order.shippingAddress === "object"
                ? Object.values(order.shippingAddress)
                    .filter(Boolean)
                    .join(", ")
                : JSON.stringify(order.shippingAddress)}
            </div>
            <div className="text-xs text-slate-400 mt-2">
              {t("paymentMethod")}: {order.paymentMethod || "N/A"}
            </div>
          </div>
        </div>

        {/* Ordered Items */}
        <div className="mb-6">
          <h4 className="text-xs font-bold text-slate-400 uppercase mb-3">
            {t("items")}
          </h4>
          <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden divide-y divide-slate-100 dark:divide-slate-800">
            {order.items?.map((item) => (
              <div
                key={item.id}
                className="p-3.5 flex items-center justify-between text-sm"
              >
                <div>
                  <div className="font-semibold text-slate-900 dark:text-white">
                    {item.productName}
                  </div>
                  {item.variantName && (
                    <div className="text-xs text-slate-500">
                      {item.variantName}
                    </div>
                  )}
                  <div className="text-xs text-slate-400 font-mono">
                    {item.quantity} x {item.unitPrice} {tCommon("currency")}
                  </div>
                </div>
                <div className="font-semibold text-slate-900 dark:text-white">
                  {item.totalPrice} {tCommon("currency")}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Totals Breakdown */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl space-y-2 text-sm">
          <div className="flex justify-between text-slate-500">
            <span>{t("subtotal")}</span>
            <span>
              {order.subtotal} {tCommon("currency")}
            </span>
          </div>
          {order.discountAmount > 0 && (
            <div className="flex justify-between text-emerald-600 font-medium">
              <span>
                {t("discount")}{" "}
                {order.couponCode && `(${order.couponCode})`}
              </span>
              <span>
                -{order.discountAmount} {tCommon("currency")}
              </span>
            </div>
          )}
          <div className="flex justify-between text-slate-500">
            <span>{t("shipping")}</span>
            <span>
              {order.shippingCost} {tCommon("currency")}
            </span>
          </div>
          <div className="flex justify-between font-bold text-base text-slate-900 dark:text-white pt-2 border-t border-slate-200 dark:border-slate-700">
            <span>{t("total")}</span>
            <span>
              {order.total} {tCommon("currency")}
            </span>
          </div>
        </div>

        {/* Close Button */}
        <div className="flex justify-end pt-6">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-200 cursor-pointer"
          >
            {tCommon("close")}
          </button>
        </div>
      </div>
    </div>
  );
}
