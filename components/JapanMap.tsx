"use client";
import dynamic from "next/dynamic";

interface Props {
  onPrefectureSelect?: (prefectureName: string) => void;
  selectedPrefecture?: string | null;
}

const MapContent = dynamic(() => import("./JapanMapContent"), { ssr: false });

export function JapanMap({ onPrefectureSelect, selectedPrefecture }: Props) {
  return <MapContent onPrefectureSelect={onPrefectureSelect} selectedPrefecture={selectedPrefecture} />;
}
