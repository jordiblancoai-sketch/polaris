import Link from "next/link";
import { Logo } from "@/components/Logo";

export const metadata = { title: "Data & Methodology — Polaris" };

// What actually powers a score today — live inputs.
const LIVE_INPUTS = [
  {
    name: "Live web-intelligence engine",
    tag: "Live · weekly",
    feeds: "For every one of 136 regions, Polaris runs a weekly battery of targeted searches across the open web and quantifies real-world signals — how much study-abroad demand is surfacing, how saturated the region already is with competing recruiters, and its economic and academic readiness. This is the layer that keeps scores current.",
  },
  {
    name: "U.S. Department of State — F-1 visa data",
    tag: "Public · live input",
    feeds: "Country-level F-1 visa-approval rates anchor the corridor-strength dimension (China ~66%, Japan ~95%, Singapore ~97%).",
  },
  {
    name: "Demand-anchored baselines",
    tag: "Anchor",
    feeds: "Each region carries a population- and demand-anchored baseline, so the live signal is grounded in known market size rather than web noise. It's why large, proven markets can't be unseated by a single noisy signal.",
  },
];

// Authoritative public datasets we benchmark against and are integrating as live feeds.
const BENCHMARKS = [
  { name: "IIE Open Doors", url: "https://opendoorsdata.org", feeds: "Annual census of international students at US institutions by origin country — the canonical corridor-volume reference (e.g. ~277k students from China, 2023)." },
  { name: "UNESCO Institute for Statistics", url: "https://uis.unesco.org", feeds: "Bilateral student-mobility flows behind multi-year corridor trend lines." },
  { name: "World Bank Open Data", url: "https://data.worldbank.org", feeds: "GDP per capita, 18–24 population structure and household income — the economic-fit reference." },
  { name: "EF English Proficiency Index", url: "https://www.ef.com/epi", feeds: "Regional English-proficiency rankings behind the academic-readiness signal." },
  { name: "National statistics bureaus", url: "https://www.stats.gov.cn", feeds: "China NBS, Japan e-Stat / MEXT, Singapore MOE / SingStat — regional demographics and graduating cohorts." },
];

// Real weights, matching the live scoring model.
const FACTORS = [
  ["Student demand", "25%", "Study-abroad demand surfacing across the open web, grounded in the 18–24 population and high-school density."],
  ["Competitive white space", "25%", "Inverted competitor saturation — regions with fewer US recruiters present score higher. This is where budget works hardest."],
  ["Economic fit", "15%", "Local economic capacity measured against full international tuition — the ability-to-pay signal."],
  ["Academic readiness", "15%", "English proficiency, test-prep density and the strength of feeder high schools."],
  ["Corridor strength", "10%", "U.S. F-1 visa-approval rate and travel access for the corridor."],
  ["Migration intent", "10%", "Visa-pathway and study-abroad-agency activity that signals intent to go."],
];

