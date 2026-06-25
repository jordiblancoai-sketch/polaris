"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronDown, Check, Globe } from "lucide-react";
import { CORRIDORS } from "@/lib/types";

export function CorridorDropdown() {
  const router = useRouter();
  const params = useSearchParams();
  const current = params.get("c");
  const active = CORRIDORS.find(c => c.key === current) || null;

  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const pick = (key: string | null) => {
    setOpen(false);
    router.push(key ? `/map?c=${key}` : "/map", { scroll: false });
  };

  return (
    <div ref={ref} className="mx-4 mt-4 relative">
      <div className="text-[10px] text-navy-400 uppercase tracking-wider mb-1.5">Active Corridor</div>

      <button
        onClick={() => setOpen(o => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="w-full flex items-center justify-between gap-2 px-3 py-2.5 bg-navy-800 hover:bg-navy-700/80 rounded-lg border border-navy-700 hover:border-gold-400/40 transition-all group"
      >
        <span className="flex items-center gap-2 min-w-0">
          {active ? <span className="text-lg shrink-0">{active.flag}</span>
                  : <Globe className="w-4 h-4 text-navy-300 shrink-0" />}
          <span className="text-xs font-semibold text-white truncate">
            {active ? active.country : "Global view"}
          </span>
          <span className="text-navy-500 text-xs">→</span>
          <span className="text-base shrink-0">🇺🇸</span>
        </span>
        <ChevronDown className={`w-4 h-4 text-navy-400 group-hover:text-gold-400 transition-transform duration-200 ${open ? "rotate-180 text-gold-400" : ""}`} />
      </button>

      {open && (
        <div
          role="listbox"
          className="absolute left-0 right-0 mt-2 z-50 bg-navy-800 border border-navy-700 rounded-xl shadow-2xl shadow-black/50 overflow-hidden py-1 origin-top"
          style={{ animation: "corridorIn 0.14s ease-out" }}
        >
          <style>{`@keyframes corridorIn{from{opacity:0;transform:translateY(-6px) scale(.98)}to{opacity:1;transform:none}}`}</style>

          {CORRIDORS.map(c => {
            const isActive = c.key === current;
            return (
              <button
                key={c.key}
                onClick={() => pick(c.key)}
                role="option"
                aria-selected={isActive}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-left transition-colors ${isActive ? "bg-navy-700/70" : "hover:bg-navy-700/50"}`}
              >
                <span className="text-lg shrink-0">{c.flag}</span>
                <span className="flex-1 min-w-0">
                  <span className={`block text-xs font-semibold truncate ${isActive ? "text-gold-400" : "text-white"}`}>
                    {c.country} <span className="text-navy-400 font-normal">→ US</span>
                  </span>
                  <span className="block text-[10px] text-navy-400 truncate">
                    {c.regionsScored} regions · top {c.topRegion} ({c.topScore})
                  </span>
                </span>
                {isActive && <Check className="w-3.5 h-3.5 text-gold-400 shrink-0" />}
              </button>
            );
          })}

          <div className="my-1 border-t border-navy-700/70" />
          <button
            onClick={() => pick(null)}
            className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-left transition-colors ${!active ? "bg-navy-700/70" : "hover:bg-navy-700/50"}`}
          >
            <Globe className="w-4 h-4 text-navy-300 shrink-0 ml-0.5" />
            <span className={`flex-1 text-xs font-semibold ${!active ? "text-gold-400" : "text-white"}`}>Global view</span>
            {!active && <Check className="w-3.5 h-3.5 text-gold-400 shrink-0" />}
          </button>
        </div>
      )}
    </div>
  );
}
