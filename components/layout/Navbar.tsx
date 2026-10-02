"use client";
import Link from "next/link";
import { ShoppingCart, Search, User } from "lucide-react";
import { useEffect, useState } from "react";
import { useCartStore } from "@/store/useCartStore";
import { useCustomerStore } from "@/store/useCustomerStore";
import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
  const itemCount = useCartStore((s) => s.getItemCount());
  const openCart = useCartStore((s) => s.openCart);
  const isAuth = useCustomerStore((s) => s.isAuthenticated);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return (
    <header className="sticky top-0 z-50 bg-white/95 dark:bg-gray-950/95 backdrop-blur-md border-b border-gray-100 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-xl font-extrabold tracking-tight">
            Toppersthrifts<span className="text-red-600">KE</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold">
            <Link href="/" className="hover:text-gray-600 dark:hover:text-gray-300 transition">Home</Link>
            <Link href="/shop?filter=hype" className="hover:text-gray-600 dark:hover:text-gray-300 transition">Hype</Link>
            <Link href="/shop?filter=iconic" className="hover:text-gray-600 dark:hover:text-gray-300 transition">Iconic</Link>
            <Link href="/shop?filter=legacy" className="hover:text-gray-600 dark:hover:text-gray-300 transition">Legacy</Link>
            <Link href="/shop?filter=drip" className="hover:text-gray-600 dark:hover:text-gray-300 transition">Drip</Link>
            <Link href="/shop?filter=offers" className="text-red-600 hover:text-red-700 transition font-bold">Offers</Link>
          </nav>

          <div className="flex items-center gap-1">
            <ThemeToggle />
            <Link
              href="/search"
              aria-label="Search"
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            >
              <Search className="w-5 h-5" />
            </Link>
            <button
              onClick={openCart}
              aria-label="Cart"
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition relative"
            >
              <ShoppingCart className="w-5 h-5" />
              {mounted && itemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-brand-black dark:bg-white text-white dark:text-brand-black text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full">
                  {itemCount}
                </span>
              )}
            </button>
            <Link
              href={isAuth ? "/account" : "/account/login"}
              aria-label="Account"
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            >
              <User className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}