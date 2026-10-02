"use client";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import ProductCard from "@/components/product/ProductCard";
import { mockProducts } from "@/lib/mockData";

export default function SearchPage() {
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return mockProducts.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
    );
  }, [query]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <h1 className="text-2xl font-extrabold mb-6">Search Caps</h1>

      <div className="relative mb-8">
        <Search className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search by name, brand, or vibe..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoFocus
          className="w-full pl-12 pr-4 py-3 rounded-full bg-gray-100 border border-transparent focus:border-brand-black focus:bg-white outline-none transition text-sm"
        />
      </div>

      {query && (
        <p className="text-xs text-gray-400 font-semibold mb-4">
          {results.length} {results.length === 1 ? "result" : "results"}
        </p>
      )}

      {query && results.length > 0 && (
        <div className="grid grid-cols-3 md:grid-cols-4 gap-3 md:gap-4">
          {results.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}

      {query && results.length === 0 && (
        <div className="text-center py-20 text-gray-400 text-sm">
          No caps match "{query}". Try a different search.
        </div>
      )}

      {!query && (
        <div className="text-center py-20 text-gray-400 text-sm">
          Start typing to search for caps, brands, or vibes.
        </div>
      )}
    </div>
  );
}