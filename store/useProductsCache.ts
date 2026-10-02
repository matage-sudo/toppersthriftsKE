import { create } from "zustand";
import { Product } from "@/types";

interface ProductsCache {
  products: Product[];
  lastFetched: number | null;
  setProducts: (p: Product[]) => void;
  clear: () => void;
  isStale: () => boolean;
}

const STALE_MS = 5 * 60 * 1000; // 5 minutes

export const useProductsCache = create<ProductsCache>((set, get) => ({
  products: [],
  lastFetched: null,
  setProducts: (products) =>
    set({ products, lastFetched: Date.now() }),
  clear: () => set({ products: [], lastFetched: null }),
  isStale: () => {
    const { lastFetched } = get();
    if (!lastFetched) return true;
    return Date.now() - lastFetched > STALE_MS;
  },
}));