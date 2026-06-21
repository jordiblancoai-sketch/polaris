"use client";
import { useState } from "react";

const JAPAN_PREFECTURES = [
  { name: "Tokyo", score: 75, x: 75, y: 45 },
  { name: "Kyoto", score: 78, x: 60, y: 52 },
  { name: "Osaka", score: 76, x: 62, y: 55 },
  { name: "Kanagawa", score: 74, x: 76, y: 48 },
  { name: "Saitama", score: 72, x: 74, y: 42 },
  { name: "Aichi", score: 70, x: 68, y: 52 },
  { name: "Fukuoka", score: 68, x: 40, y: 70 },
  { name: "Hiroshima", score: 65, x: 52, y: 60 },
  { name: "Nagoya", score: 62, x: 68, y: 54 },
];

export function JapanMap({
  onPrefectureSelect,
  selectedPrefecture
}: {
  onPrefectureSelect?: (name: string) => void;
  selectedPrefecture?: string | null;
}) {
  const [hoveredPrefecture, setHoveredPrefecture] = useState<string | null>(null);

  return (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-navy-950 via-blue-950 to-navy-950 relative overflow-hidden p-8">
      {/* Stylized Japan map background */}
      <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full opacity-20 pointer-events-none">
        <path
          d="M 65,25 L 70,30 L 75,35 L 75,40 L 72,45 L 70,50 L 68,55 L 65,60 L 60,65 L 55,62 L 50,60 L 48,55 L 50,50 L 52,45 L 55,40 L 58,35 L 60,30 Z"
          fill="none"
          stroke="#0369a1"
          strokeWidth="0.5"
          opacity="0.3"
        />
      </svg>

      {/* Prefectures grid */}
      <div className="relative w-full max-w-2xl aspect-square">
        {JAPAN_PREFECTURES.map((pref) => {
          const isSelected = selectedPrefecture === pref.name;
          const isHovered = hoveredPrefecture === pref.name;
          const color = pref.score >= 70 ? "#10b981" : pref.score >= 50 ? "#d97706" : "#ef4444";

          return (
            <button
              key={pref.name}
              onClick={() => onPrefectureSelect?.(pref.name)}
              onMouseEnter={() => setHoveredPrefecture(pref.name)}
              onMouseLeave={() => setHoveredPrefecture(null)}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 group transition-all"
              style={{ left: `${pref.x}%`, top: `${pref.y}%` }}
            >
              {/* Glow effect */}
              <div
                className={`absolute inset-0 rounded-full blur-lg transition-all ${
                  isSelected || isHovered ? "opacity-60" : "opacity-20"
                }`}
                style={{ backgroundColor: color, width: "48px", height: "48px", marginLeft: "-24px", marginTop: "-24px" }}
              />

              {/* Circle */}
              <div
                className={`relative w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all ${
                  isSelected ? "border-white shadow-lg" : "border-white/30 hover:border-white/60"
                }`}
                style={{ backgroundColor: `${color}20`, borderColor: isSelected ? "white" : color }}
              >
                <span className="font-black text-white text-sm">{pref.score}</span>
              </div>

              {/* Label */}
              <div
                className={`absolute top-full mt-2 whitespace-nowrap text-xs font-semibold transition-all ${
                  isHovered || isSelected ? "text-white opacity-100" : "text-white/60 opacity-0"
                }`}
              >
                {pref.name}
              </div>
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="absolute bottom-6 left-6 bg-navy-900/80 backdrop-blur rounded-xl p-4 border border-navy-700">
        <div className="text-white text-xs font-bold mb-3">Score Guide</div>
        <div className="space-y-2 text-[10px]">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-emerald-500" />
            <span className="text-navy-300">70+ (High Opportunity)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-amber-400" />
            <span className="text-navy-300">50-69 (Moderate)</span>
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
