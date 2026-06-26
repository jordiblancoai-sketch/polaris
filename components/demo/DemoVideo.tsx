"use client";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { ChinaMap } from "@/components/ChinaMap";
import { JapanMap } from "@/components/JapanMap";
import { SingaporeMap } from "@/components/SingaporeMap";
import { CorridorModal } from "@/components/CorridorModal";

/* ─── Scene data ─────────────────────────────────────────────── */
const CHINA_PROVINCES = [
  { name: "Zhejiang",  score: 82, color: "#059669", x: 72, y: 52 },
  { name: "Jiangsu",   score: 81, color: "#059669", x: 70, y: 46 },
  { name: "Sichuan",   score: 74, color: "#059669", x: 48, y: 54 },
  { name: "Hubei",     score: 73, color: "#059669", x: 62, y: 52 },
  { name: "Hunan",     score: 72, color: "#059669", x: 61, y: 58 },
  { name: "Shaanxi",   score: 71, color: "#059669", x: 54, y: 46 },
  { name: "Shandong",  score: 70, color: "#059669", x: 68, y: 42 },
  { name: "Guangdong", score: 58, color: "#d97706", x: 63, y: 66 },
  { name: "Fujian",    score: 76, color: "#059669", x: 71, y: 60 },
  { name: "Liaoning",  score: 63, color: "#d97706", x: 74, y: 34 },
  { name: "Henan",     score: 47, color: "#d97706", x: 63, y: 47 },
  { name: "Yunnan",    score: 40, color: "#ef4444", x: 49, y: 64 },
  { name: "Beijing",   score: 28, color: "#ef4444", x: 67, y: 36 },
  { name: "Shanghai",  score: 26, color: "#ef4444", x: 74, y: 50 },
  { name: "Xinjiang",  score: 18, color: "#ef4444", x: 22, y: 38 },
  { name: "Tibet",     score: 12, color: "#ef4444", x: 30, y: 56 },
];

const JAPAN_PREFECTURES = [
  { name: "Kyoto",     score: 78, color: "#059669", x: 60, y: 52 },
  { name: "Tokyo",     score: 75, color: "#059669", x: 75, y: 45 },
  { name: "Osaka",     score: 76, color: "#059669", x: 62, y: 55 },
  { name: "Kanagawa",  score: 74, color: "#059669", x: 76, y: 48 },
  { name: "Saitama",   score: 72, color: "#059669", x: 74, y: 42 },
  { name: "Aichi",     score: 70, color: "#059669", x: 68, y: 52 },
  { name: "Fukuoka",   score: 68, color: "#d97706", x: 40, y: 70 },
  { name: "Hiroshima", score: 65, color: "#d97706", x: 52, y: 60 },
  { name: "Nagoya",    score: 62, color: "#d97706", x: 68, y: 54 },
];

const SINGAPORE_REGIONS = [
  { name: "Central",   score: 88, color: "#059669", x: 50, y: 50 },
  { name: "East",      score: 85, color: "#059669", x: 70, y: 50 },
  { name: "North",     score: 82, color: "#059669", x: 50, y: 30 },
  { name: "West",      score: 80, color: "#059669", x: 30, y: 50 },
  { name: "Northeast", score: 79, color: "#d97706", x: 65, y: 30 },
];

function getCorridorData(corridor: string) {
  switch(corridor) {
    case "japan":
      return { regions: JAPAN_PREFECTURES, name: "Japan", count: "47 prefectures" };
    case "singapore":
      return { regions: SINGAPORE_REGIONS, name: "Singapore", count: "5 regions" };
    default:
      return { regions: CHINA_PROVINCES, name: "China", count: "31 provinces" };
  }
}

const SCENES = [
  {
    id: "problem",
    duration: 4000,
    title: "The problem universities face",
    subtitle: "They spend $30,000 on a recruiting trip to Beijing and Shanghai — then wonder why yields are flat.",
  },
  {
    id: "map",
    duration: 5000,
    title: "31 Chinese provinces. Scored.",
    subtitle: "Every province ranked by probability of enrollment yield — updated weekly.",
  },
  {
    id: "insight",
    duration: 5000,
    title: "The insight that changes everything",
    subtitle: "Beijing scores 28. Zhejiang scores 82. Same budget. 3× the yield.",
  },
  {
    id: "breakdown",
    duration: 5000,
    title: "Every score is transparent",
    subtitle: "Show your provost exactly why Zhejiang outperforms. No black boxes.",
  },
  {
    id: "corridors",
    duration: 5000,
    title: "Japan and Singapore. Same precision.",
    subtitle: "47 prefectures + 5 regions scored — high-approval markets most US universities ignore.",
  },
  {
    id: "roi",
    duration: 5000,
    title: "The Travel ROI Planner",
    subtitle: "Input your budget. Get the optimal itinerary. See the dollars saved.",
  },
  {
    id: "result",
    duration: 4000,
    title: "Three corridors. Zero guesswork.",
    subtitle: "China, Japan, Singapore — all scored. All transparent. All live.",
  },
];

