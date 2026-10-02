"use client";
import { useEffect } from "react";
import { useCustomerStore } from "@/store/useCustomerStore";
import { createClient } from "@/lib/supabase/client";

export default function AuthSync({ children }: { children: React.ReactNode }) {
  const syncFromSupabase = useCustomerStore((s) => s.syncFromSupabase);

  useEffect(() => {
    syncFromSupabase();

    const supabase = createClient();
    const { data: sub } = supabase.auth.onAuthStateChange(() => {
      syncFromSupabase();
    });

    return () => {
      sub.subscription.unsubscribe();
    };
  }, [syncFromSupabase]);

  return <>{children}</>;
}