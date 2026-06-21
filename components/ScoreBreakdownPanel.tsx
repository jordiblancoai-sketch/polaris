"use client";
import { useState } from "react";
import { RankedOpportunity } from "@/lib/types";
import { scoreColor, cn } from "@/lib/utils";
import { X, AlertTriangle, Calendar, School, TrendingUp, Zap, BarChart2, Target, Clock } from "lucide-react";
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, Tooltip } from "recharts";
import { EngagementPlaybook } from "@/components/EngagementPlaybook";
import CompetitiveIntelPanel from "@/components/CompetitiveIntelPanel";
import TimingHeatmap from "@/components/TimingHeatmap";

const FACTOR_META: Record<string, { label: string; icon: string; description: string }> = {
  demand_signal:             { label: "Student Demand",        icon: "👥", description: "Population 18-24, school density, historical enrollment flows" },
  economic_fit:              { label: "Economic Fit",          icon: "💰", description: "GDP per capita, household income, ability to pay full tuition" },
  academic_profile:          { label: "Academic Pipeline",     icon: "🎓", description: "Secondary completion, tertiary enrollment, English proficiency" },
  corridor_viability:        { label: "Corridor Viability",    icon: "✈️",  description: "Visa approval rate, direct flights, policy risk" },
  competitive_saturation_inv:{ label: "Market Opportunity",    icon: "🎯", description: "Inverted saturation — fewer competitors = higher score" },
  migration_propensity:      { label: "Migration Propensity",  icon: "🌊", description: "Diaspora size, historical flow trend, migration momentum" },
};

// Build demo breakdown data for a province
function buildBreakdown(opp: RankedOpportunity) {
  const nameMap: Record<string, number> = {
    "Beijing":       { demand_signal: 85, economic_fit: 92, academic_profile: 95, corridor_viability: 50, competitive_saturation_inv: 5,  migration_propensity: 75 },
    "Shanghai":      { demand_signal: 82, economic_fit: 91, academic_profile: 94, corridor_viability: 50, competitive_saturation_inv: 6,  migration_propensity: 72 },
    "Zhejiang":      { demand_signal: 88, economic_fit: 85, academic_profile: 88, corridor_viability: 66, competitive_saturation_inv: 32, migration_propensity: 70 },
    "Jiangsu":       { demand_signal: 90, economic_fit: 83, academic_profile: 86, corridor_viability: 66, competitive_saturation_inv: 29, migration_propensity: 68 },
    "Sichuan":       { demand_signal: 92, economic_fit: 65, academic_profile: 78, corridor_viability: 66, competitive_saturation_inv: 58, migration_propensity: 55 },
    "Hubei":         { demand_signal: 88, economic_fit: 68, academic_profile: 82, corridor_viability: 66, competitive_saturation_inv: 52, migration_propensity: 58 },
    "Hunan":         { demand_signal: 88, economic_fit: 65, academic_profile: 79, corridor_viability: 66, competitive_saturation_inv: 60, migration_propensity: 52 },
    "Shaanxi":       { demand_signal: 84, economic_fit: 64, academic_profile: 80, corridor_viability: 66, competitive_saturation_inv: 62, migration_propensity: 50 },
  }[opp.target_entity_name] ?? {
    demand_signal:              Math.min(100, opp.score + 10),
    economic_fit:               Math.min(100, opp.score + 5),
    academic_profile:           Math.min(100, opp.score + 8),
    corridor_viability:         Math.min(100, opp.score + 2),
    competitive_saturation_inv: Math.max(5, opp.score - 5),
    migration_propensity:       Math.min(100, opp.score),
  };

  return Object.entries(FACTOR_META).map(([key, meta]) => ({
    key,
    label: meta.label,
    icon: meta.icon,
    description: meta.description,
    value: (nameMap as any)[key] ?? 50,
  }));
}

type Tab = "score" | "engagement" | "competitive" | "timing";

interface Props { opp: RankedOpportunity; onClose: () => void; }

