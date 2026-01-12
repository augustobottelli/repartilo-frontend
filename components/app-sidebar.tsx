"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Truck, Home, BarChart3, CreditCard, Settings, MessageSquare, History } from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Home", href: "/dashboard", icon: Home },
  { name: "History", href: "/dashboard/history", icon: History },
  { name: "Usage", href: "/dashboard/usage", icon: BarChart3 },
  { name: "Billing", href: "/dashboard/billing", icon: CreditCard },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <div className="flex flex-col w-64 bg-white border-r border-gray-200 h-screen sticky top-0">
      {/* Logo */}
      <div className="flex items-center gap-2 px-6 py-4 border-b border-gray-200">
        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
          <Truck className="w-5 h-5 text-white" />
        </div>
        <span className="text-xl font-bold text-gray-900">Repartilo</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              )}
            >
              <item.icon className="w-5 h-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-4 py-4 border-t border-gray-200">
        <a
          href="mailto:support@repartilo.com"
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
        >
          <MessageSquare className="w-5 h-5" />
          Support
        </a>
      </div>
    </div>
  );
}
