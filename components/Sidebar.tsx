"use client";
import { Suspense } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Map, Plane, Settings, TrendingUp } from "lucide-react";
import { CorridorDropdown } from "@/components/CorridorDropdown";

const NAV = [
  { href: "/map",      icon: Map,       label: "Opportunity Map",   sub: "Where to recruit" },
  { href: "/trips",    icon: Plane,     label: "ROI Planner",       sub: "Optimize your trip" },
  { href: "/outcomes", icon: TrendingUp, label: "Outcome Reports",  sub: "What worked" },
  { href: "/settings", icon: Settings,  label: "Settings",          sub: "Account & billing" },
];

export function Sidebar() {
  const path = usePathname();
  return (
    <aside className="hidden md:flex w-60 bg-navy-900 text-white flex-col h-screen shrink-0">
      {/* Logo — click to go back home */}
      <Link href="/landing" className="block px-5 pt-6 pb-5 border-b border-navy-700 hover:bg-navy-800/50 transition-colors">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-navy-700 rounded-full flex items-center justify-center shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-gold-400">
              <path d="M13 2L3 14h8l-1 8 10-12h-8l1-8z" />
            </svg>
          </div>
          <div>
            <div className="leading-none">
              <span className="font-semibold text-sm text-white">Polar</span><span className="font-bold text-sm text-gold-400">is</span>
            </div>
            <div className="text-navy-400 text-[10px] mt-0.5 leading-none">Intelligence Platform</div>
          </div>
        </div>
      </Link>

      {/* Corridor selector */}
      <Suspense fallback={<div className="mx-4 mt-4 h-16 bg-navy-800 rounded-lg border border-navy-700 animate-pulse" />}>
        <CorridorDropdown />
      </Suspense>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV.map(({ href, icon: Icon, label, sub }) => {
          const active = path.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group",
                active
                  ? "bg-navy-700 text-white border-l-2 border-gold-400"
                  : "text-navy-300 hover:bg-navy-800 hover:text-white"
              )}
            >
              <Icon className={cn("w-4 h-4 shrink-0", active ? "text-gold-400" : "text-navy-400 group-hover:text-navy-200")} />
              <div>
                <div className="text-sm font-medium leading-none">{label}</div>
                <div className={cn("text-[10px] mt-0.5", active ? "text-navy-300" : "text-navy-500")}>{sub}</div>
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Stats footer */}
      <div className="px-4 pb-5 pt-3 border-t border-navy-800">
        <div className="text-[10px] text-navy-500 uppercase tracking-wider mb-2">Model</div>
        <div className="flex items-center justify-between">
          <div className="text-xs text-navy-300">baseline-v1</div>
          <div className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></div>
            <span className="text-[10px] text-navy-400">Live</span>
          </div>
        </div>
        <div className="text-[10px] text-navy-500 mt-1">136 regions scored · Updated weekly</div>
      </div>
    </aside>
  );
}
