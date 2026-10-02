"use client";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import HeroCarousel from "@/components/home/HeroCarousel";
import FeaturedReviews from "@/components/home/FeaturedReviews";
import ProductCard from "@/components/product/ProductCard";
import { useProducts } from "@/hooks/useProducts";

export default function HomePage() {
  const { products, loading, error } = useProducts();

  const featured = products.filter((p) => p.isFeatured).slice(0, 8);
  const offers = products.filter((p) => p.isOffer).slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <HeroCarousel />

      {error && (
        <div className="text-center py-8 text-red-600 dark:text-red-400 text-sm">
          Failed to load products. Please refresh.
        </div>
      )}

      <section className="mb-12">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-extrabold tracking-tight text-brand-black dark:text-white">
            Fresh Drops
          </h2>
          <Link href="/shop" className="text-xs font-semibold text-gray-500 hover:text-brand-black dark:hover:text-white transition flex items-center gap-1">
            See all <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-3 md:grid-cols-4 gap-3 md:gap-4">
            {Array(8).fill(0).map((_, i) => (
              <div key={i} className="aspect-square bg-gray-100 dark:bg-gray-900 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-3 md:grid-cols-4 gap-3 md:gap-4">
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {!loading && offers.length > 0 && (
        <section className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-extrabold tracking-tight text-red-600">Hot Offers</h2>
            <Link href="/shop?filter=offers" className="text-xs font-semibold text-gray-500 hover:text-brand-black dark:hover:text-white transition flex items-center gap-1">
              See all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="grid grid-cols-3 md:grid-cols-4 gap-3 md:gap-4">
            {offers.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      <FeaturedReviews />

      <section className="py-12 text-center bg-gray-50 dark:bg-gray-900 rounded-2xl">
        <h3 className="text-2xl md:text-3xl font-extrabold mb-3 text-brand-black dark:text-white">
          Ready to flex?
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
          Browse the full collection and find your vibe.
        </p>
        <Link href="/shop" className="inline-flex items-center gap-2 bg-brand-black dark:bg-white text-white dark:text-black px-6 py-3 rounded-lg font-bold text-sm hover:bg-gray-800 dark:hover:bg-gray-200 transition">
          Shop All Caps <ArrowRight className="w-4 h-4" />
        </Link>
      </section>
    </div>
  );
}