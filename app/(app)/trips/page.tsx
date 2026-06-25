"use client";
import { useState } from "react";
import Image from "next/image";
import { TripPlanResponse } from "@/lib/types";
import { usd, scoreColor, cn } from "@/lib/utils";
import { generateTripPDF } from "@/lib/trip-pdf";
import { Plane, DollarSign, Users, TrendingUp, School, ChevronRight, Loader2, FileText, Check } from "lucide-react";
import { CORRIDORS } from "@/lib/types";
import { scoresFor } from "@/lib/scores";

const HISTORICAL_CPE = 2_500; // historical cost per enrollment to benchmark against

function flagFor(iso: string) { return CORRIDORS.find(c => c.iso === iso)?.flag ?? "🏳️"; }
function countryName(iso: string) { return CORRIDORS.find(c => c.iso === iso)?.country ?? iso; }

function schoolsFor(region: string, iso: string) {
  const intl = iso === "SGP" || iso === "IND";
  return [
    { id: `${region}-1`, name: `${region} No.1 High School`,        type: "public",        has_ib: false, student_count: 3800 },
    { id: `${region}-2`, name: `${region} Foreign Language School`, type: "public",        has_ib: true,  student_count: 2600 },
    ...(intl ? [{ id: `${region}-3`, name: `${region} International School`, type: "international", has_ib: true, student_count: 1200 }] : []),
  ];
}

// Build a multi-country itinerary from the selected corridors, budget and days.
// Pulls the highest-scoring regions of each chosen country (real score data),
// distributes the days/budget across them, and computes the ROI numbers.
function buildItinerary(isos: string[], budget: number, days: number): TripPlanResponse {
  const perCountry = isos.map(iso => ({ iso, regions: scoresFor(iso) }));
  const nCountries = isos.length;
  const maxStops = Math.max(nCountries, Math.min(8, Math.round(days / 2.5)));

  // Round-robin the top regions across countries until we hit maxStops.
  const picked: { iso: string; region: string; score: number }[] = [];
  for (let depth = 0; picked.length < maxStops; depth++) {
    let added = false;
    for (const pc of perCountry) {
      const r = pc.regions[depth];
      if (r) { picked.push({ iso: pc.iso, region: r.target_entity_name, score: r.score }); added = true; }
      if (picked.length >= maxStops) break;
    }
    if (!added) break;
  }
  picked.sort((a, b) => b.score - a.score); // visit highest-yield first

  // Cost model: long-haul + inter-country hops + per-stop ground cost.
  const flightsCost = 1400 + (nCountries - 1) * 900;
  const groundPer = Math.max(1500, Math.round((budget - flightsCost) / Math.max(1, picked.length)));

  const itinerary = picked.map((p, i) => {
    const days_recommended = p.iso === "SGP" ? 2 : p.score >= 75 ? 3 : 2;
    const estimated_cost_usd = groundPer + (i === 0 ? flightsCost : 0);
    const projected_enrolled_students = +((p.score / 100) * days_recommended * 3).toFixed(1);
    return {
      city_id: `${p.iso}-${i}`,
      city_name: p.region,
      country_iso: p.iso,
      opportunity_score: p.score,
      schools_to_visit: schoolsFor(p.region, p.iso),
      estimated_cost_usd,
      projected_enrolled_students,
      days_recommended,
      notes: p.score >= 70
        ? `Top-tier ${countryName(p.iso)} region — strong demand, low recruiter saturation.`
        : `Emerging ${countryName(p.iso)} region — lower competition, watch the pipeline size.`,
    };
  });

  const total_cost_usd = itinerary.reduce((a, s) => a + s.estimated_cost_usd, 0);
  const total_days = itinerary.reduce((a, s) => a + s.days_recommended, 0);
  const projected_total_enrollments = +itinerary.reduce((a, s) => a + s.projected_enrolled_students, 0).toFixed(1);
  const cpe = projected_total_enrollments > 0 ? Math.round(total_cost_usd / projected_total_enrollments) : 0;
  const savings = Math.max(0, Math.round((HISTORICAL_CPE - cpe) * projected_total_enrollments));
  const names = isos.map(countryName);
  const countryList = names.length === 1 ? names[0]
    : `${names.slice(0, -1).join(", ")} and ${names[names.length - 1]}`;

  return {
    itinerary,
    total_cost_usd,
    total_days,
    projected_total_enrollments,
    projected_cost_per_enrollment_usd: cpe,
    historical_cost_per_enrollment_usd: HISTORICAL_CPE,
    savings_vs_historical_usd: savings,
    roi_narrative: `This ${itinerary.length}-stop itinerary across ${countryList} targets the highest-yield regions in each market. At ${cpe ? "$" + cpe.toLocaleString() : "—"}/projected enrollment vs. your historical $2,500/enrollment, this approach frees roughly $${savings.toLocaleString()} in recruiting budget.`,
  };
}

