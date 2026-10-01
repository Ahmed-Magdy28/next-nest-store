"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { reviewsApi } from "@/lib/api";
import { toast } from "sonner";
import { ReviewTable } from "@/components/reviews/review-table";

export default function ReviewsPage() {
  const t = useTranslations("Reviews");
  const tCommon = useTranslations("Common");
  const queryClient = useQueryClient();

  const [page, setPage] = useState(1);
  const [filterApproved, setFilterApproved] = useState<string>("");

  const { data: reviewsData, isLoading } = useQuery({
    queryKey: ["admin", "reviews", page, filterApproved],
    queryFn: () =>
      reviewsApi.getReviews({
        page,
        limit: 10,
        isApproved:
          filterApproved === "approved"
            ? true
            : filterApproved === "pending"
              ? false
              : undefined,
      }),
  });

  const moderateMutation = useMutation({
    mutationFn: ({ id, isApproved }: { id: string; isApproved: boolean }) =>
      reviewsApi.moderate(id, { isApproved }),
    onSuccess: () => {
      toast.success(t("moderateSuccess"));
      queryClient.invalidateQueries({ queryKey: ["admin", "reviews"] });
    },
    onError: (err: any) =>
      toast.error(err?.message || "Failed to moderate review"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => reviewsApi.delete(id),
    onSuccess: () => {
      toast.success(t("deleteSuccess"));
      queryClient.invalidateQueries({ queryKey: ["admin", "reviews"] });
    },
    onError: (err: any) =>
      toast.error(err?.message || "Failed to delete review"),
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

      {/* Filter Bar */}
      <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-3">
        <button
          type="button"
          onClick={() => {
            setFilterApproved("");
            setPage(1);
          }}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
            filterApproved === ""
              ? "bg-indigo-600 text-white"
              : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
          }`}
        >
          {tCommon("all")}
        </button>
        <button
          type="button"
          onClick={() => {
            setFilterApproved("pending");
            setPage(1);
          }}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
            filterApproved === "pending"
              ? "bg-indigo-600 text-white"
              : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
          }`}
        >
          {t("pending")}
        </button>
        <button
          type="button"
          onClick={() => {
            setFilterApproved("approved");
            setPage(1);
          }}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
            filterApproved === "approved"
              ? "bg-indigo-600 text-white"
              : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
          }`}
        >
          {t("approved")}
        </button>
      </div>

      {/* Reviews Table */}
      <ReviewTable
        reviewsData={reviewsData}
        isLoading={isLoading}
        page={page}
        onPageChange={setPage}
        onModerate={(id, isApproved) =>
          moderateMutation.mutate({ id, isApproved })
        }
        onDelete={(id) => deleteMutation.mutate(id)}
      />
    </div>
  );
}
