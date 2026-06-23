"use client";
import dynamic from "next/dynamic";

interface Props {
  onRegionSelect?: (regionName: string) => void;
  selectedRegion?: string | null;
}

const MapContent = dynamic(() => import("./SingaporeMapContent"), { ssr: false });

export function SingaporeMap({ onRegionSelect, selectedRegion }: Props) {
  return <MapContent onRegionSelect={onRegionSelect} selectedRegion={selectedRegion} />;
}
