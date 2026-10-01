"use client";

import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import {
  ordersApi,
  productsApi,
  reviewsApi,
  couponsApi,
  usersApi,
} from "@/lib/api";
import {
  Plus,
  TicketPercent,
  MessageSquareCheck,
} from "lucide-react";
import { DashboardKpiCards } from "@/components/dashboard/dashboard-kpi-cards";
import { RecentOrdersTable } from "@/components/dashboard/recent-orders-table";

export default function DashboardPage() {
  const t = useTranslations("Dashboard");

  // Fetch recent orders
  const { data: ordersData, isLoading: ordersLoading } = useQuery({
    queryKey: ["admin", "orders", "recent"],
    queryFn: () => ordersApi.getOrders({ page: 1, limit: 5 }),
  });

  // Fetch products count
  const { data: productsData } = useQuery({
    queryKey: ["admin", "products", "count"],
    queryFn: () => productsApi.getProducts({ page: 1, limit: 1 }),
  });

  // Fetch user stats (total users, active users)
  const { data: userStatsData } = useQuery({
    queryKey: ["admin", "users", "stats"],
    queryFn: () => usersApi.getUserStats(),
  });

  // Fetch pending reviews count
  const { data: pendingReviewsData } = useQuery({
    queryKey: ["admin", "reviews", "pending-count"],
    queryFn: () => reviewsApi.getReviews({ isApproved: false, limit: 1 }),
  });

  // Fetch active coupons count
  const { data: activeCouponsData } = useQuery({
    queryKey: ["admin", "coupons", "active-count"],
    queryFn: () => couponsApi.getCoupons({ isActive: true, limit: 1 }),
  });

  const totalOrders = ordersData?.meta?.total ?? 0;
  const totalProducts = productsData?.meta?.total ?? 0;
  const totalUsers = userStatsData?.totalUsers ?? 0;
  const activeUsers = userStatsData?.activeUsers ?? 0;
  const pendingReviews = pendingReviewsData?.meta?.total ?? 0;
  const activeCoupons = activeCouponsData?.meta?.total ?? 0;

  return (
    <div className="space-y-8">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          {t("title")}
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          {t("subtitle")}
        </p>
      </div>

      {/* KPI Cards */}
      <DashboardKpiCards
        totalOrders={totalOrders}
        totalProducts={totalProducts}
        totalUsers={totalUsers}
        activeUsers={activeUsers}
        pendingReviews={pendingReviews}
        activeCoupons={activeCoupons}
      />

      {/* Quick Actions */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <h2 className="text-base font-bold text-slate-900 dark:text-white mb-4">
          {t("quickActions")}
        </h2>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold transition-colors shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>{t("addProduct")}</span>
          </Link>
          <Link
            href="/coupons"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-white rounded-xl text-sm font-semibold transition-colors"
          >
            <TicketPercent className="w-4 h-4" />
            <span>{t("addCoupon")}</span>
          </Link>
          <Link
            href="/reviews"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-white rounded-xl text-sm font-semibold transition-colors"
          >
            <MessageSquareCheck className="w-4 h-4" />
            <span>{t("moderateReviews")}</span>
          </Link>
        </div>
      </div>

      {/* Recent Orders Table */}
      <RecentOrdersTable
        orders={ordersData?.items}
        isLoading={ordersLoading}
      />
    </div>
  );
}
