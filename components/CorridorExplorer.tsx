"use client";
import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { CORRIDORS, RankedOpportunity, CorridorSummary } from "@/lib/types";
import { WorldMap } from "@/components/WorldMap";
import { ChinaMap } from "@/components/ChinaMap";
import { JapanMap } from "@/components/JapanMap";
import { SingaporeMap } from "@/components/SingaporeMap";
import { KoreaMap } from "@/components/KoreaMap";
import { ProvinceModal } from "@/components/ProvinceModal";

type View = "world" | CorridorSummary["key"];

function RegionCard({ r, onClick }: { r: RankedOpportunity; onClick: () => void }) {
  const color = r.score >= 70 ? "#059669" : r.score >= 50 ? "#d97706" : "#ef4444";
  return (
    <button onClick={onClick}
      className="w-full text-left bg-navy-900/70 hover:bg-navy-800 border border-navy-700 hover:border-gold-400/50 rounded-xl p-4 transition-all group">
      <div className="flex items-center justify-between mb-2">
        <span className="text-white font-bold group-hover:text-gold-400 transition-colors">{r.target_entity_name}</span>
        <span className="text-2xl font-black" style={{ color }}>{r.score}</span>
      </div>
      <div className="h-1.5 bg-navy-700 rounded-full overflow-hidden mb-2">
        <div className="h-full rounded-full" style={{ width: `${r.score}%`, backgroundColor: color }} />
      </div>
      <p className="text-navy-400 text-[11px] leading-snug line-clamp-2">{r.key_insight}</p>
    </button>
  );
}

