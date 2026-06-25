"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import {
  ArrowRight, Check, X, Play, Bell, Menu,
  Target, BarChart2, Plane, Clock,
  DollarSign, Users, MapPin, TrendingUp,
} from "lucide-react";
import { Logo } from "@/components/Logo";
import { WaitlistModal } from "@/components/WaitlistModal";
import { StrategyBuilder } from "@/components/StrategyBuilder";
import { StrategicPlanBuilder } from "@/components/StrategicPlanBuilder";
import { EnhancedContactForm } from "@/components/EnhancedContactForm";
import { DemoVideo } from "@/components/demo/DemoVideo";
import { CorridorModal } from "@/components/CorridorModal";
import { Footer } from "@/components/Footer";
import { FAQ } from "@/components/FAQ";

/* ─── Utilities ───────────────────────────────────────────── */
const usd = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);

function CountUp({ target, active, duration = 1400, prefix = "", suffix = "" }: {
  target: number; active: boolean; duration?: number; prefix?: string; suffix?: string;
}) {
  const [val, setVal] = useState(0);
  const ran = useRef(false);
  useEffect(() => {
    if (!active || ran.current) return;
    ran.current = true;
    const start = Date.now();
    const tick = () => {
      const p = Math.min(1, (Date.now() - start) / duration);
      setVal(Math.round((1 - Math.pow(1 - p, 3)) * target));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [active, duration, target]);
  return <>{prefix}{val.toLocaleString()}{suffix}</>;
}

/* ─── Parallax wrapper — image drifts as you scroll ─────────── */
function Parallax({ children, amount = 40, className = "" }: { children: React.ReactNode; amount?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [-amount, amount]);
  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <motion.div style={{ y }} className="h-full w-full scale-125">{children}</motion.div>
    </div>
  );
}

/* ─── Hero slides — auto-rotating city backdrops ────────────── */
const HERO_SLIDES = [
  { src: "https://images.unsplash.com/photo-1474181487882-5abf3f0ba6c2?w=2400&q=85", alt: "Shanghai skyline at night", city: "Shanghai", pos: "object-bottom" },
  { src: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=2400&q=85", alt: "Tokyo at dusk", city: "Tokyo", pos: "object-center" },
  { src: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=2400&q=85", alt: "Singapore Marina Bay", city: "Singapore", pos: "object-center" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
};
const s = (delay = 0) => ({
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] } },
});

