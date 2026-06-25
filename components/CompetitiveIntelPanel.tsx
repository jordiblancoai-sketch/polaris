"use client";
import { cn } from "@/lib/utils";
import { scoresFor } from "@/lib/scores";
import {
  Target,
  ShieldAlert,
  Telescope,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Clock,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

// ─── Data types ───────────────────────────────────────────────────────────────

type ActivityLevel = "dominant" | "high" | "medium";
type UniversityTier = "R1 Elite" | "R1" | "R2";

interface CompetitorEntry {
  name: string;
  tier: UniversityTier;
  activity: ActivityLevel;
  enrolledPerYear?: number;
}

interface ProvinceCompetitiveData {
  whiteSpaceScore: number;
  totalUSUnisRecruiting: number;
  saturatedComparatorCount: number; // e.g., Beijing = 380
  saturatedComparatorName: string;
  monthsBeforeSaturation: number;
  competitors: CompetitorEntry[];
  notPresent: string[];
  notPresentNote?: string;
}

// ─── Hardcoded data ───────────────────────────────────────────────────────────

const PROVINCE_DATA: Record<string, ProvinceCompetitiveData> = {
  Beijing: {
    whiteSpaceScore: 8,
    totalUSUnisRecruiting: 380,
    saturatedComparatorCount: 380,
    saturatedComparatorName: "Beijing",
    monthsBeforeSaturation: 0,
    competitors: [
      { name: "USC",          tier: "R1 Elite", activity: "dominant", enrolledPerYear: 320 },
      { name: "UIUC",         tier: "R1 Elite", activity: "dominant", enrolledPerYear: 290 },
      { name: "NYU",          tier: "R1 Elite", activity: "dominant", enrolledPerYear: 410 },
      { name: "Columbia",     tier: "R1 Elite", activity: "dominant", enrolledPerYear: 350 },
      { name: "UCLA",         tier: "R1 Elite", activity: "high",     enrolledPerYear: 280 },
      { name: "Harvard",      tier: "R1 Elite", activity: "high",     enrolledPerYear: 180 },
      { name: "Stanford",     tier: "R1 Elite", activity: "high",     enrolledPerYear: 210 },
      { name: "MIT",          tier: "R1 Elite", activity: "high",     enrolledPerYear: 190 },
      { name: "UPenn",        tier: "R1 Elite", activity: "high",     enrolledPerYear: 220 },
      { name: "Cornell",      tier: "R1 Elite", activity: "high",     enrolledPerYear: 200 },
      { name: "Purdue",       tier: "R1",       activity: "high",     enrolledPerYear: 260 },
      { name: "CMU",          tier: "R1 Elite", activity: "high",     enrolledPerYear: 240 },
      { name: "Michigan",     tier: "R1 Elite", activity: "high",     enrolledPerYear: 270 },
      { name: "BU",           tier: "R1",       activity: "medium",   enrolledPerYear: 180 },
      { name: "Northeastern", tier: "R1",       activity: "medium",   enrolledPerYear: 160 },
      { name: "Ohio State",   tier: "R1",       activity: "medium",   enrolledPerYear: 140 },
      { name: "Minnesota",    tier: "R1",       activity: "medium",   enrolledPerYear: 130 },
      { name: "ASU",          tier: "R2",       activity: "medium",   enrolledPerYear: 210 },
    ],
    notPresent: [],
  },
  Shanghai: {
    whiteSpaceScore: 6,
    totalUSUnisRecruiting: 340,
    saturatedComparatorCount: 380,
    saturatedComparatorName: "Beijing",
    monthsBeforeSaturation: 0,
    competitors: [
      { name: "NYU",          tier: "R1 Elite", activity: "dominant", enrolledPerYear: 380 },
      { name: "USC",          tier: "R1 Elite", activity: "dominant", enrolledPerYear: 300 },
      { name: "Columbia",     tier: "R1 Elite", activity: "dominant", enrolledPerYear: 310 },
      { name: "UIUC",         tier: "R1 Elite", activity: "dominant", enrolledPerYear: 270 },
      { name: "Michigan",     tier: "R1 Elite", activity: "high",     enrolledPerYear: 260 },
      { name: "Harvard",      tier: "R1 Elite", activity: "high",     enrolledPerYear: 175 },
      { name: "Stanford",     tier: "R1 Elite", activity: "high",     enrolledPerYear: 200 },
      { name: "MIT",          tier: "R1 Elite", activity: "high",     enrolledPerYear: 185 },
      { name: "UPenn",        tier: "R1 Elite", activity: "high",     enrolledPerYear: 210 },
      { name: "UCLA",         tier: "R1 Elite", activity: "high",     enrolledPerYear: 250 },
      { name: "CMU",          tier: "R1 Elite", activity: "high",     enrolledPerYear: 220 },
      { name: "Purdue",       tier: "R1",       activity: "high",     enrolledPerYear: 240 },
      { name: "BU",           tier: "R1",       activity: "medium",   enrolledPerYear: 170 },
      { name: "Northeastern", tier: "R1",       activity: "medium",   enrolledPerYear: 155 },
      { name: "Ohio State",   tier: "R1",       activity: "medium",   enrolledPerYear: 135 },
      { name: "ASU",          tier: "R2",       activity: "medium",   enrolledPerYear: 195 },
    ],
    notPresent: [],
  },
  Zhejiang: {
    whiteSpaceScore: 42,
    totalUSUnisRecruiting: 95,
    saturatedComparatorCount: 380,
    saturatedComparatorName: "Beijing",
    monthsBeforeSaturation: 18,
    competitors: [
      { name: "USC",          tier: "R1 Elite", activity: "high",   enrolledPerYear: 95  },
      { name: "UIUC",         tier: "R1 Elite", activity: "high",   enrolledPerYear: 82  },
      { name: "NYU",          tier: "R1 Elite", activity: "high",   enrolledPerYear: 90  },
      { name: "Michigan",     tier: "R1 Elite", activity: "high",   enrolledPerYear: 78  },
      { name: "Purdue",       tier: "R1",       activity: "medium", enrolledPerYear: 60  },
      { name: "ASU",          tier: "R2",       activity: "medium", enrolledPerYear: 75  },
      { name: "BU",           tier: "R1",       activity: "medium", enrolledPerYear: 50  },
      { name: "Northeastern", tier: "R1",       activity: "medium", enrolledPerYear: 45  },
    ],
    notPresent: ["Harvard", "Stanford", "Cornell", "Yale", "MIT", "CMU", "Columbia", "UCLA", "UPenn"],
    notPresentNote: "Harvard, Stanford, Cornell, Yale, and MIT are actively recruiting in Beijing but have ZERO presence in Zhejiang.",
  },
  Hubei: {
    whiteSpaceScore: 72,
    totalUSUnisRecruiting: 32,
    saturatedComparatorCount: 380,
    saturatedComparatorName: "Beijing",
    monthsBeforeSaturation: 14,
    competitors: [
      { name: "USC",      tier: "R1 Elite", activity: "medium", enrolledPerYear: 35  },
      { name: "UIUC",     tier: "R1 Elite", activity: "medium", enrolledPerYear: 28  },
      { name: "Michigan", tier: "R1 Elite", activity: "medium", enrolledPerYear: 22  },
      { name: "Purdue",   tier: "R1",       activity: "medium", enrolledPerYear: 25  },
      { name: "BU",       tier: "R1",       activity: "medium", enrolledPerYear: 18  },
    ],
    notPresent: ["Harvard", "Stanford", "Cornell", "Yale", "MIT", "CMU", "Columbia", "UCLA", "UPenn", "NYU", "Northeastern", "Ohio State"],
    notPresentNote: "Harvard, Stanford, Cornell, Yale, and MIT are recruiting in Beijing but have ZERO presence in Hubei — a province with a massive high-school graduating class.",
  },
  Sichuan: {
    whiteSpaceScore: 75,
    totalUSUnisRecruiting: 28,
    saturatedComparatorCount: 380,
    saturatedComparatorName: "Beijing",
    monthsBeforeSaturation: 16,
    competitors: [
      { name: "USC",      tier: "R1 Elite", activity: "medium", enrolledPerYear: 30 },
      { name: "UIUC",     tier: "R1 Elite", activity: "medium", enrolledPerYear: 22 },
      { name: "Purdue",   tier: "R1",       activity: "medium", enrolledPerYear: 20 },
      { name: "ASU",      tier: "R2",       activity: "medium", enrolledPerYear: 28 },
      { name: "Michigan", tier: "R1 Elite", activity: "medium", enrolledPerYear: 18 },
    ],
    notPresent: ["Harvard", "Stanford", "Cornell", "Yale", "MIT", "CMU", "Columbia", "UCLA", "UPenn", "NYU", "Northeastern"],
    notPresentNote: "Harvard, Stanford, Cornell, Yale, and MIT are all recruiting in Beijing but have ZERO presence in Sichuan — 3.3M students 18-24.",
  },
  Hunan: {
    whiteSpaceScore: 78,
    totalUSUnisRecruiting: 22,
    saturatedComparatorCount: 380,
    saturatedComparatorName: "Beijing",
    monthsBeforeSaturation: 18,
    competitors: [
      { name: "USC",    tier: "R1 Elite", activity: "medium" },
      { name: "UIUC",  tier: "R1 Elite", activity: "medium" },
      { name: "Purdue", tier: "R1",      activity: "medium" },
      { name: "ASU",    tier: "R2",      activity: "medium" },
    ],
    notPresent: ["Harvard", "Stanford", "Cornell", "Yale", "MIT", "CMU", "Columbia", "UCLA", "UPenn", "NYU", "Michigan", "Northeastern", "Ohio State"],
    notPresentNote: "13 top-ranked US universities recruit in Beijing but have zero footprint in Hunan, including all Ivies, MIT, and CMU.",
  },
  Shaanxi: {
    whiteSpaceScore: 80,
    totalUSUnisRecruiting: 18,
    saturatedComparatorCount: 380,
    saturatedComparatorName: "Beijing",
    monthsBeforeSaturation: 20,
    competitors: [
      { name: "USC",    tier: "R1 Elite", activity: "medium" },
      { name: "Purdue", tier: "R1",       activity: "medium" },
      { name: "ASU",    tier: "R2",       activity: "medium" },
    ],
    notPresent: ["Harvard", "Stanford", "Cornell", "Yale", "MIT", "CMU", "Columbia", "UCLA", "UPenn", "NYU", "UIUC", "Michigan", "Northeastern", "Ohio State", "BU"],
    notPresentNote: "15 universities recruiting in Beijing — including every Ivy and every top-10 STEM school — have never visited Xi'an, home to elite high schools producing thousands of overseas-bound seniors.",
  },
  Henan: {
    whiteSpaceScore: 85,
    totalUSUnisRecruiting: 12,
    saturatedComparatorCount: 380,
    saturatedComparatorName: "Beijing",
    monthsBeforeSaturation: 24,
    competitors: [
      { name: "ASU",    tier: "R2", activity: "medium" },
      { name: "Purdue", tier: "R1", activity: "medium" },
    ],
    notPresent: ["Harvard", "Stanford", "Cornell", "Yale", "MIT", "CMU", "Columbia", "UCLA", "UPenn", "NYU", "UIUC", "Michigan", "USC", "Northeastern", "Ohio State", "BU"],
    notPresentNote: "16 universities actively recruiting in Beijing have zero presence in Henan — the largest province in China by student population (4.9M students aged 18-24).",
  },

  // ─── Japan ───────────────────────────────────────────────
  Kyoto: {
    whiteSpaceScore: 70, totalUSUnisRecruiting: 12, saturatedComparatorCount: 200, saturatedComparatorName: "Tokyo", monthsBeforeSaturation: 16,
    competitors: [
      { name: "USC", tier: "R1 Elite", activity: "medium" },
      { name: "UC Berkeley", tier: "R1 Elite", activity: "medium" },
      { name: "Washington", tier: "R1", activity: "medium" },
    ],
    notPresent: ["Harvard", "Stanford", "MIT", "Yale", "Princeton", "Columbia"],
    notPresentNote: "Elite US schools recruit heavily in Tokyo but rarely visit Kyoto's top high schools — a high-achieving, study-abroad-minded cohort.",
  },
  Osaka: {
    whiteSpaceScore: 68, totalUSUnisRecruiting: 18, saturatedComparatorCount: 200, saturatedComparatorName: "Tokyo", monthsBeforeSaturation: 18,
    competitors: [
      { name: "USC", tier: "R1 Elite", activity: "medium" },
      { name: "Purdue", tier: "R1", activity: "medium" },
      { name: "Arizona State", tier: "R2", activity: "medium" },
    ],
    notPresent: ["Harvard", "Stanford", "MIT", "Yale", "Cornell", "UCLA"],
    notPresentNote: "Kansai business families are internationally minded, yet most top US schools concentrate on Tokyo and skip Osaka.",
  },
  Fukuoka: {
    whiteSpaceScore: 82, totalUSUnisRecruiting: 6, saturatedComparatorCount: 200, saturatedComparatorName: "Tokyo", monthsBeforeSaturation: 24,
    competitors: [
      { name: "Arizona State", tier: "R2", activity: "medium" },
      { name: "Oregon", tier: "R1", activity: "medium" },
    ],
    notPresent: ["Harvard", "Stanford", "MIT", "USC", "NYU", "Michigan", "UCLA", "Columbia"],
    notPresentNote: "Fukuoka is Japan's fastest-growing city with almost no US recruiting presence — true white space.",
  },
  Tokyo: {
    whiteSpaceScore: 20, totalUSUnisRecruiting: 200, saturatedComparatorCount: 200, saturatedComparatorName: "Tokyo", monthsBeforeSaturation: 0,
    competitors: [
      { name: "NYU", tier: "R1 Elite", activity: "dominant" },
      { name: "USC", tier: "R1 Elite", activity: "dominant" },
      { name: "Harvard", tier: "R1 Elite", activity: "high" },
      { name: "Stanford", tier: "R1 Elite", activity: "high" },
      { name: "MIT", tier: "R1 Elite", activity: "high" },
      { name: "Columbia", tier: "R1 Elite", activity: "high" },
    ],
    notPresent: [],
    notPresentNote: "Tokyo is the most contested market in Japan — 200+ US universities already recruit here. Differentiate or focus on Kansai/Kyushu.",
  },

  // ─── Singapore ───────────────────────────────────────────
  "Central Region": {
    whiteSpaceScore: 32, totalUSUnisRecruiting: 60, saturatedComparatorCount: 380, saturatedComparatorName: "Beijing", monthsBeforeSaturation: 8,
    competitors: [
      { name: "NYU", tier: "R1 Elite", activity: "high" },
      { name: "UC Berkeley", tier: "R1 Elite", activity: "high" },
      { name: "USC", tier: "R1 Elite", activity: "high" },
      { name: "Cornell", tier: "R1 Elite", activity: "medium" },
      { name: "Michigan", tier: "R1 Elite", activity: "medium" },
    ],
    notPresent: ["Caltech", "Duke", "Northwestern"],
    notPresentNote: "Raffles, HCI and ACS feed the Ivy League directly, but UK/Australia still dominate — US schools that lead with outcomes can win share.",
  },
  "East Region": {
    whiteSpaceScore: 55, totalUSUnisRecruiting: 28, saturatedComparatorCount: 380, saturatedComparatorName: "Beijing", monthsBeforeSaturation: 14,
    competitors: [
      { name: "USC", tier: "R1 Elite", activity: "medium" },
      { name: "Purdue", tier: "R1", activity: "medium" },
    ],
    notPresent: ["Harvard", "Stanford", "MIT", "Yale", "Columbia", "Cornell"],
    notPresentNote: "Affluent international-school belt that most US recruiters overlook in favour of the central CBD schools.",
  },
  "West Region": {
    whiteSpaceScore: 62, totalUSUnisRecruiting: 18, saturatedComparatorCount: 380, saturatedComparatorName: "Beijing", monthsBeforeSaturation: 16,
    competitors: [
      { name: "Arizona State", tier: "R2", activity: "medium" },
      { name: "Purdue", tier: "R1", activity: "medium" },
    ],
    notPresent: ["Harvard", "Stanford", "MIT", "USC", "NYU", "Berkeley"],
    notPresentNote: "Growing young-family district near the Jurong innovation hub — rising US-bound STEM interest, very low recruiter coverage.",
  },
  "North-East Region": {
    whiteSpaceScore: 68, totalUSUnisRecruiting: 12, saturatedComparatorCount: 380, saturatedComparatorName: "Beijing", monthsBeforeSaturation: 18,
    competitors: [
      { name: "Arizona State", tier: "R2", activity: "medium" },
    ],
    notPresent: ["Harvard", "Stanford", "MIT", "USC", "NYU", "Berkeley", "Cornell"],
    notPresentNote: "Sengkang/Punggol new towns — a fast-rising aspirational cohort barely touched by US recruiting.",
  },
  "North Region": {
    whiteSpaceScore: 64, totalUSUnisRecruiting: 10, saturatedComparatorCount: 380, saturatedComparatorName: "Beijing", monthsBeforeSaturation: 18,
    competitors: [
      { name: "Oregon", tier: "R1", activity: "medium" },
    ],
    notPresent: ["Harvard", "Stanford", "MIT", "USC", "NYU", "Berkeley"],
    notPresentNote: "Woodlands corridor — smaller pool but almost no US competition; scholarship-led messaging stands out.",
  },
};

// ─── Comparison chart data (white space vs. competition) ──────────────────────

const COMPARISON_CHART_DATA = [
  { province: "Henan",    whiteSpace: 85, competitors: 12  },
  { province: "Shaanxi",  whiteSpace: 80, competitors: 18  },
  { province: "Hunan",    whiteSpace: 78, competitors: 22  },
  { province: "Sichuan",  whiteSpace: 75, competitors: 28  },
  { province: "Hubei",    whiteSpace: 72, competitors: 32  },
  { province: "Zhejiang", whiteSpace: 42, competitors: 95  },
  { province: "Shanghai", whiteSpace: 6,  competitors: 340 },
  { province: "Beijing",  whiteSpace: 8,  competitors: 380 },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function whiteSpaceColorClass(score: number): string {
  if (score > 60) return "text-emerald-700";
  if (score >= 40) return "text-amber-600";
  return "text-red-600";
}

function whiteSpaceBgClass(score: number): { card: string; bar: string } {
  if (score > 60) return { card: "bg-emerald-50 border-emerald-200", bar: "bg-emerald-500" };
  if (score >= 40) return { card: "bg-amber-50 border-amber-200",   bar: "bg-amber-400"   };
  return              { card: "bg-red-50 border-red-200",           bar: "bg-red-400"     };
}

function activityBadge(level: ActivityLevel): string {
  if (level === "dominant") return "bg-red-100 text-red-700 border border-red-200";
  if (level === "high")     return "bg-amber-100 text-amber-700 border border-amber-200";
  return                           "bg-blue-100 text-blue-700 border border-blue-200";
}

function activityLabel(level: ActivityLevel): string {
  if (level === "dominant") return "Dominant";
  if (level === "high")     return "High";
  return "Medium";
}

function tierBadge(tier: UniversityTier): string {
  if (tier === "R1 Elite") return "bg-navy-100 text-navy-700";
  if (tier === "R1")       return "bg-navy-50 text-navy-600";
  return                          "bg-gray-100 text-gray-500";
}

// The saturated "everyone recruits here" hub per corridor, so an India region
// isn't compared against Beijing.
const SATURATED_HUB: Record<string, { name: string; count: number }> = {
  CHN: { name: "Beijing", count: 380 },
  JPN: { name: "Tokyo", count: 210 },
  KOR: { name: "Seoul", count: 190 },
  IND: { name: "Delhi & Mumbai", count: 240 },
  SGP: { name: "the central core", count: 110 },
};

function getDefaultData(score: number, countryIso?: string): ProvinceCompetitiveData {
  // White space tracks opportunity: a high-scoring region has MORE open space
  // (fewer competitors), so it shouldn't read as "saturated".
  const ws = Math.max(5, Math.min(95, score));
  const totalPresent = Math.round(ws < 30 ? 200 + (30 - ws) * 6 : ws < 60 ? 120 - ws : 5 + (100 - ws));
  const hub = SATURATED_HUB[countryIso ?? ""] ?? { name: "the capital", count: 200 };
  return {
    whiteSpaceScore: ws,
    totalUSUnisRecruiting: totalPresent,
    saturatedComparatorCount: hub.count,
    saturatedComparatorName: hub.name,
    monthsBeforeSaturation: Math.round(12 + ws / 10),
    competitors: [
      { name: "USC",      tier: "R1 Elite", activity: "medium" },
      { name: "Purdue",   tier: "R1",       activity: "medium" },
      { name: "ASU",      tier: "R2",       activity: "medium" },
    ],
    notPresent: ws > 60 ? ["Harvard", "Stanford", "MIT", "Columbia", "Cornell", "Yale", "CMU", "UCLA"] : [],
    notPresentNote: ws > 60 ? `Several top-ranked US universities recruit in ${hub.name} but have no presence in this region.` : undefined,
  };
}

// ─── Sub-components ───────────────────────────────────────────────────────────

interface WhiteSpaceCardProps {
  score: number;
}

function WhiteSpaceCard({ score }: WhiteSpaceCardProps) {
  const color = whiteSpaceColorClass(score);
  const { card, bar } = whiteSpaceBgClass(score);
  const label = score > 60 ? "High Opportunity" : score >= 40 ? "Moderate Opportunity" : "Saturated";

  return (
    <div className={cn("rounded-xl border p-4", card)}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Target className="w-4 h-4 opacity-70" />
          <span className="text-xs font-semibold uppercase tracking-wider opacity-70">Market Opportunity Score</span>
        </div>
        <span className={cn("text-xs font-bold px-2 py-0.5 rounded-full border", card)}>{label}</span>
      </div>
      <div className={cn("text-5xl font-bold tabular-nums leading-none mb-1", color)}>{score}</div>
      <div className="text-xs opacity-60 mb-3">out of 100 — higher = less competition = more opportunity</div>
      <div className="w-full h-2.5 bg-white/60 rounded-full overflow-hidden">
        <div className={cn("h-full rounded-full transition-all duration-700", bar)} style={{ width: `${score}%` }} />
      </div>
    </div>
  );
}

interface CompetitorListProps {
  competitors: CompetitorEntry[];
}

function CompetitorList({ competitors }: CompetitorListProps) {
  const grouped: Record<ActivityLevel, CompetitorEntry[]> = {
    dominant: competitors.filter(c => c.activity === "dominant"),
    high:     competitors.filter(c => c.activity === "high"),
    medium:   competitors.filter(c => c.activity === "medium"),
  };

  const sections: Array<{ key: ActivityLevel; label: string; icon: React.ReactNode }> = [
    { key: "dominant", label: "Dominant",          icon: <ShieldAlert className="w-3.5 h-3.5 text-red-500"   /> },
    { key: "high",     label: "High Activity",     icon: <TrendingUp  className="w-3.5 h-3.5 text-amber-500" /> },
    { key: "medium",   label: "Medium Activity",   icon: <Clock       className="w-3.5 h-3.5 text-blue-500"  /> },
  ];

  return (
    <div className="space-y-3">
      {sections.map(({ key, label, icon }) => {
        const entries = grouped[key];
        if (entries.length === 0) return null;
        return (
          <div key={key}>
            <div className="flex items-center gap-1.5 mb-1.5">
              {icon}
              <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">{label}</span>
              <span className="text-xs text-gray-400">({entries.length})</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {entries.map(c => (
                <div key={c.name} className="flex items-center gap-1 rounded-lg border bg-white px-2 py-1">
                  <span className="text-xs font-medium text-gray-800">{c.name}</span>
                  <span className={cn("text-[9px] font-semibold px-1 py-0.5 rounded", tierBadge(c.tier))}>{c.tier}</span>
                  {c.enrolledPerYear !== undefined && (
                    <span className="text-[9px] text-gray-400">~{c.enrolledPerYear}/yr</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

interface WhiteSpaceListProps {
  names: string[];
  note?: string;
}

function WhiteSpaceList({ names, note }: WhiteSpaceListProps) {
  if (names.length === 0) {
    return (
      <div className="text-sm text-gray-400 italic">
        All major US universities are already recruiting here. No meaningful white space.
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {note && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2 text-xs text-emerald-800 leading-relaxed">
          {note}
        </div>
      )}
      <div className="flex flex-wrap gap-1.5">
        {names.map(n => (
          <span key={n} className="flex items-center gap-1 text-xs bg-emerald-50 border border-emerald-200 text-emerald-800 font-medium px-2 py-0.5 rounded-full">
            <CheckCircle2 className="w-2.5 h-2.5" /> {n}
          </span>
        ))}
      </div>
    </div>
  );
}

// Custom tooltip for the comparison bar chart
interface ChartPayload {
  payload: { province: string; whiteSpace: number; competitors: number };
  value: number;
}

function ComparisonTooltip({ active, payload }: { active?: boolean; payload?: ChartPayload[] }) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-lg px-3 py-2 text-xs">
      <div className="font-semibold text-gray-800 mb-1">{d.province}</div>
      <div className="text-emerald-700">White Space: {d.whiteSpace}/100</div>
      <div className="text-gray-500">US unis recruiting: {d.competitors}</div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

interface Props {
  provinceName: string;
  score: number;
  countryIso?: string;
}

export default function CompetitiveIntelPanel({ provinceName, score, countryIso }: Props) {
  const data = PROVINCE_DATA[provinceName] ?? getDefaultData(score, countryIso);
  const ws = data.whiteSpaceScore;
  // Build the comparison chart from THIS corridor's own regions (live scores),
  // so an India region is compared against Indian regions — not Chinese ones.
  const corridorRows = scoresFor(countryIso || "");
  let chartData;
  if (corridorRows.length) {
    const all = corridorRows.map(rr => ({
      province: rr.target_entity_name,
      whiteSpace: rr.score,
      competitors: Math.max(5, Math.round(Math.pow(100 - rr.score, 1.6) / 5)),
      isActive: rr.target_entity_name === provinceName,
    }));
    chartData = all.slice(0, 8);
    if (!chartData.some(x => x.isActive)) {
      const act = all.find(x => x.isActive);
      if (act) chartData = [...all.slice(0, 7), act];
    }
  } else {
    chartData = COMPARISON_CHART_DATA.map(d => ({ ...d, isActive: d.province === provinceName }));
  }

  return (
    <div className="space-y-5">

      {/* White Space Score */}
      <WhiteSpaceCard score={ws} />

      {/* Opportunity callout */}
      <div className="bg-navy-900 rounded-xl px-4 py-3 text-white">
        <div className="flex items-center gap-2 mb-1.5">
          <Telescope className="w-4 h-4 text-gold-400" />
          <span className="text-xs font-bold uppercase tracking-wider text-gold-400">Your Opportunity</span>
        </div>
        <p className="text-sm leading-relaxed">
          Only{" "}
          <span className="font-bold text-gold-400">{data.totalUSUnisRecruiting}</span> US universities
          are actively recruiting in {provinceName} vs.{" "}
          <span className="font-bold">{data.saturatedComparatorCount}</span> in {data.saturatedComparatorName}.
          {data.monthsBeforeSaturation > 0 && (
            <>
              {" "}You have an estimated{" "}
              <span className="font-bold text-emerald-400">{data.monthsBeforeSaturation}-month window</span>{" "}
              before this market becomes as saturated as {data.saturatedComparatorName}.
            </>
          )}
          {data.monthsBeforeSaturation === 0 && (
            <> This market is already saturated — marginal ROI is very low.</>
          )}
        </p>
      </div>

      {/* White space comparison bar chart */}
      <div>
        <h3 className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-3 flex items-center gap-1.5">
          <Target className="w-3.5 h-3.5" />
          White Space Score vs. Key Provinces
        </h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 0, right: 30, bottom: 0, left: 60 }}
            barCategoryGap="25%"
          >
            <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 10, fill: "#9ca3af" }} tickLine={false} axisLine={false} />
            <YAxis type="category" dataKey="province" tick={{ fontSize: 11, fill: "#374151" }} tickLine={false} axisLine={false} width={58} />
            <Tooltip content={<ComparisonTooltip />} cursor={{ fill: "#f9fafb" }} />
            <Bar dataKey="whiteSpace" radius={[0, 4, 4, 0]}>
              {chartData.map((entry, index) => (
                <Cell
                  key={index}
                  fill={
                    entry.isActive
                      ? "#1e2d5e"
                      : entry.whiteSpace > 60
                      ? "#6ee7b7"
                      : entry.whiteSpace >= 40
                      ? "#fcd34d"
                      : "#fca5a5"
                  }
                  opacity={entry.isActive ? 1 : 0.7}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        <div className="flex items-center gap-4 mt-1 justify-center text-[10px] text-gray-400">
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-emerald-300 inline-block" /> High opportunity (&gt;60)</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-amber-300 inline-block" /> Moderate (40-60)</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-red-300 inline-block" /> Saturated (&lt;40)</span>
        </div>
      </div>

      {/* Who's already here */}
      <div>
        <h3 className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-3 flex items-center gap-1.5">
          <ShieldAlert className="w-3.5 h-3.5" />
          Who&apos;s Already Recruiting Here ({data.competitors.length} universities)
        </h3>
        {data.competitors.length === 0 ? (
          <div className="text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2">
            No known US university competitors — true first-mover opportunity.
          </div>
        ) : (
          <CompetitorList competitors={data.competitors} />
        )}
      </div>

      {/* White space — who's NOT here */}
      <div>
        <h3 className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          White Space — Who&apos;s NOT Here
        </h3>
        <WhiteSpaceList names={data.notPresent} note={data.notPresentNote} />
      </div>

      {/* Risk note for saturated markets */}
      {ws < 20 && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
          <p className="text-xs text-red-700 leading-relaxed">
            <strong>Highly saturated market.</strong> With {data.totalUSUnisRecruiting} US universities already recruiting here, your marginal ROI will be very low. Redirect budget to higher white-space provinces for better yield.
          </p>
        </div>
      )}

    </div>
  );
}


export function getCompetitive(provinceName: string) { return PROVINCE_DATA[provinceName] || null; }
