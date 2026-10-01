"use client";

import { useState } from "react";
import { Star, MessageSquare, Trash2, CheckCircle2, AlertCircle } from "lucide-react";
import {
  useProductReviews,
  useProductRatingSummary,
  useCreateReview,
  useDeleteReview,
} from "../../../hooks/use-reviews";
import { useAuthStore } from "../../../lib/stores/auth-store";
import { Link } from "../../../i18n/routing";
import type { ReviewDto } from "@repo/shared/dtos/e-commerce";

interface ProductReviewsProps {
  productId: string;
}

export function ProductReviews({ productId }: ProductReviewsProps) {
  const user = useAuthStore((s) => s.user);
  const { data: summary, isLoading: isLoadingSummary } =
    useProductRatingSummary(productId);
  const { data: reviewsData, isLoading: isLoadingReviews } =
    useProductReviews(productId);

  const createReview = useCreateReview(productId);
  const deleteReview = useDeleteReview(productId);

  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [comment, setComment] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSubmitSuccess(false);

    try {
      await createReview.mutateAsync({
        productId,
        rating,
        comment: comment.trim() || undefined,
      });
      setComment("");
      setRating(5);
      setSubmitSuccess(true);
      setTimeout(() => setSubmitSuccess(false), 5000);
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : (err as { response?: { data?: { message?: string } } })?.response
                ?.data?.message || "Failed to submit review";
      setErrorMsg(Array.isArray(msg) ? msg.join(", ") : msg);
    }
  };

  const reviews = reviewsData?.items || [];
  const totalCount = summary?.count || 0;
  const averageRating = summary?.average ? Number(summary.average.toFixed(1)) : 0;

  return (
    <section className="mt-16 rounded-2xl border border-gray-100 bg-white p-6 shadow-xs sm:p-8 dark:border-gray-800 dark:bg-gray-900">
      <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
        {/* Rating Breakdown Section */}
        <div className="md:w-1/3">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Customer Reviews
          </h2>

          <div className="mt-4 flex items-center gap-4">
            <div className="text-4xl font-extrabold text-gray-900 dark:text-white">
              {averageRating}
            </div>
            <div>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-4 w-4 ${
                      star <= Math.round(averageRating)
                        ? "fill-amber-400 text-amber-400"
                        : "text-gray-300 dark:text-gray-700"
                    }`}
                  />
                ))}
              </div>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Based on {totalCount} {totalCount === 1 ? "review" : "reviews"}
              </p>
            </div>
          </div>

          {/* Rating Bars */}
          <div className="mt-6 space-y-2">
            {[5, 4, 3, 2, 1].map((stars) => {
              const countForStar =
                summary?.distribution?.[stars as 1 | 2 | 3 | 4 | 5] || 0;
              const percentage =
                totalCount > 0 ? (countForStar / totalCount) * 100 : 0;

              return (
                <div key={stars} className="flex items-center gap-2 text-xs">
                  <span className="w-4 font-medium text-gray-600 dark:text-gray-400">
                    {stars}
                  </span>
                  <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                    <div
                      className="h-full rounded-full bg-amber-400 transition-all duration-300"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="w-8 text-right text-gray-400">
                    {countForStar}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Write a Review Form */}
        <div className="md:w-2/3 md:border-l md:border-gray-100 md:pl-8 dark:md:border-gray-800">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Write a Review
          </h3>

          {!user ? (
            <div className="mt-4 rounded-xl border border-gray-200 bg-gray-50 p-5 text-center dark:border-gray-800 dark:bg-gray-800/40">
              <MessageSquare className="mx-auto h-8 w-8 text-gray-400" />
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                Please sign in to share your thoughts about this product.
              </p>
              <Link
                href="/signin"
                className="mt-4 inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-xs hover:bg-blue-700"
              >
                Sign In
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">
                  Your Rating
                </label>
                <div className="mt-1 flex items-center gap-1.5">
                  {[1, 2, 3, 4, 5].map((star) => {
                    const active = (hoverRating ?? rating) >= star;
                    return (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(null)}
                        className="rounded p-1 transition hover:scale-110 focus:outline-hidden"
                      >
                        <Star
                          className={`h-6 w-6 ${
                            active
                              ? "fill-amber-400 text-amber-400"
                              : "text-gray-300 dark:text-gray-700"
                          }`}
                        />
                      </button>
                    );
                  })}
                  <span className="ml-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                    {hoverRating ?? rating} / 5
                  </span>
                </div>
              </div>

              <div>
                <label
                  htmlFor="review-comment"
                  className="block text-xs font-medium text-gray-700 dark:text-gray-300"
                >
                  Your Review
                </label>
                <textarea
                  id="review-comment"
                  rows={3}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share details of your own experience with this product..."
                  className="mt-1 w-full rounded-xl border border-gray-300 bg-white p-3 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-hidden focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
              </div>

              {errorMsg && (
                <div className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {submitSuccess && (
                <div className="flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="h-4 w-4 shrink-0" />
                  <span>Your review has been submitted successfully!</span>
                </div>
              )}

              <button
                type="submit"
                disabled={createReview.isPending}
                className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-medium text-white shadow-xs hover:bg-blue-700 disabled:opacity-50"
              >
                {createReview.isPending ? "Submitting..." : "Submit Review"}
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Review List */}
      <div className="mt-12 border-t border-gray-100 pt-8 dark:border-gray-800">
        <h3 className="text-base font-semibold text-gray-900 dark:text-white">
          All Reviews ({reviews.length})
        </h3>

        {isLoadingReviews ? (
          <div className="mt-4 space-y-4">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="h-20 animate-pulse rounded-xl bg-gray-100 dark:bg-gray-800"
              />
            ))}
          </div>
        ) : reviews.length === 0 ? (
          <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
            No reviews yet. Be the first to review this product!
          </p>
        ) : (
          <div className="mt-6 divide-y divide-gray-100 dark:divide-gray-800">
            {reviews.map((rev: ReviewDto) => {
              const isOwner = user?.id === rev.userId;
              const formattedDate = new Date(rev.createdAt).toLocaleDateString(
                undefined,
                {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                },
              );

              return (
                <div key={rev.id} className="py-5 first:pt-0 last:pb-0">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-900 dark:text-white">
                          {rev.user?.username || "Verified Buyer"}
                        </span>
                        <span className="text-xs text-gray-400">
                          {formattedDate}
                        </span>
                      </div>
                      <div className="mt-1 flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-3.5 w-3.5 ${
                              star <= rev.rating
                                ? "fill-amber-400 text-amber-400"
                                : "text-gray-300 dark:text-gray-700"
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    {(isOwner || user?.role === "ADMIN") && (
                      <button
                        type="button"
                        onClick={() => deleteReview.mutate(rev.id)}
                        disabled={deleteReview.isPending}
                        title="Delete review"
                        className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-red-600 dark:hover:bg-gray-800"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>

                  {rev.comment && (
                    <p className="mt-2.5 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                      {rev.comment}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
