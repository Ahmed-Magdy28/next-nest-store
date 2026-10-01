"use client";

import {
  AlertCircle,
  CheckCircle2,
  Clock,
  Truck,
  XCircle,
} from "lucide-react";

export function getOrderStatusBadge(status: string) {
  switch (status) {
    case "DELIVERED":
      return {
        icon: CheckCircle2,
        color:
          "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800",
      };
    case "SHIPPED":
      return {
        icon: Truck,
        color:
          "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800",
      };
    case "PROCESSING":
    case "CONFIRMED":
      return {
        icon: Clock,
        color:
          "bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-800",
      };
    case "CANCELLED":
    case "RETURNED":
    case "REFUNDED":
      return {
        icon: XCircle,
        color:
          "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800",
      };
    default: // PENDING
      return {
        icon: AlertCircle,
        color:
          "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800",
      };
  }
}

export function getPaymentStatusBadge(status: string) {
  switch (status) {
    case "PAID":
      return "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800";
    case "FAILED":
      return "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800";
    case "REFUNDED":
      return "bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-800";
    default: // PENDING
      return "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800";
  }
}
