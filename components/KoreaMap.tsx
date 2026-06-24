"use client";
import dynamic from "next/dynamic";

interface Props {
  onProvinceSelect?: (provinceName: string) => void;
  selectedProvince?: string | null;
}

const MapContent = dynamic(() => import("./KoreaMapContent"), { ssr: false });

export function KoreaMap({ onProvinceSelect, selectedProvince }: Props) {
  return <MapContent onProvinceSelect={onProvinceSelect} selectedProvince={selectedProvince} />;
}
