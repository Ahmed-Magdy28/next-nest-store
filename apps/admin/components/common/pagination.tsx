"use client";

import { Fragment } from "react";
import { useTranslations } from "next-intl";
import { ChevronLeft, ChevronRight } from "lucide-react";

export interface PaginationProps {
  meta?: {
    total: number;
    page: number;
    totalPages: number;
    hasPrev: boolean;
    hasNext: boolean;
  };
  page: number;
  onPageChange: (page: number) => void;
  itemLabel?: string;
}

export function Pagination({
  meta,
  page,
  onPageChange,
  itemLabel,
}: PaginationProps) {
  const tCommon = useTranslations("Common");

  if (!meta) return null;

  const totalPages = meta.totalPages || 1;
  const total = meta.total || 0;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
      <div>
        {total > 0 ? (
          <span>
            {tCommon("page")}{" "}
            <strong className="text-slate-900 dark:text-white">{page}</strong>{" "}
            {tCommon("of")}{" "}
            <strong className="text-slate-900 dark:text-white">
              {totalPages}
            </strong>{" "}
            ({total} {itemLabel || "items"})
          </span>
        ) : (
          <span>0 {itemLabel || "items"}</span>
        )}
      </div>

      <div className="flex items-center gap-1.5 flex-wrap justify-center">
        <button
          type="button"
          disabled={!meta.hasPrev || page <= 1}
          onClick={() => onPageChange(Math.max(1, page - 1))}
          className="px-2.5 sm:px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors font-medium flex items-center gap-1 cursor-pointer text-xs"
        >
          <ChevronLeft className="w-3.5 h-3.5 rtl:rotate-180" />
          <span>{tCommon("previous")}</span>
        </button>

        <div className="flex items-center gap-1">
          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter((pNum) => {
              return (
                pNum === 1 ||
                pNum === totalPages ||
                (pNum >= page - 1 && pNum <= page + 1)
              );
            })
            .map((pNum, idx, arr) => {
              const prevP = arr[idx - 1];
              const showEllipsis = prevP && pNum - prevP > 1;

              return (
                <Fragment key={pNum}>
                  {showEllipsis && (
                    <span className="px-1 text-slate-400">...</span>
                  )}
                  <button
                    type="button"
                    onClick={() => onPageChange(pNum)}
                    className={`w-8 h-8 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                      page === pNum
                        ? "bg-indigo-600 text-white"
                        : "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                    }`}
                  >
                    {pNum}
                  </button>
                </Fragment>
              );
            })}
        </div>

        <button
          type="button"
          disabled={!meta.hasNext || page >= totalPages}
          onClick={() => onPageChange(Math.min(totalPages, page + 1))}
          className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors font-medium flex items-center gap-1 cursor-pointer"
        >
          <span>{tCommon("next")}</span>
          <ChevronRight className="w-3.5 h-3.5 rtl:rotate-180" />
        </button>
      </div>
    </div>
  );
}
