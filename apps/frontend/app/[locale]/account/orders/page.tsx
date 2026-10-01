"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { ArrowLeft, ShoppingBag } from "lucide-react";
import type { OrderDto } from "@repo/shared/dtos/e-commerce";

import { Link } from "../../../../i18n/routing";
import { ProtectedRoute } from "../../../../components/auth/protected-route";
import { useMyOrders } from "../../../../hooks/use-orders";
import { Pagination } from "../../../../components/common/pagination";
import { OrderCard } from "../../../../components/e-commerce/orders/order-card";

export default function AccountOrdersPage() {
  return (
    <ProtectedRoute>
      <OrdersContent />
    </ProtectedRoute>
  );
}

function OrdersContent() {
  const t = useTranslations("Account");
  const locale = useLocale();
  const [page, setPage] = useState(1);
  const [expandedOrders, setExpandedOrders] = useState<Record<string, boolean>>({});

  const { data, isLoading } = useMyOrders({ page, limit: 10 });

  const toggleExpand = (id: string) => {
    setExpandedOrders((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const orders = data?.items || [];
  const totalPages = data?.meta?.totalPages || 1;

  const formatDate = (dateValue: Date | string) => {
    try {
      const d = new Date(dateValue);
      return new Intl.DateTimeFormat(locale === "ar" ? "ar-EG" : "en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }).format(d);
    } catch {
      return String(dateValue);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/60 py-8 px-4 sm:px-6 lg:px-8 dark:bg-gray-950">
      <div className="mx-auto max-w-4xl space-y-6">
        {/* Navigation Breadcrumb / Header */}
        <div className="flex items-center justify-between">
          <Link
            href="/account"
            className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition"
          >
            <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
            <span>{t("backToDashboard")}</span>
          </Link>
          <span className="text-xs text-gray-400">
            {data?.meta?.total ?? 0} {t("orders")}
          </span>
        </div>

        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            {t("myOrders")}
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {t("trackManageOrders")}
          </p>
        </div>

        {/* Loading state skeleton */}
        {isLoading && (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="h-36 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm animate-pulse dark:border-gray-800 dark:bg-gray-900"
              />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!isLoading && orders.length === 0 && (
          <div className="text-center py-16 px-4 bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-sm">
            <div className="mx-auto w-16 h-16 flex items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400 mb-4">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              {t("noOrders")}
            </h2>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 max-w-md mx-auto">
              {t("noOrdersDesc")}
            </p>
            <div className="mt-6">
              <Link
                href="/products"
                className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition"
              >
                {t("startShopping")}
              </Link>
            </div>
          </div>
        )}

        {/* Orders list */}
        {!isLoading && orders.length > 0 && (
          <div className="space-y-4">
            {orders.map((order: OrderDto) => (
              <OrderCard
                key={order.id}
                order={order}
                isExpanded={Boolean(expandedOrders[order.id])}
                onToggleExpand={() => toggleExpand(order.id)}
                formatDate={formatDate}
              />
            ))}

            {/* Pagination */}
            <Pagination
              page={page}
              totalPages={totalPages}
              onPageChange={(p) => setPage(p)}
            />
          </div>
        )}
      </div>
    </div>
  );
}