/* ─── Counter animation ──────────────────────────────────────── */
function Counter({ to, duration = 1500, prefix = "", suffix = "" }: { to: number; duration?: number; prefix?: string; suffix?: string }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    const start = Date.now();
    const tick = () => {
      const p = Math.min(1, (Date.now() - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(eased * to));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [to, duration]);
  return <span>{prefix}{val.toLocaleString()}{suffix}</span>;
}

/* ─── Cursor ─────────────────────────────────────────────────── */
function Cursor({ x, y, clicking }: { x: number; y: number; clicking: boolean }) {
  return (
    <motion.div
      className="pointer-events-none absolute z-50"
      animate={{ left: `${x}%`, top: `${y}%` }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      style={{ left: `${x}%`, top: `${y}%` }}
    >
      <motion.div
        animate={{ scale: clicking ? 0.7 : 1 }}
        transition={{ duration: 0.15 }}
      >
        {/* cursor svg */}
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
          <path d="M4 2L18 11L11 13L8 20L4 2Z" fill="white" stroke="#1e2d5e" strokeWidth="1.5" strokeLinejoin="round" />
        </svg>
      </motion.div>
      {clicking && (
        <motion.div
          className="absolute top-0 left-0 w-8 h-8 rounded-full border-2 border-navy-600 -translate-x-1/4 -translate-y-1/4"
          initial={{ scale: 0.3, opacity: 1 }}
          animate={{ scale: 1.8, opacity: 0 }}
          transition={{ duration: 0.4 }}
        />
      )}
    </motion.div>
  );
}

/* ─── Scene: Problem ─────────────────────────────────────────── */
function SceneProblem({ corridor = "china" }: { corridor?: string }) {
  const problemTrips = {
    china: [
      { emoji: "✈️", label: "Recruiting trip to Beijing", cost: "$28,000", result: "11 enrolled", bad: true },
      { emoji: "🏨", label: "Trip to Shanghai", cost: "$22,000", result: "8 enrolled", bad: true },
    ],
    japan: [
      { emoji: "✈️", label: "Recruiting trip to Tokyo", cost: "$32,000", result: "9 enrolled", bad: true },
      { emoji: "🏨", label: "Trip to Osaka", cost: "$24,000", result: "7 enrolled", bad: true },
    ],
    singapore: [
      { emoji: "✈️", label: "Recruiting trip to Singapore", cost: "$18,000", result: "6 enrolled", bad: true },
      { emoji: "🏨", label: "Follow-up visit", cost: "$12,000", result: "3 enrolled", bad: true },
    ],
  };

  const trips = problemTrips[corridor as keyof typeof problemTrips] || problemTrips.china;

  return (
    <div className="flex flex-col items-center justify-center h-full gap-8 px-16">
      <motion.div className="grid grid-cols-3 gap-5 w-full max-w-2xl"
        initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        {[...trips,
          { emoji: "❓", label: "Next cycle plan", cost: "???", result: "Same strategy", bad: true },
        ].map((item, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 + i * 0.3 }}
            className="bg-white/10 border border-white/20 rounded-xl p-4 text-center">
            <div className="text-3xl mb-2">{item.emoji}</div>
            <div className="text-white/80 text-xs mb-2">{item.label}</div>
            <div className="text-white font-bold text-lg">{item.cost}</div>
            <div className={cn("text-xs mt-1", item.bad ? "text-red-300" : "text-emerald-300")}>{item.result}</div>
          </motion.div>
        ))}
      </motion.div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}
        className="bg-red-500/20 border border-red-400/40 rounded-xl px-6 py-3 text-red-200 text-sm text-center">
        💸 $50,000 spent on guesswork. Zero data. Zero targeting.
      </motion.div>
    </div>
  );
}

