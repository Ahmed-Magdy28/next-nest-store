"use client";

import { useTranslations } from "next-intl";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({
  page,
  totalPages,
  onPageChange,
}: PaginationProps) {
  const t = useTranslations("Common");

  if (totalPages <= 1) return null;

  const canPrev = page > 1;
  const canNext = page < totalPages;

  return (
    <div className="flex items-center justify-between gap-4 border-t border-gray-100 pt-6 dark:border-gray-800">
      <button
        type="button"
        onClick={() => onPageChange(page - 1)}
        disabled={!canPrev}
        className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-gray-800 dark:text-gray-200 dark:hover:bg-gray-800 cursor-pointer"
      >
        <ChevronLeft className="h-4 w-4 rtl:rotate-180" />
        <span>{t("previous")}</span>
      </button>

      <span className="text-sm text-gray-500 dark:text-gray-400">
        <strong className="text-gray-900 dark:text-white">{page}</strong>{" "}
        {t("of")}{" "}
        <strong className="text-gray-900 dark:text-white">{totalPages}</strong>
      </span>

      <button
        type="button"
        onClick={() => onPageChange(page + 1)}
        disabled={!canNext}
        className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-gray-800 dark:text-gray-200 dark:hover:bg-gray-800 cursor-pointer"
      >
        <span>{t("next")}</span>
        <ChevronRight className="h-4 w-4 rtl:rotate-180" />
      </button>
    </div>
  );
}
