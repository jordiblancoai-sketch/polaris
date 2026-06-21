"use client";
import { useState } from "react";

const SINGAPORE_REGIONS = [
  { name: "Central", score: 88, x: 50, y: 50 },
  { name: "East", score: 85, x: 70, y: 50 },
  { name: "North", score: 82, x: 50, y: 30 },
  { name: "West", score: 80, x: 30, y: 50 },
  { name: "Northeast", score: 79, x: 65, y: 30 },
];

export function SingaporeMap({
  onRegionSelect,
  selectedRegion
}: {
  onRegionSelect?: (name: string) => void;
  selectedRegion?: string | null;
}) {
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);

  return (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-navy-950 via-emerald-950 to-navy-950 relative overflow-hidden p-8">
      {/* Stylized Singapore map background */}
      <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full opacity-20 pointer-events-none">
        <circle cx="50" cy="50" r="25" fill="none" stroke="#059669" strokeWidth="0.5" opacity="0.3" />
        <circle cx="50" cy="50" r="18" fill="none" stroke="#059669" strokeWidth="0.3" opacity="0.2" />
      </svg>

      {/* Regions grid */}
      <div className="relative w-full max-w-2xl aspect-square">
        {SINGAPORE_REGIONS.map((region) => {
          const isSelected = selectedRegion === region.name;
          const isHovered = hoveredRegion === region.name;
          const color = region.score >= 70 ? "#059669" : region.score >= 50 ? "#d97706" : "#ef4444";

          return (
            <button
              key={region.name}
              onClick={() => onRegionSelect?.(region.name)}
              onMouseEnter={() => setHoveredRegion(region.name)}
              onMouseLeave={() => setHoveredRegion(null)}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 group transition-all"
              style={{ left: `${region.x}%`, top: `${region.y}%` }}
            >
              {/* Glow effect */}
              <div
                className={`absolute inset-0 rounded-full blur-lg transition-all ${
                  isSelected || isHovered ? "opacity-70" : "opacity-30"
                }`}
                style={{ backgroundColor: color, width: "56px", height: "56px", marginLeft: "-28px", marginTop: "-28px" }}
              />

              {/* Circle */}
              <div
                className={`relative w-14 h-14 rounded-full flex items-center justify-center border-2 transition-all ${
                  isSelected ? "border-white shadow-lg shadow-emerald-500/50" : "border-white/30 hover:border-white/60"
                }`}
                style={{ backgroundColor: `${color}20`, borderColor: isSelected ? "white" : color }}
              >
                <span className="font-black text-white text-lg">{region.score}</span>
              </div>

              {/* Label */}
              <div
                className={`absolute top-full mt-3 whitespace-nowrap text-xs font-semibold transition-all ${
                  isHovered || isSelected ? "text-white opacity-100" : "text-white/60 opacity-0"
                }`}
              >
                {region.name}
              </div>
            </button>
          );
        })}
      </div>

      {/* Stats box */}
      <div className="absolute bottom-6 left-6 bg-navy-900/80 backdrop-blur rounded-xl p-4 border border-navy-700 max-w-xs">
        <div className="text-white text-xs font-bold mb-3">Singapore Regions</div>
        <div className="space-y-1.5 text-[10px] text-navy-300">
          <div>📍 5 strategic regions</div>
          <div>👥 Premium market segment</div>
          <div>✈️ Highest F-1 approval rate</div>
        </div>
      </div>

      {/* Score guide */}
      <div className="absolute top-6 right-6 bg-navy-900/80 backdrop-blur rounded-xl p-4 border border-navy-700">
        <div className="text-white text-xs font-bold mb-3">Score Guide</div>
        <div className="space-y-2 text-[10px]">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-emerald-500" />
            <span className="text-navy-300">70+ (Premium)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-amber-400" />
            <span className="text-navy-300">50-69 (Good)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-400" />
            <span className="text-navy-300">&lt;50 (Developing)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
