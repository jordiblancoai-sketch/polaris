"use client";
import { cn } from "@/lib/utils";
import { Calendar, AlertTriangle, Star, Clock, DollarSign, Users, Zap } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  ReferenceLine,
} from "recharts";

// ─── Data types ───────────────────────────────────────────────────────────────

type MonthLabel = "PEAK" | "GOOD" | "NEUTRAL" | "AVOID";

interface MonthData {
  month: string;       // "Jan", "Feb", ...
  monthFull: string;
  score: number;
  label: MonthLabel;
  keyEvents: string[];
}

interface SchoolFair {
  name: string;
  province: string;
  month: string;
  durationDays: number;
  usUniversitiesTypical: number;
  costUSD: number;
  qualityScore: number;
  bookNowUrgent: boolean;
}

// ─── 12-month data (China → US, universal) ───────────────────────────────────

const MONTH_DATA: MonthData[] = [
  { month: "Jan", monthFull: "January",   score: 35, label: "NEUTRAL", keyEvents: ["US Regular Decision deadlines Jan 1–15", "Families reviewing offers received"] },
  { month: "Feb", monthFull: "February",  score: 25, label: "AVOID",   keyEvents: ["Spring Festival — families unavailable", "Travel disruption, all business paused"] },
  { month: "Mar", monthFull: "March",     score: 55, label: "GOOD",    keyEvents: ["US admissions decisions releasing (Mar–Apr)", "Deposit planning conversations start"] },
  { month: "Apr", monthFull: "April",     score: 72, label: "GOOD",    keyEvents: ["May 1 deposit deadline approaching", "Families finalizing school decisions"] },
  { month: "May", monthFull: "May",       score: 68, label: "GOOD",    keyEvents: ["May 1 deposit deadline", "Grad confirmations, next-cycle family prep"] },
  { month: "Jun", monthFull: "June",      score: 20, label: "AVOID",   keyEvents: ["GAOKAO June 7–8 — students unavailable", "High family stress, no recruitment engagement"] },
  { month: "Jul", monthFull: "July",      score: 45, label: "NEUTRAL", keyEvents: ["Gaokao results released", "Next-cycle applications begin to open"] },
  { month: "Aug", monthFull: "August",    score: 62, label: "GOOD",    keyEvents: ["Applications opening (EA/ED Sep–Oct)", "Summer family discussions, building lists"] },
  { month: "Sep", monthFull: "September", score: 75, label: "GOOD",    keyEvents: ["New academic year begins", "IELTS/TOEFL peak testing season"] },
  { month: "Oct", monthFull: "October",   score: 95, label: "PEAK",    keyEvents: ["School fair circuit in full swing", "ED1 deadline approaching (Nov 1)", "IDEAL visit window — maximum engagement"] },
  { month: "Nov", monthFull: "November",  score: 92, label: "PEAK",    keyEvents: ["ED1 deadline Nov 1", "School fairs continue", "Highest family readiness of the year"] },
  { month: "Dec", monthFull: "December",  score: 48, label: "NEUTRAL", keyEvents: ["Holiday season", "Applications being finalized", "RD deadline prep (Jan 1)"] },
];

const MONTH_DATA_JPN: MonthData[] = [
  { month: "Jan", monthFull: "January",   score: 30, label: "AVOID",   keyEvents: ["University entrance-exam season — families fully occupied"] },
  { month: "Feb", monthFull: "February",  score: 26, label: "AVOID",   keyEvents: ["National Center Test & private exams — avoid entirely"] },
  { month: "Mar", monthFull: "March",     score: 48, label: "NEUTRAL", keyEvents: ["Graduation season", "Spring-break study-abroad planning"] },
  { month: "Apr", monthFull: "April",     score: 55, label: "GOOD",    keyEvents: ["New school year begins (April intake)", "Fresh student cohort"] },
  { month: "May", monthFull: "May",       score: 52, label: "GOOD",    keyEvents: ["Post-Golden-Week", "Students settled into new year"] },
  { month: "Jun", monthFull: "June",      score: 58, label: "GOOD",    keyEvents: ["Study-abroad interest building", "Open-campus season starts"] },
  { month: "Jul", monthFull: "July",      score: 62, label: "GOOD",    keyEvents: ["Summer programs", "Open campus & info sessions"] },
  { month: "Aug", monthFull: "August",    score: 60, label: "GOOD",    keyEvents: ["Summer break — family discussions about overseas study"] },
  { month: "Sep", monthFull: "September", score: 85, label: "PEAK",    keyEvents: ["Autumn study-abroad fair season begins", "Peak engagement window"] },
  { month: "Oct", monthFull: "October",   score: 92, label: "PEAK",    keyEvents: ["Fair circuit in full swing", "US EA/ED application season"] },
  { month: "Nov", monthFull: "November",  score: 78, label: "PEAK",    keyEvents: ["Fairs continue", "EA/ED deadlines approaching"] },
  { month: "Dec", monthFull: "December",  score: 40, label: "NEUTRAL", keyEvents: ["Year-end", "Entrance-exam prep ramps up"] },
];

