import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Product, Category } from "@/types";
import { mockProducts } from "@/lib/mockData";

interface ProductStore {
  products: Product[];
  addProduct: (p: Omit<Product, "id" | "createdAt">) => Product;
  updateProduct: (id: string, data: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  toggleOffer: (id: string) => void;
  toggleFeatured: (id: string) => void;
  resetToDefaults: () => void;
  getByCategory: (cat: Category) => Product[];
  getOffers: () => Product[];
}

export const useProductStore = create<ProductStore>()(
  persist(
    (set, get) => ({
      products: mockProducts,
      addProduct: (data) => {
        const product: Product = {
          ...data,
          id: data.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "") + "-" + Date.now().toString(36),
          createdAt: new Date().toISOString(),
        };
        set({ products: [product, ...get().products] });
        return product;
      },
      updateProduct: (id, data) => {
        set({
          products: get().products.map((p) => (p.id === id ? { ...p, ...data } : p)),
        });
      },
      deleteProduct: (id) => {
        set({ products: get().products.filter((p) => p.id !== id) });
      },
      toggleOffer: (id) => {
        set({
          products: get().products.map((p) =>
            p.id === id ? { ...p, isOffer: !p.isOffer } : p
          ),
        });
      },
      toggleFeatured: (id) => {
        set({
          products: get().products.map((p) =>
            p.id === id ? { ...p, isFeatured: !p.isFeatured } : p
          ),
        });
      },
      resetToDefaults: () => set({ products: mockProducts }),
      getByCategory: (cat) => get().products.filter((p) => p.category === cat),
      getOffers: () => get().products.filter((p) => p.isOffer),
    }),
    { name: "toppersthrifts-products" }
  )
);