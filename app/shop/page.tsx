"use client";
import { useEffect, useMemo, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Search, Package } from "lucide-react";
import ProductCard from "@/components/product/ProductCard";
import { useProducts } from "@/hooks/useProducts";
import { CATEGORIES, OFFER_FILTER } from "@/lib/mockData";
import { Category } from "@/types";

type Filter = "all" | Category | "offers";

function ShopContent() {
  const searchParams = useSearchParams();
  const urlFilter = (searchParams.get("filter") as Filter) || "all";
  const [filter, setFilter] = useState<Filter>(urlFilter);
  const [search, setSearch] = useState("");
  const { products, loading, error } = useProducts();

  useEffect(() => {
    setFilter(urlFilter);
  }, [urlFilter]);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      if (filter === "offers" && !p.isOffer) return false;
      if (filter !== "all" && filter !== "offers" && p.category !== filter) return false;
      if (search) {
        const q = search.toLowerCase();
        return p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q);
      }
      return true;
    });
  }, [products, filter, search]);

  const allFilters = [...CATEGORIES, OFFER_FILTER];

  const title =
    filter === "all"
      ? "All Caps"
      : allFilters.find((f) => f.id === filter)?.label || "Caps";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight mb-2 text-brand-black dark:text-white">
        {title}
      </h1>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
        {loading ? "Loading..." : `${filtered.length} ${filtered.length === 1 ? "cap" : "caps"} available`}
      </p>

      <div className="relative mb-6">
        <Search className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search caps, brands, vibes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-12 pr-4 py-3 rounded-full bg-gray-100 dark:bg-gray-900 border border-transparent focus:border-brand-black dark:focus:border-white outline-none transition text-sm text-brand-black dark:text-white"
        />
      </div>

      <div className="flex gap-2 overflow-x-auto pb-3 scrollbar-hide mb-4">
        {allFilters.map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id as Filter)}
            className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition ${
              filter === f.id
                ? "bg-brand-black dark:bg-white text-white dark:text-black"
                : "bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-800"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="grid grid-cols-3 md:grid-cols-4 gap-3 md:gap-4">
          {Array(8).fill(0).map((_, i) => (
            <div key={i} className="aspect-square bg-gray-100 dark:bg-gray-900 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-20 text-red-600 dark:text-red-400 text-sm">
          <Package className="w-10 h-10 mx-auto mb-3 opacity-50" />
          Failed to load products. Please refresh.
        </div>
      ) : (
        <>
          <div className="grid grid-cols-3 md:grid-cols-4 gap-3 md:gap-4">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          {filtered.length === 0 && (
            <div className="text-center py-20 text-gray-400 text-sm">
              No caps found. Try another vibe.
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto px-4 py-20 text-center text-gray-400">Loading...</div>}>
      <ShopContent />
    </Suspense>
  );
}