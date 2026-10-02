import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useNotificationStore } from "./useNotificationStore";

export interface AdminReview {
  id: string;
  customer: string;
  product: string;
  rating: number;
  comment: string;
  status: "approved" | "pending" | "rejected";
  createdAt: string;
}

interface ReviewStore {
  reviews: AdminReview[];
  addReview: (r: Omit<AdminReview, "id" | "createdAt" | "status">) => AdminReview;
  updateStatus: (id: string, status: AdminReview["status"]) => void;
  deleteReview: (id: string) => void;
}

const seedReviews: AdminReview[] = [
  { id: "REV-001", customer: "Jane W.", product: "Deadpool Flat Brim Snapback", rating: 5, comment: "Quality is amazing! Fits perfectly.", status: "approved", createdAt: new Date(Date.now() - 86400000).toISOString() },
  { id: "REV-002", customer: "Brian O.", product: "Star Wars Classic Cap", rating: 5, comment: "Exactly as pictured. Fast delivery.", status: "approved", createdAt: new Date(Date.now() - 172800000).toISOString() },
  { id: "REV-003", customer: "Aisha M.", product: "Batman Comic Print Snapback", rating: 4, comment: "Love the comic print. Runs a bit small.", status: "pending", createdAt: new Date(Date.now() - 259200000).toISOString() },
];

export const useReviewStore = create<ReviewStore>()(
  persist(
    (set, get) => ({
      reviews: seedReviews,
      addReview: (r) => {
        const maxNum = get().reviews.reduce((max, existing) => {
          const match = existing.id.match(/REV-(\d+)/);
          return match ? Math.max(max, parseInt(match[1], 10)) : max;
        }, 0);
        const id = `REV-${String(maxNum + 1).padStart(3, "0")}`;

        const review: AdminReview = {
          ...r,
          id,
          status: "pending",
          createdAt: new Date().toISOString(),
        };

        set({ reviews: [review, ...get().reviews] });
        useNotificationStore.getState().addUnreadReview(review.id);
        return review;
      },
      updateStatus: (id, status) => {
        set({
          reviews: get().reviews.map((r) => (r.id === id ? { ...r, status } : r)),
        });
      },
      deleteReview: (id) => {
        set({ reviews: get().reviews.filter((r) => r.id !== id) });
      },
    }),
    { name: "toppersthrifts-reviews" }
  )
);