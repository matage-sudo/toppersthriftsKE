"use client";
import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export interface Order {
  id: string;
  customerId?: string;
  customerName: string;
  customerPhone: string;
  customerLocation: string;
  items: { name: string; quantity: number; price: number }[];
  total: number;
  status: "pending" | "shipped" | "delivered" | "cancelled";
  paymentMethod: string;
  notes?: string;
  createdAt: string;
}

function rowToOrder(row: any): Order {
  return {
    id: row.id,
    customerId: row.customer_id || undefined,
    customerName: row.customer_name,
    customerPhone: row.customer_phone,
    customerLocation: row.customer_location,
    items: row.items || [],
    total: row.total,
    status: row.status,
    paymentMethod: row.payment_method,
    notes: row.notes || undefined,
    createdAt: row.created_at,
  };
}

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    const supabase = createClient();
    setLoading(true);
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Supabase fetch error:", error);
      setError(error.message);
    } else {
      setOrders((data || []).map(rowToOrder));
      setError(null);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return { orders, loading, error, refresh: fetchOrders };
}

export async function createOrder(input: Omit<Order, "id" | "createdAt">) {
  const supabase = createClient();
  const id = `ORD-${Date.now().toString(36).toUpperCase().slice(-6)}`;

  const { data, error } = await supabase
    .from("orders")
    .insert({
      id,
      customer_id: input.customerId || null,
      customer_name: input.customerName,
      customer_phone: input.customerPhone,
      customer_location: input.customerLocation,
      items: input.items,
      total: input.total,
      status: input.status,
      payment_method: input.paymentMethod,
      notes: input.notes || null,
    })
    .select()
    .single();

  if (error) {
    console.error("Supabase insert error:", error);
    throw error;
  }
  return rowToOrder(data);
}

export async function updateOrderStatus(id: string, status: Order["status"]) {
  const supabase = createClient();
  const { error } = await supabase.from("orders").update({ status }).eq("id", id);
  if (error) throw error;
}

export async function deleteOrder(id: string) {
  const supabase = createClient();
  const { error } = await supabase.from("orders").delete().eq("id", id);
  if (error) throw error;
}