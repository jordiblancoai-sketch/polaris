"use client";
import dynamic from "next/dynamic";

interface Props {
  onProvinceSelect?: (provinceName: string) => void;
  selectedProvince?: string | null;
}

function MapLoading() {
  return (
    <div className="w-full h-full bg-gradient-to-br from-navy-950 via-navy-900 to-navy-950 flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-gold-400/30 border-t-gold-400 rounded-full animate-spin mx-auto mb-3" />
        <p className="text-navy-400 text-sm">Loading China map…</p>
      </div>
    </div>
  );
}

// Dynamic import avoids SSR hydration issues with react-simple-maps
const MapContent = dynamic(() => import("./MapContent"), {
  ssr: false,
  loading: () => <MapLoading />,
});

export function ChinaMap({ onProvinceSelect, selectedProvince }: Props) {
  return <MapContent onProvinceSelect={onProvinceSelect} selectedProvince={selectedProvince} />;
}
