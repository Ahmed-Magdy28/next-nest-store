"use client";

import { useTranslations } from "next-intl";
import { Star, Check, X, Trash2, Loader2 } from "lucide-react";
import type { ReviewDto, PaginatedResultDto } from "@repo/shared/dtos/e-commerce";
import { Pagination } from "../common/pagination";

interface ReviewTableProps {
  reviewsData?: PaginatedResultDto<ReviewDto>;
  isLoading: boolean;
  page: number;
  onPageChange: (page: number) => void;
  onModerate: (id: string, isApproved: boolean) => void;
  onDelete: (id: string) => void;
}

export function ReviewTable({
  reviewsData,
  isLoading,
  page,
  onPageChange,
  onModerate,
  onDelete,
}: ReviewTableProps) {
  const t = useTranslations("Reviews");
  const tCommon = useTranslations("Common");

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[650px] text-start text-sm">
          <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs uppercase font-medium border-b border-slate-200 dark:border-slate-800">
            <tr>
              <th className="px-6 py-3.5 text-start">{t("user")}</th>
              <th className="px-6 py-3.5 text-start">{t("rating")}</th>
              <th className="px-6 py-3.5 text-start">{t("comment")}</th>
              <th className="px-6 py-3.5 text-start">{t("moderationStatus")}</th>
              <th className="px-6 py-3.5 text-start">{tCommon("date")}</th>
              <th className="px-6 py-3.5 text-end">{tCommon("actions")}</th>
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
            ) : !reviewsData?.items?.length ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-6 py-8 text-center text-slate-500"
                >
                  {tCommon("noData")}
                </td>
              </tr>
            ) : (
              reviewsData.items.map((review) => (
                <tr
                  key={review.id}
                  className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors"
                >
                  <td className="px-6 py-4 font-semibold text-slate-900 dark:text-white">
                    {review.user?.username || review.userId}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1 text-amber-500">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${
                            i < review.rating
                              ? "fill-amber-400 text-amber-400"
                              : "text-slate-200 dark:text-slate-700"
                          }`}
                        />
                      ))}
                      <span className="ms-1 text-xs font-bold text-slate-700 dark:text-slate-300">
                        {review.rating}/5
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-300 max-w-xs truncate">
                    {review.comment || (
                      <span className="text-slate-400 italic">No comment</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        review.isApproved
                          ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400"
                          : "bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400"
                      }`}
                    >
                      {review.isApproved ? t("approved") : t("pending")}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-500">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-end">
                    <div className="flex items-center justify-end gap-2">
                      {!review.isApproved ? (
                        <button
                          type="button"
                          onClick={() => onModerate(review.id, true)}
                          className="p-1.5 rounded-lg border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 text-emerald-600 dark:text-emerald-400 cursor-pointer"
                          title={t("approve")}
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => onModerate(review.id, false)}
                          className="p-1.5 rounded-lg border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 text-amber-600 dark:text-amber-400 cursor-pointer"
                          title={t("reject")}
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => {
                          if (confirm(t("deleteConfirm"))) {
                            onDelete(review.id);
                          }
                        }}
                        className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-rose-50 dark:hover:bg-rose-950/50 hover:text-rose-600 text-slate-400 cursor-pointer"
                        title={tCommon("delete")}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Pagination
        meta={reviewsData?.meta}
        page={page}
        onPageChange={onPageChange}
        itemLabel="reviews"
      />
    </div>
  );
}