/* ─── Scene: Map ─────────────────────────────────────────────── */
function SceneMap({ progress: _progress, corridor = "china" }: { progress: number; corridor?: string }) {
  const mapLabels = {
    china: "🇨🇳 China → 🇺🇸 United States",
    japan: "🇯🇵 Japan → 🇺🇸 United States",
    singapore: "🇸🇬 Singapore → 🇺🇸 United States",
  };

  return (
    <div className="h-full p-4">
      {/* Map visualization - real interactive map per corridor */}
      <div className="relative h-full rounded-2xl overflow-hidden border border-white/10 bg-navy-900 flex items-center justify-center">
        {corridor === "japan" ? (
          <JapanMap />
        ) : corridor === "singapore" ? (
          <SingaporeMap />
        ) : (
          <ChinaMap />
        )}
        <div className="absolute bottom-3 right-3 text-white/50 text-xs bg-navy-900/70 rounded px-2 py-1">{mapLabels[corridor as keyof typeof mapLabels] || mapLabels.china}</div>
      </div>
    </div>
  );
}

/* ─── Scene: Corridors (Japan + Singapore) ───────────────────── */
function SceneCorridors() {
  const [selectedCorridor, setSelectedCorridor] = useState<any>(null);

  const cards = [
    { flag: "🇯🇵", name: "Japan", city: "Tokyo", country: "Japan", regions: "47 prefectures", visa: "95% F-1 approval", top: "Kyoto", score: 78,
      note: "Autumn fair season = peak. Jan–Feb entrance exams = avoid.", color: "#10b981", img: "https://images.unsplash.com/photo-1522383150241-a0aae5d0b0d6?w=800&h=600&fit=crop" },
    { flag: "🇸🇬", name: "Singapore", city: "Singapore", country: "Singapore", regions: "5 regions", visa: "97% F-1 approval", top: "Central", score: 88,
      note: "January A-level results = decision window. Income is no barrier.", color: "#059669", img: "https://images.unsplash.com/photo-1512453475869-a46b16470a0e?w=800&h=600&fit=crop" },
    { flag: "🇹🇭", name: "Thailand", city: "Bangkok", country: "Thailand", regions: "8 provinces", visa: "88% F-1 approval", top: "Bangkok", score: 75,
      note: "Growing market. International schools producing strong candidates. Peak season: May–June.", color: "#0891b2", img: "https://images.unsplash.com/photo-1494649049569-3ac54efd2083?w=800&h=600&fit=crop" },
  ];

  return (
    <>
      <div className="flex items-center justify-center h-full gap-6 px-12">
        {cards.map((c, i) => (
          <motion.div key={c.name}
            initial={{ opacity: 0, y: 30, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.3 + i * 0.35, type: "spring", stiffness: 200 }}
            onClick={() => setSelectedCorridor({ city: c.city, country: c.country, img: c.img, stat: c.regions, score: `${c.score}/100`, visa: c.visa })}
            className="flex-1 max-w-xs bg-white/5 border border-white/15 rounded-2xl p-6 cursor-pointer hover:border-white/30 hover:bg-white/10 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="text-3xl">{c.flag}</span>
                <div>
                  <div className="text-white font-bold">{c.name} → US</div>
                  <div className="text-white/40 text-[10px]">{c.regions}</div>
                </div>
              </div>
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.9 + i * 0.35, type: "spring" }}
                className="w-12 h-12 rounded-full flex items-center justify-center text-white font-black"
                style={{ backgroundColor: c.color }}>
                {c.score}
              </motion.div>
            </div>
            <div className="text-emerald-300 text-xs font-semibold mb-1">✓ {c.visa}</div>
            <div className="text-white/60 text-xs mb-3">Top region: <span className="text-gold-400 font-bold">{c.top} {c.score}/100</span></div>
            <div className="bg-white/5 rounded-lg px-3 py-2 text-white/50 text-[10px] leading-relaxed">{c.note}</div>
          </motion.div>
        ))}
      </div>
      <CorridorModal
        corridor={selectedCorridor}
        isOpen={!!selectedCorridor}
        onClose={() => setSelectedCorridor(null)}
      />
    </>
  );
}

