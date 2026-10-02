"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  Star,
  Activity,
  LogOut,
  Shield,
  Menu,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import ThemeToggle from "@/components/layout/ThemeToggle";
import { useNotificationStore } from "@/store/useNotificationStore";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [checking, setChecking] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const isLoginPage = pathname === "/admin/login";

  const unreadOrders = useNotificationStore((s) => s.getOrderCount());
  const unreadReviews = useNotificationStore((s) => s.getReviewCount());
  const unreadCustomers = useNotificationStore((s) => s.getCustomerCount());
  const unreadTotal = useNotificationStore((s) => s.getTotalCount());

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isLoginPage) {
      setChecking(false);
      return;
    }

    const checkAuth = async () => {
      const supabase = createClient();
      const { data: session } = await supabase.auth.getSession();

      if (!session.session?.user) {
        router.push("/admin/login");
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", session.session.user.id)
        .single();

      if (!profile || profile.role !== "admin") {
        await supabase.auth.signOut();
        router.push("/admin/login");
        return;
      }

      setIsAdmin(true);
      setChecking(false);
    };

    checkAuth();
  }, [pathname, isLoginPage, router]);

  if (isLoginPage) {
    return <>{children}</>;
  }

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  };

  const navItems = [
    {
      href: "/admin/dashboard",
      icon: LayoutDashboard,
      label: "Dashboard",
      badge: unreadTotal,
    },
    { href: "/admin/products", icon: Package, label: "Products", badge: 0 },
    {
      href: "/admin/orders",
      icon: ShoppingBag,
      label: "Orders",
      badge: unreadOrders,
    },
    {
      href: "/admin/customers",
      icon: Users,
      label: "Customers",
      badge: unreadCustomers,
    },
    {
      href: "/admin/reviews",
      icon: Star,
      label: "Reviews",
      badge: unreadReviews,
    },
    { href: "/admin/logs", icon: Activity, label: "Activity Logs", badge: 0 },
  ];

  if (checking || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="text-center">
          <div className="w-10 h-10 rounded-full border-4 border-gray-200 dark:border-gray-800 border-t-brand-black dark:border-t-white animate-spin mx-auto mb-4" />
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Verifying access...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex">
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-[80] p-2 rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800"
        aria-label="Toggle sidebar"
      >
        {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/40 z-[60]"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={cn(
          "fixed lg:sticky top-0 left-0 h-screen w-64 z-[70] flex flex-col bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transition-transform duration-300",
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="p-5 border-b border-gray-200 dark:border-gray-800">
          <Link href="/admin/dashboard" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-brand-black dark:bg-white flex items-center justify-center">
              <Shield className="w-4 h-4 text-white dark:text-black" />
            </div>
            <div>
              <p className="text-sm font-extrabold leading-tight text-brand-black dark:text-white">
                Admin Panel
              </p>
              <p className="text-[10px] text-gray-500 dark:text-gray-400 leading-tight">
                ToppersthriftsKE
              </p>
            </div>
          </Link>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href || pathname?.startsWith(item.href + "/");
            const showBadge = mounted && item.badge > 0;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition relative",
                  isActive
                    ? "bg-brand-black dark:bg-white text-white dark:text-black"
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                )}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span className="flex-1">{item.label}</span>
                {showBadge && (
                  <span
                    className={cn(
                      "min-w-[20px] h-5 px-1.5 rounded-full text-[10px] font-bold flex items-center justify-center",
                      isActive
                        ? "bg-red-500 text-white"
                        : "bg-red-500 text-white animate-pulse"
                    )}
                  >
                    {item.badge > 99 ? "99+" : item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-gray-200 dark:border-gray-800 space-y-2">
          <div className="flex items-center justify-between px-3 py-2">
            <span className="text-xs text-gray-500 dark:text-gray-400">
              Theme
            </span>
            <ThemeToggle />
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      <main className="flex-1 min-w-0 lg:ml-0">
        <div className="lg:hidden h-16" />
        {children}
      </main>
    </div>
  );
}