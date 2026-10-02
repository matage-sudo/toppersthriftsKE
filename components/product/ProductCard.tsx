"use client";
import Link from "next/link";
import { Plus, Check } from "lucide-react";
import { useState } from "react";
import { Product } from "@/types";
import { useCartStore } from "@/store/useCartStore";
import { formatPrice } from "@/lib/utils";

export default function ProductCard({ product }: { product: Product }) {
  const addItem = useCartStore((s) => s.addItem);
  const [added, setAdded] = useState(false);

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      stock: 10,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <Link
      href={`/product/${product.id}`}
      className="group bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col"
    >
      <div className="aspect-square bg-gray-100 dark:bg-gray-800 relative overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {product.isOffer && (
          <span className="absolute top-2 left-2 bg-brand-black dark:bg-white text-white dark:text-black text-[10px] font-bold px-2 py-1 rounded">
            OFFER
          </span>
        )}
      </div>
      <div className="p-2 md:p-3 flex flex-col flex-1">
        <h3 className="text-xs md:text-sm font-semibold line-clamp-2 mb-1 text-brand-black dark:text-white">
          {product.name}
        </h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
          {product.brand}
        </p>
        <div className="flex items-baseline gap-1.5 mb-2 mt-auto">
          <p className="text-sm font-extrabold text-brand-black dark:text-white">
            {formatPrice(product.price)}
          </p>
          {product.originalPrice && (
            <p className="text-xs text-gray-400 dark:text-gray-500 line-through">
              {formatPrice(product.originalPrice)}
            </p>
          )}
        </div>
        <button
          onClick={handleAdd}
          disabled={!product.inStock}
          className={`w-full py-1.5 md:py-2 text-[11px] md:text-xs font-bold rounded-lg flex items-center justify-center gap-1 transition active:scale-95 disabled:opacity-50 ${
            added
              ? "bg-green-600 text-white"
              : "bg-brand-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200"
          }`}
        >
          {added ? (
            <>
              <Check className="w-3 h-3" /> Added
            </>
          ) : (
            <>
              <Plus className="w-3 h-3" /> Add
            </>
          )}
        </button>
      </div>
    </Link>
  );
}