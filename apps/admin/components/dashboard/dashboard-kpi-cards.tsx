"use client";

import { useTranslations } from "next-intl";
import {
  ShoppingBag,
  Package,
  MessageSquareCheck,
  TicketPercent,
  Users,
  UserCheck,
} from "lucide-react";

interface DashboardKpiCardsProps {
  totalOrders: number;
  totalProducts: number;
  pendingReviews: number;
  activeCoupons: number;
  totalUsers: number;
  activeUsers: number;
}

export function DashboardKpiCards({
  totalOrders,
  totalProducts,
  pendingReviews,
  activeCoupons,
  totalUsers,
  activeUsers,
}: DashboardKpiCardsProps) {
  const t = useTranslations("Dashboard");

  const kpis = [
    {
      title: t("totalOrders"),
      value: totalOrders.toString(),
      icon: ShoppingBag,
      color: "text-blue-600 dark:text-blue-400",
      bg: "bg-blue-50 dark:bg-blue-950/50",
    },
    {
      title: t("totalProducts"),
      value: totalProducts.toString(),
      icon: Package,
      color: "text-emerald-600 dark:text-emerald-400",
      bg: "bg-emerald-50 dark:bg-emerald-950/50",
    },
    {
      title: t("totalUsers"),
      value: totalUsers.toString(),
      icon: Users,
      color: "text-indigo-600 dark:text-indigo-400",
      bg: "bg-indigo-50 dark:bg-indigo-950/50",
    },
    {
      title: t("activeUsers"),
      value: activeUsers.toString(),
      icon: UserCheck,
      color: "text-teal-600 dark:text-teal-400",
      bg: "bg-teal-50 dark:bg-teal-950/50",
    },
    {
      title: t("pendingReviews"),
      value: pendingReviews.toString(),
      icon: MessageSquareCheck,
      color: "text-amber-600 dark:text-amber-400",
      bg: "bg-amber-50 dark:bg-amber-950/50",
    },
    {
      title: t("activeCoupons"),
      value: activeCoupons.toString(),
      icon: TicketPercent,
      color: "text-purple-600 dark:text-purple-400",
      bg: "bg-purple-50 dark:bg-purple-950/50",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {kpis.map((kpi, idx) => {
        const Icon = kpi.icon;
        return (
          <div
            key={idx}
            className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between"
          >
            <div>
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400 block mb-1">
                {kpi.title}
              </span>
              <span className="text-2xl font-bold text-slate-900 dark:text-white">
                {kpi.value}
              </span>
            </div>
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center ${kpi.bg}`}
            >
              <Icon className={`w-6 h-6 ${kpi.color}`} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