const MONTH_DATA_SGP: MonthData[] = [
  { month: "Jan", monthFull: "January",   score: 95, label: "PEAK",    keyEvents: ["A-level results released — peak decision window", "Students choosing destinations now"] },
  { month: "Feb", monthFull: "February",  score: 70, label: "GOOD",    keyEvents: ["New academic year", "University course planning"] },
  { month: "Mar", monthFull: "March",     score: 78, label: "PEAK",    keyEvents: ["Singapore education fair season (SIES)", "Strong fair attendance"] },
  { month: "Apr", monthFull: "April",     score: 60, label: "GOOD",    keyEvents: ["Term settled", "Counsellor engagement"] },
  { month: "May", monthFull: "May",       score: 55, label: "GOOD",    keyEvents: ["Mid-year preparation"] },
  { month: "Jun", monthFull: "June",      score: 60, label: "GOOD",    keyEvents: ["June holidays — family discussions"] },
  { month: "Jul", monthFull: "July",      score: 62, label: "GOOD",    keyEvents: ["Open houses", "Applications opening"] },
  { month: "Aug", monthFull: "August",    score: 64, label: "GOOD",    keyEvents: ["US application season ramps up"] },
  { month: "Sep", monthFull: "September", score: 66, label: "GOOD",    keyEvents: ["EA/ED prep", "Strong counsellor access"] },
  { month: "Oct", monthFull: "October",   score: 42, label: "NEUTRAL", keyEvents: ["A-level exams approaching — engagement drops"] },
  { month: "Nov", monthFull: "November",  score: 25, label: "AVOID",   keyEvents: ["A-level examinations — students unavailable, avoid"] },
  { month: "Dec", monthFull: "December",  score: 50, label: "GOOD",    keyEvents: ["Post-exam period", "Holiday-season planning"] },
];

const MONTHS_BY_ISO: Record<string, MonthData[]> = { CHN: MONTH_DATA, JPN: MONTH_DATA_JPN, SGP: MONTH_DATA_SGP };
function monthsFor(iso?: string): MonthData[] { return MONTHS_BY_ISO[iso || "CHN"] || MONTH_DATA; }

// ─── School fairs data ────────────────────────────────────────────────────────

