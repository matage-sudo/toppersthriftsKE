"use client";
import { useEffect, useState } from "react";
import { Search, Trash2, Package, Truck, CheckCircle2, XCircle, Phone, MapPin, CreditCard, Calendar, RefreshCw } from "lucide-react";
import { useOrders, updateOrderStatus, deleteOrder, Order } from "@/hooks/useOrders";
import { useNotificationStore } from "@/store/useNotificationStore";
import { formatPrice, cn } from "@/lib/utils";
import ClientDate from "@/components/ui/ClientDate";

const STATUS_OPTIONS: Order["status"][] = ["pending", "shipped", "delivered", "cancelled"];

export default function AdminOrdersPage() {
  const { orders, loading, error, refresh } = useOrders();
  const markRead = useNotificationStore((s) => s.markOrdersRead);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<Order["status"] | "all">("all");
  const [highlightIds, setHighlightIds] = useState<string[]>([]);

  useEffect(() => {
    const unread = useNotificationStore.getState().unreadOrderIds;
    setHighlightIds(unread);
    markRead();
  }, [markRead]);

  const filtered = orders.filter((o) => {
    if (statusFilter !== "all" && o.status !== statusFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return o.customerName.toLowerCase().includes(q) || o.customerPhone.includes(q) || o.id.toLowerCase().includes(q);
    }
    return true;
  });

  const handleDelete = async (id: string) => {
    if (!confirm("Delete order " + id + "?")) return;
    try {
      await deleteOrder(id);
      refresh();
    } catch (err) {
      alert("Failed to delete order");
    }
  };

  const handleStatusChange = async (id: string, status: Order["status"]) => {
    try {
      await updateOrderStatus(id, status);
      refresh();
    } catch (err) {
      alert("Failed to update status");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-brand-black dark:text-white">Orders</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {loading ? "Loading..." : orders.length + " total orders"}
          </p>
        </div>
        <button onClick={refresh} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-sm font-semibold text-brand-black dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 transition">
          <RefreshCw className="w-4 h-4" /> Refresh
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
          <input type="text" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-brand-black dark:text-white outline-none focus:border-brand-black dark:focus:border-white text-sm" />
        </div>
        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
          <button onClick={() => setStatusFilter("all")} className={cn("px-3 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition", statusFilter === "all" ? "bg-brand-black dark:bg-white text-white dark:text-black" : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400")}>All</button>
          {STATUS_OPTIONS.map((s) => (
            <button key={s} onClick={() => setStatusFilter(s)} className={cn("px-3 py-2 rounded-lg text-xs font-bold whitespace-nowrap capitalize transition", statusFilter === s ? "bg-brand-black dark:bg-white text-white dark:text-black" : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400")}>{s}</button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array(3).fill(0).map((_, i) => (
            <div key={i} className="h-40 bg-gray-100 dark:bg-gray-900 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : error ? (
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-12 text-center">
          <p className="text-sm text-red-600 dark:text-red-400 mb-3">Failed to load orders.</p>
          <button onClick={refresh} className="text-sm underline text-brand-black dark:text-white">Try again</button>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-12 text-center">
          <Package className="w-10 h-10 mx-auto text-gray-300 dark:text-gray-700 mb-3" />
          <p className="text-sm text-gray-400">No orders found.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((o) => {
            const isNew = highlightIds.includes(o.id);
            return (
              <div key={o.id} className={cn("bg-white dark:bg-gray-900 rounded-2xl border p-5 transition", isNew ? "border-red-400 dark:border-red-500 ring-2 ring-red-200 dark:ring-red-900/40" : "border-gray-200 dark:border-gray-800")}>
                <div className="flex flex-wrap justify-between items-start gap-3 mb-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <p className="text-xs font-mono font-bold text-gray-500 dark:text-gray-400">{o.id}</p>
                      {isNew && <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-red-500 text-white animate-pulse">NEW</span>}
                      <StatusBadge status={o.status} />
                    </div>
                    <p className="text-base font-extrabold text-brand-black dark:text-white mb-2">{o.customerName}</p>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-600 dark:text-gray-400">
                      <span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 shrink-0" />{o.customerPhone}</span>
                      <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 shrink-0" />{o.customerLocation || "No location"}</span>
                      <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 shrink-0" /><ClientDate date={o.createdAt} /></span>
                      <span className="flex items-center gap-1.5"><CreditCard className="w-3.5 h-3.5 shrink-0" />{o.paymentMethod}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <p className="font-extrabold text-lg text-brand-black dark:text-white">{formatPrice(o.total)}</p>
                    <button onClick={() => handleDelete(o.id)} className="p-2 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="border-t border-gray-100 dark:border-gray-800 pt-3 mb-4">
                  {o.items.map((item, i) => (
                    <div key={i} className="flex justify-between text-sm py-1">
                      <span className="text-gray-600 dark:text-gray-400">{item.name} x {item.quantity}</span>
                      <span className="font-semibold text-brand-black dark:text-white">{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap gap-2">
                  {STATUS_OPTIONS.map((s) => (
                    <button key={s} onClick={() => handleStatusChange(o.id, s)} className={cn("px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition flex items-center gap-1.5", o.status === s ? "bg-brand-black dark:bg-white text-white dark:text-black" : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400")}>
                      {s === "pending" && <Package className="w-3 h-3" />}
                      {s === "shipped" && <Truck className="w-3 h-3" />}
                      {s === "delivered" && <CheckCircle2 className="w-3 h-3" />}
                      {s === "cancelled" && <XCircle className="w-3 h-3" />}
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    pending: "bg-yellow-100 dark:bg-yellow-950/40 text-yellow-700 dark:text-yellow-400",
    shipped: "bg-blue-100 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400",
    delivered: "bg-green-100 dark:bg-green-950/40 text-green-700 dark:text-green-400",
    cancelled: "bg-red-100 dark:bg-red-950/40 text-red-700 dark:text-red-400",
  };
  return <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${colors[status] || ""}`}>{status}</span>;
}