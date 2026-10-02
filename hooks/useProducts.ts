"use client";
import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Product } from "@/types";
import { useProductsCache } from "@/store/useProductsCache";

function rowToProduct(row: any): Product {
  return {
    id: row.id,
    name: row.name,
    description: row.description || "",
    price: row.price,
    originalPrice: row.original_price || undefined,
    image: row.image,
    category: row.category,
    brand: row.brand,
    isOffer: row.is_offer,
    isFeatured: row.is_featured,
    inStock: row.in_stock,
    rating: row.rating ? Number(row.rating) : undefined,
    createdAt: row.created_at,
  };
}

export function useProducts() {
  const { products, setProducts, isStale, clear } = useProductsCache();
  const [loading, setLoading] = useState(products.length === 0);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    const supabase = createClient();
    setLoading(true);
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Supabase fetch error:", error);
      setError(error.message);
    } else {
      setProducts((data || []).map(rowToProduct));
      setError(null);
    }
    setLoading(false);
  }, [setProducts]);

  useEffect(() => {
    if (products.length > 0 && !isStale()) {
      setLoading(false);
      return;
    }
    fetchProducts();
  }, [fetchProducts, products.length, isStale]);

  const refresh = useCallback(async () => {
    clear();
    await fetchProducts();
  }, [clear, fetchProducts]);

  return { products, loading, error, refresh };
}

export function useProduct(id: string) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    const supabase = createClient();

    supabase
      .from("products")
      .select("*")
      .eq("id", id)
      .single()
      .then(({ data, error }) => {
        if (cancelled) return;
        if (error) {
          setError(error.message);
        } else if (data) {
          setProduct(rowToProduct(data));
        }
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  return { product, loading, error };
}

export async function createProduct(input: {
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  brand: string;
  isOffer: boolean;
  isFeatured: boolean;
  inStock: boolean;
  rating?: number;
}) {
  const supabase = createClient();
  const id =
    input.name
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "") +
    "-" +
    Date.now().toString(36);

  const { data, error } = await supabase
    .from("products")
    .insert({
      id,
      name: input.name,
      description: input.description,
      price: input.price,
      original_price: input.originalPrice || null,
      image: input.image,
      category: input.category,
      brand: input.brand,
      is_offer: input.isOffer,
      is_featured: input.isFeatured,
      in_stock: input.inStock,
      rating: input.rating || null,
    })
    .select()
    .single();

  if (error) {
    console.error("createProduct error:", error);
    throw error;
  }
  return data;
}

export async function deleteProductById(id: string) {
  const supabase = createClient();
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) {
    console.error("deleteProduct error:", error);
    throw error;
  }
}

export async function toggleOfferById(id: string) {
  const supabase = createClient();
  const { data: current } = await supabase
    .from("products")
    .select("is_offer")
    .eq("id", id)
    .single();
  if (!current) return;
  const { error } = await supabase
    .from("products")
    .update({ is_offer: !current.is_offer })
    .eq("id", id);
  if (error) throw error;
}

export async function toggleFeaturedById(id: string) {
  const supabase = createClient();
  const { data: current } = await supabase
    .from("products")
    .select("is_featured")
    .eq("id", id)
    .single();
  if (!current) return;
  const { error } = await supabase
    .from("products")
    .update({ is_featured: !current.is_featured })
    .eq("id", id);
  if (error) throw error;
}
export async function uploadProductImage(file: File): Promise<string> {
  const supabase = createClient();
  const ext = file.name.split(".").pop() || "jpg";
  const filename = Date.now() + "-" + Math.random().toString(36).slice(2, 8) + "." + ext;
  const path = "products/" + filename;

  const { error: uploadError } = await supabase.storage
    .from("caps")
    .upload(path, file, { cacheControl: "3600", upsert: false });

  if (uploadError) {
    console.error("Upload error:", uploadError);
    throw uploadError;
  }

  const { data } = supabase.storage.from("caps").getPublicUrl(path);
  return data.publicUrl;
}
