"use client";
import { useState } from "react";
import Image from "next/image";
import { DemoVideo } from "@/components/demo/DemoVideo";

const CORRIDORS = [
  { flag: "🇨🇳", label: "China → US", id: "china" },
  { flag: "🇯🇵", label: "Japan → US", id: "japan" },
  { flag: "🇸🇬", label: "Singapore → US", id: "singapore" },
];

export default function DemoPage() {
  const [selectedCorridor, setSelectedCorridor] = useState("china");

  return (
    <div className="min-h-screen bg-navy-950 flex flex-col items-center justify-center p-4 md:p-8 gap-6 md:gap-8">
      {/* Student image strip */}
      <div className="w-full max-w-4xl grid grid-cols-3 gap-2 md:gap-3">
        <Image
          src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&q=80"
          alt="Asian students group"
          width={400}
          height={160}
          unoptimized
          className="w-full h-20 md:h-40 object-cover rounded-xl opacity-70"
        />
        <Image
          src="https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400&q=80"
          alt="Tokyo at night"
          width={400}
          height={160}
          unoptimized
          className="w-full h-20 md:h-40 object-cover rounded-xl opacity-70"
        />
        <Image
          src="https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=400&q=80"
          alt="Singapore skyline"
          width={400}
          height={160}
          unoptimized
          className="w-full h-20 md:h-40 object-cover rounded-xl opacity-70"
        />
      </div>

      {/* Title */}
      <div className="text-center">
        <div className="text-white/60 text-xs uppercase tracking-widest mb-3">Polaris · Product Demo</div>
        <h1 className="text-3xl md:text-5xl font-black text-white leading-tight">
          Stop guessing where to recruit.<br />
          <span className="text-gold-400">Start knowing.</span>
        </h1>
      </div>

      {/* Corridor selector */}
      <div className="flex items-center gap-3 justify-center">
        <span className="text-white/40 text-xs uppercase tracking-wider">Active corridor:</span>
        {CORRIDORS.map((c) => (
          <button key={c.id} onClick={() => setSelectedCorridor(c.id)} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all cursor-pointer ${
            selectedCorridor === c.id ? "bg-gold-400/20 border-gold-400/50 text-gold-400" : "border-white/10 text-white/40 hover:border-white/30 hover:text-white/60"
          }`}>
            {c.flag} {c.label}
          </button>
        ))}
      </div>

      {/* Demo video — desktop only (animated mock is sized for large screens) */}
      <div className="w-full max-w-4xl hidden md:block">
        <DemoVideo corridor={selectedCorridor} />
      </div>

      {/* Mobile: tappable card into the real interactive demo */}
      <a href="/demo-map"
        className="md:hidden w-full max-w-sm bg-navy-900 border border-white/10 rounded-2xl overflow-hidden active:scale-[0.99] transition-transform">
        <div className="relative h-40">
          <Image src="https://images.unsplash.com/photo-1535139262971-c51845709a48?w=600&q=80"
            alt="City skyline" fill unoptimized className="object-cover opacity-50" />
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
            <div className="w-14 h-14 bg-gold-400 rounded-full flex items-center justify-center">
              <span className="text-navy-950 text-xl ml-0.5">▶</span>
            </div>
            <span className="text-white font-semibold text-sm">Open interactive demo</span>
            <span className="text-white/50 text-xs">China · Japan · Singapore — live</span>
          </div>
        </div>
      </a>

      {/* CTAs */}
      <div className="flex gap-4 flex-wrap justify-center">
        <a href="/landing#pricing" className="bg-gold-400 hover:bg-gold-500 text-navy-950 font-bold text-sm px-8 py-3 rounded-full transition-colors">
          Try the product →
        </a>
        <a href="/map" className="bg-white text-navy-900 font-bold text-sm px-6 py-3 rounded-full hover:bg-gray-100 transition-colors">
          Explore the Map
        </a>
      </div>
    </div>
  );
}