export default function MethodologyPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-6 py-10">
        <Link href="/landing"><Logo size="md" /></Link>
        <h1 className="text-3xl font-black text-navy-950 mt-8 mb-2">Data &amp; Methodology</h1>
        <p className="text-sm text-gray-400 mb-8">How Polaris scores are built — the live signals, the weights, the refresh cadence, and the limits. Transparent by design.</p>

        {/* Highlight: the engine */}
        <div className="rounded-2xl bg-navy-950 p-6 md:p-8 mb-12">
          <div className="text-gold-400 text-[11px] font-bold uppercase tracking-widest mb-2">A live engine, not a static report</div>
          <p className="text-navy-200 text-sm leading-relaxed">
            Polaris is powered by a <strong className="text-white">live web-intelligence engine</strong>. Every week, for all 136
            regions, it measures real signals of student demand and competitive saturation across the open web —
            anchored by U.S. visa data and population-based baselines, and benchmarked against the public datasets
            your leadership already trusts. The output is a transparent, 0–100 score you can trace and defend.
          </p>
        </div>

        <section className="mb-12">
          <h2 className="font-black text-navy-900 text-xl mb-1">1. What powers the score today</h2>
          <p className="text-gray-400 text-xs mb-4">The live inputs behind every number, refreshed weekly.</p>
          <div className="space-y-3">
            {LIVE_INPUTS.map(src => (
              <div key={src.name} className="border border-gray-100 rounded-xl p-4 bg-gray-50">
                <div className="flex flex-wrap items-baseline justify-between gap-2 mb-1">
                  <span className="font-bold text-gray-900 text-sm">{src.name}</span>
                  <span className="text-[10px] text-gold-600 uppercase tracking-wider font-semibold">{src.tag}</span>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">{src.feeds}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="font-black text-navy-900 text-xl mb-1">2. The six-factor opportunity score</h2>
          <p className="text-gray-600 text-sm leading-relaxed mb-5">
            Each region receives a 0–100 score from six weighted dimensions. Live signals are normalized
            <em> within each corridor</em> (so a Japanese prefecture is ranked against Japan, not against Chinese
            provinces) and blended with a demand-anchored baseline, so credible markets stay on top and noise
            can't dominate.
          </p>
          <div className="space-y-3 mb-5">
            {FACTORS.map(([name, w, desc]) => (
              <div key={name} className="flex gap-4 items-start">
                <span className="shrink-0 w-12 text-right font-black text-gold-500">{w}</span>
                <div>
                  <div className="font-bold text-gray-900 text-sm">{name}</div>
                  <p className="text-gray-500 text-sm">{desc}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="text-gray-600 text-sm leading-relaxed">
            Scores are recomputed weekly. Each region also carries a <strong>confidence rating</strong>
            {" "}(high / medium / low) reflecting signal strength and coverage — thinner-signal regions are
            flagged rather than silently scored.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="font-black text-navy-900 text-xl mb-1">3. Datasets we benchmark against</h2>
          <p className="text-gray-600 text-sm leading-relaxed mb-4">
            We benchmark every Polaris ranking against the authoritative public datasets your provost already
            trusts, and are integrating them as live inputs corridor by corridor. Today they validate rankings
            and inform our baselines; direct feed integration is rolling out.
          </p>
          <div className="space-y-3">
            {BENCHMARKS.map(src => (
              <div key={src.name} className="border border-gray-100 rounded-xl p-4 bg-gray-50 hover:border-navy-900 transition">
                <div className="flex flex-wrap items-baseline justify-between gap-2 mb-1">
                  <span className="font-bold text-gray-900 text-sm">{src.name}</span>
                  <a href={src.url} target="_blank" rel="noopener noreferrer" className="text-gold-500 hover:text-gold-600 text-xs font-semibold transition">Visit source →</a>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">{src.feeds}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="font-black text-navy-900 text-xl mb-4">4. Timing &amp; engagement intelligence</h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            Visit-window scores are built from each market's academic calendar (Gaokao in China, entrance-exam
            season in Japan, the A-level cycle in Singapore), US application deadlines (EA/ED, Regular Decision)
            and school-fair timing. Engagement-format guidance (e.g. alumni events vs. fairs) reflects observed
            conversion patterns and is refined as customers report real outcomes back into the platform.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="font-black text-navy-900 text-xl mb-4">5. How we keep it honest</h2>
          <ul className="space-y-2 text-gray-600 text-sm leading-relaxed list-disc pl-5">
            <li>Scores today are driven by live web-intelligence signals blended with demand baselines and visa data. Programmatic integration of the benchmark datasets above is in active development.</li>
            <li>Outcome calibration — measuring each prediction against realized enrollments — is being added to tighten accuracy over time.</li>
            <li>Public mobility datasets lag 12–18 months; the live engine is what keeps the picture current between releases.</li>
            <li>Competitor-presence signals are drawn from public footprints and may undercount quiet, agent-led activity.</li>
            <li>Scores are decision support, not guarantees — they rank where your budget is statistically most productive.</li>
          </ul>
        </section>

        <div className="pt-6 border-t border-gray-100 flex items-center justify-between">
          <Link href="/landing" className="text-sm text-navy-700 hover:text-navy-900">← Back to home</Link>
          <Link href="/contact" className="text-sm text-gold-500 hover:text-gold-400 font-bold">Questions about the data? →</Link>
        </div>
      </div>
    </div>
  );
}
