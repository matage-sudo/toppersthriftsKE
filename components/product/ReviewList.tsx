"use client";
import { Star } from "lucide-react";
import { useProductReviews } from "@/hooks/useReviews";
import { cn } from "@/lib/utils";

interface ReviewListProps {
  productId: string;
  refreshKey?: number;
}

export default function ReviewList({ productId, refreshKey }: ReviewListProps) {
  const { reviews, loading } = useProductReviews(productId);

  if (loading) {
    return (
      <div className="space-y-3">
        {Array(2).fill(0).map((_, i) => (
          <div
            key={i}
            className="h-24 bg-gray-100 dark:bg-gray-900 rounded-xl animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <p className="text-sm text-gray-400 dark:text-gray-500 py-4">
        No reviews yet. Be the first to share your thoughts!
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {reviews.map((r) => (
        <div
          key={r.id}
          className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4"
        >
          <div className="flex justify-between items-start gap-2 mb-2">
            <div>
              <p className="font-bold text-sm text-brand-black dark:text-white">
                {r.customerName}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {new Date(r.createdAt).toLocaleDateString("en-KE")}
              </p>
            </div>
            <div className="flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map((n) => (
                <Star
                  key={n}
                  className={cn(
                    "w-3.5 h-3.5",
                    n <= r.rating
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300 dark:text-gray-700"
                  )}
                />
              ))}
            </div>
          </div>
          <p className="text-sm text-gray-700 dark:text-gray-300">{r.comment}</p>
        </div>
      ))}
    </div>
  );
}