"use client";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Plus, Check, Star, Truck, Shield, Package } from "lucide-react";
import { useProduct, useProducts } from "@/hooks/useProducts";
import { useCartStore } from "@/store/useCartStore";
import { formatPrice } from "@/lib/utils";
import ProductCard from "@/components/product/ProductCard";
import ReviewForm from "@/components/product/ReviewForm";
import ReviewList from "@/components/product/ReviewList";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const addItem = useCartStore((s) => s.addItem);
  const [added, setAdded] = useState(false);
  const [reviewRefreshKey, setReviewRefreshKey] = useState(0);

  const { product, loading, error } = useProduct(String(params.id));
  const { products: allProducts } = useProducts();

  const related = product
    ? allProducts
        .filter((p) => p.category === product.category && p.id !== product.id)
        .slice(0, 4)
    : [];

  const handleAdd = () => {
    if (!product) return;
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

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12">
          <div className="bg-gray-100 dark:bg-gray-900 rounded-2xl aspect-square animate-pulse" />
          <div className="flex flex-col gap-4">
            <div className="h-4 w-24 bg-gray-100 dark:bg-gray-900 rounded animate-pulse" />
            <div className="h-8 w-3/4 bg-gray-100 dark:bg-gray-900 rounded animate-pulse" />
            <div className="h-6 w-32 bg-gray-100 dark:bg-gray-900 rounded animate-pulse" />
            <div className="h-20 w-full bg-gray-100 dark:bg-gray-900 rounded animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <Package className="w-12 h-12 mx-auto mb-4 text-gray-300 dark:text-gray-700" />
        <h1 className="text-2xl font-bold mb-4 text-brand-black dark:text-white">Cap not found</h1>
        <Link href="/shop" className="text-brand-black dark:text-white underline">Back to shop</Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-brand-black dark:hover:text-white transition mb-6"
      >
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      <div className="grid md:grid-cols-2 gap-8 md:gap-12">
        <div className="bg-gray-100 dark:bg-gray-900 rounded-2xl overflow-hidden aspect-square">
          <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
        </div>

        <div className="flex flex-col">
          <p className="text-sm text-gray-400 mb-2">{product.brand}</p>
          <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight mb-4 text-brand-black dark:text-white">
            {product.name}
          </h1>

          {product.rating && (
            <div className="flex items-center gap-1 mb-4">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-semibold text-brand-black dark:text-white">{product.rating}</span>
              <span className="text-sm text-gray-400">42 reviews</span>
            </div>
          )}

          <div className="flex items-baseline gap-3 mb-6">
            <span className="text-3xl font-extrabold text-brand-black dark:text-white">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && (
              <span className="text-lg text-gray-400 line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>

          <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-8">
            {product.description}
          </p>

          <button
            onClick={handleAdd}
            disabled={!product.inStock}
            className={`w-full py-4 rounded-xl font-bold text-base flex items-center justify-center gap-2 transition active:scale-[0.98] disabled:opacity-50 ${
              added
                ? "bg-green-600 text-white"
                : "bg-brand-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200"
            }`}
          >
            {added ? (
              <>
                <Check className="w-5 h-5" /> Added to Cart
              </>
            ) : (
              <>
                <Plus className="w-5 h-5" /> Add to Cart
              </>
            )}
          </button>

          <div className="grid grid-cols-2 gap-4 mt-8 pt-8 border-t border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <Truck className="w-4 h-4" /> Fast delivery
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <Shield className="w-4 h-4" /> Quality guaranteed
            </div>
          </div>
        </div>
      </div>

      <section className="mt-16">
        <h2 className="text-xl font-extrabold mb-6 text-brand-black dark:text-white">
          Customer Reviews
        </h2>

        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <ReviewForm
              productId={product.id}
              productName={product.name}
              onSubmitted={() => setReviewRefreshKey((k) => k + 1)}
            />
          </div>
          <div>
            <ReviewList productId={product.id} refreshKey={reviewRefreshKey} />
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="text-xl font-extrabold mb-4 text-brand-black dark:text-white">
            You might also like
          </h2>
          <div className="grid grid-cols-3 md:grid-cols-4 gap-3 md:gap-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}