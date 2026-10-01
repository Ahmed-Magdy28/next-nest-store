"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import {
  ChevronDown,
  ChevronUp,
  CreditCard,
  MapPin,
  Package,
} from "lucide-react";
import type { OrderDto } from "@repo/shared/dtos/e-commerce";
import {
  getOrderStatusBadge,
  getPaymentStatusBadge,
} from "./order-status-badge";

interface OrderCardProps {
  order: OrderDto;
  isExpanded: boolean;
  onToggleExpand: () => void;
  formatDate: (date: Date | string) => string;
}

export function OrderCard({
  order,
  isExpanded,
  onToggleExpand,
  formatDate,
}: OrderCardProps) {
  const t = useTranslations("Account");

  const orderBadge = getOrderStatusBadge(order.status);
  const OrderIcon = orderBadge.icon;
  const itemCount =
    order.items?.reduce((sum, item) => sum + item.quantity, 0) ?? 0;

  return (
    <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900 shadow-sm transition overflow-hidden">
      {/* Order summary card header */}
      <div className="p-4 sm:p-6 flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                {t("orderNumber")}
              </span>
              <span className="font-mono font-bold text-gray-900 dark:text-white">
                {order.orderNumber}
              </span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {t("date")}: {formatDate(order.createdAt)}
            </p>
          </div>

          {/* Badges */}
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${orderBadge.color}`}
            >
              <OrderIcon className="w-3.5 h-3.5" />
              <span>{t(`statuses.${order.status}`)}</span>
            </span>

            <span
              className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getPaymentStatusBadge(
                order.paymentStatus,
              )}`}
            >
              {t(`statuses.${order.paymentStatus}`)}
            </span>
          </div>
        </div>

        {/* Middle preview row: items preview + total + action */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-3 border-t border-gray-100 dark:border-gray-800/80">
          {/* Products thumbnail preview */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            {order.items?.slice(0, 4).map((item) => (
              <div
                key={item.id}
                className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg border border-gray-100 bg-gray-50 dark:border-gray-800 dark:bg-gray-800"
                title={item.productName}
              >
                {item.productImage ? (
                  <Image
                    src={item.productImage}
                    alt={item.productName}
                    fill
                    sizes="48px"
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-gray-400">
                    <Package className="h-5 w-5" />
                  </div>
                )}
              </div>
            ))}
            {order.items && order.items.length > 4 && (
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg border border-gray-100 bg-gray-100 text-xs font-semibold text-gray-600 dark:border-gray-800 dark:bg-gray-800 dark:text-gray-300">
                +{order.items.length - 4}
              </div>
            )}
            <span className="text-xs text-gray-500 dark:text-gray-400 ms-1">
              {itemCount} {t("items")}
            </span>
          </div>

          {/* Total & Expand toggle */}
          <div className="flex items-center justify-between sm:justify-end gap-4">
            <div className="text-start sm:text-end">
              <span className="text-xs text-gray-400 block">{t("total")}</span>
              <span className="text-lg font-bold text-gray-900 dark:text-white">
                ${Number(order.total).toFixed(2)}
              </span>
            </div>

            <button
              type="button"
              onClick={onToggleExpand}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-700 transition dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 cursor-pointer"
            >
              <span>{isExpanded ? t("close") : t("viewDetails")}</span>
              {isExpanded ? (
                <ChevronUp className="w-3.5 h-3.5" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Expanded Details section */}
      {isExpanded && (
        <div className="border-t border-gray-200 bg-gray-50/70 p-4 sm:p-6 dark:border-gray-800 dark:bg-gray-900/50 space-y-6">
          {/* Products list */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
              {t("items")}
            </h4>
            <div className="space-y-3">
              {order.items?.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between gap-4 rounded-xl border border-gray-200/80 bg-white p-3 dark:border-gray-800 dark:bg-gray-900"
                >
                  <div className="flex items-center gap-3">
                    <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-lg border border-gray-100 bg-gray-50 dark:border-gray-800 dark:bg-gray-800">
                      {item.productImage ? (
                        <Image
                          src={item.productImage}
                          alt={item.productName}
                          fill
                          sizes="56px"
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-gray-400">
                          <Package className="h-6 w-6" />
                        </div>
                      )}
                    </div>
                    <div className="space-y-0.5">
                      <p className="font-semibold text-sm text-gray-900 dark:text-white line-clamp-1">
                        {item.productName}
                      </p>
                      {item.variantName && (
                        <p className="text-xs text-blue-600 dark:text-blue-400">
                          {item.variantName}
                        </p>
                      )}
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {t("quantity")}: {item.quantity} × $
                        {Number(item.unitPrice).toFixed(2)}
                      </p>
                    </div>
                  </div>

                  <div className="text-end">
                    <span className="font-bold text-sm text-gray-900 dark:text-white">
                      ${Number(item.totalPrice).toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Summary Breakdown & Shipping Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Shipping info */}
            <div className="rounded-xl border border-gray-200/80 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
              <div className="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white mb-2">
                <MapPin className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span>{t("shippingAddress")}</span>
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-300 space-y-1">
                <p className="font-medium text-gray-900 dark:text-white">
                  {order.customerName}
                </p>
                {order.customerPhone && <p>{order.customerPhone}</p>}
                {order.shippingAddress ? (
                  typeof order.shippingAddress === "string" ? (
                    <p>{order.shippingAddress}</p>
                  ) : (
                    <>
                      <p>
                        {order.shippingAddress.street ||
                          order.shippingAddress.addressLine1}
                      </p>
                      <p>
                        {[
                          order.shippingAddress.city,
                          order.shippingAddress.state,
                          order.shippingAddress.country,
                          order.shippingAddress.postalCode ||
                            order.shippingAddress.zipCode,
                        ]
                          .filter(Boolean)
                          .join(", ")}
                      </p>
                    </>
                  )
                ) : (
                  <p className="text-gray-400">—</p>
                )}
              </div>
            </div>

            {/* Order Cost Breakdown */}
            <div className="rounded-xl border border-gray-200/80 bg-white p-4 dark:border-gray-800 dark:bg-gray-900 space-y-2 text-xs">
              <div className="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white mb-3">
                <CreditCard className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span>{t("orderDetails")}</span>
              </div>

              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>{t("subtotal")}</span>
                <span>${Number(order.subtotal).toFixed(2)}</span>
              </div>

              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>{t("shipping")}</span>
                <span>
                  {order.shippingCost > 0
                    ? `$${Number(order.shippingCost).toFixed(2)}`
                    : t("free")}
                </span>
              </div>

              {order.discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                  <span>
                    {t("discount")}{" "}
                    {order.couponCode ? `(${order.couponCode})` : ""}
                  </span>
                  <span>-${Number(order.discountAmount).toFixed(2)}</span>
                </div>
              )}

              <div className="pt-2 border-t border-gray-100 dark:border-gray-800 flex justify-between font-bold text-sm text-gray-900 dark:text-white">
                <span>{t("total")}</span>
                <span>${Number(order.total).toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
