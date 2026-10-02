"use client";
import { useCartStore } from "@/store/useCartStore";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { useEffect, useState } from "react";

export default function CartPage() {
  const { items, removeItem, updateQuantity, getTotal, clearCart } = useCartStore();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center text-gray-400 text-sm">
        Loading...
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-6">
          <ShoppingBag className="w-8 h-8 text-gray-400" />
        </div>
        <h1 className="text-2xl font-extrabold mb-2">Your cart is empty</h1>
        <p className="text-gray-500 mb-8">Add some caps to get started.</p>
        <Link
          href="/"
          className="bg-brand-black text-white px-6 py-3 rounded-lg font-semibold text-sm hover:bg-gray-800 transition inline-block"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-extrabold mb-8">Your Cart</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex gap-4 bg-white border border-gray-200 rounded-xl p-4"
            >
              <Link href={`/product/${item.id}`} className="shrink-0">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-20 h-20 md:w-24 md:h-24 object-cover rounded-lg"
                />
              </Link>
              <div className="flex-1 min-w-0">
                <Link href={`/product/${item.id}`}>
                  <h3 className="font-semibold mb-1 line-clamp-2 hover:text-gray-600 transition">
                    {item.name}
                  </h3>
                </Link>
                <p className="text-sm text-gray-500 mb-3">
                  {formatPrice(item.price)}
                </p>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition"
                    aria-label="Decrease"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="font-semibold w-8 text-center">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition"
                    aria-label="Increase"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="flex flex-col items-end justify-between shrink-0">
                <button
                  onClick={() => removeItem(item.id)}
                  className="text-red-500 hover:text-red-700 transition"
                  aria-label="Remove"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
                <p className="font-bold">
                  {formatPrice(item.price * item.quantity)}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-gray-50 rounded-2xl p-6 h-fit sticky top-24">
          <h2 className="text-lg font-bold mb-4">Order Summary</h2>
          <div className="space-y-2 mb-4 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Subtotal</span>
              <span className="font-semibold">{formatPrice(getTotal())}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Delivery</span>
              <span className="font-semibold">Calculated at checkout</span>
            </div>
          </div>
          <div className="border-t border-gray-200 pt-4 mb-6 flex justify-between">
            <span className="font-bold">Total</span>
            <span className="font-extrabold text-lg">{formatPrice(getTotal())}</span>
          </div>
          <button
            onClick={() => router.push("/checkout")}
            className="w-full bg-brand-black text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-gray-800 transition"
          >
            Proceed to Checkout <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={clearCart}
            className="w-full mt-3 text-sm text-gray-500 hover:text-red-600 transition"
          >
            Clear Cart
          </button>
        </div>
      </div>
    </div>
  );
}