"use client";
import { useState } from "react";
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps";
import { CORRIDORS, CorridorSummary } from "@/lib/types";

const WORLD_URL = "/geo/world.json";

function scoreColor(score: number): string {
  if (score >= 80) return "#059669";
  if (score >= 70) return "#10b981";
  return "#d97706";
}

interface Props {
  onCorridorSelect?: (key: CorridorSummary["key"]) => void;
}

export default function WorldMapContent({ onCorridorSelect }: Props) {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <div className="relative w-full h-full bg-gradient-to-br from-navy-950 via-navy-900 to-navy-950 rounded-xl overflow-hidden">
      <div className="absolute top-6 left-6 z-20 bg-navy-900/90 backdrop-blur-sm rounded-lg px-4 py-3 border border-navy-700">
        <div className="text-white font-bold text-sm">3 Active Corridors → 🇺🇸 US</div>
        <div className="text-navy-400 text-[10px] mt-0.5">Click a country to explore its regions</div>
      </div>

      <ComposableMap
        projection="geoMercator"
        projectionConfig={{ center: [120, 28], scale: 340 }}
        width={800}
        height={600}
        style={{ width: "100%", height: "100%" }}
      >
        <Geographies geography={WORLD_URL}>
          {({ geographies }: any) =>
            geographies.map((geo: any) => {
              const name = geo.properties?.name || "";
              const isCorridor = ["China", "Japan", "Singapore"].includes(name);
              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill={isCorridor ? "#1e3a6e" : "#13224a"}
                  stroke="#0a1530"
                  strokeWidth={0.5}
                  style={{
                    default: { outline: "none" },
                    hover: { outline: "none" },
                    pressed: { outline: "none" },
                  }}
                />
              );
            })
          }
        </Geographies>

        {CORRIDORS.map(c => {
          const isHovered = hovered === c.key;
          return (
            <Marker
              key={c.key}
              coordinates={c.coords}
              onMouseEnter={() => setHovered(c.key)}
              onMouseLeave={() => setHovered(null)}
              onClick={() => onCorridorSelect?.(c.key)}
              style={{ default: { cursor: "pointer" }, hover: { cursor: "pointer" }, pressed: {} }}
            >
              {/* Pulsing halo */}
              <circle r={isHovered ? 26 : 22} fill={scoreColor(c.topScore)} opacity={0.15} />
              <circle r={isHovered ? 20 : 17} fill={scoreColor(c.topScore)} opacity={0.25} />
              {/* Score bubble */}
              <circle r={14} fill={scoreColor(c.topScore)} stroke="#fff" strokeWidth={1.5} />
              <text textAnchor="middle" y={5} fontSize={13} fontWeight="bold" fill="#fff" style={{ pointerEvents: "none" }}>
                {c.topScore}
              </text>
              {/* Label */}
              <text textAnchor="middle" y={-22} fontSize={11} fontWeight="bold" fill="#fff" style={{ pointerEvents: "none" }}>
                {c.flag} {c.country}
              </text>
              <text textAnchor="middle" y={30} fontSize={8} fill="#98afd9" style={{ pointerEvents: "none" }}>
                {c.studentsPerYear} students/yr
              </text>
            </Marker>
          );
        })}
      </ComposableMap>

      {/* Corridor cards overlay */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex flex-wrap justify-center gap-2 z-20 w-full px-3">
        {CORRIDORS.map(c => (
          <button
            key={c.key}
            onClick={() => onCorridorSelect?.(c.key)}
            onMouseEnter={() => setHovered(c.key)}
            onMouseLeave={() => setHovered(null)}
            className="bg-navy-900/90 backdrop-blur-sm border border-navy-700 hover:border-gold-400/60 rounded-xl px-3 py-2 transition-all text-left group"
          >
            <div className="flex items-center gap-2">
              <span className="text-base md:text-lg">{c.flag}</span>
              <div>
                <div className="text-white text-[11px] md:text-xs font-bold group-hover:text-gold-400 transition-colors">{c.country} → US</div>
                <div className="text-navy-400 text-[9px] hidden sm:block">{c.regionsScored} regions · top {c.topRegion} ({c.topScore})</div>
                <div className="text-navy-400 text-[9px] sm:hidden">{c.regionsScored} regions · {c.topScore}</div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
