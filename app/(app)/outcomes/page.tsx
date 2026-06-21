"use client";
import { useState } from "react";
import { usd, cn } from "@/lib/utils";
import { TrendingUp, Plus, CheckCircle, BarChart2, ArrowDown, Minus, ArrowUp } from "lucide-react";

const DEMO_OUTCOMES = [
  { id: "1", region: "Zhejiang", year: "2023-24", program: "Graduate", enrolled: 22, applied: 48, conversion: 0.46, predicted: 82, trip_cost: 3100, cost_per: 141 },
  { id: "2", region: "Hubei",    year: "2023-24", program: "Graduate", enrolled: 14, applied: 35, conversion: 0.40, predicted: 73, trip_cost: 3200, cost_per: 229 },
  { id: "3", region: "Sichuan",  year: "2023-24", program: "Graduate", enrolled: 18, applied: 41, conversion: 0.44, predicted: 74, trip_cost: 3400, cost_per: 189 },
  { id: "4", region: "Beijing",  year: "2022-23", program: "Graduate", enrolled: 8,  applied: 32, conversion: 0.25, predicted: 28, trip_cost: 8500, cost_per: 1063 },
  { id: "5", region: "Shanghai", year: "2022-23", program: "Graduate", enrolled: 6,  applied: 30, conversion: 0.20, predicted: 26, trip_cost: 9200, cost_per: 1533 },
];

