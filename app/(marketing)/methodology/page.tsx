import Link from "next/link";
import { Logo } from "@/components/Logo";

export const metadata = { title: "Data & Methodology — Polaris" };

const SOURCES = [
  { name: "IIE Open Doors", url: "https://opendoorsdata.org", external: true, feeds: "Annual census of international students enrolled at US institutions, by origin country. Basis for corridor volume figures (e.g. 277,398 Chinese students in the US, 2023 report).", cadence: "Annual" },
  { name: "U.S. Department of State — Visa Statistics", url: "https://travel.state.gov/content/travel/en/us-visas/visa-information-resources/visa-statistics.html", external: true, feeds: "F-1 visa issuances and refusal rates by nationality. Basis for corridor visa-approval figures (China ~66%, Japan ~95%, Singapore ~97%).", cadence: "Monthly / annual" },
  { name: "UNESCO Institute for Statistics", url: "https://uis.unesco.org", external: true, feeds: "Bilateral student-mobility flows. Basis for 5-year trend lines per corridor.", cadence: "Annual" },
  { name: "World Bank Open Data", url: "https://data.worldbank.org", external: true, feeds: "GDP per capita, population structure (18–24 cohort), household income. Basis for the Economic Fit factor.", cadence: "Annual" },
  { name: "EF English Proficiency Index", url: "https://www.ef.com/epi", external: true, feeds: "Regional English proficiency rankings. Basis for the Academic Pipeline factor, weighted highest for Japan.", cadence: "Annual" },
  { name: "China National Bureau of Statistics", url: "http://www.stats.gov.cn", external: true, feeds: "Province-level demographics, school counts, graduating cohorts.", cadence: "Annual" },
  { name: "Japan e-Stat / MEXT", url: "https://www.e-stat.go.jp", external: true, feeds: "Prefecture-level demographics and education statistics.", cadence: "Annual" },
  { name: "Singapore MOE / SingStat", url: "https://www.singstat.gov.sg", external: true, feeds: "Planning-region demographics, A-level cohorts, school directories.", cadence: "Annual" },
  { name: "Polaris field scan", url: null, external: false, feeds: "Competitor recruiting presence, school-fair calendars, partner-school activity. Compiled from public recruiting pages, fair registrations and counselor networks.", cadence: "Refreshed weekly" },
];

const FACTORS = [
  ["Student demand", "25%", "Population aged 18–24, high-school density and historical outbound enrollment flows."],
  ["Economic fit", "20%", "GDP per capita and household income measured against full international tuition cost."],
  ["Academic pipeline", "15%", "Secondary completion rates, English proficiency, strength of feeder high schools."],
  ["Corridor viability", "15%", "F-1 approval rate, direct flight connectivity, policy stability."],
  ["Market white space", "15%", "Inverted competitor saturation — regions with fewer US recruiters score higher."],
  ["Migration momentum", "10%", "Diaspora size in the US and the 5-year direction of the flow."],
];

export default function MethodologyPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-6 py-10">
        <Link href="/landing"><Logo size="md" /></Link>
        <h1 className="text-3xl font-black text-navy-950 mt-8 mb-2">Data & Methodology</h1>
        <p className="text-sm text-gray-400 mb-10">How Polaris scores are built — sources, weights, cadence and limitations.</p>

        <section className="mb-12">
          <h2 className="font-black text-navy-900 text-xl mb-4">1. Data sources</h2>
          <div className="space-y-3">
            {SOURCES.map(src => (
              <div key={src.name} className="border border-gray-100 rounded-xl p-4 bg-gray-50 hover:border-navy-900 transition">
                <div className="flex flex-wrap items-baseline justify-between gap-2 mb-1">
                  <span className="font-bold text-gray-900 text-sm">{src.name}</span>
                  <span className="text-[10px] text-gray-400 uppercase tracking-wider">{src.cadence}</span>
                </div>
                {src.url ? (
                  <a href={src.url} target="_blank" rel="noopener noreferrer" className="text-gold-500 hover:text-gold-600 text-xs font-semibold mb-2 inline-block transition">
                    Visit source →
                  </a>
                ) : (
                  <span className="text-[10px] text-gray-400 italic mb-2 block">Proprietary data</span>
                )}
                <p className="text-gray-600 text-sm leading-relaxed">{src.feeds}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="font-black text-navy-900 text-xl mb-4">2. The opportunity score</h2>
          <p className="text-gray-600 text-sm leading-relaxed mb-5">
            Each region receives a score from 0–100, computed as a weighted blend of six factors.
            Raw inputs are normalized within each corridor (so a Japanese prefecture is compared
            against Japan, not against Chinese provinces), then combined:
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
            (high / medium / low) reflecting data freshness and coverage — regions relying on older or
            sparser inputs are flagged rather than silently scored.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="font-black text-navy-900 text-xl mb-4">3. Timing & engagement intelligence</h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            Visit-window scores are built from each market's academic calendar (Gaokao in China,
            entrance-exam season in Japan, A-level cycle in Singapore), application deadlines
            (EA/ED, Regular Decision) and school-fair calendars. Engagement-format effectiveness
            (e.g. alumni events vs. fairs) is modeled from observed conversion patterns and is
            refined as customers report outcomes back into the platform.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="font-black text-navy-900 text-xl mb-4">4. Known limitations</h2>
          <ul className="space-y-2 text-gray-600 text-sm leading-relaxed list-disc pl-5">
            <li>Public mobility datasets lag 12–18 months; we extrapolate trends and flag low-confidence regions.</li>
            <li>Competitor-presence data is compiled from public footprints and may undercount quiet agent-led activity.</li>
            <li>Scores are decision support, not guarantees — they rank where your budget is statistically most productive.</li>
            <li>Demo environment displays illustrative figures modeled on the sources above.</li>
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
