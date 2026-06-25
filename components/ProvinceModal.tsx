"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Download, Trophy, Gauge, CalendarClock, AlertTriangle, Lightbulb, Target,
  BarChart2, Zap, Clock } from "lucide-react";
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, Tooltip } from "recharts";
import { RankedOpportunity } from "@/lib/types";
import { scoreColor, cn } from "@/lib/utils";
import { generateProvincePDF } from "@/lib/pdf-generator";
import { EngagementPlaybook } from "@/components/EngagementPlaybook";
import CompetitiveIntelPanel from "@/components/CompetitiveIntelPanel";
import TimingHeatmap from "@/components/TimingHeatmap";

interface Props {
  region: RankedOpportunity | null;
  corridorLabel?: string;
  totalRegions?: number;
  onClose: () => void;
}

type Tab = "overview" | "score" | "competitive" | "timing" | "playbook";

function tier(score: number) {
  if (score >= 70) return { label: "High opportunity", color: "text-emerald-600", bg: "bg-emerald-50", hex: "#059669" };
  if (score >= 50) return { label: "Medium opportunity", color: "text-amber-600", bg: "bg-amber-50", hex: "#d97706" };
  return { label: "Lower opportunity", color: "text-red-600", bg: "bg-red-50", hex: "#ef4444" };
}

function strategyFor(iso: string, score: number): string[] {
  if (iso === "CHN") {
    return score >= 70
      ? ["Partner with top IB / international high schools as feeders", "Host an in-person recruiting fair in the capital city", "Run TOEFL/IELTS prep partnerships", "Activate alumni ambassadors for parent-led decisions"]
      : score >= 50
      ? ["Lead with scholarship & financial-aid messaging", "Pair with a high-scoring neighbour province", "Use agent partnerships to extend reach", "Target STEM & MBA programs"]
      : ["Treat as long-term / virtual-only for now", "Use webinars instead of in-person visits", "Monitor GDP growth before committing budget", "Focus scholarship-funded pipelines"];
  }
  if (iso === "JPN") return ["Build formal partnerships with schools & universities", "Emphasise English-support / pathway programs", "Attend autumn study-abroad fairs (Sep–Nov)", "Avoid Jan–Feb entrance-exam period"];
  return ["Target self-directed top students", "Lead with rankings & outcomes, not scholarships", "Engage after Jan A-level results and the Oct fair", "Partner with Raffles / HCI / ACS feeder schools"];
}

// Radar factors derived from the score so each region differs
function buildRadar(region: RankedOpportunity) {
  const s = region.score;
  const f = [
    { subject: "👥 Demand", value: Math.min(100, s + 10) },
    { subject: "💰 Economic", value: Math.min(100, s + 5) },
    { subject: "🎓 Academic", value: Math.min(100, s + 8) },
    { subject: "✈️ Corridor", value: Math.min(100, s + 2) },
    { subject: "🎯 White space", value: Math.max(5, 100 - s + 10) },
    { subject: "🌊 Migration", value: Math.min(100, s) },
  ];
  return f;
}