export function CorridorExplorer() {
  const [view, setView] = useState<View>("world");
  const [selected, setSelected] = useState<RankedOpportunity | null>(null);

  const corridor = CORRIDORS.find(c => c.key === view);

  return (
    <div className="flex h-screen bg-navy-950 overflow-hidden">
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Header */}
        <div className="bg-navy-900 border-b border-navy-800 px-4 md:px-6 py-3 md:py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2 md:gap-3 min-w-0">
            {view !== "world" && (
              <button onClick={() => setView("world")}
                className="p-2 hover:bg-navy-800 rounded-lg text-navy-300 hover:text-white transition-colors shrink-0">
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            <div className="min-w-0">
              <h1 className="text-lg md:text-2xl font-black text-white truncate">
                {view === "world" ? "Global Recruitment Intelligence" : `${corridor!.flag} ${corridor!.country} → United States`}
              </h1>
              <p className="text-navy-400 text-xs md:text-sm mt-0.5 truncate">
                {view === "world"
                  ? "4 active corridors · click a country to explore"
                  : `${corridor!.regionsScored} regions scored · top: ${corridor!.topRegion} (${corridor!.topScore})`}
              </p>
            </div>
          </div>
          {corridor && (
            <div className="hidden md:block bg-navy-800 rounded-lg px-4 py-2 text-sm text-navy-300">
              <span className="text-white font-bold">{corridor.studentsPerYear}</span> students/yr ·
              <span className="text-emerald-400 font-bold ml-1">{corridor.visaRate}</span> visa rate
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 relative overflow-hidden">
          {view === "world" && (
            <WorldMap onCorridorSelect={(k) => setView(k)} />
          )}

          {view === "china" && (
            <div className="flex h-full">
              {/* Ranked standings list */}
              <div className="w-full max-w-sm border-r border-navy-800 overflow-y-auto bg-navy-950 shrink-0 hidden md:block">
                <div className="px-4 py-3 sticky top-0 bg-navy-950 border-b border-navy-800 z-10">
                  <div className="text-white text-sm font-bold">Ranked opportunity standings</div>
                  <div className="text-navy-500 text-[10px]">All 31 provinces · click for full analysis</div>
                </div>
                <div className="divide-y divide-navy-800/60">
                  {corridor!.scores.map(r => {
                    const color = r.score >= 70 ? "#10b981" : r.score >= 50 ? "#d97706" : "#ef4444";
                    const active = selected?.target_entity_name === r.target_entity_name;
                    return (
                      <button key={r.target_entity_id} onClick={() => setSelected(r)}
                        className={`w-full text-left px-4 py-3 transition-colors ${active ? "bg-navy-800" : "hover:bg-navy-900"}`}>
                        <div className="flex items-center gap-3">
                          <span className="text-navy-600 text-xs font-bold w-5 shrink-0">{r.rank}</span>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-white text-sm font-semibold truncate">{r.target_entity_name}</span>
                              <span className="text-sm font-black ml-2" style={{ color }}>{r.score}</span>
                            </div>
                            <div className="h-1.5 bg-navy-800 rounded-full overflow-hidden">
                              <div className="h-full rounded-full" style={{ width: `${r.score}%`, backgroundColor: color }} />
                            </div>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
              {/* Map */}
              <div className="flex-1 relative">
                <ChinaMap
                  onProvinceSelect={(name) => {
                    const r = corridor!.scores.find(s => s.target_entity_name === name);
                    if (r) setSelected(r);
                  }}
                  selectedProvince={selected?.target_entity_name || null}
                />
              </div>
            </div>
          )}

          {view === "japan" && (
            <div className="flex h-full">
              {/* Ranked standings list */}
              <div className="w-full max-w-sm border-r border-navy-800 overflow-y-auto bg-navy-950 shrink-0 hidden md:block">
                <div className="px-4 py-3 sticky top-0 bg-navy-950 border-b border-navy-800 z-10">
                  <div className="text-white text-sm font-bold">Ranked opportunity standings</div>
                  <div className="text-navy-500 text-[10px]">47 prefectures · click for full analysis</div>
                </div>
                <div className="divide-y divide-navy-800/60">
                  {corridor!.scores.map(r => {
                    const color = r.score >= 70 ? "#10b981" : r.score >= 50 ? "#d97706" : "#ef4444";
                    const active = selected?.target_entity_name === r.target_entity_name;
                    return (
                      <button key={r.target_entity_id} onClick={() => setSelected(r)}
                        className={`w-full text-left px-4 py-3 transition-colors ${active ? "bg-navy-800" : "hover:bg-navy-900"}`}>
                        <div className="flex items-center gap-3">
                          <span className="text-navy-600 text-xs font-bold w-5 shrink-0">{r.rank}</span>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-white text-sm font-semibold truncate">{r.target_entity_name}</span>
                              <span className="text-sm font-black ml-2" style={{ color }}>{r.score}</span>
                            </div>
                            <div className="h-1.5 bg-navy-800 rounded-full overflow-hidden">
                              <div className="h-full rounded-full" style={{ width: `${r.score}%`, backgroundColor: color }} />
                            </div>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
              {/* Map */}
              <div className="flex-1 relative">
                <JapanMap
                  onPrefectureSelect={(name) => {
                    const r = corridor!.scores.find(s => s.target_entity_name === name);
                    if (r) setSelected(r);
                  }}
                  selectedPrefecture={selected?.target_entity_name || null}
                />
              </div>
            </div>
          )}

          {view === "singapore" && (
            <div className="flex h-full">
              {/* Ranked standings list */}
              <div className="w-full max-w-sm border-r border-navy-800 overflow-y-auto bg-navy-950 shrink-0 hidden md:block">
                <div className="px-4 py-3 sticky top-0 bg-navy-950 border-b border-navy-800 z-10">
                  <div className="text-white text-sm font-bold">Ranked opportunity standings</div>
                  <div className="text-navy-500 text-[10px]">5 regions · click for full analysis</div>
                </div>
                <div className="divide-y divide-navy-800/60">
                  {corridor!.scores.map(r => {
                    const color = r.score >= 70 ? "#059669" : r.score >= 50 ? "#d97706" : "#ef4444";
                    const active = selected?.target_entity_name === r.target_entity_name;
                    return (
                      <button key={r.target_entity_id} onClick={() => setSelected(r)}
                        className={`w-full text-left px-4 py-3 transition-colors ${active ? "bg-navy-800" : "hover:bg-navy-900"}`}>
                        <div className="flex items-center gap-3">
                          <span className="text-navy-600 text-xs font-bold w-5 shrink-0">{r.rank}</span>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-white text-sm font-semibold truncate">{r.target_entity_name}</span>
                              <span className="text-sm font-black ml-2" style={{ color }}>{r.score}</span>
                            </div>
                            <div className="h-1.5 bg-navy-800 rounded-full overflow-hidden">
                              <div className="h-full rounded-full" style={{ width: `${r.score}%`, backgroundColor: color }} />
                            </div>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
              {/* Map */}
              <div className="flex-1 relative">
                <SingaporeMap
                  onRegionSelect={(name) => {
                    const r = corridor!.scores.find(s => s.target_entity_name === name);
                    if (r) setSelected(r);
                  }}
                  selectedRegion={selected?.target_entity_name || null}
                />
              </div>
            </div>
          )}

          {view === "korea" && (
            <div className="flex h-full">
              {/* Ranked standings list */}
              <div className="w-full max-w-sm border-r border-navy-800 overflow-y-auto bg-navy-950 shrink-0 hidden md:block">
                <div className="px-4 py-3 sticky top-0 bg-navy-950 border-b border-navy-800 z-10">
                  <div className="text-white text-sm font-bold">Ranked opportunity standings</div>
                  <div className="text-navy-500 text-[10px]">17 provinces · click for full analysis</div>
                </div>
                <div className="divide-y divide-navy-800/60">
                  {corridor!.scores.map(r => {
                    const color = r.score >= 70 ? "#10b981" : r.score >= 50 ? "#d97706" : "#ef4444";
                    const active = selected?.target_entity_name === r.target_entity_name;
                    return (
                      <button key={r.target_entity_id} onClick={() => setSelected(r)}
                        className={`w-full text-left px-4 py-3 transition-colors ${active ? "bg-navy-800" : "hover:bg-navy-900"}`}>
                        <div className="flex items-center gap-3">
                          <span className="text-navy-600 text-xs font-bold w-5 shrink-0">{r.rank}</span>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-white text-sm font-semibold truncate">{r.target_entity_name}</span>
                              <span className="text-sm font-black ml-2" style={{ color }}>{r.score}</span>
                            </div>
                            <div className="h-1.5 bg-navy-800 rounded-full overflow-hidden">
                              <div className="h-full rounded-full" style={{ width: `${r.score}%`, backgroundColor: color }} />
                            </div>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
              {/* Map */}
              <div className="flex-1 relative">
                <KoreaMap
                  onProvinceSelect={(name) => {
                    const r = corridor!.scores.find(s => s.target_entity_name === name);
                    if (r) setSelected(r);
                  }}
                  selectedProvince={selected?.target_entity_name || null}
                />
              </div>
            </div>
          )}
        </div>

        {/* Stats strip (corridor view only) */}
        {corridor && (
          <div className="bg-navy-900 border-t border-navy-800 px-4 py-3 grid grid-cols-2 sm:grid-cols-4 gap-2 shrink-0">
            {[
              { label: "Students / yr", value: corridor.studentsPerYear, color: "text-white" },
              { label: "Visa approval", value: corridor.visaRate, color: "text-emerald-400" },
              { label: "Regions scored", value: String(corridor.regionsScored), color: "text-white" },
              { label: "Top region", value: `${corridor.topRegion} ${corridor.topScore}`, color: "text-gold-400" },
            ].map(s => (
              <div key={s.label} className="text-center">
                <div className={`text-sm font-bold ${s.color}`}>{s.value}</div>
                <div className="text-[9px] text-navy-500 leading-tight">{s.label}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      <ProvinceModal
        region={selected}
        corridorLabel={corridor ? `${corridor.country} → US` : undefined}
        totalRegions={corridor?.regionsScored}
        onClose={() => setSelected(null)}
      />
    </div>
  );
}