/* ─── Scene: Insight ─────────────────────────────────────────── */
function SceneInsight({ corridor = "china" }: { corridor?: string }) {
  const insightData = {
    china: {
      regions: [
        { name: "Beijing",  score: 28, color: "#ef4444", note: "95% saturated · 380 competitors · Declining −6% YoY" },
        { name: "Shanghai", score: 26, color: "#ef4444", note: "94% saturated · 360 competitors · Declining −7% YoY" },
        { name: "Zhejiang", score: 82, color: "#059669", note: "68% saturated · 220 competitors · Stable +2% YoY" },
        { name: "Hubei",    score: 73, color: "#059669", note: "48% saturated · 110 competitors · Growing +3% YoY" },
        { name: "Sichuan",  score: 74, color: "#059669", note: "42% saturated · 95 competitors · Growing +4% YoY" },
      ],
      lowRegions: 2,
      comparison: "Beijing/Shanghai"
    },
    japan: {
      regions: [
        { name: "Tokyo",    score: 28, color: "#ef4444", note: "Highly saturated · 450+ competitors · Declining −8% YoY" },
        { name: "Osaka",    score: 32, color: "#ef4444", note: "Very saturated · 380 competitors · Stable +1% YoY" },
        { name: "Kyoto",    score: 78, color: "#059669", note: "Moderate saturation · 120 competitors · Growing +5% YoY" },
        { name: "Kanagawa", score: 74, color: "#059669", note: "Lower saturation · 90 competitors · Growing +6% YoY" },
        { name: "Nagoya",   score: 70, color: "#059669", note: "Untapped · 60 competitors · Growing +7% YoY" },
      ],
      lowRegions: 2,
      comparison: "Tokyo/Osaka"
    },
    singapore: {
      regions: [
        { name: "Central",  score: 88, color: "#059669", note: "Premium market · 80 competitors · Stable +2% YoY" },
        { name: "East",     score: 85, color: "#059669", note: "Strong demand · 75 competitors · Growing +3% YoY" },
        { name: "North",    score: 82, color: "#059669", note: "Growing opportunity · 60 competitors · Growing +4% YoY" },
        { name: "West",     score: 80, color: "#059669", note: "Emerging market · 45 competitors · Growing +5% YoY" },
        { name: "NE",       score: 79, color: "#d97706", note: "Developing · 35 competitors · Growing +6% YoY" },
      ],
      lowRegions: 0,
      comparison: "regional average"
    }
  };

  const data = insightData[corridor as keyof typeof insightData] || insightData.china;

  return (
    <div className="flex gap-6 h-full px-8 py-6 items-center">
      <div className="flex-1 space-y-4">
        {data.regions.map((p, i) => (
          <motion.div key={p.name} initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.25 }}
            className={cn("rounded-xl border p-3", i < data.lowRegions ? "bg-red-500/10 border-red-500/30" : "bg-emerald-500/10 border-emerald-500/30")}>
            <div className="flex items-center gap-3">
              <div className="text-white font-semibold text-sm w-24 shrink-0">{p.name}</div>
              <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                <motion.div className="h-full rounded-full" style={{ backgroundColor: p.color }}
                  initial={{ width: 0 }} animate={{ width: `${p.score}%` }} transition={{ delay: i * 0.25 + 0.3, duration: 0.8 }} />
              </div>
              <div className="font-bold text-sm w-8 text-right" style={{ color: p.color }}>{p.score}</div>
            </div>
            <div className="text-white/40 text-[10px] mt-1 ml-27">{p.note}</div>
          </motion.div>
        ))}
      </div>
      <motion.div className="w-48 text-center" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 1.5 }}>
        <div className="bg-emerald-500/20 border border-emerald-400/40 rounded-2xl p-5">
          <div className="text-emerald-300 text-xs uppercase tracking-wider mb-2">Yield difference</div>
          <div className="text-5xl font-black text-white"><Counter to={3} suffix="×" /></div>
          <div className="text-emerald-300 text-xs mt-2">more students per dollar<br />vs {data.comparison}</div>
        </div>
      </motion.div>
    </div>
  );
}

