import { create } from "zustand";
import { persist } from "zustand/middleware";

interface NotificationStore {
  unreadOrderIds: string[];
  unreadReviewIds: string[];
  unreadCustomerPhones: string[];
  addUnreadOrder: (id: string) => void;
  addUnreadReview: (id: string) => void;
  addUnreadCustomer: (phone: string) => void;
  markOrdersRead: () => void;
  markReviewsRead: () => void;
  markCustomersRead: () => void;
  getOrderCount: () => number;
  getReviewCount: () => number;
  getCustomerCount: () => number;
  getTotalCount: () => number;
}

export const useNotificationStore = create<NotificationStore>()(
  persist(
    (set, get) => ({
      unreadOrderIds: [],
      unreadReviewIds: [],
      unreadCustomerPhones: [],
      addUnreadOrder: (id) => {
        if (!get().unreadOrderIds.includes(id)) {
          set({ unreadOrderIds: [...get().unreadOrderIds, id] });
        }
      },
      addUnreadReview: (id) => {
        if (!get().unreadReviewIds.includes(id)) {
          set({ unreadReviewIds: [...get().unreadReviewIds, id] });
        }
      },
      addUnreadCustomer: (phone) => {
        if (!get().unreadCustomerPhones.includes(phone)) {
          set({ unreadCustomerPhones: [...get().unreadCustomerPhones, phone] });
        }
      },
      markOrdersRead: () => set({ unreadOrderIds: [] }),
      markReviewsRead: () => set({ unreadReviewIds: [] }),
      markCustomersRead: () => set({ unreadCustomerPhones: [] }),
      getOrderCount: () => get().unreadOrderIds.length,
      getReviewCount: () => get().unreadReviewIds.length,
      getCustomerCount: () => get().unreadCustomerPhones.length,
      getTotalCount: () =>
        get().unreadOrderIds.length +
        get().unreadReviewIds.length +
        get().unreadCustomerPhones.length,
    }),
    { name: "toppersthrifts-notifications" }
  )
);