export default function OutcomesPage() {
  const [showForm, setShowForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const totalEnrolled = DEMO_OUTCOMES.reduce((s, r) => s + r.enrolled, 0);
  const totalSpent    = DEMO_OUTCOMES.reduce((s, r) => s + r.trip_cost, 0);
  const avgCPE        = totalSpent / totalEnrolled;
  const accurateCount = DEMO_OUTCOMES.filter(r => Math.abs(r.predicted - (r.enrolled > 15 ? 80 : r.enrolled > 8 ? 60 : 30)) <= 15).length;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-100 px-8 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-navy-700" /> Outcome Reports
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Every report you submit improves the scoring model for all universities.
            </p>
          </div>
          <button onClick={() => setShowForm(true)} className="btn-primary flex items-center gap-2">
            <Plus className="w-4 h-4" /> Report Outcomes
          </button>
        </div>
      </div>

      <div className="p-8 max-w-5xl mx-auto space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Total Enrolled (all cycles)", value: totalEnrolled, sub: "across 5 reported trips", color: "text-emerald-700" },
            { label: "Total Spent",  value: usd(totalSpent), sub: "recruiting budget", color: "text-gray-900" },
            { label: "Avg Cost/Enrollment", value: usd(Math.round(avgCPE)), sub: "platform-guided trips", color: "text-navy-700" },
            { label: "Model Accuracy", value: `${Math.round(accurateCount / DEMO_OUTCOMES.length * 100)}%`, sub: "predictions within ±15pts", color: "text-purple-700" },
          ].map(({ label, value, sub, color }) => (
            <div key={label} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
              <div className="text-xs text-gray-400 mb-1">{label}</div>
              <div className={cn("text-2xl font-bold", color)}>{value}</div>
              <div className="text-xs text-gray-400 mt-0.5">{sub}</div>
            </div>
          ))}
        </div>

        {/* Key insight box */}
        <div className="bg-navy-900 text-white rounded-xl p-5">
          <div className="text-xs text-navy-400 uppercase tracking-wider font-medium mb-2">Model Insight</div>
          <p className="text-sm leading-relaxed">
            Based on your 5 submitted outcome reports: <strong>inland provinces (Zhejiang, Hubei, Sichuan)</strong> are
            outperforming at <strong>$186 avg cost/enrollment</strong> vs <strong>$1,298</strong> for Beijing/Shanghai.
            Score predictions are accurate within ±15 points on 80% of reports.
            <span className="text-gold-400 ml-1">Submit {Math.max(0, 50 - 5)} more reports to trigger model retraining.</span>
          </p>
        </div>

        {/* Outcomes table */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">Reported Outcomes</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  {["Region", "Year", "Program", "Enrolled", "Applied", "Conversion", "Predicted Score", "Cost/Enrolled", "vs Platform Avg"].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {DEMO_OUTCOMES.map(r => {
                  const efficiency = r.cost_per < 500 ? "text-emerald-700 bg-emerald-50" : r.cost_per < 1000 ? "text-amber-700 bg-amber-50" : "text-red-700 bg-red-50";
                  return (
                    <tr key={r.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-semibold text-gray-900">{r.region}</td>
                      <td className="px-4 py-3 text-gray-600">{r.year}</td>
                      <td className="px-4 py-3 text-gray-600">{r.program}</td>
                      <td className="px-4 py-3 font-semibold text-emerald-700">{r.enrolled}</td>
                      <td className="px-4 py-3 text-gray-600">{r.applied}</td>
                      <td className="px-4 py-3 text-gray-700">{(r.conversion * 100).toFixed(0)}%</td>
                      <td className="px-4 py-3 text-navy-700 font-medium">{r.predicted}/100</td>
                      <td className="px-4 py-3">
                        <span className={cn("px-2 py-0.5 rounded-full text-xs font-medium", efficiency)}>
                          {usd(r.cost_per)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-500">
                        {r.cost_per < 500 ? "🟢 Excellent" : r.cost_per < 1000 ? "🟡 Average" : "🔴 Poor"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Submit form */}
        {showForm && !submitted && (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h2 className="font-semibold text-gray-900 mb-5">Report New Outcomes</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[
                { label: "Source Region", type: "text", placeholder: "e.g. Zhejiang" },
                { label: "Academic Year", type: "text", placeholder: "e.g. 2024-25" },
                { label: "Program Type", type: "text", placeholder: "Graduate / Undergrad / MBA" },
                { label: "Students Enrolled", type: "number", placeholder: "0" },
                { label: "Students Applied", type: "number", placeholder: "0" },
                { label: "Trip Budget Spent (USD)", type: "number", placeholder: "0" },
              ].map(f => (
                <div key={f.label}>
                  <label className="text-xs font-medium text-gray-500 block mb-1.5">{f.label}</label>
                  <input type={f.type} placeholder={f.placeholder}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-navy-400" />
                </div>
              ))}
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={() => setSubmitted(true)} className="btn-primary flex items-center gap-2">
                <BarChart2 className="w-4 h-4" /> Submit — Improve the Model
              </button>
              <button onClick={() => setShowForm(false)} className="btn-ghost text-sm">Cancel</button>
            </div>
          </div>
        )}

        {submitted && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <div className="font-semibold text-emerald-800">Outcome reported successfully</div>
              <div className="text-sm text-emerald-700 mt-0.5">
                6 of 50 reports needed to trigger model retraining. Every report makes the platform smarter for all users.
              </div>
            </div>
          </div>
        )}

        {/* ── Benchmarking Section ─────────────────────────────────── */}
        <div className="pt-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Your performance vs. R1 peers</h2>
              <p className="text-sm text-gray-500 mt-0.5">Anonymized aggregate data from 15+ R1 institutions · 2023–24 cycle</p>
            </div>
            <span className="text-xs font-medium bg-navy-50 text-navy-700 border border-navy-100 px-3 py-1 rounded-full">
              R1 Benchmark
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
            {[
              {
                label: "Cost per Enrollment",
                yours: "$2,500",
                median: "$1,850",
                percentile: "35th",
                status: "below",
                note: "Below R1 median",
              },
              {
                label: "Conversion Rate",
                yours: "38%",
                median: "38%",
                percentile: "50th",
                status: "at",
                note: "At R1 median",
              },
              {
                label: "Enrolled per Trip",
                yours: "~4",
                median: "8",
                percentile: "22nd",
                status: "below",
                note: "Below R1 median",
              },
              {
                label: "Source Country Diversity",
                yours: "2 countries",
                median: "6.2",
                percentile: "18th",
                status: "below",
                note: "Well below median",
              },
            ].map(({ label, yours, median, percentile, status, note }) => {
              const isBelow = status === "below";
              const isAt = status === "at";
              const badgeCn = isBelow
                ? "bg-red-50 text-red-700 border-red-200"
                : isAt
                ? "bg-amber-50 text-amber-700 border-amber-200"
                : "bg-emerald-50 text-emerald-700 border-emerald-200";
              const Icon = isBelow ? ArrowDown : isAt ? Minus : ArrowUp;
              return (
                <div key={label} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
                  <div className="text-xs text-gray-400 mb-3 leading-tight">{label}</div>
                  <div className="flex items-end gap-1.5 mb-1">
                    <span className="text-2xl font-black text-gray-900">{yours}</span>
                    <span className="text-xs text-gray-400 mb-0.5">you</span>
                  </div>
                  <div className="text-xs text-gray-500 mb-3">
                    R1 median: <span className="font-semibold text-gray-700">{median}</span>
                  </div>
                  <div className={cn("inline-flex items-center gap-1 border rounded-full px-2 py-0.5 text-xs font-semibold", badgeCn)}>
                    <Icon className="w-3 h-3" />
                    {percentile} percentile
                  </div>
                  <div className="text-[10px] text-gray-400 mt-1.5">{note}</div>
                </div>
              );
            })}
          </div>

          {/* Callout box */}
          <div className="bg-navy-900 rounded-xl p-5 mb-4">
            <div className="text-xs text-navy-400 uppercase tracking-wider font-semibold mb-2">Benchmarking Insight</div>
            <p className="text-sm text-white/80 leading-relaxed">
              Top-quartile R1 universities average{" "}
              <span className="text-gold-400 font-semibold">$1,200/enrollment</span>. They recruit in Hubei, Zhejiang,
              and Shaanxi — not Beijing. Your platform subscription at $25,000/year pays for itself if you enroll just{" "}
              <span className="text-white font-semibold">3 additional students</span> per year.
            </p>
          </div>

          {/* Upgrade nudge */}
          <div className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-xl px-5 py-4">
            <div className="flex items-center gap-3">
              <BarChart2 className="w-5 h-5 text-navy-600 shrink-0" />
              <p className="text-sm text-gray-700">
                <span className="font-semibold">Upgrade to Enterprise</span> to unlock full peer benchmarking with
                anonymized comparison data from 15+ R1 institutions.
              </p>
            </div>
            <a
              href="/demo"
              className="shrink-0 ml-4 bg-navy-800 hover:bg-navy-900 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors whitespace-nowrap"
            >
              Talk to us →
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}
