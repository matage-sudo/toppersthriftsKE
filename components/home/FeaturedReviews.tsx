"use client";
import { Star, Quote } from "lucide-react";
import { useFeaturedReviews } from "@/hooks/useReviews";
import { cn } from "@/lib/utils";

export default function FeaturedReviews() {
  const { reviews, loading } = useFeaturedReviews(6);

  if (loading) {
    return (
      <section className="mb-12">
        <h2 className="text-xl font-extrabold tracking-tight mb-4 text-brand-black dark:text-white">
          What Customers Are Saying
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Array(3).fill(0).map((_, i) => (
            <div
              key={i}
              className="h-40 bg-gray-100 dark:bg-gray-900 rounded-2xl animate-pulse"
            />
          ))}
        </div>
      </section>
    );
  }

  if (reviews.length === 0) return null;

  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-extrabold tracking-tight text-brand-black dark:text-white">
          What Customers Are Saying
        </h2>
        <span className="text-xs text-gray-500 dark:text-gray-400 font-semibold">
          {reviews.length} {reviews.length === 1 ? "review" : "reviews"}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {reviews.map((r) => (
          <div
            key={r.id}
            className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-5 flex flex-col"
          >
            <Quote className="w-6 h-6 text-gray-300 dark:text-gray-700 mb-3 shrink-0" />

            <div className="flex items-center gap-0.5 mb-3">
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

            <p className="text-sm text-gray-700 dark:text-gray-300 mb-4 flex-1 line-clamp-4">
              {r.comment}
            </p>

            <div className="border-t border-gray-200 dark:border-gray-800 pt-3">
              <p className="text-sm font-bold text-brand-black dark:text-white">
                {r.customerName}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                on {r.productName}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}