// "Book now urgent" = fair is within ~90 days of June 2026 (so roughly Sep–Aug 2026)
// October fairs are ~4 months away — flagged as urgent because 45-day lead time needed
const SCHOOL_FAIRS: SchoolFair[] = [
  {
    name: "Beijing Education Expo",
    province: "Beijing",
    month: "October",
    durationDays: 3,
    usUniversitiesTypical: 120,
    costUSD: 3500,
    qualityScore: 85,
    bookNowUrgent: true,
  },
  {
    name: "Shanghai International Education Fair",
    province: "Shanghai",
    month: "November",
    durationDays: 3,
    usUniversitiesTypical: 110,
    costUSD: 4200,
    qualityScore: 82,
    bookNowUrgent: true,
  },
  {
    name: "Guangzhou International Education Fair",
    province: "Guangdong",
    month: "October",
    durationDays: 2,
    usUniversitiesTypical: 90,
    costUSD: 2800,
    qualityScore: 78,
    bookNowUrgent: true,
  },
  {
    name: "Shenzhen International School Fair",
    province: "Guangdong",
    month: "October–November",
    durationDays: 2,
    usUniversitiesTypical: 35,
    costUSD: 2000,
    qualityScore: 72,
    bookNowUrgent: true,
  },
  {
    name: "Hangzhou International School Fair",
    province: "Zhejiang",
    month: "October",
    durationDays: 2,
    usUniversitiesTypical: 45,
    costUSD: 1800,
    qualityScore: 76,
    bookNowUrgent: true,
  },
  {
    name: "Nanjing Education Expo",
    province: "Jiangsu",
    month: "November",
    durationDays: 2,
    usUniversitiesTypical: 40,
    costUSD: 1600,
    qualityScore: 74,
    bookNowUrgent: true,
  },
  {
    name: "Wuhan Education Expo",
    province: "Hubei",
    month: "November",
    durationDays: 2,
    usUniversitiesTypical: 25,
    costUSD: 1200,
    qualityScore: 71,
    bookNowUrgent: true,
  },
  {
    name: "Chengdu International Education Expo",
    province: "Sichuan",
    month: "October",
    durationDays: 2,
    usUniversitiesTypical: 30,
    costUSD: 1500,
    qualityScore: 74,
    bookNowUrgent: true,
  },
  {
    name: "Xi'an International Education Fair",
    province: "Shaanxi",
    month: "November",
    durationDays: 2,
    usUniversitiesTypical: 20,
    costUSD: 1100,
    qualityScore: 68,
    bookNowUrgent: true,
  },

  {
    name: "Tokyo Study Abroad Expo", province: "Tokyo", month: "October",
    durationDays: 2, usUniversitiesTypical: 80, costUSD: 3000, qualityScore: 82, bookNowUrgent: true,
  },
  {
    name: "Kansai International Education Fair", province: "Osaka", month: "September",
    durationDays: 2, usUniversitiesTypical: 50, costUSD: 2200, qualityScore: 78, bookNowUrgent: true,
  },
  {
    name: "Singapore Education Fair", province: "Central Region", month: "October",
    durationDays: 2, usUniversitiesTypical: 80, costUSD: 3500, qualityScore: 85, bookNowUrgent: true,
  },
  {
    name: "SIES — Singapore Intl Education Showcase", province: "Central Region", month: "March",
    durationDays: 2, usUniversitiesTypical: 60, costUSD: 3000, qualityScore: 80, bookNowUrgent: false,
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function monthScoreColor(score: number): string {
  if (score >= 75) return "bg-emerald-500";
  if (score >= 50) return "bg-amber-400";
  if (score >= 35) return "bg-gray-400";
  return "bg-red-400";
}

function monthCardBg(label: MonthLabel): string {
  if (label === "PEAK")    return "bg-emerald-950 border-emerald-700";
  if (label === "GOOD")    return "bg-white border-gray-200";
  if (label === "NEUTRAL") return "bg-gray-50 border-gray-200";
  return "bg-red-950 border-red-800";
}

function monthScoreText(score: number): string {
  if (score >= 75) return "text-emerald-600";
  if (score >= 50) return "text-amber-600";
  if (score >= 35) return "text-gray-500";
  return "text-red-600";
}

function labelBadgeClass(label: MonthLabel): string {
  if (label === "PEAK")    return "bg-emerald-500 text-white";
  if (label === "GOOD")    return "bg-amber-100 text-amber-700";
  if (label === "NEUTRAL") return "bg-gray-100 text-gray-500";
  return "bg-red-500 text-white";
}

function monthNameText(label: MonthLabel): string {
  if (label === "PEAK")    return "text-emerald-300";
  if (label === "AVOID")   return "text-red-300";
  return "text-gray-700";
}

function getFairsForProvince(provinceName: string): SchoolFair[] {
  return SCHOOL_FAIRS.filter(f => f.province === provinceName);
}

function getNearestFair(provinceName: string): SchoolFair | null {
  // Fallback: suggest a regional fair if none for this province
  const nearby: Record<string, SchoolFair> = {
    Hunan:    SCHOOL_FAIRS.find(f => f.province === "Hubei")!,
    Henan:    SCHOOL_FAIRS.find(f => f.name === "Nanjing Education Expo")!,
    Jiangxi:  SCHOOL_FAIRS.find(f => f.name === "Nanjing Education Expo")!,
    Anhui:    SCHOOL_FAIRS.find(f => f.name === "Nanjing Education Expo")!,
    Tianjin:  SCHOOL_FAIRS.find(f => f.province === "Beijing")!,
    Hebei:    SCHOOL_FAIRS.find(f => f.province === "Beijing")!,
    Shandong: SCHOOL_FAIRS.find(f => f.name === "Nanjing Education Expo")!,
    // Japan
    Kyoto:    SCHOOL_FAIRS.find(f => f.province === "Osaka")!,
    Fukuoka:  SCHOOL_FAIRS.find(f => f.province === "Tokyo")!,
    Aichi:    SCHOOL_FAIRS.find(f => f.province === "Tokyo")!,
    Hokkaido: SCHOOL_FAIRS.find(f => f.province === "Tokyo")!,
    // Singapore (all regions share the national fairs in Central Region)
    "East Region":       SCHOOL_FAIRS.find(f => f.province === "Central Region")!,
    "West Region":       SCHOOL_FAIRS.find(f => f.province === "Central Region")!,
    "North Region":      SCHOOL_FAIRS.find(f => f.province === "Central Region")!,
    "North-East Region": SCHOOL_FAIRS.find(f => f.province === "Central Region")!,
  };
  return nearby[provinceName] ?? null;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

interface MonthCardProps {
  data: MonthData;
  compact?: boolean;
}

function MonthCard({ data, compact = false }: MonthCardProps) {
  const isPeak = data.label === "PEAK";
  const isAvoid = data.label === "AVOID";

  return (
    <div
      className={cn(
        "rounded-xl border p-2.5 flex flex-col gap-1.5 relative overflow-hidden transition-transform hover:scale-[1.02]",
        monthCardBg(data.label),
        isPeak && "ring-2 ring-emerald-500 ring-offset-1 shadow-lg"
      )}
    >
      {/* Peak glow effect */}
      {isPeak && (
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/30 to-transparent pointer-events-none" />
      )}

      <div className="flex items-center justify-between">
        <span className={cn("text-xs font-bold", isPeak || isAvoid ? monthNameText(data.label) : "text-gray-700")}>
          {data.month}
        </span>
        <span className={cn("text-[9px] font-bold px-1.5 py-0.5 rounded-full", labelBadgeClass(data.label))}>
          {data.label}
        </span>
      </div>

      {/* Score circle */}
      <div className="flex items-center gap-1.5">
        <div
          className={cn("w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs shrink-0", monthScoreColor(data.score))}
        >
          {data.score}
        </div>
        <div className="flex-1">
          <div className="h-1.5 bg-black/10 rounded-full overflow-hidden">
            <div
              className={cn("h-full rounded-full transition-all duration-700", monthScoreColor(data.score))}
              style={{ width: `${data.score}%` }}
            />
          </div>
        </div>
      </div>

      {!compact && (
        <ul className="space-y-0.5">
          {data.keyEvents.slice(0, 2).map((ev, i) => (
            <li
              key={i}
              className={cn(
                "text-[9px] leading-tight",
                isPeak ? "text-emerald-300" : isAvoid ? "text-red-300" : "text-gray-400"
              )}
            >
              • {ev}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

interface BestWindowCalloutProps {
  provinceName: string;
  months?: MonthData[];
}

function BestWindowCallout({ provinceName, months }: BestWindowCalloutProps) {
  const peaks = (months || MONTH_DATA).filter(m => m.label === "PEAK").sort((a, b) => b.score - a.score);
  const top = peaks[0];
  const second = peaks[1];

  return (
    <div className="bg-emerald-950 border border-emerald-700 rounded-xl p-4 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full -translate-y-8 translate-x-8 pointer-events-none" />
      <div className="flex items-center gap-2 mb-2">
        <Star className="w-4 h-4 text-gold-400 fill-gold-400" />
        <span className="text-xs font-bold text-gold-400 uppercase tracking-wider">Best Visit Windows for {provinceName}</span>
      </div>
      <p className="text-sm text-emerald-100 leading-relaxed">
        Best months:{" "}
        <span className="font-bold text-white">{top.monthFull} ({top.score})</span>,{" "}
        <span className="font-bold text-white">{second.monthFull} ({second.score})</span>.
        Start planning <span className="font-bold text-gold-400">NOW</span> — lead time is{" "}
        <span className="font-bold text-white">45 days</span> minimum.
      </p>
      <div className="mt-2.5 flex items-center gap-2 text-xs text-emerald-400">
        <Clock className="w-3.5 h-3.5" />
        <span>Book school visits, fairs, and alumni events by <strong className="text-white">September 1</strong> for October windows.</span>
      </div>
    </div>
  );
}

interface SchoolFairCardProps {
  fair: SchoolFair;
  isNearby?: boolean;
}

function SchoolFairCard({ fair, isNearby = false }: SchoolFairCardProps) {
  const isLowCompetition = fair.usUniversitiesTypical <= 35;

  return (
    <div className={cn(
      "rounded-xl border p-3.5 bg-white space-y-2",
      fair.bookNowUrgent ? "border-gold-400/60" : "border-gray-200",
      isNearby && "border-dashed"
    )}>
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-semibold text-gray-900">{fair.name}</span>
            {fair.bookNowUrgent && (
              <span className="text-[10px] bg-gold-500 text-navy-900 font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                <Zap className="w-2.5 h-2.5" /> Book Now
              </span>
            )}
            {isNearby && (
              <span className="text-[10px] bg-blue-100 text-blue-700 border border-blue-200 font-medium px-2 py-0.5 rounded-full">
                Nearest regional fair
              </span>
            )}
          </div>
          <div className="text-xs text-gray-400 mt-0.5 flex items-center gap-2">
            <Calendar className="w-3 h-3" />
            {fair.month} · {fair.durationDays} days · {fair.province}
          </div>
        </div>
        <div className="text-right shrink-0">
          <div className="text-sm font-bold text-gray-800">${fair.costUSD.toLocaleString()}</div>
          <div className="text-[10px] text-gray-400">est. cost</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {/* US unis count */}
        <div className={cn(
          "rounded-lg border px-2.5 py-1.5",
          isLowCompetition ? "bg-emerald-50 border-emerald-200" : "bg-gray-50 border-gray-200"
        )}>
          <div className="flex items-center gap-1 mb-0.5">
            <Users className="w-3 h-3 text-gray-400" />
            <span className="text-[10px] text-gray-500">US unis attending</span>
          </div>
          <div className={cn("text-lg font-bold tabular-nums", isLowCompetition ? "text-emerald-700" : "text-gray-700")}>
            {fair.usUniversitiesTypical}
          </div>
          {isLowCompetition && (
            <div className="text-[9px] text-emerald-600 font-medium">Low competition — stand out!</div>
          )}
        </div>

        {/* Quality score */}
        <div className="rounded-lg border border-gray-200 bg-gray-50 px-2.5 py-1.5">
          <div className="flex items-center gap-1 mb-1">
            <Star className="w-3 h-3 text-gray-400" />
            <span className="text-[10px] text-gray-500">Quality score</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-lg font-bold tabular-nums text-gray-700">{fair.qualityScore}</span>
            <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-navy-600 transition-all duration-700"
                style={{ width: `${fair.qualityScore}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1.5 text-[10px] text-gray-500">
        <DollarSign className="w-3 h-3" />
        <span>~${Math.round(fair.costUSD / Math.max(1, fair.usUniversitiesTypical / 10))} per qualified lead estimate · {fair.durationDays}-day commitment</span>
      </div>
    </div>
  );
}

interface HeatmapChartProps {
  data: MonthData[];
}

function HeatmapChart({ data }: HeatmapChartProps) {
  return (
    <ResponsiveContainer width="100%" height={140}>
      <BarChart data={data} margin={{ top: 5, right: 5, bottom: 5, left: -20 }} barCategoryGap="12%">
        <XAxis
          dataKey="month"
          tick={{ fontSize: 10, fill: "#6b7280" }}
          tickLine={false}
          axisLine={false}
        />
        <YAxis domain={[0, 100]} tick={{ fontSize: 9, fill: "#d1d5db" }} tickLine={false} axisLine={false} />
        <Tooltip
          content={({ active, payload }) => {
            if (!active || !payload?.length) return null;
            const d = payload[0].payload as MonthData;
            return (
              <div className="bg-white border border-gray-200 rounded-lg shadow-lg px-3 py-2 text-xs max-w-[180px]">
                <div className="font-semibold text-gray-900 mb-1">{d.monthFull} — {d.score}/100</div>
                <div className={cn("text-[10px] font-bold mb-1", labelBadgeClass(d.label).includes("emerald") ? "text-emerald-600" : d.label === "AVOID" ? "text-red-600" : "text-amber-600")}>
                  {d.label}
                </div>
                {d.keyEvents.map((ev, i) => (
                  <div key={i} className="text-[10px] text-gray-500">• {ev}</div>
                ))}
              </div>
            );
          }}
          cursor={{ fill: "#f9fafb" }}
        />
        <ReferenceLine y={75} stroke="#6ee7b7" strokeDasharray="3 3" strokeWidth={1} />
        <Bar dataKey="score" radius={[3, 3, 0, 0]}>
          {data.map((entry, index) => (
            <Cell
              key={index}
              fill={
                entry.label === "PEAK"    ? "#10b981" :
                entry.label === "GOOD"    ? "#f59e0b" :
                entry.label === "AVOID"   ? "#ef4444" :
                                            "#9ca3af"
              }
              opacity={entry.label === "PEAK" ? 1 : entry.label === "AVOID" ? 0.6 : 0.75}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

interface Props {
  provinceName: string;
  score: number;
  iso?: string;
  corridorName?: string;
}

export default function TimingHeatmap({ provinceName, score: _score, iso, corridorName }: Props) {
  const months = monthsFor(iso);
  const localFairs = getFairsForProvince(provinceName);
  const nearbyFair = localFairs.length === 0 ? getNearestFair(provinceName) : null;
  const avoidMonths = months.filter(m => m.label === "AVOID");

  return (
    <div className="space-y-5">

      {/* Full bar chart overview */}
      <div>
        <h3 className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1 flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5" />
          12-Month Visit Probability — {corridorName || "China"} Corridor
        </h3>
        <div className="text-[10px] text-gray-400 mb-2 flex items-center gap-3">
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-emerald-500 inline-block" /> Peak (&ge;75)</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-amber-400 inline-block" /> Good (50-74)</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-gray-400 inline-block" /> Neutral (35-49)</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-red-400 inline-block" /> Avoid (&lt;35)</span>
        </div>
        <HeatmapChart data={months} />
      </div>

      {/* Best window callout */}
      <BestWindowCallout provinceName={provinceName} months={months} />

      {/* 4×3 month grid */}
      <div>
        <h3 className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2.5">Month-by-Month Breakdown</h3>
        <div className="grid grid-cols-4 gap-2">
          {months.map(m => (
            <MonthCard key={m.month} data={m} />
          ))}
        </div>
      </div>

      {/* School fairs */}
      <div>
        <h3 className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
          <Zap className="w-3.5 h-3.5 text-gold-500" />
          School Fairs
          {localFairs.length > 0
            ? ` in ${provinceName} (${localFairs.length})`
            : " — Nearest Regional Options"}
        </h3>

        {localFairs.length > 0 ? (
          <div className="space-y-3">
            {localFairs.map(fair => (
              <SchoolFairCard key={fair.name} fair={fair} />
            ))}
          </div>
        ) : nearbyFair ? (
          <div className="space-y-3">
            <div className="text-xs text-gray-500 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
              No dedicated local fair for {provinceName}. Nearest regional option:
            </div>
            <SchoolFairCard fair={nearbyFair} isNearby />
          </div>
        ) : (
          <div className="text-xs text-gray-400 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
            No school fairs currently tracked for this province. Consider creating a standalone info session — the low competition means a private event will stand out.
          </div>
        )}
      </div>

      {/* Key dates to avoid */}
      <div>
        <h3 className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
          <AlertTriangle className="w-3.5 h-3.5 text-red-500" />
          Key Dates to Avoid
        </h3>
        <div className="space-y-2">
          {avoidMonths.map(m => (
            <div key={m.month} className="bg-red-50 border border-red-200 rounded-xl px-3 py-2.5 flex items-start gap-2.5">
              <div className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full shrink-0 mt-0.5">{m.month}</div>
              <div>
                {m.keyEvents.map((ev, i) => (
                  <p key={i} className="text-xs text-red-700">{ev}</p>
                ))}
              </div>
            </div>
          ))}
          <div className="bg-amber-50 border border-amber-200 rounded-xl px-3 py-2.5 flex items-start gap-2.5">
            <div className="bg-amber-400 text-white text-xs font-bold px-2 py-0.5 rounded-full shrink-0 mt-0.5">Jan</div>
            <p className="text-xs text-amber-700">US Regular Decision deadlines Jan 1–15 — families are heads-down on applications, not recruitment visits. Deprioritize.</p>
          </div>
        </div>
      </div>

    </div>
  );
}


export function getTimingMonths(iso?: string) { return monthsFor(iso); }
