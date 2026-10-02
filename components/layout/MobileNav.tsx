"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, ShoppingBag, Flame, User } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { useCustomerStore } from "@/store/useCustomerStore";
import { cn } from "@/lib/utils";

export default function MobileNav() {
  const pathname = usePathname();
  const openCart = useCartStore((s) => s.openCart);
  const isAuth = useCustomerStore((s) => s.isAuthenticated);

  const links = [
    { href: "/", icon: Home, label: "Home" },
    { href: "/search", icon: Search, label: "Search" },
    { href: "#cart", icon: ShoppingBag, label: "Cart", action: "cart" },
    { href: "/shop?filter=offers", icon: Flame, label: "Offers" },
    { href: isAuth ? "/account" : "/account/login", icon: User, label: "Account" },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-gray-950/95 backdrop-blur-md border-t border-gray-100 dark:border-gray-800">
      <div className="flex justify-around items-center h-16">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          const handleClick = (e: React.MouseEvent) => {
            if (link.action === "cart") {
              e.preventDefault();
              openCart();
            }
          };
          return (
            <Link
              key={link.label}
              href={link.href}
              onClick={handleClick}
              className={cn(
                "flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-lg transition min-w-[60px]",
                isActive
                  ? "text-brand-black dark:text-white"
                  : "text-gray-400"
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] font-semibold">{link.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}