"use client";
import { useState } from "react";
import Image from "next/image";
import { TripPlanResponse } from "@/lib/types";
import { usd, scoreColor, cn } from "@/lib/utils";
import { generateTripPDF } from "@/lib/trip-pdf";
import { Plane, DollarSign, Users, TrendingUp, School, ChevronRight, Loader2, FileText, Check } from "lucide-react";

// Demo trip result for China → US
const DEMO_TRIP: TripPlanResponse = {
  itinerary: [
    { city_id: "1", city_name: "Wuhan",    country_iso: "CHN", opportunity_score: 73, schools_to_visit: [{ id:"1", name:"Wuhan University High School", type:"public", has_ib:false, student_count:3500 }, { id:"2", name:"Huazhong University Affiliated High School", type:"public", has_ib:false, student_count:4000 }, { id:"3", name:"Wuhan Foreign Language School", type:"public", has_ib:true, student_count:2800 }], estimated_cost_usd: 3200, projected_enrolled_students: 6.8, days_recommended: 3, notes: "China's biggest student city. Schedule visits Mon–Wed." },
    { city_id: "2", city_name: "Chengdu",  country_iso: "CHN", opportunity_score: 74, schools_to_visit: [{ id:"4", name:"Chengdu No.7 High School", type:"public", has_ib:false, student_count:3800 }, { id:"5", name:"Sichuan University Affiliated School", type:"public", has_ib:false, student_count:3200 }, { id:"6", name:"Chengdu International School", type:"international", has_ib:true, student_count:1200 }], estimated_cost_usd: 3400, projected_enrolled_students: 7.2, days_recommended: 3, notes: "Fast-growing tech hub. 95 competitors vs 380 in Beijing." },
    { city_id: "3", city_name: "Hangzhou", country_iso: "CHN", opportunity_score: 82, schools_to_visit: [{ id:"7", name:"Hangzhou No.2 High School", type:"public", has_ib:false, student_count:4200 }, { id:"8", name:"Zhejiang University Affiliated High School", type:"public", has_ib:false, student_count:3600 }, { id:"9", name:"Hangzhou Foreign Language School", type:"public", has_ib:true, student_count:2400 }], estimated_cost_usd: 3100, projected_enrolled_students: 8.4, days_recommended: 2, notes: "Top scoring province. Alibaba/tech wealth. Start here." },
    { city_id: "4", city_name: "Nanjing",  country_iso: "CHN", opportunity_score: 81, schools_to_visit: [{ id:"10", name:"Nanjing Foreign Language School", type:"public", has_ib:true, student_count:3000 }, { id:"11", name:"Nanjing No.1 High School", type:"public", has_ib:false, student_count:3800 }], estimated_cost_usd: 2800, projected_enrolled_students: 7.8, days_recommended: 2, notes: "Strong STEM pipeline. Nanjing University feeder schools." },
  ],
  total_cost_usd: 12_500,
  total_days: 10,
  projected_total_enrollments: 30.2,
  projected_cost_per_enrollment_usd: 414,
  historical_cost_per_enrollment_usd: 2_500,
  savings_vs_historical_usd: 63_000,
  roi_narrative: "This 4-city inland itinerary focuses on underserved markets where your budget works harder. At $414/projected enrollment vs. your historical $2,500/enrollment, this approach frees $63,000 in recruiting budget — the equivalent of another full trip cycle.",
};

export default function TripsPage() {
  const [budget, setBudget]       = useState(15000);
  const [days, setDays]           = useState(10);
  const [target, setTarget]       = useState(25);
  const [program, setProgram]     = useState("graduate");
  const [result, setResult]       = useState<TripPlanResponse | null>(null);
  const [loading, setLoading]     = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [saved, setSaved]         = useState(false);

  async function handlePlan() {
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200)); // simulate API call
    setResult(DEMO_TRIP);
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
              Enter your budget and trip constraints — get the optimal China itinerary with projected enrollments and dollars saved.
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
                <h2 className="font-semibold text-gray-900">Optimized Itinerary — {result.itinerary.length} Cities</h2>
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
