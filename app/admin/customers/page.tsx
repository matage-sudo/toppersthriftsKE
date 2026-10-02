"use client";
import { useEffect, useMemo, useState } from "react";
import { Search, Phone, MapPin, Users, RefreshCw } from "lucide-react";
import { useOrders } from "@/hooks/useOrders";
import { useNotificationStore } from "@/store/useNotificationStore";
import { formatPrice, cn } from "@/lib/utils";

interface Customer {
  name: string;
  phone: string;
  location: string;
  orders: number;
  totalSpent: number;
  lastOrder: string;
}

export default function AdminCustomersPage() {
  const { orders, loading, refresh } = useOrders();
  const markRead = useNotificationStore((s) => s.markCustomersRead);
  const [search, setSearch] = useState("");
  const [highlightPhones, setHighlightPhones] = useState<string[]>([]);

  useEffect(() => {
    const unread = useNotificationStore.getState().unreadCustomerPhones;
    setHighlightPhones(unread);
    markRead();
  }, [markRead]);

  const customers: Customer[] = useMemo(() => {
    const map = new Map<string, Customer>();
    for (const o of orders) {
      const existing = map.get(o.customerPhone);
      if (existing) {
        existing.orders += 1;
        existing.totalSpent += o.total;
        if (new Date(o.createdAt) > new Date(existing.lastOrder)) {
          existing.lastOrder = o.createdAt;
          existing.location = o.customerLocation;
        }
      } else {
        map.set(o.customerPhone, {
          name: o.customerName,
          phone: o.customerPhone,
          location: o.customerLocation,
          orders: 1,
          totalSpent: o.total,
          lastOrder: o.createdAt,
        });
      }
    }
    return Array.from(map.values()).sort(
      (a, b) => new Date(b.lastOrder).getTime() - new Date(a.lastOrder).getTime()
    );
  }, [orders]);

  const filtered = customers.filter((c) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return c.name.toLowerCase().includes(q) || c.phone.includes(q);
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-brand-black dark:text-white">Customers</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {loading ? "Loading..." : customers.length + " unique customers"}
          </p>
        </div>
        <button onClick={refresh} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-sm font-semibold text-brand-black dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 transition">
          <RefreshCw className="w-4 h-4" /> Refresh
        </button>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
        <input type="text" placeholder="Search by name or phone..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-brand-black dark:text-white outline-none focus:border-brand-black dark:focus:border-white text-sm" />
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array(6).fill(0).map((_, i) => (
            <div key={i} className="h-48 bg-gray-100 dark:bg-gray-900 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-12 text-center">
          <Users className="w-10 h-10 mx-auto text-gray-300 dark:text-gray-700 mb-3" />
          <p className="text-sm text-gray-400">No customers yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((c) => {
            const isNew = highlightPhones.includes(c.phone);
            return (
              <div key={c.phone} className={cn("bg-white dark:bg-gray-900 rounded-2xl border p-5 transition", isNew ? "border-red-400 dark:border-red-500 ring-2 ring-red-200 dark:ring-red-900/40" : "border-gray-200 dark:border-gray-800")}>
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-11 h-11 rounded-full bg-brand-black dark:bg-white flex items-center justify-center shrink-0">
                    <span className="text-white dark:text-black font-bold">{c.name.charAt(0).toUpperCase()}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-bold text-brand-black dark:text-white truncate">{c.name}</p>
                      {isNew && <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-red-500 text-white animate-pulse">NEW</span>}
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Last order {new Date(c.lastOrder).toLocaleDateString("en-KE")}</p>
                  </div>
                </div>

                <div className="space-y-2 mb-4 text-sm">
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <Phone className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{c.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <MapPin className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{c.location}</span>
                  </div>
                </div>

                <div className="border-t border-gray-100 dark:border-gray-800 pt-3 flex justify-between text-sm">
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Orders</p>
                    <p className="font-bold text-brand-black dark:text-white">{c.orders}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500 dark:text-gray-400">Total Spent</p>
                    <p className="font-bold text-brand-black dark:text-white">{formatPrice(c.totalSpent)}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}