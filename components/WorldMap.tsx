"use client";
import dynamic from "next/dynamic";
import { CorridorSummary } from "@/lib/types";

function Loading() {
  return (
    <div className="w-full h-full bg-gradient-to-br from-navy-950 via-navy-900 to-navy-950 flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-gold-400/30 border-t-gold-400 rounded-full animate-spin mx-auto mb-3" />
        <p className="text-navy-400 text-sm">Loading world map…</p>
      </div>
    </div>
  );
}

const WorldMapContent = dynamic(() => import("./WorldMapContent"), {
  ssr: false,
  loading: () => <Loading />,
});

export function WorldMap({ onCorridorSelect }: { onCorridorSelect?: (key: CorridorSummary["key"]) => void }) {
  return <WorldMapContent onCorridorSelect={onCorridorSelect} />;
}
