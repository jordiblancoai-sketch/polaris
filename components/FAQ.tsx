"use client";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { LANDING_FAQS as FAQS } from "@/lib/faq";

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="bg-white py-24 px-6">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <div className="text-gold-500 text-xs font-bold uppercase tracking-widest mb-3">Questions &amp; Answers</div>
          <h2 className="text-3xl md:text-4xl font-black text-navy-950">Everything you want to know</h2>
          <p className="text-gray-500 mt-3">Straight answers on data, scoring and getting started.</p>
        </div>

        <div className="divide-y divide-gray-200 border-t border-b border-gray-200">
          {FAQS.map((f, i) => {
            const isOpen = open === i;
            return (
              <div key={f.q}>
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="w-full flex items-center justify-between gap-4 text-left py-5 group"
                >
                  <span className="text-base md:text-lg font-semibold text-navy-950 group-hover:text-gold-600 transition-colors">{f.q}</span>
                  <ChevronDown className={`w-5 h-5 shrink-0 text-gray-400 transition-transform duration-200 ${isOpen ? "rotate-180 text-gold-500" : ""}`} />
                </button>
                <div className={`grid transition-all duration-200 ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
                  <div className="overflow-hidden">
                    <p className="text-gray-600 leading-relaxed pb-5 pr-8">{f.a}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
