"use client";
import { useState } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { MOCK_SCORES } from "@/lib/types";

const GEO_URL = "/geo/japan.json";

function scoreToColor(score: number): string {
  if (score >= 70) return "#059669";
  if (score >= 50) return "#d97706";
  return "#ef4444";
}

interface Props {
  onPrefectureSelect?: (prefectureName: string) => void;
  selectedPrefecture?: string | null;
}

export default function JapanMapContent({ onPrefectureSelect, selectedPrefecture }: Props) {
  const [hovered, setHovered] = useState<string | null>(null);
  const [tooltip, setTooltip] = useState<{ x: number; y: number; name: string; score: number } | null>(null);

  const scoreMap: Record<string, number> = {};
  MOCK_SCORES.forEach(s => { if (s.target_country_iso === "JPN") scoreMap[s.target_entity_name] = s.score; });

  return (
    <div className="relative w-full h-full bg-gradient-to-br from-navy-950 via-blue-950 to-navy-950 rounded-xl overflow-hidden">
      {/* Legend */}
      <div className="absolute top-6 left-6 z-20 flex flex-col gap-2 bg-navy-900/90 backdrop-blur-sm rounded-lg p-3 border border-navy-700">
        {[
          { color: "#059669", label: "High (≥70)" },
          { color: "#d97706", label: "Medium (50–69)" },
          { color: "#ef4444", label: "Low (<50)" },
        ].map(l => (
          <div key={l.label} className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: l.color }} />
            <span className="text-[9px] text-white/70">{l.label}</span>
          </div>
        ))}
      </div>

      <div className="absolute top-6 right-6 z-20 text-[10px] text-white/50">
        🇯🇵 → 🇺🇸 Interactive Prefecture Scoring
      </div>

      <ComposableMap
        projection="geoMercator"
        projectionConfig={{ center: [138, 36], scale: 1200 }}
        width={800}
        height={600}
        style={{ width: "100%", height: "100%" }}
      >
        <Geographies geography={GEO_URL}>
          {({ geographies }: any) =>
            geographies.map((geo: any) => {
              const name = geo.properties?.name || "";
              const hasScore = scoreMap[name] !== undefined;
              const score = scoreMap[name] ?? 45;
              const isSelected = selectedPrefecture === name;
              const isHovered = hovered === name;

              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill={scoreToColor(score)}
                  stroke="#0a1530"
                  strokeWidth={0.6}
                  style={{
                    default: {
                      outline: "none",
                      cursor: hasScore ? "pointer" : "default",
                      opacity: isSelected ? 1 : isHovered ? 0.95 : 0.8,
                      transition: "opacity 0.15s ease",
                    },
                    hover: {
                      outline: "none",
                      cursor: hasScore ? "pointer" : "default",
                      opacity: 1,
                    },
                    pressed: { outline: "none" },
                  }}
                  onMouseEnter={(e: any) => {
                    if (!hasScore) return;
                    setHovered(name);
                    setTooltip({ x: e.clientX, y: e.clientY, name, score });
                  }}
                  onMouseMove={(e: any) => {
                    if (!hasScore) return;
                    setTooltip({ x: e.clientX, y: e.clientY, name, score });
                  }}
                  onMouseLeave={() => { setHovered(null); setTooltip(null); }}
                  onClick={() => { if (hasScore) onPrefectureSelect?.(name); }}
                />
              );
            })
          }
        </Geographies>
      </ComposableMap>

      {/* Tooltip */}
      {tooltip && (
        <div
          className="fixed z-50 bg-navy-900 border border-navy-700 rounded-lg px-3 py-2 pointer-events-none shadow-xl"
          style={{ left: tooltip.x + 14, top: tooltip.y - 44 }}
        >
          <div className="text-white font-semibold text-xs">{tooltip.name}</div>
          <div className="text-xs font-bold" style={{ color: scoreToColor(tooltip.score) }}>
            Score: {tooltip.score}/100
          </div>
        </div>
      )}
    </div>
  );
}
