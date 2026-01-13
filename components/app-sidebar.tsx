"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { Home, CreditCard, Settings, MessageSquare, History, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { useOptimizationStore } from "@/lib/store";

const navigation = [
  { name: "Home", href: "/dashboard", icon: Home },
  { name: "Optimise", href: "/dashboard/optimize", icon: Zap, highlight: true },
  { name: "History", href: "/dashboard/history", icon: History },
  { name: "Billing", href: "/dashboard/billing", icon: CreditCard },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

export function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isExpanded, setIsExpanded] = useState(false);
  const { reset } = useOptimizationStore();

  const handleOptimizeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    // Always reset to fresh state when clicking Optimize tab
    reset();
    router.push('/dashboard/optimize');
  };

  return (
    <div
      className={cn(
        "flex flex-col bg-white border-r border-gray-200 h-screen sticky top-0 transition-all duration-300",
        isExpanded ? "w-64" : "w-16"
      )}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      {/* Navigation */}
      <nav className="flex-1 px-2 py-6 space-y-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          const isHighlighted = item.highlight;
          const isOptimizeTab = item.name === "Optimise";

          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={isOptimizeTab ? handleOptimizeClick : undefined}
              className={cn(
                "flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors",
                isHighlighted && isActive
                  ? "bg-primary text-white"
                  : isHighlighted
                  ? "bg-primary/90 text-white hover:bg-primary"
                  : isActive
                  ? "bg-primary/10 text-primary"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              )}
              title={!isExpanded ? item.name : undefined}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              <span
                className={cn(
                  "whitespace-nowrap transition-all duration-300",
                  isExpanded ? "opacity-100 w-auto" : "opacity-0 w-0 overflow-hidden"
                )}
              >
                {item.name}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-2 py-4 border-t border-gray-200">
        <a
          href="mailto:support@repartilo.com"
          className="flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
          title={!isExpanded ? "Support" : undefined}
        >
          <MessageSquare className="w-5 h-5 flex-shrink-0" />
          <span
            className={cn(
              "whitespace-nowrap transition-all duration-300",
              isExpanded ? "opacity-100 w-auto" : "opacity-0 w-0 overflow-hidden"
            )}
          >
            Support
          </span>
        </a>
      </div>
    </div>
  );
}