/* ─── Scene: Score Breakdown ─────────────────────────────────── */
function SceneBreakdown({ corridor = "china" }: { corridor?: string }) {
  const breakdownData = {
    china: {
      region: "Zhejiang Province",
      score: 82,
      factors: [
        { label: "🎯 Market Opportunity",  value: 32, desc: "Only 220 US universities here" },
        { label: "💰 Economic Fit",        value: 85, desc: "$18,200 GDP/capita" },
        { label: "👥 Student Demand",      value: 88, desc: "1.85M students aged 18-24" },
        { label: "✈️  Corridor Viability", value: 66, desc: "66% F-1 visa approval rate" },
        { label: "🎓 Academic Pipeline",   value: 88, desc: "Strong STEM, high completion" },
        { label: "🌊 Migration Propensity",value: 70, desc: "Established US diaspora" },
      ],
      insight: "Strong STEM pipeline, high ability to pay, low saturation from US competitors."
    },
    japan: {
      region: "Kyoto Prefecture",
      score: 78,
      factors: [
        { label: "🎯 Market Opportunity",  value: 42, desc: "260 US universities actively recruiting" },
        { label: "💰 Economic Fit",        value: 82, desc: "$40,200 GDP/capita (highest in region)" },
        { label: "👥 Student Demand",      value: 78, desc: "890k students aged 18-24" },
        { label: "✈️  Corridor Viability", value: 95, desc: "95% F-1 visa approval rate" },
        { label: "🎓 Academic Pipeline",   value: 85, desc: "Excellent English proficiency & STEM" },
        { label: "🌊 Migration Propensity",value: 72, desc: "Growing outbound education trend" },
      ],
      insight: "Premium market with high visa approval and English proficiency. Less saturated than Tokyo."
    },
    singapore: {
      region: "Central Region",
      score: 88,
      factors: [
        { label: "🎯 Market Opportunity",  value: 88, desc: "Strategic regional hub positioning" },
        { label: "💰 Economic Fit",        value: 95, desc: "$65,500 GDP/capita (globally highest)" },
        { label: "👥 Student Demand",      value: 82, desc: "Premium segment, 3.2k students/year" },
        { label: "✈️  Corridor Viability", value: 97, desc: "97% F-1 visa approval rate" },
        { label: "🎓 Academic Pipeline",   value: 92, desc: "World-class education system" },
        { label: "🌊 Migration Propensity",value: 88, desc: "Strong government scholarship ecosystem" },
      ],
      insight: "Highest concentration of affluent families. Premium positioning, quality over quantity."
    }
  };

  const data = breakdownData[corridor as keyof typeof breakdownData] || breakdownData.china;

  return (
    <div className="flex gap-6 h-full px-8 py-6 items-center">
      <div className="flex-1 space-y-3">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className="text-white/60 text-xs uppercase tracking-wider mb-4">
          {data.region} · Score breakdown
        </motion.div>
        {data.factors.map((f, i) => (
          <motion.div key={f.label} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.15 }}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-white/80 text-xs">{f.label}</span>
              <span className={cn("text-xs font-bold", f.value >= 70 ? "text-emerald-400" : f.value >= 50 ? "text-amber-400" : "text-red-400")}>{f.value}/100</span>
            </div>
            <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
              <motion.div className={cn("h-full rounded-full", f.value >= 70 ? "bg-emerald-500" : f.value >= 50 ? "bg-amber-400" : "bg-red-500")}
                initial={{ width: 0 }} animate={{ width: `${f.value}%` }} transition={{ delay: i * 0.15 + 0.2, duration: 0.7 }} />
            </div>
            <div className="text-white/30 text-[9px] mt-0.5">{f.desc}</div>
          </motion.div>
        ))}
      </div>
      <motion.div className="w-44" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}>
        <div className="bg-white/10 border border-white/20 rounded-2xl p-4 text-center">
          <div className="text-white/60 text-[10px] uppercase tracking-wider mb-1">Overall Score</div>
          <div className="text-5xl font-black text-emerald-400"><Counter to={data.score} /></div>
          <div className="text-white/40 text-[10px] mt-1">High confidence</div>
          <div className="mt-3 bg-emerald-500/20 rounded-lg px-3 py-2 text-emerald-300 text-[10px]">
            💡 {data.insight}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

