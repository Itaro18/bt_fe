"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Home } from "lucide-react";
import { cn } from "@/lib/utils"; // shadcn's utility

const navItems = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    href: "/properties",
    label: "Properties",
    icon: Home,
  },
];

export default function BottomBar() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 w-full bg-black border-t z-50 flex justify-around py-2 shadow-md sm:hidden">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-col items-center text-xs text-gray-500",
              isActive && "text-blue-600 font-semibold"
            )}
          >
            <item.icon className="w-5 h-5 mb-0.5" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
