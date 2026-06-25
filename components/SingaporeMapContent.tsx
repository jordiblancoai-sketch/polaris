"use client";
import { useState } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { scoresFor } from "@/lib/scores";

const GEO_URL = "/geo/singapore.json";

function scoreToColor(score: number): string {
  if (score >= 70) return "#059669";
  if (score >= 50) return "#d97706";
  return "#ef4444";
}

interface Props {
  onRegionSelect?: (regionName: string) => void;
  selectedRegion?: string | null;
}

export default function SingaporeMapContent({ onRegionSelect, selectedRegion }: Props) {
  const [hovered, setHovered] = useState<string | null>(null);
  const [tooltip, setTooltip] = useState<{ x: number; y: number; name: string; score: number } | null>(null);

  // Normalize names so GeoJSON ("NORTH-EAST REGION") matches score data ("Northeast Region")
  const norm = (s: string) => s.toUpperCase().replace(/PREFECTURE|REGION/g, "").replace(/[^A-Z]/g, "");
  const scoreMap: Record<string, { score: number; name: string }> = {};
  scoresFor("SGP").forEach(s => { scoreMap[norm(s.target_entity_name)] = { score: s.score, name: s.target_entity_name }; });

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
        🇸🇬 → 🇺🇸 Interactive Region Scoring
      </div>

      <ComposableMap
        projection="geoMercator"
        projectionConfig={{ center: [103.85, 1.35], scale: 50000 }}
        width={800}
        height={600}
        style={{ width: "100%", height: "100%" }}
      >
        <Geographies geography={GEO_URL}>
          {({ geographies }: any) =>
            geographies.map((geo: any) => {
              const rawName = (geo.properties?.shapeName || geo.properties?.name || "").trim();
              const entry = scoreMap[norm(rawName)];
              const name = entry?.name ?? rawName;
              const hasScore = entry !== undefined;
              const score = entry?.score ?? 45;
              const isSelected = selectedRegion === name;
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
                  onClick={() => { if (hasScore) onRegionSelect?.(name); }}
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
