"use client";
import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export interface Review {
  id: string;
  customerId?: string;
  customerName: string;
  productId: string;
  productName: string;
  rating: number;
  comment: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
}

function rowToReview(row: any): Review {
  return {
    id: row.id,
    customerId: row.customer_id || undefined,
    customerName: row.customer_name,
    productId: row.product_id,
    productName: row.product_name,
    rating: row.rating,
    comment: row.comment,
    status: row.status,
    createdAt: row.created_at,
  };
}

export function useReviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReviews = useCallback(async () => {
    const supabase = createClient();
    setLoading(true);
    const { data, error } = await supabase
      .from("reviews")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Supabase fetch error:", error);
      setError(error.message);
    } else {
      setReviews((data || []).map(rowToReview));
      setError(null);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  return { reviews, loading, error, refresh: fetchReviews };
}

export function useProductReviews(productId: string) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!productId) return;
    let cancelled = false;
    const supabase = createClient();

    supabase
      .from("reviews")
      .select("*")
      .eq("product_id", productId)
      .eq("status", "approved")
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (cancelled) return;
        if (!error) setReviews((data || []).map(rowToReview));
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [productId]);

  return { reviews, loading };
}

export function useFeaturedReviews(limit = 6) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const supabase = createClient();

    supabase
      .from("reviews")
      .select("*")
      .eq("status", "approved")
      .order("created_at", { ascending: false })
      .limit(limit)
      .then(({ data, error }) => {
        if (cancelled) return;
        if (!error) setReviews((data || []).map(rowToReview));
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [limit]);

  return { reviews, loading };
}

export async function createReview(input: {
  customerId?: string;
  customerName: string;
  productId: string;
  productName: string;
  rating: number;
  comment: string;
}) {
  const supabase = createClient();
  const id = "REV-" + Date.now().toString(36).toUpperCase().slice(-6);

  const { data, error } = await supabase
    .from("reviews")
    .insert({
      id,
      customer_id: input.customerId || null,
      customer_name: input.customerName,
      product_id: input.productId,
      product_name: input.productName,
      rating: input.rating,
      comment: input.comment,
      status: "pending",
    })
    .select()
    .single();

  if (error) {
    console.error("Supabase insert error:", error);
    throw error;
  }
  return rowToReview(data);
}

export async function updateReviewStatus(
  id: string,
  status: Review["status"]
) {
  const supabase = createClient();
  const { error } = await supabase
    .from("reviews")
    .update({ status })
    .eq("id", id);
  if (error) throw error;
}

export async function deleteReview(id: string) {
  const supabase = createClient();
  const { error } = await supabase.from("reviews").delete().eq("id", id);
  if (error) throw error;
}