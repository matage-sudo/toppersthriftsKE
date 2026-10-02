"use client";
import { useCartStore } from "@/store/useCartStore";
import { formatPrice } from "@/lib/utils";
import { X, Plus, Minus, Trash2, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, getTotal } =
    useCartStore();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const handleCheckout = () => {
    closeCart();
    router.push("/checkout");
  };

  if (!mounted) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/40 z-[60] transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={closeCart}
      />

      {/* Drawer */}
      <aside
        className={`fixed top-0 right-0 h-full w-full max-w-md z-[70] shadow-2xl transition-transform duration-300 flex flex-col bg-white dark:bg-gray-950 text-brand-black dark:text-white ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-gray-800">
          <h2 className="text-lg font-extrabold">
            Your Cart{" "}
            {items.length > 0 && (
              <span className="text-gray-400 text-sm font-semibold">
                ({items.length})
              </span>
            )}
          </h2>
          <button
            onClick={closeCart}
            aria-label="Close cart"
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
            <div className="w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-900 flex items-center justify-center mb-4">
              <X className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="font-bold mb-2">Your cart is empty</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              Add some caps to get started
            </p>
            <Link
              href="/shop"
              onClick={closeCart}
              className="bg-brand-black dark:bg-white text-white dark:text-black px-6 py-3 rounded-lg font-semibold text-sm hover:bg-gray-800 dark:hover:bg-gray-200 transition"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <>
            {/* Items */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-3 py-3 border-b border-gray-100 dark:border-gray-800 last:border-0"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-lg bg-gray-100 dark:bg-gray-900"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold line-clamp-2 mb-1 text-brand-black dark:text-white">
                      {item.name}
                    </h3>
                    <p className="text-sm font-bold mb-2 text-brand-black dark:text-white">
                      {formatPrice(item.price)}
                    </p>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                        className="w-7 h-7 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 transition text-brand-black dark:text-white"
                        aria-label="Decrease"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-sm font-semibold w-6 text-center text-brand-black dark:text-white">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                        className="w-7 h-7 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 transition text-brand-black dark:text-white"
                        aria-label="Increase"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="ml-auto text-gray-400 hover:text-red-500 transition"
                        aria-label="Remove"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="border-t border-gray-100 dark:border-gray-800 p-5 space-y-4 bg-white dark:bg-gray-950">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Subtotal
                </span>
                <span className="font-extrabold text-lg text-brand-black dark:text-white">
                  {formatPrice(getTotal())}
                </span>
              </div>
              <p className="text-xs text-gray-400 dark:text-gray-500">
                Delivery calculated at checkout
              </p>
              <button
                onClick={handleCheckout}
                className="w-full bg-brand-black dark:bg-white text-white dark:text-black py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gray-800 dark:hover:bg-gray-200 transition active:scale-[0.98]"
              >
                Checkout <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </>
        )}
      </aside>
    </>
  );
}