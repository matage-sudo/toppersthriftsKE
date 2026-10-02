"use client";
import { useRef, useState } from "react";
import { Plus, Search, Trash2, Star, Flame, X, Check, RefreshCw, Upload } from "lucide-react";
import {
  useProducts,
  createProduct,
  deleteProductById,
  toggleOfferById,
  toggleFeaturedById,
  uploadProductImage,
} from "@/hooks/useProducts";
import { useActivityStore } from "@/store/useActivityStore";
import { useProductsCache } from "@/store/useProductsCache";
import { formatPrice, cn } from "@/lib/utils";
import { Category } from "@/types";

const CATEGORIES: { id: Category; label: string }[] = [
  { id: "hype", label: "Hype" },
  { id: "iconic", label: "Iconic" },
  { id: "legacy", label: "Legacy" },
  { id: "drip", label: "Drip" },
  { id: "streetwear", label: "Streetwear" },
];

export default function AdminProductsPage() {
  const { products, loading, error, refresh } = useProducts();
  const clearCache = useProductsCache((s) => s.clear);
  const addLog = useActivityStore((s) => s.addLog);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<Category | "all">("all");
  const [showModal, setShowModal] = useState(false);
  const [busy, setBusy] = useState(false);

  const filtered = products.filter((p) => {
    if (categoryFilter !== "all" && p.category !== categoryFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q);
    }
    return true;
  });

  const handleRefresh = async () => {
    clearCache();
    if (typeof refresh === "function") await refresh();
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm("Delete this product?")) return;
    setBusy(true);
    try {
      await deleteProductById(id);
      addLog("Deleted product", name);
      clearCache();
      if (typeof refresh === "function") await refresh();
    } catch (err) {
      alert("Failed to delete product");
    } finally {
      setBusy(false);
    }
  };

  const handleToggleOffer = async (id: string, name: string) => {
    try {
      await toggleOfferById(id);
      addLog("Toggled offer", name);
      clearCache();
      if (typeof refresh === "function") await refresh();
    } catch (err) {
      alert("Failed to toggle offer");
    }
  };

  const handleToggleFeatured = async (id: string, name: string) => {
    try {
      await toggleFeaturedById(id);
      addLog("Toggled featured", name);
      clearCache();
      if (typeof refresh === "function") await refresh();
    } catch (err) {
      alert("Failed to toggle featured");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-brand-black dark:text-white">
            Products
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {loading ? "Loading..." : products.length + " items in store"}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleRefresh}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-gray-100 dark:bg-gray-800 text-sm font-semibold text-brand-black dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 transition"
          >
            <RefreshCw className="w-4 h-4" /> Refresh
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-brand-black dark:bg-white text-white dark:text-black px-4 py-2.5 rounded-lg text-sm font-bold hover:bg-gray-800 dark:hover:bg-gray-200 transition"
          >
            <Plus className="w-4 h-4" /> Add Product
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-brand-black dark:text-white outline-none focus:border-brand-black dark:focus:border-white text-sm"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
          <button
            onClick={() => setCategoryFilter("all")}
            className={cn(
              "px-3 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition",
              categoryFilter === "all"
                ? "bg-brand-black dark:bg-white text-white dark:text-black"
                : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
            )}
          >
            All
          </button>
          {CATEGORIES.map((c) => (
            <button
              key={c.id}
              onClick={() => setCategoryFilter(c.id)}
              className={cn(
                "px-3 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition",
                categoryFilter === c.id
                  ? "bg-brand-black dark:bg-white text-white dark:text-black"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
              )}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
        {loading ? (
          <div className="p-8 space-y-3">
            {Array(4).fill(0).map((_, i) => (
              <div key={i} className="h-14 bg-gray-100 dark:bg-gray-800 rounded animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-sm text-gray-400">No products found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 dark:bg-gray-950 text-gray-500 dark:text-gray-400 font-semibold text-xs uppercase">
                <tr>
                  <th className="px-4 py-3">Image</th>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Price</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Flags</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {filtered.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50 dark:hover:bg-gray-950 transition">
                    <td className="px-4 py-3">
                      <img src={p.image} alt={p.name} className="w-10 h-10 rounded object-cover" />
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-brand-black dark:text-white">{p.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{p.brand}</p>
                    </td>
                    <td className="px-4 py-3 font-semibold text-brand-black dark:text-white">
                      {formatPrice(p.price)}
                    </td>
                    <td className="px-4 py-3 capitalize text-gray-600 dark:text-gray-400">{p.category}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        <button
                          onClick={() => handleToggleOffer(p.id, p.name)}
                          disabled={busy}
                          title="Toggle Offer"
                          className={cn(
                            "p-1.5 rounded-lg transition disabled:opacity-50",
                            p.isOffer
                              ? "bg-red-100 dark:bg-red-950/40 text-red-600 dark:text-red-400"
                              : "bg-gray-100 dark:bg-gray-800 text-gray-400"
                          )}
                        >
                          <Flame className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleToggleFeatured(p.id, p.name)}
                          disabled={busy}
                          title="Toggle Featured"
                          className={cn(
                            "p-1.5 rounded-lg transition disabled:opacity-50",
                            p.isFeatured
                              ? "bg-yellow-100 dark:bg-yellow-950/40 text-yellow-600 dark:text-yellow-400"
                              : "bg-gray-100 dark:bg-gray-800 text-gray-400"
                          )}
                        >
                          <Star className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleDelete(p.id, p.name)}
                        disabled={busy}
                        className="p-1.5 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition disabled:opacity-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <AddProductModal
          onClose={() => setShowModal(false)}
          onAdd={async (data) => {
            try {
              await createProduct(data);
              addLog("Added product", data.name);
              clearCache();
              if (typeof refresh === "function") await refresh();
              setShowModal(false);
            } catch (err) {
              alert("Failed to add product");
            }
          }}
        />
      )}
    </div>
  );
}

function AddProductModal({
  onClose,
  onAdd,
}: {
  onClose: () => void;
  onAdd: (data: any) => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: 0,
    originalPrice: 0,
    image: "",
    category: "hype" as Category,
    brand: "",
    isOffer: false,
    isFeatured: false,
    inStock: true,
    rating: 4.5,
  });
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.size > 5 * 1024 * 1024) {
      setUploadError("Image must be under 5MB");
      return;
    }
    setUploadError("");
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setUploadError("");

    try {
      let imageUrl = form.image;

      if (file) {
        setUploading(true);
        imageUrl = await uploadProductImage(file);
        setUploading(false);
      }

      if (!imageUrl) {
        setUploadError("Please upload an image or paste an image URL");
        setSubmitting(false);
        setUploading(false);
        return;
      }

      await onAdd({
        ...form,
        image: imageUrl,
        price: Number(form.price),
        originalPrice: form.originalPrice ? Number(form.originalPrice) : undefined,
        rating: Number(form.rating),
      });
    } catch (err) {
      console.error(err);
      setUploadError("Upload failed. Please try again.");
      setSubmitting(false);
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50">
      <div className="w-full max-w-2xl bg-white dark:bg-gray-950 rounded-2xl border border-gray-200 dark:border-gray-800 max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800 p-5 flex justify-between items-center z-10">
          <h2 className="text-lg font-bold text-brand-black dark:text-white">Add New Product</h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-1 text-brand-black dark:text-white">Product Name *</label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-brand-black dark:text-white outline-none focus:border-brand-black dark:focus:border-white text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1 text-brand-black dark:text-white">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={2}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-brand-black dark:text-white outline-none focus:border-brand-black dark:focus:border-white text-sm resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-1 text-brand-black dark:text-white">Price (KES) *</label>
              <input
                type="number"
                required
                value={form.price}
                onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-brand-black dark:text-white outline-none focus:border-brand-black dark:focus:border-white text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1 text-brand-black dark:text-white">Original Price</label>
              <input
                type="number"
                value={form.originalPrice}
                onChange={(e) => setForm({ ...form, originalPrice: Number(e.target.value) })}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-brand-black dark:text-white outline-none focus:border-brand-black dark:focus:border-white text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1 text-brand-black dark:text-white">
              Product Image *
            </label>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />

            {preview ? (
              <div className="relative inline-block">
                <img
                  src={preview}
                  alt="Preview"
                  className="w-32 h-32 object-cover rounded-xl border border-gray-200 dark:border-gray-800"
                />
                <button
                  type="button"
                  onClick={() => {
                    setFile(null);
                    setPreview("");
                    setForm({ ...form, image: "" });
                    if (fileInputRef.current) fileInputRef.current.value = "";
                  }}
                  className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full flex flex-col items-center justify-center gap-2 py-8 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-700 hover:border-brand-black dark:hover:border-white bg-gray-50 dark:bg-gray-900 transition"
              >
                <Upload className="w-6 h-6 text-gray-400" />
                <span className="text-sm font-semibold text-gray-500 dark:text-gray-400">
                  Click to upload image
                </span>
                <span className="text-xs text-gray-400">JPG, PNG, WEBP (max 5MB)</span>
              </button>
            )}

            <div className="mt-2">
              <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                Or paste an image URL
              </label>
              <input
                type="text"
                value={file ? "" : form.image}
                onChange={(e) => setForm({ ...form, image: e.target.value })}
                disabled={!!file}
                placeholder="/caps/filename.jpg or https://..."
                className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-brand-black dark:text-white outline-none focus:border-brand-black dark:focus:border-white text-xs disabled:opacity-50"
              />
            </div>

            {uploadError && (
              <p className="text-sm text-red-600 dark:text-red-400 mt-2">{uploadError}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-1 text-brand-black dark:text-white">Category *</label>
              <select
                required
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value as Category })}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-brand-black dark:text-white outline-none focus:border-brand-black dark:focus:border-white text-sm"
              >
                {CATEGORIES.map((c) => (
                  <option key={c.id} value={c.id}>{c.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1 text-brand-black dark:text-white">Brand *</label>
              <input
                type="text"
                required
                value={form.brand}
                onChange={(e) => setForm({ ...form, brand: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-brand-black dark:text-white outline-none focus:border-brand-black dark:focus:border-white text-sm"
                placeholder="e.g., New Era"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-4 pt-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.isOffer} onChange={(e) => setForm({ ...form, isOffer: e.target.checked })} className="w-4 h-4 accent-brand-black" />
              <span className="text-sm font-semibold text-brand-black dark:text-white">On Offer</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.isFeatured} onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })} className="w-4 h-4 accent-brand-black" />
              <span className="text-sm font-semibold text-brand-black dark:text-white">Featured</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.inStock} onChange={(e) => setForm({ ...form, inStock: e.target.checked })} className="w-4 h-4 accent-brand-black" />
              <span className="text-sm font-semibold text-brand-black dark:text-white">In Stock</span>
            </label>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-bold text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 px-4 py-3 rounded-lg bg-brand-black dark:bg-white text-white dark:text-black font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Check className="w-4 h-4" />
              {uploading ? "Uploading..." : submitting ? "Adding..." : "Add Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}