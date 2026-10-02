"use client";
import { useState } from "react";
import { Star, Send } from "lucide-react";
import { useCustomerStore } from "@/store/useCustomerStore";
import { createReview } from "@/hooks/useReviews";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface ReviewFormProps {
  productId: string;
  productName: string;
  onSubmitted?: () => void;
}

export default function ReviewForm({ productId, productName, onSubmitted }: ReviewFormProps) {
  const { customer, isAuthenticated } = useCustomerStore();
  const router = useRouter();
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customer || !comment.trim()) return;
    setLoading(true);

    try {
      await createReview({
        customerName: customer.name,
        productId,
        productName,
        rating,
        comment: comment.trim(),
      });
      setSubmitted(true);
      setComment("");
      setRating(5);
      onSubmitted?.();
    } catch (err) {
      console.error("Review submission failed:", err);
      alert("Failed to submit review. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-6 text-center">
        <h3 className="text-lg font-bold mb-2 text-brand-black dark:text-white">
          Leave a Review
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          Sign in to share your experience with this cap.
        </p>
        <button
          onClick={() => router.push("/account/login")}
          className="bg-brand-black dark:bg-white text-white dark:text-black px-6 py-3 rounded-lg font-bold text-sm hover:bg-gray-800 dark:hover:bg-gray-200 transition"
        >
          Sign In to Review
        </button>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-2xl p-6 text-center">
        <h3 className="text-lg font-bold mb-2 text-green-700 dark:text-green-400">
          Thank you!
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Your review is pending approval. It will appear here once approved.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-6">
      <h3 className="text-lg font-bold mb-4 text-brand-black dark:text-white">
        Leave a Review
      </h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold mb-2 text-brand-black dark:text-white">
            Your Rating
          </label>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setRating(n)}
                onMouseEnter={() => setHoverRating(n)}
                onMouseLeave={() => setHoverRating(0)}
                className="transition"
                aria-label={`Rate ${n} stars`}
              >
                <Star
                  className={cn(
                    "w-8 h-8 transition",
                    n <= (hoverRating || rating)
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300 dark:text-gray-700"
                  )}
                />
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1 text-brand-black dark:text-white">
            Your Review
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
            required
            placeholder="Tell others about the fit, quality, and style..."
            className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-brand-black dark:text-white outline-none focus:border-brand-black dark:focus:border-white transition text-sm resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={loading || !comment.trim()}
          className="w-full bg-brand-black dark:bg-white text-white dark:text-black py-3 rounded-lg font-bold text-sm hover:bg-gray-800 dark:hover:bg-gray-200 transition disabled:opacity-50 flex items-center justify-center gap-2"
        >
          <Send className="w-4 h-4" />
          {loading ? "Submitting..." : "Submit Review"}
        </button>
      </form>
    </div>
  );
}