"use client";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

const FAQS: { q: string; a: string }[] = [
  {
    q: "Where does Polaris get its data?",
    a: "We combine authoritative public datasets — IIE Open Doors enrollment flows, U.S. Department of State F-1 visa statistics, World Bank economics, UNESCO mobility trends and EF English Proficiency — with live web signals collected and refreshed continuously. Every input is a verifiable, citable source, never a black box.",
  },
  {
    q: "How is each region scored?",
    a: "Every province, prefecture or state gets a 0–100 yield-probability score built from six weighted dimensions: Student Demand, Economic ability-to-pay, Academic readiness, Corridor strength (visa approval + travel access), Competitive white space, and Migration intent. The score estimates how likely your recruiting spend in that region converts to actual enrolled students.",
  },
  {
    q: "How often is the data updated?",
    a: "Scores are recomputed nightly. As visa policy, economic conditions and competitor activity shift through the recruiting cycle, your map stays current — so you're never planning a trip on last year's assumptions.",
  },
  {
    q: "Which corridors are covered?",
    a: "China, Japan, South Korea, India and Singapore → United States are live today, covering 130+ scored regions. Additional source and destination corridors are added on request as part of a pilot.",
  },
  {
    q: "Can I see why a region scores the way it does?",
    a: "Yes. Click any region for a full transparent breakdown — the six score dimensions, the key insight, risk flags, the optimal visit window and recommended partner schools. You can show your provost exactly why one province outperforms another. No black boxes.",
  },
  {
    q: "How accurate are the scores?",
    a: "Scores are calibrated against historical enrollment and visa outcomes, and every dimension is traceable to its source. The goal isn't a crystal ball — it's a defensible, transparent ranking that beats gut feel and outdated relationships.",
  },
  {
    q: "Do I need to install anything?",
    a: "No. Polaris is fully web-based and works on any device. Sign in, pick a corridor, and start exploring — no software, no setup, no IT ticket.",
  },
  {
    q: "How do I get started?",
    a: "Start a pilot on a single corridor or request a 15-minute live demo — no signup required. We'll scope the corridors that matter to your institution and have you exploring real scores the same week.",
  },
];

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