/* ─── Scene: ROI Planner ─────────────────────────────────────── */
function SceneROI({ corridor = "china" }: { corridor?: string }) {
  const [step, setStep] = useState(0);
  useEffect(() => {
    const t1 = setTimeout(() => setStep(1), 800);
    const t2 = setTimeout(() => setStep(2), 1800);
    const t3 = setTimeout(() => setStep(3), 2800);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  const roiData = {
    china: [
      { name: "Hangzhou",   score: 82, days: 2, enrolled: 8.4, cost: 3100 },
      { name: "Nanjing",    score: 81, days: 2, enrolled: 7.8, cost: 2800 },
      { name: "Wuhan",      score: 73, days: 3, enrolled: 6.8, cost: 3200 },
      { name: "Chengdu",    score: 74, days: 3, enrolled: 7.2, cost: 3400 },
    ],
    japan: [
      { name: "Kyoto",      score: 78, days: 2, enrolled: 7.2, cost: 2900 },
      { name: "Kanagawa",   score: 74, days: 2, enrolled: 6.8, cost: 2700 },
      { name: "Aichi",      score: 70, days: 3, enrolled: 5.6, cost: 3100 },
      { name: "Nagoya",     score: 70, days: 2, enrolled: 5.4, cost: 2800 },
    ],
    singapore: [
      { name: "Central",    score: 88, days: 2, enrolled: 9.2, cost: 2400 },
      { name: "East",       score: 85, days: 2, enrolled: 8.4, cost: 2200 },
      { name: "North",      score: 82, days: 1, enrolled: 5.6, cost: 1500 },
      { name: "West",       score: 80, days: 1, enrolled: 5.0, cost: 1400 },
    ]
  };

  const cities = roiData[corridor as keyof typeof roiData] || roiData.china;

  return (
    <div className="flex gap-6 h-full px-8 py-6">
      {/* Input */}
      <div className="w-52 flex flex-col gap-3 justify-center">
        {[
          { label: "Budget", value: "$15,000", active: step >= 1 },
          { label: "Duration", value: "10 days", active: step >= 1 },
          { label: "Target", value: "25 enrollments", active: step >= 1 },
          { label: "Program", value: "Graduate", active: step >= 1 },
        ].map((f, i) => (
          <motion.div key={f.label} initial={{ opacity: 0 }} animate={{ opacity: f.active ? 1 : 0.3 }}
            className="bg-white/10 border border-white/20 rounded-lg px-3 py-2">
            <div className="text-white/40 text-[10px]">{f.label}</div>
            <div className="text-white font-medium text-sm">{f.value}</div>
          </motion.div>
        ))}
        <motion.button initial={{ opacity: 0 }} animate={{ opacity: step >= 1 ? 1 : 0 }}
          className="bg-emerald-500 text-white text-xs font-bold py-2 rounded-lg">
          ✨ Optimize Itinerary
        </motion.button>
      </div>

      {/* Results */}
      <div className="flex-1 space-y-2">
        <AnimatePresence>
          {step >= 2 && cities.map((c, i) => (
            <motion.div key={c.name} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.2 }}
              className="bg-white/10 border border-white/20 rounded-xl p-3 flex items-center gap-3">
              <div className="w-7 h-7 rounded-full bg-navy-900 text-white text-xs font-bold flex items-center justify-center shrink-0">{i+1}</div>
              <div className="flex-1">
                <div className="text-white font-semibold text-sm">{c.name} <span className="text-white/40 text-xs">· {c.days} days</span></div>
                <div className="flex items-center gap-3 mt-0.5">
                  <span className="text-emerald-400 text-xs font-medium">~{c.enrolled} enrolled</span>
                  <span className="text-white/40 text-xs">${c.cost.toLocaleString()}</span>
                  <span className="text-white/40 text-xs">Score {c.score}/100</span>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {step >= 3 && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="bg-emerald-500/20 border border-emerald-400/40 rounded-xl p-3 grid grid-cols-3 gap-3 mt-3">
            {[
              { label: "Cost/Enrollment", value: "$414", color: "text-emerald-300" },
              { label: "vs Historical",   value: "$2,500", color: "text-red-300" },
              { label: "Savings",         value: "$63k", color: "text-gold-400" },
            ].map(s => (
              <div key={s.label} className="text-center">
                <div className={cn("text-xl font-bold", s.color)}>{s.value}</div>
                <div className="text-white/40 text-[9px]">{s.label}</div>
              </div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}

/* ─── Scene: Result ──────────────────────────────────────────── */
function SceneResult({ corridor = "china" }: { corridor?: string }) {
  const resultData = {
    china: { cpe: 414, historical: 2500 },
    japan: { cpe: 385, historical: 2800 },
    singapore: { cpe: 258, historical: 3200 }
  };

  const data = resultData[corridor as keyof typeof resultData] || resultData.china;

  return (
    <div className="flex flex-col items-center justify-center h-full gap-5 px-16">
      <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 200 }}
        className="text-center">
        <div className="text-7xl font-black text-emerald-400 mb-2">
          $<Counter to={data.cpe} duration={2000} />
        </div>
        <div className="text-white/60 text-lg">per enrolled student</div>
        <div className="text-white/30 text-sm mt-1">vs ${data.historical.toLocaleString()} historical (unguided trip)</div>
      </motion.div>

      <div className="grid grid-cols-3 gap-3 mt-4 w-full max-w-md">
        {[
          { flag: "🇨🇳", country: "China", region: "Zhejiang", score: 82 },
          { flag: "🇯🇵", country: "Japan", region: "Kyoto", score: 78 },
          { flag: "🇸🇬", country: "Singapore", region: "Central", score: 88 },
        ].map((c, i) => (
          <motion.div key={c.country} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 + i * 0.15 }}
            className="bg-white/10 border border-white/20 rounded-xl p-3 text-center">
            <div className="text-2xl mb-1">{c.flag}</div>
            <div className="text-emerald-400 font-bold text-lg">{c.score}</div>
            <div className="text-white/40 text-[9px]">{c.region}</div>
          </motion.div>
        ))}
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}
        className="text-center">
        <div className="text-white/60 text-sm">One subscription pays for itself before the first flight is booked.</div>
        <div className="mt-3 inline-block bg-gold-500 text-navy-950 font-bold text-sm px-6 py-2.5 rounded-full">
          Request a Demo →
        </div>
      </motion.div>
    </div>
  );
}

/* ─── Cursor positions per scene ─────────────────────────────── */
const CURSOR_PATHS: Record<string, Array<{ x: number; y: number; click?: boolean; delay: number }>> = {
  problem:   [{ x: 50, y: 50, delay: 0 }],
  map:       [{ x: 72, y: 52, delay: 1500 }, { x: 72, y: 52, click: true, delay: 2000 }, { x: 48, y: 54, delay: 3000 }, { x: 48, y: 54, click: true, delay: 3500 }],
  insight:   [{ x: 35, y: 35, delay: 500 }, { x: 35, y: 70, delay: 1500 }],
  breakdown: [{ x: 70, y: 40, delay: 500 }, { x: 70, y: 65, delay: 1800 }],
  roi:       [{ x: 20, y: 40, delay: 400 }, { x: 20, y: 85, click: true, delay: 900 }, { x: 65, y: 50, delay: 2000 }],
  result:    [{ x: 50, y: 80, delay: 1800 }, { x: 50, y: 80, click: true, delay: 2200 }],
};

/* ─── Main component ─────────────────────────────────────────── */
export function DemoVideo({ corridor = "china" }: { corridor?: string }) {
  const [sceneIdx, setSceneIdx] = useState(0);
  const [playing, setPlaying]   = useState(true);
  const [sceneTime, setSceneTime] = useState(0);
  const [cursor, setCursor]     = useState({ x: 50, y: 50, clicking: false });
  const intervalRef             = useRef<NodeJS.Timeout | null>(null);
  const audioRef                = useRef<HTMLAudioElement>(null);

  // Warm the map data the demo will show, so the map scene isn't slow.
  useEffect(() => {
    ["china", "japan", "singapore"].forEach(c => {
      fetch(`/geo/${c}.json`).catch(() => {});
    });
  }, []);

  // Reset scene when corridor changes
  useEffect(() => {
    setSceneIdx(0);
    setSceneTime(0);
  }, [corridor]);

  const scene = SCENES[sceneIdx];

  // Advance scenes
  useEffect(() => {
    if (!playing) return;
    const start = Date.now();
    intervalRef.current = setInterval(() => {
      const elapsed = Date.now() - start;
      setSceneTime(elapsed);
      if (elapsed >= scene.duration) {
        setSceneIdx(i => (i + 1) % SCENES.length);
        setSceneTime(0);
      }
    }, 50);
    return () => clearInterval(intervalRef.current!);
  }, [playing, sceneIdx, scene.duration]);

  // Move cursor
  useEffect(() => {
    const path = CURSOR_PATHS[scene.id] || [];
    const timers: NodeJS.Timeout[] = [];
    path.forEach(pos => {
      timers.push(setTimeout(() => setCursor({ x: pos.x, y: pos.y, clicking: pos.click ?? false }), pos.delay));
      if (pos.click) timers.push(setTimeout(() => setCursor(c => ({ ...c, clicking: false })), pos.delay + 200));
    });
    return () => timers.forEach(clearTimeout);
  }, [scene.id]);

  // Audio playback sync
  useEffect(() => {
    if (!audioRef.current) return;
    if (playing) {
      audioRef.current.play().catch(() => {});
    } else {
      audioRef.current.pause();
    }
  }, [playing]);

  // Reset audio on scene loop
  useEffect(() => {
    if (sceneIdx === 0 && audioRef.current) {
      audioRef.current.currentTime = 0;
    }
  }, [sceneIdx]);

  const progress = sceneTime / scene.duration;

  return (
    <div className="relative w-full aspect-video bg-navy-950 rounded-2xl overflow-hidden select-none shadow-2xl border border-white/10">
      {/* Browser chrome */}
      <div className="h-9 bg-navy-900 border-b border-white/10 flex items-center px-4 gap-2">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500/70" />
          <div className="w-3 h-3 rounded-full bg-amber-500/70" />
          <div className="w-3 h-3 rounded-full bg-emerald-500/70" />
        </div>
        <div className="flex-1 mx-4">
          <div className="bg-white/10 rounded-md h-5 flex items-center px-3 max-w-xs mx-auto">
            <span className="text-white/40 text-[10px]">🔒 app.polarisuni.com/map</span>
          </div>
        </div>
        <div className="text-white/20 text-[10px]">Polaris</div>
      </div>

      {/* App chrome — sidebar */}
      <div className="flex h-[calc(100%-36px)]">
        <div className="w-14 bg-navy-900 border-r border-white/10 flex flex-col items-center py-3 gap-4">
          {["🗺️","✈️","📊","⚙️"].map((icon, i) => (
            <div key={i} className={cn("w-8 h-8 rounded-lg flex items-center justify-center text-sm",
              i === (sceneIdx <= 1 ? 0 : sceneIdx === 4 ? 1 : sceneIdx === 2 || sceneIdx === 3 ? 0 : 2)
                ? "bg-navy-700" : "hover:bg-white/5"
            )}>
              {icon}
            </div>
          ))}
        </div>

        {/* Scene content */}
        <div className="flex-1 relative">
          <AnimatePresence mode="wait">
            <motion.div key={scene.id} className="absolute inset-0"
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4 }}>
              {scene.id === "problem"   && <SceneProblem corridor={corridor} />}
              {scene.id === "map"       && <SceneMap progress={progress} corridor={corridor} />}
              {scene.id === "insight"   && <SceneInsight corridor={corridor} />}
              {scene.id === "breakdown" && <SceneBreakdown corridor={corridor} />}
              {scene.id === "corridors" && <SceneCorridors />}
              {scene.id === "roi"       && <SceneROI corridor={corridor} />}
              {scene.id === "result"    && <SceneResult corridor={corridor} />}
            </motion.div>
          </AnimatePresence>

          {/* Animated cursor */}
          <Cursor x={cursor.x} y={cursor.y} clicking={cursor.clicking} />
        </div>
      </div>

      {/* Scene title overlay — dark fade so text never collides with content */}
      <AnimatePresence mode="wait">
        <motion.div key={scene.id + "-title"}
          className="absolute bottom-10 left-0 right-0 px-8 pt-14 pb-3 text-center bg-gradient-to-t from-navy-950 via-navy-950/95 to-transparent pointer-events-none"
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
          <div className="text-white font-bold text-sm">
            {scene.id === "map"
              ? `${getCorridorData(corridor).count} of ${getCorridorData(corridor).name}. Scored.`
              : scene.title}
          </div>
          <div className="text-white/60 text-xs mt-0.5">
            {scene.id === "map"
              ? "Every region ranked by probability of enrollment yield — updated weekly."
              : scene.subtitle}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Progress bar + controls */}
      <div className="absolute bottom-0 left-0 right-0 bg-navy-950/90 backdrop-blur-sm px-4 py-2">
        {/* Scene progress bars */}
        <div className="flex gap-1 mb-2">
          {SCENES.map((s, i) => (
            <button key={s.id} onClick={() => { setSceneIdx(i); setSceneTime(0); }}
              className="flex-1 h-1 rounded-full overflow-hidden bg-white/10">
              <motion.div className="h-full bg-white rounded-full"
                style={{ width: i < sceneIdx ? "100%" : i === sceneIdx ? `${progress * 100}%` : "0%" }} />
            </button>
          ))}
        </div>
        {/* Controls */}
        <div className="flex items-center gap-3">
          <button onClick={() => setPlaying(p => !p)}
            className="w-6 h-6 text-white/70 hover:text-white transition-colors">
            {playing ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>
          <button onClick={() => { setSceneIdx(0); setSceneTime(0); setPlaying(true); }}
            className="w-6 h-6 text-white/40 hover:text-white transition-colors">
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <div className="flex gap-1 mx-auto">
            {SCENES.map((s, i) => (
              <button key={s.id} onClick={() => { setSceneIdx(i); setSceneTime(0); }}
                className={cn("w-1.5 h-1.5 rounded-full transition-all", i === sceneIdx ? "bg-white w-3" : "bg-white/30 hover:bg-white/60")} />
            ))}
          </div>
          <div className="text-white/30 text-[10px]">{sceneIdx + 1}/{SCENES.length}</div>
        </div>
      </div>

      {/* Background music */}
      <audio
        ref={audioRef}
        src="/demo-music.mp3"
        loop
        onLoadedMetadata={(e) => { (e.currentTarget as HTMLAudioElement).volume = 0.35; }}
        className="hidden"
      />
    </div>
  );
}