/* ─── ROI Calculator ──────────────────────────────────────── */
function ROICalc() {
  const [budget, setBudget] = useState(120000);
  const [students, setStudents] = useState(48);
  const [tier, setTier] = useState<"starter"|"pro">("pro");
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  const tierCost = tier === "starter" ? 9000 : 25000;
  const currentCPE = budget / Math.max(students, 1);
  const projStudents = Math.round(students * 1.6);
  const savings = Math.max(0, (currentCPE - 414) * projStudents);
  const roi = Math.round((savings / tierCost) * 100);

  return (
    <section ref={ref} className="bg-navy-950 py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
          className="text-center mb-12">
          <span className="text-gold-400 text-xs font-bold uppercase tracking-widest">ROI Calculator</span>
          <h2 className="text-4xl font-black text-white mt-3 mb-4">
            See your return before you commit.
          </h2>
          <p className="text-navy-300 text-lg max-w-xl mx-auto">
            No competitor shows you this number. We do.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Sliders */}
          <motion.div variants={s(0)} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="bg-navy-900 rounded-2xl border border-navy-700 p-7 space-y-8">
            {[
              { label: "Annual Recruiting Budget", val: budget, min: 30000, max: 500000, step: 5000, set: setBudget, fmt: (v: number) => usd(v) },
              { label: "International Students Enrolled / Year", val: students, min: 10, max: 400, step: 5, set: setStudents, fmt: (v: number) => `${v} students` },
            ].map(({ label, val, min, max, step, set, fmt }) => (
              <div key={label}>
                <div className="flex justify-between mb-3">
                  <span className="text-sm font-medium text-white">{label}</span>
                  <span className="text-gold-400 font-bold text-sm">{fmt(val)}</span>
                </div>
                <input type="range" min={min} max={max} step={step} value={val}
                  onChange={e => set(+e.target.value)}
                  className="w-full h-2 bg-navy-700 rounded-full appearance-none cursor-pointer accent-yellow-400" />
                <div className="flex justify-between text-[10px] text-navy-600 mt-1">
                  <span>{fmt(min)}</span><span>{fmt(max)}</span>
                </div>
              </div>
            ))}
            <div>
              <span className="text-sm font-medium text-white block mb-3">Subscription Tier</span>
              <div className="grid grid-cols-2 gap-3">
                {(["starter","pro"] as const).map(t => (
                  <button key={t} onClick={() => setTier(t)}
                    className={`rounded-xl border py-3 text-sm font-semibold transition-all capitalize ${
                      tier === t ? "border-gold-400 bg-gold-400/10 text-gold-400" : "border-navy-600 text-navy-400 hover:border-navy-400"
                    }`}>
                    {t === "starter" ? "Starter" : "Professional"}
                    <div className="text-xs font-normal opacity-60">{t === "starter" ? "$9k/yr" : "$25k/yr"}</div>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Results */}
          <motion.div variants={s(0.15)} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="space-y-4">
            <div className="bg-navy-900 border border-navy-700 rounded-2xl p-6">
              <div className="text-navy-400 text-xs uppercase tracking-wider mb-1">Your current cost / enrollment</div>
              <div className="text-4xl font-black text-red-400">{usd(Math.round(currentCPE))}</div>
              <div className="text-navy-500 text-xs mt-1">{students} students from {usd(budget)} budget</div>
            </div>
            <div className="bg-emerald-950 border border-emerald-800 rounded-2xl p-6">
              <div className="text-emerald-400 text-xs uppercase tracking-wider mb-1">Polaris cost / enrollment</div>
              <div className="text-4xl font-black text-emerald-300">$414</div>
              <div className="text-emerald-700 text-xs mt-1">median across platform customers</div>
            </div>
            <div className="bg-navy-900 border border-gold-500/30 rounded-2xl p-6 grid grid-cols-2 gap-4">
              <div>
                <div className="text-navy-400 text-xs uppercase tracking-wider mb-1">Annual savings</div>
                <div className="text-3xl font-black text-gold-400">
                  <CountUp target={savings} active={inView} prefix="$" />
                </div>
              </div>
              <div>
                <div className="text-navy-400 text-xs uppercase tracking-wider mb-1">ROI on subscription</div>
                <div className="text-3xl font-black text-white">
                  <CountUp target={roi} active={inView} suffix="%" />
                </div>
              </div>
              <div className="col-span-2 border-t border-navy-700 pt-4 text-[10px] text-navy-500">
                Projecting {projStudents} enrolled with Polaris vs. {students} current. Assumes 60% yield improvement.
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
          className="text-center mt-10">
          <Link href="/map"
            className="inline-flex items-center gap-2 bg-gold-400 hover:bg-gold-500 text-navy-950 font-bold text-base px-8 py-4 rounded-full transition-all hover:scale-105">
            Start your pilot <ArrowRight className="w-4 h-4" />
          </Link>
          <p className="text-navy-600 text-xs mt-3">$4k–6k pilot · or free with annual contract · cancel anytime</p>
        </motion.div>
      </div>
    </section>
  );
}

/* ─── Comparison table data ───────────────────────────────── */
const FEATURES = [
  "Transparent pricing",
  "Ranked opportunity score by province",
  "Competitive intelligence (who's recruiting where)",
  "Travel ROI Planner",
  "Engagement strategy playbook",
  "Timing calendar",
  "Outcome feedback loop",
  "PDF reports for CFO / Provost",
  "Neutral — no agent conflict of interest",
  "Self-serve, live in days",
  "Multi-corridor (Japan, Singapore)",
];
const COLS = [
  { name: "Polaris ★", us: true,  vals: [1,1,1,1,1,1,1,1,1,1,1] },
  { name: "QS",        us: false, vals: [0,0,0,0,0,0,0,0,0,0,0] },
  { name: "EAB",       us: false, vals: [0,1,0,0,0,0,0,0,1,0,0] },
  { name: "IDP",       us: false, vals: [0,0,1,0,0,0,0,0,0,0,0] },
  { name: "StudyPortals", us: false, vals: [0,0,0,0,0,0,0,0,1,1,0] },
];

/* ─── Page ────────────────────────────────────────────────── */
export default function LandingPage() {
  const [modal, setModal] = useState(false);
  const [contactModal, setContactModal] = useState(false);
  const [heroIdx, setHeroIdx] = useState(0);
  const [selectedCorridor, setSelectedCorridor] = useState<any>(null);
  const [notifyOpen, setNotifyOpen] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [notifyForm, setNotifyForm] = useState({ email: "", institution: "" });
  const [notifySuccess, setNotifySuccess] = useState(false);

  const handleNotify = async () => {
    if (!notifyForm.email || !notifyForm.institution) return;
    setNotifySuccess(true);
    setNotifyForm({ email: "", institution: "" });
    setTimeout(() => {
      setNotifySuccess(false);
      setNotifyOpen(false);
    }, 2000);
  };

  useEffect(() => {
    const t = setInterval(() => setHeroIdx(i => (i + 1) % HERO_SLIDES.length), 8000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="min-h-screen bg-white antialiased">

      {/* NAV */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/landing" aria-label="Polaris home"><Logo size="md" /></Link>
          <div className="hidden md:flex gap-8">
            {[["Free Strategic Plan","/strategic-plan"],["Product","/map"],["Demo","/demo"],["Pricing","#pricing"],["FAQ","#faq"]].map(([l,h]) => (
              <Link key={l} href={h} className="text-sm font-medium text-gray-600 hover:text-navy-900 transition-colors">{l}</Link>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="hidden md:block text-sm text-gray-500 hover:text-gray-800 px-3 py-2">Sign in</Link>
            <button onClick={() => setNotifyOpen(true)} className="hidden md:flex text-xs font-semibold text-gold-400 hover:text-gold-300 px-3 py-2 gap-1.5 items-center transition-colors">
              <Bell className="w-3.5 h-3.5" /> Notify Me
            </button>
            <button onClick={() => setContactModal(true)} className="bg-navy-900 hover:bg-navy-800 text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors flex items-center gap-1.5">
              Request Demo <ArrowRight className="w-3.5 h-3.5" />
            </button>
            {/* Mobile menu toggle */}
            <button onClick={() => setMobileMenu(o => !o)} aria-label="Open menu" aria-expanded={mobileMenu}
              className="md:hidden p-2 -mr-1 text-gray-700 hover:text-navy-900 transition-colors">
              {mobileMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown menu */}
        {mobileMenu && (
          <div className="md:hidden border-t border-gray-100 bg-white px-6 py-4 flex flex-col gap-1">
            {[["Product","/map"],["Demo","/demo"],["Free Strategic Plan","/strategic-plan"],["Pricing","#pricing"],["FAQ","#faq"],["Contact","/contact"]].map(([l,h]) => (
              <Link key={l} href={h} onClick={() => setMobileMenu(false)}
                className="text-sm font-medium text-gray-700 hover:text-navy-900 py-2.5 transition-colors">{l}</Link>
            ))}
            <Link href="/login" onClick={() => setMobileMenu(false)}
              className="text-sm font-semibold text-navy-900 py-2.5 border-t border-gray-100 mt-1">Sign in</Link>
          </div>
        )}
      </nav>

      {/* HERO — cinematic full-screen */}
      <section className="relative min-h-[92vh] flex items-center bg-[#03071e] overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          {HERO_SLIDES.map((slide, i) => (
            <div key={slide.src}
              className={`absolute inset-[-4%] kenburns transition-opacity duration-[2500ms] ease-in-out ${i === heroIdx ? "opacity-100" : "opacity-0"}`}>
              <Image src={slide.src} alt={slide.alt} fill unoptimized priority={i === 0}
                className={`object-cover ${slide.pos} opacity-[0.9]`} />
            </div>
          ))}
          <div className="absolute inset-0 bg-gradient-to-b from-[#03071e]/50 via-transparent to-[#03071e]" />
          {/* current city label */}
          <div className="absolute bottom-8 right-8 hidden md:flex items-center gap-3">
            <span className="h-px w-10 bg-gold-400/50" />
            <span key={heroIdx} className="text-white/50 text-[11px] tracking-[0.4em] uppercase">{HERO_SLIDES[heroIdx].city}</span>
          </div>
        </div>

        <div className="relative max-w-5xl mx-auto px-6 text-center py-28">
          <motion.div variants={s(0)} initial="hidden" animate="visible"
            className="flex items-center justify-center gap-4 mb-10">
            <span className="h-px w-12 bg-gold-400/60" />
            <span className="text-gold-400 text-[11px] font-medium tracking-[0.35em] uppercase">International Enrollment Intelligence</span>
            <span className="h-px w-12 bg-gold-400/60" />
          </motion.div>

          <motion.h1 variants={s(0.08)} initial="hidden" animate="visible"
            className="text-5xl md:text-8xl font-black text-white leading-[1.02] tracking-tight mb-8 drop-shadow-2xl float-hero">
            Stop guessing<br />where to recruit.<br />
            <span className="bg-gradient-to-r from-gold-400 via-amber-100 to-gold-400 bg-clip-text text-transparent shimmer-gold inline-block">Start knowing.</span>
          </motion.h1>

          <motion.p variants={s(0.16)} initial="hidden" animate="visible"
            className="text-lg md:text-2xl text-white/70 max-w-2xl mx-auto mb-12 leading-relaxed font-light">
            Polaris scores every source market so you know exactly where your budget
            will enroll the most students — before you book a single flight.
          </motion.p>

          <motion.div variants={s(0.22)} initial="hidden" animate="visible"
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14">
            <Link href="/map"
              className="bg-gold-400 hover:bg-gold-500 text-navy-950 font-bold text-base px-10 py-4 rounded-full transition-all hover:scale-105 flex items-center gap-2 shadow-[0_0_60px_rgba(245,200,66,0.35)]">
              See it live <ArrowRight className="w-4 h-4" />
            </Link>
            <button onClick={() => { setModal(true); setNotifyOpen(false); }}
              className="flex items-center gap-2.5 text-white/80 hover:text-white border border-white/25 hover:border-gold-400/60 backdrop-blur-sm bg-white/5 px-7 py-4 rounded-full transition-all text-sm font-medium">
              <Play className="w-4 h-4 fill-current" /> Watch 2-min demo
            </button>
          </motion.div>

          <motion.div variants={s(0.28)} initial="hidden" animate="visible"
            className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
            {[{ t: 277, suf: "k+", l: "students in US from Asia" }, { t: 95, suf: "%+", l: "visa approval — Japan & Singapore" }, { t: 414, pre: "$", l: "avg cost / enrollment" }, { t: 83, l: "regions scored" }].map(x => (
              <div key={x.l} className="text-center">
                <div className="text-2xl md:text-3xl font-black text-white tabular-nums">
                  <CountUp target={x.t} active duration={1800} prefix={x.pre || ""} suffix={x.suf || ""} />
                </div>
                <div className="text-[10px] uppercase tracking-[0.2em] text-white/40 mt-1">{x.l}</div>
              </div>
            ))}
          </motion.div>

          <motion.p variants={s(0.34)} initial="hidden" animate="visible"
            className="mt-6 text-white/30 text-[10px] tracking-wide">
            Sources: IIE Open Doors · U.S. Dept. of State · UNESCO UIS · World Bank
          </motion.p>
        </div>

        {/* scroll cue */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/30 text-[10px] tracking-[0.3em] uppercase animate-bounce">Scroll</div>
      </section>

      {/* TICKER — luxury marquee */}
      <div className="bg-[#03071e] border-y border-white/5 py-4 overflow-hidden">
        <div className="marquee flex items-center gap-14">
          {Array.from({ length: 2 }).flatMap((_, dup) =>
            ["TOKYO", "★", "SHANGHAI", "★", "SINGAPORE", "★", "83 REGIONS SCORED", "★", "277K STUDENTS / YR", "★", "UPDATED NIGHTLY", "★", "ZERO GUESSWORK", "★"].map((t, i) => (
              <span key={`${dup}-${i}`} className={t === "★" ? "text-gold-400/60 text-[9px]" : "text-white/35 text-xs font-semibold tracking-[0.35em]"}>{t}</span>
            ))
          )}
        </div>
      </div>

      {/* THREE CITIES — luxury full-bleed showcase */}
      <section className="bg-[#03071e] py-0">
        <div className="text-center pt-20 pb-12 px-6">
          <span className="text-gold-400 text-[11px] font-medium tracking-[0.35em] uppercase">Three corridors. One platform.</span>
          <h2 className="text-4xl md:text-6xl font-black text-white mt-4">Where your next students live.</h2>
        </div>
        <div className="flex flex-col md:flex-row h-auto md:h-[80vh]">
          {[
            { city: "Tokyo", country: "Japan", img: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=1400&q=85", stat: "47 prefectures scored", score: "Kyoto 78", visa: "95% F-1 approval" },
            { city: "Shanghai", country: "China", img: "https://images.unsplash.com/photo-1474181487882-5abf3f0ba6c2?w=1400&q=85", stat: "31 provinces scored", score: "Zhejiang 82", visa: "277k students/yr" },
            { city: "Singapore", country: "Singapore", img: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=1400&q=85", stat: "5 regions scored", score: "Central 88", visa: "97% F-1 approval" },
          ].map(c => (
            <button key={c.city} onClick={() => setSelectedCorridor(c)} type="button"
              className="group relative flex-none md:flex-1 md:hover:flex-[1.7] transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] h-[60vh] md:h-full overflow-hidden text-left">
              <div className="absolute inset-[-3%] kenburns-slow" style={{ animationDelay: `${["0s","-9s","-18s"][["Tokyo","Shanghai","Singapore"].indexOf(c.city)] }` }}>
                <Image src={c.img} alt={`${c.city} skyline`} fill unoptimized
                  className="object-cover transition-transform duration-[2000ms] group-hover:scale-110" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-[#03071e] via-[#03071e]/20 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-8 md:p-10">
                <div className="text-gold-400 text-[10px] tracking-[0.35em] uppercase mb-2">{c.country} → United States</div>
                <div className="text-white text-4xl md:text-5xl font-black tracking-tight drop-shadow-xl">{c.city}</div>
                <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-white/60 text-xs">
                  <span>{c.stat}</span><span className="text-gold-400 font-semibold">Top: {c.score}</span><span>{c.visa}</span>
                </div>
                <div className="mt-5 inline-flex items-center gap-2 text-white text-sm font-semibold opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
                  Explore the corridor <ArrowRight className="w-4 h-4 text-gold-400" />
                </div>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* SOCIAL PROOF */}
      <section className="bg-white py-12 px-6 border-b border-gray-100">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-xs text-gray-400 uppercase tracking-widest mb-8">Pilot program — used by admissions teams at leading research universities</p>
          <div className="flex flex-wrap justify-center items-center gap-6 md:gap-10">
            {[
              { initials: "SU",  name: "State University",          color: "bg-blue-900",   rank: "R1" },
              { initials: "PU",  name: "Pacific University",         color: "bg-red-900",    rank: "R1" },
              { initials: "ARU", name: "Atlantic Research Univ.",    color: "bg-green-900",  rank: "R1" },
              { initials: "MU",  name: "Midwest University",         color: "bg-purple-900", rank: "R2" },
              { initials: "CU",  name: "Coastal University",         color: "bg-orange-900", rank: "R1" },
            ].map(u => (
              <div key={u.name} className="flex items-center gap-2 group">
                <div className={`w-9 h-9 rounded-lg ${u.color} flex items-center justify-center shrink-0`}>
                  <span className="text-white font-black text-[10px]">{u.initials}</span>
                </div>
                <div className="text-left">
                  <div className="text-gray-500 text-xs font-semibold leading-none">{u.name}</div>
                  <div className="text-gray-300 text-[10px] mt-0.5">{u.rank} Research University</div>
                </div>
              </div>
            ))}
          </div>
          <p className="text-[10px] text-gray-300 mt-6">(Illustrative — institutional names withheld per pilot agreement)</p>
        </div>
      </section>

      {/* THE PROBLEM */}
      <section className="bg-gray-50 py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-16">
            <span className="text-red-500 text-xs font-bold uppercase tracking-widest">The Problem</span>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mt-3">
              Universities spend $30,000 on a recruiting<br className="hidden md:block" /> trip and call it strategy.
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 mb-16">
            {[
              { icon: MapPin, color: "text-red-500 bg-red-50", title: "Recruiting blind", body: "Most universities choose destinations based on where they went last year. No scoring. No competitive awareness. Zero data." },
              { icon: DollarSign, color: "text-amber-600 bg-amber-50", title: "$2,500 per enrolled student", body: "The average unguided international recruiting trip costs $2,500 per enrolled student. Top R1s average $1,200. You can close that gap." },
              { icon: TrendingUp, color: "text-blue-600 bg-blue-50", title: "Declining returns", body: "US F-1 approvals for China dropped 24 points since 2019. Doubling down on the same saturated markets delivers diminishing returns." },
            ].map(({ icon: Icon, color, title, body }, i) => (
              <motion.div key={title} variants={s(i * 0.1)} initial="hidden" whileInView="visible" viewport={{ once: true }}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-7">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{body}</p>
              </motion.div>
            ))}
          </div>

          {/* Pull quote over photo */}
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="relative rounded-2xl overflow-hidden">
            <Parallax className="h-64 md:h-72" amount={45}>
              <Image src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1400&q=80"
                alt="Asian students group" width={1400} height={400} unoptimized
                className="w-full h-full object-cover" />
            </Parallax>
            <div className="absolute inset-0 bg-gradient-to-r from-navy-950/90 to-navy-950/30 flex items-center">
              <div className="px-8 md:px-14 max-w-2xl">
                <p className="text-white text-xl md:text-2xl font-black leading-snug">
                  "We spent three years recruiting in Beijing. Polaris showed us we had 14 alumni in Wuhan and zero competitors. We enrolled 11 students at a fifth of the cost."
                </p>
                <p className="text-white/50 text-sm mt-4">— VP International Enrollment, R1 University (illustrative)</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* THE PRODUCT */}
      <section className="bg-white py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-16">
            <span className="text-navy-700 text-xs font-bold uppercase tracking-widest">The Platform</span>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mt-3 mb-5">Precision targeting. Not gut feel.</h2>
            <p className="text-gray-500 text-lg max-w-xl mx-auto">Every region scored across China, Japan and Singapore. Every trip optimized. Every outcome tracked.</p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Score demo */}
            <motion.div variants={s(0)} initial="hidden" whileInView="visible" viewport={{ once: true }}
              className="bg-navy-950 rounded-2xl border border-navy-800 p-7">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-9 h-9 bg-navy-800 rounded-xl flex items-center justify-center">
                  <Target className="w-5 h-5 text-gold-400" />
                </div>
                <div>
                  <div className="text-white font-bold">Ranked Opportunity Map</div>
                  <div className="text-navy-400 text-xs">31 Chinese provinces, scored nightly</div>
                </div>
              </div>
              {[
                { name: "Zhejiang", score: 82, note: "Low saturation · $18k GDP/capita", green: true },
                { name: "Hubei",    score: 73, note: "14 alumni · 5 US competitors only", green: true },
                { name: "Sichuan",  score: 74, note: "Chengdu tech boom · 95 competitors", green: true },
                { name: "Beijing",  score: 28, note: "95% saturated · 380 US universities", green: false },
                { name: "Shanghai", score: 26, note: "94% saturated · Enrollment -7% YoY", green: false },
              ].map((p, i) => (
                <div key={p.name} className="flex items-center gap-3 mb-3">
                  <span className="text-navy-600 text-xs w-4 shrink-0">{i+1}</span>
                  <div className="flex-1">
                    <div className="flex justify-between mb-0.5">
                      <span className="text-white text-xs font-medium">{p.name}</span>
                      <span className={`text-xs font-bold ${p.green ? "text-emerald-400" : "text-red-400"}`}>{p.score}</span>
                    </div>
                    <div className="h-1 bg-navy-800 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${p.green ? "bg-emerald-500" : "bg-red-500"}`} style={{ width: `${p.score}%` }} />
                    </div>
                    <div className="text-navy-600 text-[10px] mt-0.5">{p.note}</div>
                  </div>
                </div>
              ))}
            </motion.div>

            {/* Feature list */}
            <div className="space-y-4">
              {[
                { icon: Users, color: "bg-purple-50 text-purple-700", badge: "NEW", title: "Engagement Playbook", body: "Not just WHERE. HOW. Alumni networking events convert at 4.2×. We map your alumni to target provinces and tell you exactly which engagement format works where." },
                { icon: BarChart2, color: "bg-blue-50 text-blue-700", badge: null, title: "Competitive Intelligence", body: "See where USC, Michigan, Harvard recruit — and the white space they don't. Hubei: 5 competitors. Beijing: 380. The arbitrage is visible the moment you open the map." },
                { icon: Clock, color: "bg-amber-50 text-amber-700", badge: null, title: "Timing Calendar", body: "October = 95/100. June (Gaokao) = 20/100. The timing engine shows you exactly which month to visit each province — and which to avoid." },
                { icon: Plane, color: "bg-emerald-50 text-emerald-700", badge: null, title: "Travel ROI Planner", body: "Enter your budget → get the optimal city itinerary with projected enrollments and a PDF your CFO can approve the same day." },
              ].map(({ icon: Icon, color, badge, title, body }) => (
                <motion.div key={title} variants={s(0.1)} initial="hidden" whileInView="visible" viewport={{ once: true }}
                  className="bg-gray-50 rounded-2xl border border-gray-100 p-5 flex gap-4">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-gray-900 text-sm">{title}</span>
                      {badge && <span className="text-[9px] bg-gold-400 text-navy-950 font-bold px-1.5 py-0.5 rounded-full">{badge}</span>}
                    </div>
                    <p className="text-gray-500 text-xs leading-relaxed">{body}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* DATA & METHODOLOGY */}
      <section className="bg-white py-24 px-6 border-t border-gray-100">
        <div className="max-w-6xl mx-auto">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-14">
            <span className="text-navy-700 text-xs font-bold uppercase tracking-widest">Data you can defend</span>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mt-3 mb-5">Built on sources your provost already trusts.</h2>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">
              Every score traces back to public, citable data. No black boxes — when your CFO asks
              "where does this number come from?", you have an answer.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-14">
            {[
              { name: "IIE Open Doors", feeds: "International student enrollment in the US by origin country — the canonical census of the field.", tag: "Enrollment flows", url: "https://www.opendoorsdata.org" },
              { name: "U.S. Department of State", feeds: "F-1 visa issuance statistics by nationality — the visa approval rates behind every corridor score.", tag: "Visa data", url: "https://travel.state.gov/visa/statistics/stats.html" },
              { name: "UNESCO Institute for Statistics", feeds: "Global student-mobility flows between countries, tracked over 5-year windows.", tag: "Mobility trends", url: "https://uis.unesco.org" },
              { name: "World Bank Open Data", feeds: "GDP per capita, population 18–24 and household income by region — the ability-to-pay signal.", tag: "Economics", url: "https://data.worldbank.org" },
              { name: "EF English Proficiency Index", feeds: "Regional English proficiency — the strongest predictor of US-bound intent in Japan and inland China.", tag: "Academic readiness", url: "https://www.ef.com/epi" },
              { name: "National statistics bureaus", feeds: "China NBS, Japan e-Stat / MEXT, Singapore MOE — regional demographics and high-school graduating cohorts.", tag: "Regional detail", url: "https://www.stats.gov.cn" },
            ].map((src, i) => (
              <a key={src.name} href={src.url} target="_blank" rel="noopener noreferrer"
                className="group">
                <motion.div variants={s(i * 0.06)} initial="hidden" whileInView="visible" viewport={{ once: true }}
                  className="lift bg-gray-50 border border-gray-100 hover:border-gold-400 rounded-2xl p-5 text-left h-full transition-colors cursor-pointer">
                  <div className="text-[10px] font-bold uppercase tracking-widest text-gold-500 mb-2">{src.tag}</div>
                  <div className="font-black text-gray-900 mb-1.5 group-hover:text-gold-600 transition-colors">{src.name}</div>
                  <p className="text-gray-500 text-sm leading-relaxed">{src.feeds}</p>
                  <div className="text-gold-500 text-xs mt-3 font-semibold opacity-0 group-hover:opacity-100 transition-opacity">Visit source →</div>
                </motion.div>
              </a>
            ))}
          </div>

          {/* How the score works */}
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="bg-navy-950 rounded-2xl p-8 md:p-10">
            <div className="md:flex items-start gap-10">
              <div className="md:w-1/3 mb-8 md:mb-0">
                <h3 className="text-2xl font-black text-white mb-3">How the score works</h3>
                <p className="text-navy-300 text-sm leading-relaxed">
                  Six weighted factors, normalized to 0–100 per region, recomputed nightly.
                  Each region also carries a confidence rating based on data freshness and coverage.
                </p>
              </div>
              <div className="md:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
                {[
                  ["Student demand", 25, "Population 18–24, high-school density, historical outbound flows"],
                  ["Economic fit", 20, "GDP per capita and household income vs. full tuition cost"],
                  ["Academic pipeline", 15, "Secondary completion, English proficiency, feeder-school strength"],
                  ["Corridor viability", 15, "F-1 approval rate, direct flights, policy stability"],
                  ["Market white space", 15, "Inverted competitor saturation — fewer recruiters, higher score"],
                  ["Migration momentum", 10, "Diaspora size and 5-year flow trend"],
                ].map(([label, w, desc]) => (
                  <div key={label as string}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-white text-sm font-semibold">{label}</span>
                      <span className="text-gold-400 text-sm font-black">{w}%</span>
                    </div>
                    <div className="h-1.5 bg-navy-800 rounded-full overflow-hidden mb-1.5">
                      <div className="h-full bg-gold-400/80 rounded-full" style={{ width: `${(w as number) * 4}%` }} />
                    </div>
                    <p className="text-navy-400 text-xs leading-snug">{desc}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-8 pt-6 border-t border-navy-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-navy-400 text-xs">Full source list, update cadence and known limitations documented openly.</p>
              <Link href="/methodology"
                className="text-gold-400 hover:text-gold-300 text-sm font-bold flex items-center gap-1.5">
                Read the full methodology <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ROI CALCULATOR */}
      <ROICalc />

      {/* THE $63K NUMBER */}
      <section className="bg-white py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <p className="text-gray-400 text-xs uppercase tracking-widest mb-4">Average savings per trip cycle</p>
            <div className="text-7xl sm:text-8xl md:text-[10rem] font-black text-navy-900 leading-none tabular-nums">$63k</div>
            <p className="text-gray-500 text-xl mt-8 max-w-2xl mx-auto leading-relaxed">
              A university that previously spent <strong className="text-gray-900">$2,500 per enrolled student</strong> achieves{" "}
              <strong className="text-emerald-600">$414/enrollment</strong> with Polaris.
              The Professional plan at $25,000/year pays for itself before the first flight is booked.
            </p>
            <p className="text-gray-300 text-xs mt-4">Based on demo customer data. Individual results vary.</p>
          </motion.div>
        </div>
      </section>

      {/* STUDENT PHOTOS + TESTIMONIALS */}
      <section className="bg-gray-50 py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="text-center mb-14">
            <h2 className="text-4xl font-black text-gray-900">Built for the people who recruit them.</h2>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-14">
            {[
              "https://images.unsplash.com/photo-1523731407965-2430cd12f5e4?w=600&q=80",
              "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=600&q=80",
              "https://images.unsplash.com/photo-1474540412665-1cdae210ae6b?w=600&q=80",
            ].map((src, i) => (
              <motion.div key={i} variants={s(i * 0.1)} initial="hidden" whileInView="visible" viewport={{ once: true }}
                className="rounded-2xl overflow-hidden">
                <Image src={src} alt="International students" width={600} height={300} unoptimized
                  className="w-full h-48 md:h-64 object-cover hover:scale-105 transition-transform duration-700" />
              </motion.div>
            ))}
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { photo: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&q=80", quote: "We spent three years in Beijing and Shanghai. Polaris showed us we had 14 STEM alumni in Wuhan and zero competitors. 11 students enrolled at a fifth of the cost.", name: "VP of International Enrollment", uni: "R1 Research University" },
              { photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80", quote: "The CFO asked for ROI justification. I handed her the PDF report the platform generated. She approved the budget increase the same afternoon.", name: "Director of Graduate Admissions", uni: "Pacific Research University" },
              { photo: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=100&q=80", quote: "The competitive intelligence tab is worth the subscription alone. Seeing where Harvard and Michigan aren't recruiting — that IS the strategy.", name: "International Recruitment Manager", uni: "Atlantic University" },
            ].map(({ photo, quote, name, uni }, i) => (
              <motion.div key={name} variants={s(i * 0.12)} initial="hidden" whileInView="visible" viewport={{ once: true }}
                className="lift bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <p className="text-gray-700 text-sm italic leading-relaxed mb-5">"{quote}"</p>
                <div className="flex items-center gap-3">
                  <Image src={photo} alt={name} width={40} height={40} unoptimized className="w-10 h-10 rounded-full object-cover" />
                  <div>
                    <div className="font-semibold text-gray-900 text-xs">{name}</div>
                    <div className="text-gray-400 text-[10px]">{uni}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          <p className="text-center text-[10px] text-gray-300 mt-6">(Illustrative — pilot customer names withheld)</p>
        </div>
      </section>

      {/* COMPETITOR COMPARISON */}
      <section className="bg-navy-950 py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-12">
            <span className="text-gold-400 text-xs font-bold uppercase tracking-widest">vs. The Competition</span>
            <h2 className="text-4xl font-black text-white mt-3">
              Every competitor has a conflict of interest.<br className="hidden md:block" /> We don't.
            </h2>
            <div className="grid md:grid-cols-3 gap-4 mt-8 text-left">
              {[
                { name: "QS", problem: "Gated pricing. Tied to their own ranking ecosystem. Intelligence optimizes for QS channels, not your outcomes." },
                { name: "EAB", problem: "$100k+ enterprise contracts. Primarily domestic enrollment. International product is secondary and less mature." },
                { name: "IDP", problem: "They're also your agent. Their intelligence optimizes for IDP-channel enrollments — not your total recruitment strategy." },
              ].map(({ name, problem }) => (
                <div key={name} className="bg-navy-900 border border-navy-700 rounded-xl p-4">
                  <div className="text-red-400 font-bold text-sm mb-1">{name}: ⚠️</div>
                  <p className="text-navy-300 text-xs leading-relaxed">{problem}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="text-left text-navy-500 text-xs pb-4 pr-4 font-medium">Feature</th>
                  {COLS.map(c => (
                    <th key={c.name} className={`text-center text-xs pb-4 px-3 font-bold ${c.us ? "text-gold-400" : "text-navy-500"}`}>
                      {c.us && <div className="bg-gold-400 text-navy-950 text-[9px] px-2 py-0.5 rounded-full mb-1 inline-block">★ Us</div>}
                      {c.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-800/50">
                {FEATURES.map((f, fi) => (
                  <tr key={f}>
                    <td className="py-3 pr-4 text-navy-300 text-xs">{f}</td>
                    {COLS.map(c => (
                      <td key={c.name} className="py-3 px-3 text-center">
                        {c.vals[fi]
                          ? <Check className={`w-4 h-4 mx-auto ${c.us ? "text-gold-400" : "text-emerald-500"}`} />
                          : <X className="w-4 h-4 mx-auto text-navy-800" />}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="bg-white py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-12">
            <span className="text-navy-700 text-xs font-bold uppercase tracking-widest">Transparent Pricing</span>
            <h2 className="text-4xl font-black text-gray-900 mt-3 mb-4">
              Simple plans.<br className="hidden md:block" /> Know the price today.
            </h2>
            <p className="text-gray-500 text-base max-w-xl mx-auto">
              Every competitor hides pricing behind a discovery call. We show you the numbers upfront —
              because the math is obvious: one bad trip costs more than the subscription.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: "Starter", price: "$9,000", period: "/year", highlight: false,
                desc: "For teams testing a new corridor",
                features: ["1 destination country","2 source regions","2 seats","Ranked Opportunity Map","Transparent scoring","Email support"],
                cta: "Watch the demo" },
              { name: "Professional", price: "$25,000", period: "/year", highlight: true, badge: "MOST POPULAR",
                desc: "For active international recruiting teams",
                features: ["2 destination countries","5 source regions","5 seats","Everything in Starter","Travel ROI Planner","Engagement Playbook","Competitive Intelligence","Timing Calendar","PDF reports","Priority support"],
                cta: "Watch the demo" },
              { name: "Enterprise", price: "Custom", period: "", highlight: false,
                desc: "Multi-corridor, multi-campus",
                features: ["Unlimited scope + seats","Everything in Professional","Outcome-based pricing tier","Benchmarking data product","Dedicated customer success","SLA guarantee"],
                cta: "Watch the demo" },
            ].map((t, i) => (
              <motion.div key={t.name} variants={s(i * 0.1)} initial="hidden" whileInView="visible" viewport={{ once: true }}
                className={`lift rounded-2xl border p-7 flex flex-col ${t.highlight ? "bg-navy-900 border-gold-400/50 shadow-xl shadow-gold-400/5" : "bg-white border-gray-200"}`}>
                {(t as any).badge && (
                  <div className="bg-gold-400 text-navy-950 text-[10px] font-black px-3 py-1 rounded-full self-start mb-4 uppercase tracking-wider">{(t as any).badge}</div>
                )}
                <div className={`text-sm font-bold mb-1 ${t.highlight ? "text-gold-400" : "text-gray-900"}`}>{t.name}</div>
                <div className="flex items-end gap-1 mb-2">
                  <span className={`text-4xl font-black ${t.highlight ? "text-white" : "text-gray-900"}`}>{t.price}</span>
                  <span className={`text-sm mb-1 ${t.highlight ? "text-navy-400" : "text-gray-400"}`}>{t.period}</span>
                </div>
                <p className={`text-sm mb-5 ${t.highlight ? "text-navy-400" : "text-gray-500"}`}>{t.desc}</p>
                <ul className="space-y-2 flex-1 mb-6">
                  {t.features.map(f => (
                    <li key={f} className="flex items-center gap-2 text-xs">
                      <Check className={`w-3.5 h-3.5 shrink-0 ${t.highlight ? "text-gold-400" : "text-emerald-500"}`} />
                      <span className={t.highlight ? "text-navy-200" : "text-gray-600"}>{f}</span>
                    </li>
                  ))}
                </ul>
                <button onClick={() => { setModal(true); setNotifyOpen(false); }} className={`w-full py-3 rounded-xl text-sm font-bold text-center transition-all ${t.highlight ? "bg-gold-400 hover:bg-gold-500 text-navy-950" : "border border-gray-200 hover:border-navy-300 text-gray-700 hover:bg-gray-50"}`}>
                  {t.cta} →
                </button>
              </motion.div>
            ))}
          </div>

          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="mt-10 bg-amber-50 border border-amber-200 rounded-2xl p-6 text-center">
            <p className="text-amber-900 font-semibold text-base">
              💡 One poorly-planned trip to Beijing costs $15,000–30,000.
            </p>
            <p className="text-amber-700 text-sm mt-1">
              The Professional plan costs less than one bad trip — and makes every future trip measurably better.
            </p>
          </motion.div>
        </div>
      </section>

      {/* FAQ / Q&A */}
      <FAQ />

      {/* FINAL CTA */}
      <section className="bg-navy-950 py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <Parallax className="h-44 rounded-2xl mb-12" amount={30}>
              <Image src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=900&q=70"
                alt="University campus" width={900} height={200} unoptimized
                className="w-full h-full object-cover opacity-30" />
            </Parallax>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
              Your warm relationships<br /><span className="text-emerald-400">won't last forever.</span>
            </h2>
            <p className="text-navy-300 text-lg mb-10 max-w-xl mx-auto">
              See how Polaris works in 15 minutes. Watch the live demo now — no email, no signup, just insights.
            </p>
            <button onClick={() => { setModal(true); setNotifyOpen(false); }}
              className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-lg px-12 py-5 rounded-full transition-all hover:scale-105 flex items-center gap-3 shadow-lg shadow-emerald-500/30 mx-auto">
              <Play className="w-5 h-5 fill-current" /> Watch the demo now
            </button>
          </motion.div>
        </div>
      </section>


      {/* NOTIFY ME INLINE FORM */}
      {notifyOpen && !modal && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4" onClick={() => setNotifyOpen(false)}>
          <div className="bg-white rounded-2xl max-w-sm w-full p-8 shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-black text-navy-900">Get Early Access</h2>
              <button onClick={() => setNotifyOpen(false)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>

            {notifySuccess ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-3">✓</div>
                <p className="text-emerald-600 font-semibold">You're on the list!</p>
                <p className="text-gray-600 text-sm mt-2">We'll notify you when the Engagement Strategy Builder launches.</p>
              </div>
            ) : (
              <>
                <p className="text-gray-600 mb-6">Be the first to use <span className="font-bold text-gold-400">Engagement Strategy Builder</span> when it launches.</p>

                <div className="space-y-4">
                  <input
                    type="email"
                    placeholder="you@institution.edu"
                    value={notifyForm.email}
                    onChange={(e) => setNotifyForm({...notifyForm, email: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gold-400"
                  />
                  <input
                    type="text"
                    placeholder="Your Institution"
                    value={notifyForm.institution}
                    onChange={(e) => setNotifyForm({...notifyForm, institution: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gold-400"
                  />
                  <button
                    onClick={handleNotify}
                    disabled={!notifyForm.email || !notifyForm.institution}
                    className="w-full bg-gold-400 hover:bg-gold-500 disabled:opacity-50 disabled:cursor-not-allowed text-navy-950 font-bold py-3 rounded-lg transition-colors"
                  >
                    Notify Me When Live
                  </button>
                </div>

                <p className="text-gray-500 text-xs text-center mt-4">Expected launch: Q3 2026</p>
              </>
            )}
          </div>
        </div>
      )}

      {/* VIDEO MODAL */}
      {modal && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-6" onClick={() => {setModal(false); setNotifyOpen(false)}}>
          <div className="w-full max-w-5xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6 sticky top-0 bg-black/95 py-4 z-10">
              <span className="text-white font-semibold">Polaris — Product Demo</span>
              <button onClick={() => setModal(false)} className="text-white/60 hover:text-white text-sm">✕ Close</button>
            </div>
            <DemoVideo />
          </div>
        </div>
      )}

      <StrategicPlanBuilder />

      <CorridorModal corridor={selectedCorridor} isOpen={!!selectedCorridor} onClose={() => setSelectedCorridor(null)} />
      <EnhancedContactForm isOpen={contactModal} onClose={() => setContactModal(false)} />

      <Footer />
    </div>
  );
}
