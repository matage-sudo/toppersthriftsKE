import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useNotificationStore } from "./useNotificationStore";

export interface AdminOrder {
  id: string;
  customer: string;
  phone: string;
  location: string;
  items: { name: string; quantity: number; price: number }[];
  total: number;
  status: "pending" | "shipped" | "delivered" | "cancelled";
  paymentMethod: string;
  createdAt: string;
}

interface OrderStore {
  orders: AdminOrder[];
  addOrder: (o: Omit<AdminOrder, "id" | "createdAt">) => AdminOrder;
  updateStatus: (id: string, status: AdminOrder["status"]) => void;
  deleteOrder: (id: string) => void;
}

const seedOrders: AdminOrder[] = [
  {
    id: "ORD-001",
    customer: "Jane Wanjiku",
    phone: "0712345678",
    location: "Nairobi CBD",
    items: [{ name: "Deadpool Flat Brim Snapback", quantity: 1, price: 1500 }],
    total: 1500,
    status: "pending",
    paymentMethod: "M-Pesa",
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: "ORD-002",
    customer: "Brian Otieno",
    phone: "0723456789",
    location: "Westlands",
    items: [
      { name: "Star Wars Classic Cap", quantity: 1, price: 1200 },
      { name: "Batman Comic Print Snapback", quantity: 1, price: 1800 },
    ],
    total: 3000,
    status: "shipped",
    paymentMethod: "Card",
    createdAt: new Date(Date.now() - 172800000).toISOString(),
  },
  {
    id: "ORD-003",
    customer: "Aisha Mohamed",
    phone: "0734567890",
    location: "Karen",
    items: [{ name: "Notre Dame Fighting Irish Cap", quantity: 1, price: 2200 }],
    total: 2200,
    status: "delivered",
    paymentMethod: "Cash on Delivery",
    createdAt: new Date(Date.now() - 259200000).toISOString(),
  },
];

export const useOrderStore = create<OrderStore>()(
  persist(
    (set, get) => ({
      orders: seedOrders,
      addOrder: (o) => {
        // Determine next sequential ORD number
        const maxNum = get().orders.reduce((max, existing) => {
          const match = existing.id.match(/ORD-(\d+)/);
          return match ? Math.max(max, parseInt(match[1], 10)) : max;
        }, 0);
        const id = `ORD-${String(maxNum + 1).padStart(3, "0")}`;

        const order: AdminOrder = {
          ...o,
          id,
          createdAt: new Date().toISOString(),
        };

        // Was this a brand new customer? (check BEFORE adding the order)
        const existingCount = get().orders.filter((x) => x.phone === o.phone).length;

        set({ orders: [order, ...get().orders] });

        // Fire notifications
        const notif = useNotificationStore.getState();
        notif.addUnreadOrder(order.id);
        if (existingCount === 0) {
          notif.addUnreadCustomer(order.phone);
        }

        return order;
      },
      updateStatus: (id, status) => {
        set({
          orders: get().orders.map((o) => (o.id === id ? { ...o, status } : o)),
        });
      },
      deleteOrder: (id) => {
        set({ orders: get().orders.filter((o) => o.id !== id) });
      },
    }),
    { name: "toppersthrifts-orders" }
  )
);