export function ScoreBreakdownPanel({ opp, onClose }: Props) {
  const [tab, setTab] = useState<Tab>("score");
  const c = scoreColor(opp.score);
  const breakdown = buildBreakdown(opp);
  const radarData = breakdown.map(f => ({ subject: f.icon + " " + f.label.split(" ")[0], value: f.value, fullMark: 100 }));

  return (
    <div className="flex-1 bg-white overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between z-10">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-bold text-gray-900">{opp.target_entity_name}</h2>
            <span className={cn("text-2xl font-bold tabular-nums", c.text)}>{opp.score}</span>
            <span className="text-sm text-gray-400">/100</span>
          </div>
          <div className="text-sm text-gray-500 mt-0.5">China → United States · {opp.target_entity_name} Province</div>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <X className="w-4 h-4 text-gray-500" />
        </button>
      </div>

      {/* Tab switcher */}
      <div className="flex border-b border-gray-100 overflow-x-auto">
        {([
          ["score",       "Score",       BarChart2],
          ["engagement",  "Playbook",    Zap],
          ["competitive", "Competition", Target],
          ["timing",      "Timing",      Clock],
        ] as const).map(([id, label, Icon]) => (
          <button key={id} onClick={() => setTab(id)}
            className={cn("flex-1 min-w-0 flex items-center justify-center gap-1 py-3 text-xs font-medium transition-colors border-b-2 whitespace-nowrap px-2",
              tab === id ? "border-navy-700 text-navy-800" : "border-transparent text-gray-400 hover:text-gray-600"
            )}>
            <Icon className="w-3 h-3 shrink-0" />{label}
            {id === "engagement" && <span className="ml-0.5 text-[9px] bg-gold-500 text-navy-900 font-bold px-1 py-0.5 rounded-full">★</span>}
          </button>
        ))}
      </div>

      <div className="px-6 py-5 space-y-6">
      {tab === "engagement" && (
        <EngagementPlaybook provinceName={opp.target_entity_name} score={opp.score} />
      )}
      {tab === "competitive" && (
        <CompetitiveIntelPanel provinceName={opp.target_entity_name} score={opp.score} />
      )}
      {tab === "timing" && (
        <TimingHeatmap provinceName={opp.target_entity_name} score={opp.score} />
      )}
      {tab === "score" && (<>
        {/* Score badge + risk */}
        <div className="flex gap-3">
          <div className={cn("flex-1 rounded-xl border p-4", c.badge)}>
            <div className="text-xs font-medium mb-1 opacity-70 uppercase tracking-wider">Opportunity Score</div>
            <div className="text-4xl font-bold tabular-nums">{opp.score}</div>
            <div className="w-full h-2 bg-white/50 rounded-full mt-2 overflow-hidden">
              <div className={cn("h-full rounded-full", c.bg)} style={{ width: `${opp.score}%` }} />
            </div>
          </div>
          <div className="rounded-xl border border-gray-100 p-4 flex flex-col justify-between">
            <div>
              <div className="text-xs text-gray-400 uppercase tracking-wider mb-1">Confidence</div>
              <div className="font-semibold text-gray-700 capitalize">{opp.confidence}</div>
            </div>
            <div>
              <div className="text-xs text-gray-400 uppercase tracking-wider mb-1">Visit Window</div>
              <div className="text-sm font-medium text-gray-700 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-gray-400" />
                {opp.optimal_visit_window}
              </div>
            </div>
          </div>
        </div>

        {/* Key insight */}
        {opp.key_insight && (
          <div className="bg-navy-50 rounded-xl border border-navy-100 p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-navy-700" />
              <span className="text-xs font-semibold text-navy-700 uppercase tracking-wider">Key Insight</span>
            </div>
            <p className="text-sm text-navy-800 leading-relaxed">{opp.key_insight}</p>
          </div>
        )}

        {/* Risk flag */}
        {opp.risk_flag && (
          <div className="bg-amber-50 rounded-xl border border-amber-200 p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span className="text-xs font-semibold text-amber-700 uppercase tracking-wider">Risk Flag</span>
            </div>
            <p className="text-sm text-amber-800 leading-relaxed">{opp.risk_flag}</p>
          </div>
        )}

        {/* Radar chart */}
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Score Breakdown</h3>
          <ResponsiveContainer width="100%" height={220}>
            <RadarChart data={radarData} margin={{ top: 10, right: 20, bottom: 10, left: 20 }}>
              <PolarGrid stroke="#e5e7eb" />
              <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: "#6b7280" }} />
              <Tooltip formatter={(v: number) => [`${v}/100`, ""]} />
              <Radar name="Score" dataKey="value" stroke="#1e2d5e" fill="#1e2d5e" fillOpacity={0.15} strokeWidth={2} />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Factor bars */}
        <div className="space-y-3">
          {breakdown.map(f => {
            const fc = scoreColor(f.value);
            return (
              <div key={f.key}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm">{f.icon}</span>
                    <span className="text-sm font-medium text-gray-700">{f.label}</span>
                  </div>
                  <span className={cn("text-sm font-bold tabular-nums", fc.text)}>{f.value}</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className={cn("h-full rounded-full transition-all duration-700", fc.bg)} style={{ width: `${f.value}%` }} />
                </div>
                <p className="text-[10px] text-gray-400 mt-0.5">{f.description}</p>
              </div>
            );
          })}
        </div>

        {/* Corridor context */}
        <div className="bg-gray-50 rounded-xl p-4 space-y-2">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">China → US Corridor Context</h3>
          {[
            ["🎓", "Students in US (2023)", "277,398"],
            ["📉", "YoY enrollment change", "−6.2%"],
            ["✈️",  "F-1 visa approval rate", "66% (↓24pp vs 2019)"],
            ["🏆", "US universities recruiting in China", "350+"],
          ].map(([icon, label, val]) => (
            <div key={label} className="flex items-center justify-between text-sm">
              <span className="text-gray-500 flex items-center gap-1.5"><span>{icon}</span>{label}</span>
              <span className="font-semibold text-gray-800">{val}</span>
            </div>
          ))}
        </div>
      </>)}
      </div>
    </div>
  );
}
