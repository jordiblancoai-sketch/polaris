"use client";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Building2, CreditCard, Globe, Check, Lock } from "lucide-react";

const CORRIDORS = [
  {
    flags: "🇨🇳 → 🇺🇸",
    name: "China → United States",
    detail: "31 provinces scored · Graduate focus",
    active: true,
    locked: false,
    stats: { regions: 31, students: "277k", visa: "66%" },
  },
  {
    flags: "🇯🇵 → 🇺🇸",
    name: "Japan → United States",
    detail: "47 prefectures scored · All programs",
    active: true,
    locked: false,
    stats: { regions: 47, students: "18.9k", visa: "95%" },
  },
  {
    flags: "🇰🇷 → 🇺🇸",
    name: "South Korea → United States",
    detail: "17 regions scored · All programs",
    active: true,
    locked: false,
    stats: { regions: 17, students: "43.8k", visa: "89%" },
  },
  {
    flags: "🇮🇳 → 🇺🇸",
    name: "India → United States",
    detail: "36 states scored · Graduate focus",
    active: true,
    locked: false,
    stats: { regions: 36, students: "331k", visa: "80%" },
  },
  {
    flags: "🇸🇬 → 🇺🇸",
    name: "Singapore → United States",
    detail: "5 planning regions · All programs",
    active: true,
    locked: false,
    stats: { regions: 5, students: "3.6k", visa: "97%" },
  },
];

export default function SettingsPage() {
  const [saved, setSaved] = useState(false);

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-100 px-6 md:px-8 py-6">
        <h1 className="text-xl font-bold text-gray-900">Settings</h1>
        <p className="text-sm text-gray-500 mt-1">University account, subscription, and team management</p>
      </div>

      <div className="p-4 md:p-8 max-w-3xl mx-auto space-y-6">

        {/* University Profile */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center gap-2 mb-5">
            <Building2 className="w-4 h-4 text-navy-700" />
            <h2 className="font-semibold text-gray-900">University Profile</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { label: "University Name", value: "Demo University" },
              { label: "Country", value: "United States" },
              { label: "Institution Type", value: "R1 Research University" },
              { label: "Primary Focus", value: "Graduate Programs" },
            ].map(f => (
              <div key={f.label}>
                <label className="text-xs font-medium text-gray-500 block mb-1.5">{f.label}</label>
                <input defaultValue={f.value}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-navy-400" />
              </div>
            ))}
          </div>
          <button onClick={handleSave} className="mt-4 btn-primary text-sm flex items-center gap-2">
            {saved && <Check className="w-4 h-4" />}{saved ? "Saved!" : "Save changes"}
          </button>
        </div>

        {/* Active Corridors */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-navy-700" />
              <h2 className="font-semibold text-gray-900">Active Corridors</h2>
            </div>
            <span className="text-xs bg-navy-50 text-navy-700 border border-navy-100 px-2 py-0.5 rounded-full font-medium">
              Professional — {CORRIDORS.length} corridors
            </span>
          </div>
          <div className="space-y-3">
            {CORRIDORS.map(c => (
              <div key={c.name}
                className={cn(
                  "flex items-center justify-between p-4 rounded-xl border transition-all",
                  c.active ? "bg-navy-50 border-navy-100" : "bg-gray-50 border-gray-200 opacity-60"
                )}>
                <div className="flex items-center gap-3">
                  <span className="text-xl">{c.flags}</span>
                  <div>
                    <div className="text-sm font-semibold text-navy-900">{c.name}</div>
                    <div className="text-xs text-navy-500 mt-0.5">{c.detail}</div>
                    <div className="flex gap-3 mt-1.5">
                      <span className="text-[10px] text-gray-500">{c.stats.regions} regions</span>
                      <span className="text-[10px] text-gray-500">{c.stats.students} students/yr</span>
                      <span className="text-[10px] text-gray-500">{c.stats.visa} visa rate</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {c.locked
                    ? <span className="flex items-center gap-1 text-xs text-gray-400"><Lock className="w-3 h-3" /> Locked</span>
                    : <span className="text-xs px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-full font-medium flex items-center gap-1">
                        <Check className="w-3 h-3" /> Active
                      </span>
                  }
                </div>
              </div>
            ))}
            <button onClick={() => alert("Contact your account manager to add a corridor — sales@polarisuni.com")}
              className="w-full py-2.5 border-2 border-dashed border-gray-200 rounded-xl text-sm text-gray-400 hover:border-navy-300 hover:text-navy-600 transition-colors">
              + Add corridor — upgrade to Enterprise
            </button>
          </div>
        </div>

        {/* Subscription */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center gap-2 mb-5">
            <CreditCard className="w-4 h-4 text-navy-700" />
            <h2 className="font-semibold text-gray-900">Subscription</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { name: "Starter",      price: "$9,000/yr",  features: ["1 destination", "2 source regions", "2 seats"], current: false },
              { name: "Professional", price: "$25,000/yr", features: ["3 destinations", "All regions", "5 seats", "ROI Planner", "Engagement Playbook"], current: true },
              { name: "Enterprise",   price: "Custom",     features: ["Unlimited corridors", "All features", "Benchmarking", "Custom integrations"], current: false },
            ].map(tier => (
              <div key={tier.name} className={cn("rounded-xl border p-4", tier.current ? "border-navy-700 bg-navy-50" : "border-gray-200")}>
                <div className="font-semibold text-sm text-gray-900">{tier.name}</div>
                <div className={cn("text-lg font-bold mt-1 mb-3", tier.current ? "text-navy-800" : "text-gray-700")}>{tier.price}</div>
                <ul className="space-y-1">
                  {tier.features.map(f => (
                    <li key={f} className="text-xs text-gray-600 flex items-center gap-1.5">
                      <Check className="w-3 h-3 text-emerald-500 shrink-0" /> {f}
                    </li>
                  ))}
                </ul>
                {tier.current
                  ? <div className="mt-3 text-xs font-medium text-navy-700 bg-navy-100 rounded-md py-1.5 text-center">Current plan</div>
                  : <button onClick={() => alert(`${tier.name} plan — our team will reach out. Contact: sales@polarisuni.com`)}
                      className="mt-3 w-full text-xs font-medium text-white bg-navy-800 hover:bg-navy-900 rounded-md py-1.5 transition-colors">
                      {tier.name === "Enterprise" ? "Contact us" : "Upgrade"}
                    </button>
                }
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
