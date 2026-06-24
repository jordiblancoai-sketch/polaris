"use client";
import dynamic from "next/dynamic";

interface Props {
  onStateSelect?: (stateName: string) => void;
  selectedState?: string | null;
}

const MapContent = dynamic(() => import("./IndiaMapContent"), { ssr: false });

export function IndiaMap({ onStateSelect, selectedState }: Props) {
  return <MapContent onStateSelect={onStateSelect} selectedState={selectedState} />;
}
