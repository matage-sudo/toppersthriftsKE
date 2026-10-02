"use client";
import { useEffect, useState } from "react";
import { Star, Check, X, Trash2, RefreshCw } from "lucide-react";
import {
  useReviews,
  updateReviewStatus,
  deleteReview,
  Review,
} from "@/hooks/useReviews";
import { useNotificationStore } from "@/store/useNotificationStore";
import { cn } from "@/lib/utils";

export default function AdminReviewsPage() {
  const { reviews, loading, error, refresh } = useReviews();
  const markRead = useNotificationStore((s) => s.markReviewsRead);
  const [filter, setFilter] = useState<Review["status"] | "all">("all");
  const [highlightIds, setHighlightIds] = useState<string[]>([]);

  useEffect(() => {
    const unread = useNotificationStore.getState().unreadReviewIds;
    setHighlightIds(unread);
    markRead();
  }, [markRead]);

  const handleStatus = async (id: string, status: Review["status"]) => {
    try {
      await updateReviewStatus(id, status);
      refresh();
    } catch (err) {
      alert("Failed to update review");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this review?")) return;
    try {
      await deleteReview(id);
      refresh();
    } catch (err) {
      alert("Failed to delete review");
    }
  };

  const filtered = reviews.filter((r) => filter === "all" || r.status === filter);

  const counts = {
    all: reviews.length,
    approved: reviews.filter((r) => r.status === "approved").length,
    pending: reviews.filter((r) => r.status === "pending").length,
    rejected: reviews.filter((r) => r.status === "rejected").length,
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-brand-black dark:text-white">
            Reviews
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {loading ? "Loading..." : `${reviews.length} total reviews`}
          </p>
        </div>
        <button
          onClick={refresh}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-sm font-semibold text-brand-black dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 transition"
        >
          <RefreshCw className="w-4 h-4" /> Refresh
        </button>
      </div>

      <div className="flex gap-2 mb-6 flex-wrap">
        {(["all", "pending", "approved", "rejected"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              "px-3 py-2 rounded-lg text-xs font-bold capitalize transition",
              filter === f
                ? "bg-brand-black dark:bg-white text-white dark:text-black"
                : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
            )}
          >
            {f} ({counts[f]})
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array(3).fill(0).map((_, i) => (
            <div
              key={i}
              className="h-32 bg-gray-100 dark:bg-gray-900 rounded-2xl animate-pulse"
            />
          ))}
        </div>
      ) : error ? (
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-12 text-center">
          <p className="text-sm text-red-600 dark:text-red-400 mb-3">
            Failed to load reviews.
          </p>
          <button
            onClick={refresh}
            className="text-sm underline text-brand-black dark:text-white"
          >
            Try again
          </button>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-12 text-center">
          <Star className="w-10 h-10 mx-auto text-gray-300 dark:text-gray-700 mb-3" />
          <p className="text-sm text-gray-400">No reviews found.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((r) => {
            const isNew = highlightIds.includes(r.id);
            return (
              <div
                key={r.id}
                className={cn(
                  "bg-white dark:bg-gray-900 rounded-2xl border p-5 transition",
                  isNew
                    ? "border-red-400 dark:border-red-500 ring-2 ring-red-200 dark:ring-red-900/40"
                    : "border-gray-200 dark:border-gray-800"
                )}
              >
                <div className="flex justify-between items-start gap-3 mb-3 flex-wrap">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <p className="font-bold text-brand-black dark:text-white">
                        {r.customerName}
                      </p>
                      {isNew && (
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-red-500 text-white animate-pulse">
                          NEW
                        </span>
                      )}
                      <ReviewStatusBadge status={r.status} />
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {r.productName} -{" "}
                      {new Date(r.createdAt).toLocaleDateString("en-KE")}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <Star
                        key={n}
                        className={cn(
                          "w-4 h-4",
                          n <= r.rating
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300 dark:text-gray-700"
                        )}
                      />
                    ))}
                  </div>
                </div>

                <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
                  {r.comment}
                </p>

                <div className="flex flex-wrap gap-2 pt-3 border-t border-gray-100 dark:border-gray-800">
                  <button
                    onClick={() => handleStatus(r.id, "approved")}
                    disabled={r.status === "approved"}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-green-100 dark:bg-green-950/40 text-green-700 dark:text-green-400 disabled:opacity-50 transition"
                  >
                    <Check className="w-3.5 h-3.5" /> Approve
                  </button>
                  <button
                    onClick={() => handleStatus(r.id, "rejected")}
                    disabled={r.status === "rejected"}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-red-100 dark:bg-red-950/40 text-red-700 dark:text-red-400 disabled:opacity-50 transition"
                  >
                    <X className="w-3.5 h-3.5" /> Reject
                  </button>
                  <button
                    onClick={() => handleDelete(r.id)}
                    className="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-gray-500 hover:text-red-600 dark:hover:text-red-400 transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function ReviewStatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    approved: "bg-green-100 dark:bg-green-950/40 text-green-700 dark:text-green-400",
    pending: "bg-yellow-100 dark:bg-yellow-950/40 text-yellow-700 dark:text-yellow-400",
    rejected: "bg-red-100 dark:bg-red-950/40 text-red-700 dark:text-red-400",
  };
  return (
    <span
      className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${colors[status] || ""}`}
    >
      {status}
    </span>
  );
}