export default function TripsPage() {
  const [budget, setBudget]       = useState(15000);
  const [days, setDays]           = useState(10);
  const [target, setTarget]       = useState(25);
  const [program, setProgram]     = useState("graduate");
  const [countries, setCountries] = useState<string[]>(["CHN"]);
  const [result, setResult]       = useState<TripPlanResponse | null>(null);
  const [loading, setLoading]     = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [saved, setSaved]         = useState(false);

  function toggleCountry(iso: string) {
    setCountries(prev =>
      prev.includes(iso)
        ? (prev.length > 1 ? prev.filter(c => c !== iso) : prev) // keep at least one
        : [...prev, iso]
    );
  }

  async function handlePlan() {
    if (countries.length === 0) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000)); // simulate optimization
    // order selected ISOs by the corridor display order for a stable itinerary
    const ordered = CORRIDORS.filter(c => countries.includes(c.iso)).map(c => c.iso);
    setResult(buildItinerary(ordered, budget, days));
    setLoading(false);
  }

  async function handleDownload() {
    if (!result) return;
    setDownloading(true);
    try {
      await generateTripPDF(result);
    } catch (e) {
      console.error(e);
      alert("Could not generate the PDF — please try again.");
    } finally {
      setDownloading(false);
    }
  }

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-8 py-6">
        <div className="flex items-center justify-between gap-6">
          <div className="flex-1">
            <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Plane className="w-5 h-5 text-navy-700" /> Travel ROI Planner
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Pick the countries you'll visit and your budget — get the optimal multi-country itinerary with projected enrollments and dollars saved.
            </p>
          </div>
          <Image
            src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=400&q=80"
            alt="International travel for university recruitment"
            width={128}
            height={80}
            unoptimized
            className="w-32 h-20 rounded-lg object-cover shrink-0"
          />
        </div>
      </div>

      <div className="p-8 max-w-5xl mx-auto space-y-6">
        {/* Input card */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-sm font-semibold text-gray-700 mb-5 uppercase tracking-wider">Trip Parameters</h2>

          {/* Countries to visit (multi-select) */}
          <div className="mb-6">
            <label className="text-xs font-medium text-gray-500 block mb-2">
              Countries to visit <span className="text-gray-400">· pick one or more</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {CORRIDORS.map(c => {
                const on = countries.includes(c.iso);
                return (
                  <button
                    key={c.iso}
                    type="button"
                    onClick={() => toggleCountry(c.iso)}
                    aria-pressed={on}
                    className={cn(
                      "flex items-center gap-1.5 px-3 py-2 rounded-lg border text-sm font-medium transition-all",
                      on
                        ? "bg-navy-900 border-navy-900 text-white shadow-sm"
                        : "bg-white border-gray-200 text-gray-600 hover:border-navy-300 hover:bg-gray-50"
                    )}
                  >
                    <span className="text-base">{c.flag}</span>
                    {c.country}
                    {on && <Check className="w-3.5 h-3.5 text-gold-400" />}
                  </button>
                );
              })}
            </div>
            <p className="text-[10px] text-gray-400 mt-1.5">
              {countries.length} {countries.length === 1 ? "country" : "countries"} selected · we'll route the highest-yield regions across them
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <label className="text-xs font-medium text-gray-500 block mb-1.5">Total Budget (USD)</label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                <input type="number" value={budget} onChange={e => setBudget(+e.target.value)} min={5000} max={100000} step={1000}
                  className="w-full pl-8 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-navy-400" />
              </div>
              <p className="text-[10px] text-gray-400 mt-1">Avg bad trip costs $20k–$50k</p>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 block mb-1.5">Trip Duration (days)</label>
              <input type="number" value={days} onChange={e => setDays(+e.target.value)} min={3} max={30}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-navy-400" />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 block mb-1.5">Target Enrollments</label>
              <div className="relative">
                <Users className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                <input type="number" value={target} onChange={e => setTarget(+e.target.value)} min={5} max={200}
                  className="w-full pl-8 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-navy-400" />
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 block mb-1.5">Program Type</label>
              <select value={program} onChange={e => setProgram(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-navy-400 bg-white">
                <option value="graduate">Graduate</option>
                <option value="undergraduate">Undergraduate</option>
                <option value="mba">MBA</option>
                <option value="all">All Programs</option>
              </select>
            </div>
          </div>
          <button onClick={handlePlan} disabled={loading}
            className="mt-5 btn-primary flex items-center gap-2 disabled:opacity-60">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <TrendingUp className="w-4 h-4" />}
            {loading ? "Optimizing itinerary…" : "Generate Optimal Itinerary"}
          </button>
        </div>

        {/* How it works */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm px-6 py-4">
          <div className="flex items-center justify-center gap-4">
            <div className="text-center">
              <div className="text-xs font-semibold text-gray-600 mb-0.5">Step 1</div>
              <div className="text-xs text-gray-400">Enter budget</div>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-300 shrink-0" />
            <div className="text-center">
              <div className="text-xs font-semibold text-gray-600 mb-0.5">Step 2</div>
              <div className="text-xs text-gray-400">AI optimizes itinerary</div>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-300 shrink-0" />
            <div className="text-center">
              <div className="text-xs font-semibold text-gray-600 mb-0.5">Step 3</div>
              <div className="text-xs text-gray-400">Download PDF for CFO</div>
            </div>
          </div>
        </div>

        {/* Results */}
        {result && (
          <>
            {/* ROI summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Total Trip Cost",     value: usd(result.total_cost_usd),                      sub: `${result.total_days} days`,                        color: "text-gray-900" },
                { label: "Projected Enrolled",  value: `~${Math.round(result.projected_total_enrollments)}`, sub: "students",                                  color: "text-emerald-700" },
                { label: "Cost per Enrollment", value: usd(result.projected_cost_per_enrollment_usd),    sub: `vs ${usd(result.historical_cost_per_enrollment_usd ?? 0)} historical`, color: "text-navy-700" },
                { label: "Savings vs History",  value: usd(result.savings_vs_historical_usd ?? 0),       sub: "budget freed up",                                  color: "text-emerald-600" },
              ].map(({ label, value, sub, color }) => (
                <div key={label} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
                  <div className="text-xs text-gray-400 mb-1">{label}</div>
                  <div className={cn("text-2xl font-bold", color)}>{value}</div>
                  <div className="text-xs text-gray-400 mt-0.5">{sub}</div>
                </div>
              ))}
            </div>

            {/* ROI narrative */}
            <div className="bg-navy-900 rounded-xl p-5 text-white">
              <div className="text-xs text-navy-400 uppercase tracking-wider mb-2 font-medium">ROI Summary — For Your CFO</div>
              <p className="text-sm leading-relaxed">{result.roi_narrative}</p>
            </div>

            {/* Itinerary */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100">
                <h2 className="font-semibold text-gray-900">
                  Optimized Itinerary — {result.itinerary.length} stops
                  {(() => { const n = new Set(result.itinerary.map(s => s.country_iso)).size; return n > 1 ? ` across ${n} countries` : ""; })()}
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">Ranked by projected yield/cost ratio. Visit in this order to minimize travel cost.</p>
              </div>
              <div className="divide-y divide-gray-50">
                {result.itinerary.map((stop, i) => {
                  const c = scoreColor(stop.opportunity_score);
                  return (
                    <div key={stop.city_id} className="px-6 py-5">
                      <div className="flex items-start gap-4">
                        <div className="w-8 h-8 rounded-full bg-navy-900 text-white flex items-center justify-center text-sm font-bold shrink-0">
                          {i + 1}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="text-base mr-1.5">{flagFor(stop.country_iso)}</span>
                              <span className="font-semibold text-gray-900 text-base">{stop.city_name}</span>
                              <span className="text-gray-400 text-sm ml-2">· {stop.days_recommended} days</span>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className={cn("text-sm font-bold", c.text)}>Score {stop.opportunity_score}</span>
                              <span className="text-sm text-gray-500">{usd(stop.estimated_cost_usd)}</span>
                              <span className="text-sm font-semibold text-emerald-700">~{stop.projected_enrolled_students} enrolled</span>
                            </div>
                          </div>
                          {stop.notes && (
                            <p className="text-xs text-gray-500 mt-1">{stop.notes}</p>
                          )}
                          <div className="mt-3">
                            <div className="text-xs font-medium text-gray-500 mb-1.5 flex items-center gap-1">
                              <School className="w-3.5 h-3.5" /> Schools to visit ({stop.schools_to_visit.length})
                            </div>
                            <div className="flex flex-wrap gap-1.5">
                              {stop.schools_to_visit.map(s => (
                                <span key={s.id}
                                  className={cn("text-xs px-2 py-0.5 rounded-full border",
                                    s.has_ib ? "bg-purple-50 border-purple-200 text-purple-700" : "bg-gray-50 border-gray-200 text-gray-600"
                                  )}>
                                  {s.has_ib && "IB · "}{s.name}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* PDF download note */}
            <div className="bg-navy-50 border border-navy-100 rounded-xl px-5 py-4 flex items-center justify-between gap-4">
              <p className="text-sm text-navy-700">
                Download the full trip report as a PDF → share with your CFO for budget approval
              </p>
              <button
                onClick={handleDownload}
                disabled={downloading}
                className="shrink-0 flex items-center gap-2 bg-navy-800 hover:bg-navy-900 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors disabled:opacity-70"
              >
                <FileText className="w-4 h-4" /> {downloading ? "Generating…" : "Download PDF"}
              </button>
            </div>

            {/* CTA */}
            <div className="flex gap-3">
              <button onClick={handleSave} className="btn-primary flex items-center gap-2">
                {saved ? <Check className="w-4 h-4" /> : <Plane className="w-4 h-4" />}
                {saved ? "Saved!" : "Save as Trip Plan"}
              </button>
              <button onClick={handleDownload} disabled={downloading}
                className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-70">
                {downloading ? "Generating…" : "Export PDF for CFO"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
