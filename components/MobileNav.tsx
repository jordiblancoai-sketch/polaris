"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Map, Plane, TrendingUp, Settings } from "lucide-react";

const NAV = [
  { href: "/map",      icon: Map,        label: "Map"      },
  { href: "/trips",    icon: Plane,      label: "ROI"      },
  { href: "/outcomes", icon: TrendingUp, label: "Outcomes" },
  { href: "/settings", icon: Settings,   label: "Settings" },
];

export function MobileNav() {
  const path = usePathname();
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-navy-900 border-t border-navy-700 flex">
      {NAV.map(({ href, icon: Icon, label }) => {
        const active = path.startsWith(href);
        return (
          <Link key={href} href={href} target="_blank" rel="noopener"
            className={cn(
              "flex-1 flex flex-col items-center justify-center py-3 gap-0.5 transition-colors",
              active ? "text-gold-400" : "text-navy-400 hover:text-navy-200"
            )}>
            <Icon className="w-5 h-5" />
            <span className="text-[10px] font-medium">{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
