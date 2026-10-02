"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCustomerStore } from "@/store/useCustomerStore";
import { useCartStore } from "@/store/useCartStore";
import { useOrderStore } from "@/store/useOrderStore";
import {
  LogOut,
  Package,
  MapPin,
  Phone,
  Mail,
  Edit3,
  Check,
  ShoppingBag,
  Truck,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { formatPrice, cn } from "@/lib/utils";
import ClientDate from "@/components/ui/ClientDate";

export default function AccountPage() {
  const router = useRouter();
  const { customer, isAuthenticated, logout, updateProfile } = useCustomerStore();
  const clearCart = useCartStore((s) => s.clearCart);
  const allOrders = useOrderStore((s) => s.orders);
  const [mounted, setMounted] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    phone: "",
    location: "",
    email: "",
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !isAuthenticated) {
      router.push("/account/login");
    }
    if (customer) {
      setEditForm({
        name: customer.name,
        phone: customer.phone,
        location: customer.location,
        email: customer.email || "",
      });
    }
  }, [isAuthenticated, customer, mounted, router]);

  if (!mounted || !customer) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center text-gray-400 text-sm">
        Loading...
      </div>
    );
  }

  // Filter orders by customer's phone number
  const myOrders = allOrders.filter((o) => o.phone === customer.phone);
  const totalSpent = myOrders.reduce((sum, o) => sum + o.total, 0);

  const handleSave = () => {
    updateProfile({
      name: editForm.name.trim(),
      phone: editForm.phone.trim(),
      location: editForm.location.trim(),
      email: editForm.email.trim() || undefined,
    });
    setEditing(false);
  };

  const handleLogout = () => {
    clearCart();
    logout();
    router.push("/");
  };

  const memberSince = new Date(customer.createdAt).toLocaleDateString("en-KE", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-brand-black dark:text-white">
            Hey, {customer.name.split(" ")[0]} 👋
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Member since {memberSince}
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-sm font-semibold text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-500 transition"
        >
          <LogOut className="w-4 h-4" /> Sign out
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-2 text-gray-500 dark:text-gray-400">
            <ShoppingBag className="w-4 h-4" />
            <p className="text-xs font-bold uppercase">Orders</p>
          </div>
          <p className="text-2xl font-extrabold text-brand-black dark:text-white">
            {myOrders.length}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-2 text-gray-500 dark:text-gray-400">
            <Package className="w-4 h-4" />
            <p className="text-xs font-bold uppercase">Total Spent</p>
          </div>
          <p className="text-2xl font-extrabold text-brand-black dark:text-white">
            {formatPrice(totalSpent)}
          </p>
        </div>
      </div>

      {/* Profile */}
      <section className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-brand-black dark:text-white">Profile</h2>
          {!editing ? (
            <button
              onClick={() => setEditing(true)}
              className="flex items-center gap-2 text-sm font-semibold text-gray-600 dark:text-gray-400 hover:text-brand-black dark:hover:text-white transition"
            >
              <Edit3 className="w-4 h-4" /> Edit
            </button>
          ) : (
            <button
              onClick={handleSave}
              className="flex items-center gap-2 text-sm font-semibold text-green-600 hover:text-green-700 transition"
            >
              <Check className="w-4 h-4" /> Save
            </button>
          )}
        </div>

        <div className="space-y-4">
          <FieldRow
            icon={<Package className="w-4 h-4" />}
            label="Full Name"
            value={editForm.name}
            editing={editing}
            onChange={(v) => setEditForm({ ...editForm, name: v })}
          />
          <FieldRow
            icon={<Phone className="w-4 h-4" />}
            label="Phone"
            value={editForm.phone}
            editing={editing}
            onChange={(v) => setEditForm({ ...editForm, phone: v })}
          />
          <FieldRow
            icon={<MapPin className="w-4 h-4" />}
            label="Location"
            value={editForm.location}
            editing={editing}
            onChange={(v) => setEditForm({ ...editForm, location: v })}
          />
          <FieldRow
            icon={<Mail className="w-4 h-4" />}
            label="Email"
            value={editForm.email}
            editing={editing}
            onChange={(v) => setEditForm({ ...editForm, email: v })}
            placeholder="Add email (optional)"
          />
        </div>
      </section>

      {/* Orders */}
      <section className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-brand-black dark:text-white">My Orders</h2>
          {myOrders.length > 0 && (
            <span className="text-xs text-gray-400">
              {myOrders.length} {myOrders.length === 1 ? "order" : "orders"}
            </span>
          )}
        </div>

        {myOrders.length === 0 ? (
          <div className="text-center py-10">
            <Package className="w-10 h-10 mx-auto mb-3 text-gray-300 dark:text-gray-700" />
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              You haven't placed any orders yet.
            </p>
            <Link
              href="/shop"
              className="inline-block bg-brand-black dark:bg-white text-white dark:text-black px-5 py-2.5 rounded-lg font-bold text-xs hover:bg-gray-800 dark:hover:bg-gray-200 transition"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {myOrders.map((o) => (
              <div
                key={o.id}
                className="border border-gray-200 dark:border-gray-800 rounded-xl p-4"
              >
                <div className="flex justify-between items-start gap-3 mb-3 flex-wrap">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-bold text-sm text-brand-black dark:text-white">
                        {o.id}
                      </p>
                      <OrderStatusBadge status={o.status} />
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      <ClientDate date={o.createdAt} /> • {o.paymentMethod}
                    </p>
                  </div>
                  <p className="font-extrabold text-sm text-brand-black dark:text-white">
                    {formatPrice(o.total)}
                  </p>
                </div>

                <div className="border-t border-gray-100 dark:border-gray-800 pt-3">
                  {o.items.map((item, i) => (
                    <div key={i} className="flex justify-between text-xs py-0.5">
                      <span className="text-gray-600 dark:text-gray-400">
                        {item.name} × {item.quantity}
                      </span>
                      <span className="font-semibold text-brand-black dark:text-white">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          href="/shop"
          className="flex-1 bg-brand-black dark:bg-white text-white dark:text-black py-3 rounded-lg font-bold text-center hover:bg-gray-800 dark:hover:bg-gray-200 transition"
        >
          Continue Shopping
        </Link>
        <Link
          href="/cart"
          className="flex-1 bg-gray-100 dark:bg-gray-900 text-brand-black dark:text-white py-3 rounded-lg font-bold text-center hover:bg-gray-200 dark:hover:bg-gray-800 transition"
        >
          View Cart
        </Link>
      </div>
    </div>
  );
}

function FieldRow({
  icon,
  label,
  value,
  editing,
  onChange,
  placeholder,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  editing: boolean;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-9 h-9 rounded-full bg-gray-100 dark:bg-gray-900 flex items-center justify-center shrink-0 text-gray-500 dark:text-gray-400">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">
          {label}
        </p>
        {editing ? (
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-brand-black dark:text-white outline-none focus:border-brand-black dark:focus:border-white transition text-sm"
          />
        ) : (
          <p className="text-sm font-medium truncate text-brand-black dark:text-white">
            {value || <span className="text-gray-400">—</span>}
          </p>
        )}
      </div>
    </div>
  );
}

function OrderStatusBadge({ status }: { status: string }) {
  const config: Record<string, { color: string; icon: React.ReactNode; label: string }> = {
    pending: {
      color: "bg-yellow-100 dark:bg-yellow-950/40 text-yellow-700 dark:text-yellow-400",
      icon: <Package className="w-3 h-3" />,
      label: "Pending",
    },
    shipped: {
      color: "bg-blue-100 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400",
      icon: <Truck className="w-3 h-3" />,
      label: "Shipped",
    },
    delivered: {
      color: "bg-green-100 dark:bg-green-950/40 text-green-700 dark:text-green-400",
      icon: <CheckCircle2 className="w-3 h-3" />,
      label: "Delivered",
    },
    cancelled: {
      color: "bg-red-100 dark:bg-red-950/40 text-red-700 dark:text-red-400",
      icon: <XCircle className="w-3 h-3" />,
      label: "Cancelled",
    },
  };
  const c = config[status] || config.pending;
  return (
    <span className={cn("text-[10px] font-bold uppercase px-2 py-0.5 rounded-full flex items-center gap-1 w-fit", c.color)}>
      {c.icon}
      {c.label}
    </span>
  );
}