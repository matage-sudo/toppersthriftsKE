import { create } from "zustand";
import { createClient } from "@/lib/supabase/client";

export interface Customer {
  id: string;
  name: string;
  phone: string;
  location: string;
  email?: string;
  createdAt: string;
}

interface CustomerStore {
  customer: Customer | null;
  isAuthenticated: boolean;
  loading: boolean;
  setCustomer: (c: Customer | null) => void;
  syncFromSupabase: () => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<Customer>) => Promise<void>;
}

export const useCustomerStore = create<CustomerStore>((set, get) => ({
  customer: null,
  isAuthenticated: false,
  loading: true,

  setCustomer: (customer) =>
    set({ customer, isAuthenticated: !!customer, loading: false }),

  syncFromSupabase: async () => {
    const supabase = createClient();
    const { data: sessionData } = await supabase.auth.getSession();
    if (!sessionData.session?.user) {
      set({ customer: null, isAuthenticated: false, loading: false });
      return;
    }
    const userId = sessionData.session.user.id;
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (data) {
      set({
        customer: {
          id: data.id,
          name: data.name,
          phone: data.phone || "",
          location: data.location || "",
          email: data.email || undefined,
          createdAt: data.created_at,
        },
        isAuthenticated: true,
        loading: false,
      });
    } else {
      set({ customer: null, isAuthenticated: false, loading: false });
    }
  },

  logout: async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    set({ customer: null, isAuthenticated: false });
  },

  updateProfile: async (data) => {
    const current = get().customer;
    if (!current) return;

    const supabase = createClient();
    const { error } = await supabase
      .from("profiles")
      .update({
        name: data.name ?? current.name,
        phone: data.phone ?? current.phone,
        location: data.location ?? current.location,
        email: data.email ?? current.email,
      })
      .eq("id", current.id);

    if (error) throw error;
    set({ customer: { ...current, ...data } });
  },
}));