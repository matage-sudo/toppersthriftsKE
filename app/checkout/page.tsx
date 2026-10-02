"use client";
import { useState, useEffect } from "react";
import { useCartStore } from "@/store/useCartStore";
import { useCustomerStore } from "@/store/useCustomerStore";
import { useActivityStore } from "@/store/useActivityStore";
import { createOrder } from "@/hooks/useOrders";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import { CreditCard, Smartphone, Banknote, Check, PartyPopper, Lock, UserPlus, LogIn } from "lucide-react";

type PaymentMethod = "mpesa" | "card" | "cod";

export default function CheckoutPage() {
  const { items, getTotal, clearCart } = useCartStore();
  const { customer, isAuthenticated } = useCustomerStore();
  const addLog = useActivityStore((s) => s.addLog);
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("mpesa");
  const [formData, setFormData] = useState({
    customer: "",
    phone: "",
    location: "",
    notes: "",
  });

  useEffect(() => {
    setMounted(true);
    if (customer) {
      setFormData({
        customer: customer.name,
        phone: customer.phone,
        location: customer.location,
        notes: "",
      });
    }
  }, [customer]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0 || !customer) return;
    setLoading(true);

    const paymentLabels: Record<PaymentMethod, string> = {
      mpesa: "M-Pesa",
      card: "Card (Pesapal)",
      cod: "Cash on Delivery",
    };

    try {
      const order = await createOrder({
        customerName: formData.customer,
        customerPhone: formData.phone,
        customerLocation: formData.location,
        items: items.map((i) => ({
          name: i.name,
          quantity: i.quantity,
          price: i.price,
        })),
        total: getTotal(),
        status: "pending",
        paymentMethod: paymentLabels[paymentMethod],
        notes: formData.notes || undefined,
      });

      addLog("New Order Placed", formData.customer + " - " + formatPrice(getTotal()));
      setOrderId(order.id);
      setSuccess(true);
      clearCart();

      setTimeout(() => {
        setLoading(false);
        router.push("/account");
      }, 5000);
    } catch (err) {
      console.error("Order failed:", err);
      alert("Order failed to save. Please try again.");
      setLoading(false);
    }
  };

  if (!mounted) return <div className="max-w-3xl mx-auto px-4 py-20 text-center text-gray-400 text-sm">Loading...</div>;

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold mb-4 text-brand-black dark:text-white">Your cart is empty</h1>
        <Link href="/shop" className="text-brand-black dark:text-white underline">Back to shop</Link>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-900 flex items-center justify-center mx-auto mb-5">
          <Lock className="w-7 h-7 text-gray-500 dark:text-gray-400" />
        </div>
        <h1 className="text-2xl md:text-3xl font-extrabold mb-3 text-brand-black dark:text-white">Create an account to order</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-8 max-w-sm mx-auto">
          To track your orders and get delivery updates, you need an account.
        </p>
        <div className="flex flex-col gap-3 max-w-sm mx-auto">
          <Link href="/account/signup" className="w-full bg-brand-black dark:bg-white text-white dark:text-black py-3.5 rounded-lg font-bold text-sm flex items-center justify-center gap-2">
            <UserPlus className="w-4 h-4" /> Create Account
          </Link>
          <Link href="/account/login" className="w-full bg-gray-100 dark:bg-gray-900 text-brand-black dark:text-white py-3.5 rounded-lg font-bold text-sm flex items-center justify-center gap-2">
            <LogIn className="w-4 h-4" /> I already have an account
          </Link>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-950/40 flex items-center justify-center mx-auto mb-6">
          <PartyPopper className="w-9 h-9 text-green-600 dark:text-green-400" />
        </div>
        <h1 className="text-3xl font-extrabold mb-3 text-brand-black dark:text-white">Order Placed!</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Thank you, {formData.customer.split(" ")[0]}.</p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
          Your order <span className="font-bold text-brand-black dark:text-white">#{orderId}</span> has been received.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/account" className="bg-brand-black dark:bg-white text-white dark:text-black px-6 py-3 rounded-lg font-bold text-sm">View My Orders</Link>
          <Link href="/shop" className="bg-gray-100 dark:bg-gray-900 text-brand-black dark:text-white px-6 py-3 rounded-lg font-bold text-sm">Continue Shopping</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-extrabold mb-2 text-brand-black dark:text-white">Checkout</h1>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
        Signed in as <span className="font-semibold text-brand-black dark:text-white">{customer?.name}</span>
      </p>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white dark:bg-gray-950 rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
          <h2 className="font-bold mb-4 text-brand-black dark:text-white">Delivery Details</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-1 text-brand-black dark:text-white">Full Name</label>
              <input type="text" required value={formData.customer} onChange={(e) => setFormData({ ...formData, customer: e.target.value })} className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-brand-black dark:text-white outline-none focus:border-brand-black dark:focus:border-white transition text-sm" />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1 text-brand-black dark:text-white">Phone Number</label>
              <input type="tel" required value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-brand-black dark:text-white outline-none focus:border-brand-black dark:focus:border-white transition text-sm" />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1 text-brand-black dark:text-white">Delivery Location</label>
              <input type="text" required value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-brand-black dark:text-white outline-none focus:border-brand-black dark:focus:border-white transition text-sm" />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1 text-brand-black dark:text-white">Notes (optional)</label>
              <textarea value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} rows={2} className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-brand-black dark:text-white outline-none focus:border-brand-black dark:focus:border-white transition text-sm resize-none" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-950 rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
          <h2 className="font-bold mb-4 text-brand-black dark:text-white">Payment Method</h2>
          <div className="space-y-3">
            {[
              { id: "mpesa" as const, label: "M-Pesa", desc: "Pay via STK push", icon: <Smartphone className="w-5 h-5" /> },
              { id: "card" as const, label: "Card", desc: "Via Pesapal", icon: <CreditCard className="w-5 h-5" /> },
              { id: "cod" as const, label: "Cash on Delivery", desc: "Nairobi only", icon: <Banknote className="w-5 h-5" /> },
            ].map((opt) => (
              <button key={opt.id} type="button" onClick={() => setPaymentMethod(opt.id)} className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition text-left ${paymentMethod === opt.id ? "border-brand-black dark:border-white bg-gray-50 dark:bg-gray-900" : "border-gray-200 dark:border-gray-800"}`}>
                <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center shrink-0 text-brand-black dark:text-white">{opt.icon}</div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-brand-black dark:text-white">{opt.label}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{opt.desc}</p>
                </div>
                {paymentMethod === opt.id && <Check className="w-5 h-5 text-green-600 shrink-0" />}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-6">
          <h2 className="font-bold mb-4 text-brand-black dark:text-white">Order Summary</h2>
          {items.map((item) => (
            <div key={item.id} className="flex justify-between text-sm mb-2">
              <span className="truncate pr-4 text-gray-600 dark:text-gray-400">{item.name} x{item.quantity}</span>
              <span className="font-semibold shrink-0 text-brand-black dark:text-white">{formatPrice(item.price * item.quantity)}</span>
            </div>
          ))}
          <div className="border-t border-gray-200 dark:border-gray-800 pt-4 mt-4 flex justify-between font-bold text-lg text-brand-black dark:text-white">
            <span>Total</span>
            <span>{formatPrice(getTotal())}</span>
          </div>
        </div>

        <button type="submit" disabled={loading} className="w-full bg-brand-black dark:bg-white text-white dark:text-black py-4 rounded-lg font-bold disabled:opacity-50">
          {loading ? "Placing Order..." : "Place Order"}
        </button>
      </form>
    </div>
  );
}