export function ProvinceModal({ region, corridorLabel, totalRegions, onClose }: Props) {
  const [downloading, setDownloading] = useState(false);
  const [tab, setTab] = useState<Tab>("overview");
  if (!region) return null;

  const t = tier(region.score);
  const strategies = strategyFor(region.target_country_iso, region.score);
  const corridor = corridorLabel || `${region.target_country_iso} → ${region.dest_country_iso}`;
  const radar = buildRadar(region);
  const isChina = region.target_country_iso === "CHN";

  async function handleDownloadPDF() {
    if (!region) return;
    setDownloading(true);
    try {
      await generateProvincePDF(region.target_entity_name, {
        score: region.score, rank: region.rank, confidence: region.confidence,
        keyInsight: region.key_insight, riskFlag: region.risk_flag,
        visitWindow: region.optimal_visit_window, corridor, strategies, tierLabel: t.label,
        factors: radar, isChina, iso: region.target_country_iso,
      });
    } catch (e) { console.error(e); alert("Could not generate PDF — please try again."); }
    finally { setDownloading(false); }
  }

  const corridorName = region.target_country_iso === "JPN" ? "Japan" : region.target_country_iso === "SGP" ? "Singapore" : "China";
  const TABS: [Tab, string, any][] = [
    ["overview", "Overview", Lightbulb],
    ["score", "Score", BarChart2],
    ["playbook", "Playbook", Zap],
    ["competitive", "Competition", Target],
    ["timing", "Timing", Clock],
  ];

  return (
    <AnimatePresence>
      {/* Dim backdrop */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm" />
      {/* Right-side slide-in panel */}
      <motion.div
        initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
        transition={{ type: "tween", duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        onClick={e => e.stopPropagation()}
        className="fixed top-0 right-0 z-50 h-full w-full max-w-xl bg-white shadow-2xl overflow-hidden flex flex-col">

          {/* Header */}
          <div className="bg-gradient-to-r from-navy-950 to-navy-900 px-6 py-6 flex items-start justify-between shrink-0">
            <div>
              <div className="flex items-center gap-3 mb-1.5">
                <h2 className="text-3xl font-black text-white">{region.target_entity_name}</h2>
                <span className="text-4xl font-black" style={{ color: t.hex }}>{region.score}</span>
              </div>
              <p className="text-navy-300 text-sm">{corridor} corridor · {t.label}</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-navy-800 rounded-lg transition-colors text-white/60 hover:text-white shrink-0">
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-100 overflow-x-auto shrink-0">
            {TABS.map(([id, label, Icon]) => (
              <button key={id} onClick={() => setTab(id)}
                className={cn("flex items-center gap-1.5 px-4 py-3 text-xs font-semibold whitespace-nowrap border-b-2 transition-colors",
                  tab === id ? "border-navy-800 text-navy-800" : "border-transparent text-gray-400 hover:text-gray-600")}>
                <Icon className="w-3.5 h-3.5" />{label}
                {id === "playbook" && <span className="text-[8px] bg-gold-500 text-navy-900 font-bold px-1 rounded-full">★</span>}
              </button>
            ))}
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-6">
            {tab === "overview" && (
              <div className="space-y-5">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { icon: Trophy, v: `#${region.rank}${totalRegions ? ` of ${totalRegions}` : ""}`, l: "Rank in corridor" },
                    { icon: Gauge, v: `${region.score}/100`, l: "Opportunity score" },
                    { icon: Target, v: region.confidence, l: "Model confidence", cap: true },
                    { icon: CalendarClock, v: region.optimal_visit_window || "—", l: "Best visit window" },
                  ].map((m, i) => {
                    const Icon = m.icon;
                    return (
                      <div key={i} className={`${t.bg} rounded-xl p-4`}>
                        <Icon className={`w-5 h-5 ${t.color} mb-2`} />
                        <div className={`text-sm font-bold ${t.color} ${m.cap ? "capitalize" : ""}`}>{m.v}</div>
                        <div className="text-[11px] text-gray-600 mt-0.5">{m.l}</div>
                      </div>
                    );
                  })}
                </div>
                <div className="bg-navy-50 rounded-xl p-4 border border-navy-100">
                  <h3 className="font-bold text-navy-900 text-sm mb-2 flex items-center gap-2"><Lightbulb className="w-4 h-4 text-gold-500" /> Why this score</h3>
                  <p className="text-sm text-gray-700 leading-relaxed">{region.key_insight}</p>
                  <p className="text-[10px] text-gray-400 mt-3 pt-2 border-t border-navy-100">
                    Sources: World Bank · UNESCO UIS · U.S. Dept. of State · IIE Open Doors · national statistics bureaus
                  </p>
                </div>
                {region.risk_flag && (
                  <div className="bg-red-50 rounded-xl p-4 border border-red-200">
                    <h3 className="font-bold text-red-900 text-sm mb-2 flex items-center gap-2"><AlertTriangle className="w-4 h-4" /> Watch out</h3>
                    <p className="text-sm text-red-800 leading-relaxed">{region.risk_flag}</p>
                  </div>
                )}
                <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-200">
                  <h3 className="font-bold text-emerald-900 text-sm mb-2 flex items-center gap-2"><Target className="w-4 h-4" /> Recommended strategy</h3>
                  <ul className="space-y-1.5 text-sm text-emerald-800">
                    {strategies.map((s, i) => <li key={i} className="flex items-start gap-2"><span className="text-emerald-500 mt-0.5">✓</span><span>{s}</span></li>)}
                  </ul>
                </div>
              </div>
            )}

            {tab === "score" && (
              <div className="space-y-5">
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">Score breakdown</h3>
                  <ResponsiveContainer width="100%" height={240}>
                    <RadarChart data={radar} margin={{ top: 10, right: 25, bottom: 10, left: 25 }}>
                      <PolarGrid stroke="#e5e7eb" />
                      <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: "#6b7280" }} />
                      <Tooltip formatter={(v: number) => [`${v}/100`, ""]} />
                      <Radar dataKey="value" stroke="#1e2d5e" fill="#1e2d5e" fillOpacity={0.15} strokeWidth={2} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-3">
                  {radar.map(f => {
                    const fc = scoreColor(f.value);
                    return (
                      <div key={f.subject}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium text-gray-700">{f.subject}</span>
                          <span className={cn("text-sm font-bold", fc.text)}>{f.value}</span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div className={cn("h-full rounded-full", fc.bg)} style={{ width: `${f.value}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {tab === "playbook" && <EngagementPlaybook provinceName={region.target_entity_name} score={region.score} countryIso={region.target_country_iso} />}
            {tab === "competitive" && <CompetitiveIntelPanel provinceName={region.target_entity_name} score={region.score} countryIso={region.target_country_iso} />}
            {tab === "timing" && <TimingHeatmap provinceName={region.target_entity_name} score={region.score} iso={region.target_country_iso} corridorName={corridorName} />}
          </div>

          {/* Footer */}
          <div className="bg-gray-50 border-t border-gray-100 px-6 py-4 flex items-center justify-between shrink-0">
            <button onClick={onClose} className="px-4 py-2 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors text-sm font-medium">Close</button>
            <button onClick={handleDownloadPDF} disabled={downloading}
              className="px-4 py-2 bg-gold-400 hover:bg-gold-500 text-navy-950 rounded-lg transition-colors text-sm font-bold flex items-center gap-2 disabled:opacity-70">
              <Download className="w-4 h-4" />{downloading ? "Generating…" : "Export PDF"}
            </button>
          </div>
      </motion.div>
    </AnimatePresence>
  );
}
