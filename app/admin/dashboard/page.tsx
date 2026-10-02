"use client";
import { Package, ShoppingBag, DollarSign, Users } from "lucide-react";
import Link from "next/link";
import { useOrders } from "@/hooks/useOrders";
import { useProducts } from "@/hooks/useProducts";
import { formatPrice } from "@/lib/utils";

export default function AdminDashboardPage() {
  const { orders, loading: ordersLoading } = useOrders();
  const { products, loading: productsLoading } = useProducts();

  const totalRevenue = orders
    .filter((o) => o.status !== "cancelled")
    .reduce((sum, o) => sum + o.total, 0);
  const pendingOrders = orders.filter((o) => o.status === "pending").length;
  const customers = new Set(orders.map((o) => o.customerPhone)).size;
  const offers = products.filter((p) => p.isOffer).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-brand-black dark:text-white">Dashboard</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Overview of your store performance</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
        <StatCard icon={<Package className="w-4 h-4" />} label="Products" value={productsLoading ? "-" : String(products.length)} href="/admin/products" />
        <StatCard icon={<ShoppingBag className="w-4 h-4" />} label="Orders" value={ordersLoading ? "-" : String(orders.length)} sub={pendingOrders > 0 ? pendingOrders + " pending" : undefined} href="/admin/orders" />
        <StatCard icon={<Users className="w-4 h-4" />} label="Customers" value={ordersLoading ? "-" : String(customers)} href="/admin/customers" />
        <StatCard icon={<DollarSign className="w-4 h-4" />} label="Revenue" value={ordersLoading ? "-" : formatPrice(totalRevenue)} />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
          <div className="p-6 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
            <h2 className="text-lg font-bold text-brand-black dark:text-white">Recent Orders</h2>
            <Link href="/admin/orders" className="text-xs font-semibold text-gray-500 hover:text-brand-black dark:hover:text-white">View all</Link>
          </div>
          {ordersLoading ? (
            <div className="p-4 space-y-3">
              {Array(3).fill(0).map((_, i) => (
                <div key={i} className="h-12 bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : orders.length === 0 ? (
            <div className="p-8 text-center text-sm text-gray-400">No orders yet.</div>
          ) : (
            <div className="divide-y divide-gray-100 dark:divide-gray-800">
              {orders.slice(0, 5).map((o) => (
                <div key={o.id} className="flex justify-between items-center p-4">
                  <div>
                    <p className="font-semibold text-sm text-brand-black dark:text-white">{o.customerName}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{o.id} - {o.customerLocation}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-sm text-brand-black dark:text-white">{formatPrice(o.total)}</p>
                    <StatusBadge status={o.status} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
          <h2 className="text-lg font-bold mb-4 text-brand-black dark:text-white">Quick Stats</h2>
          <div className="space-y-4">
            <QuickRow label="Active Offers" value={productsLoading ? "-" : String(offers)} highlight />
            <QuickRow label="Featured Caps" value={productsLoading ? "-" : String(products.filter((p) => p.isFeatured).length)} />
            <QuickRow label="Pending Orders" value={ordersLoading ? "-" : String(pendingOrders)} />
            <QuickRow label="Delivered Orders" value={ordersLoading ? "-" : String(orders.filter((o) => o.status === "delivered").length)} />
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, sub, href }: { icon: React.ReactNode; label: string; value: string; sub?: string; href?: string }) {
  const content = (
    <div className="bg-white dark:bg-gray-900 p-5 rounded-2xl border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 transition">
      <div className="flex items-center gap-2 mb-2 text-gray-500 dark:text-gray-400">
        {icon}
        <h3 className="text-xs font-bold uppercase">{label}</h3>
      </div>
      <p className="text-2xl font-extrabold text-brand-black dark:text-white">{value}</p>
      {sub && <p className="text-xs text-orange-500 font-semibold mt-1">{sub}</p>}
    </div>
  );
  return href ? <Link href={href}>{content}</Link> : content;
}

function QuickRow({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-sm text-gray-500 dark:text-gray-400">{label}</span>
      <span className={highlight ? "font-bold text-sm text-red-600 dark:text-red-400" : "font-bold text-sm text-brand-black dark:text-white"}>{value}</span>
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