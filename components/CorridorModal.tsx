"use client";
import { X, TrendingUp, Users, BarChart2, Zap } from "lucide-react";
import Image from "next/image";

interface CorridorData {
  city: string;
  country: string;
  img: string;
  stat: string;
  score: string;
  visa: string;
}

interface CorridorModalProps {
  corridor: CorridorData | null;
  isOpen: boolean;
  onClose: () => void;
}

const CORRIDOR_DETAILS = {
  Tokyo: {
    regions: 47,
    students_annual: "18.9k",
    top_region: "Kyoto",
    top_score: 78,
    visa_approval: "95%",
    demand: "High outbound enrollment from major prefectures (Tokyo, Osaka, Kyoto)",
    economic: "Strong GDP per capita and household income across regions",
    academic: "Excellent English proficiency (EF Index top 20 globally)",
    viability: "Highest F-1 approval rate globally, efficient visa process",
    programs: ["STEM", "Graduate Research", "Business", "Liberal Arts"],
    highlights: [
      "Pre-dominance of quality over quantity",
      "High academic preparedness",
      "Strong repeat enrollment from established feeder schools",
      "Growing interest in STEM and graduate programs"
    ]
  },
  Shanghai: {
    regions: 31,
    students_annual: "277k",
    top_region: "Zhejiang",
    top_score: 82,
    visa_approval: "66%",
    demand: "Largest source market globally with sustained high outbound flow",
    economic: "Highest absolute GDP, strong coastal province concentrations",
    academic: "Gaokao preparation culture, competitive academic standards",
    viability: "Complex visa landscape, but high volume compensates",
    programs: ["STEM", "Business", "Engineering", "Graduate Research"],
    highlights: [
      "Largest absolute enrollment pool",
      "Geographic concentration in tier-1 and tier-2 cities",
      "Growing middle class with international education aspirations",
      "Strong agent networks established"
    ]
  },
  Singapore: {
    regions: 5,
    students_annual: "3.2k",
    top_region: "Central",
    top_score: 88,
    visa_approval: "97%",
    demand: "Compact market with strategic importance and consistent quality",
    economic: "Highest GDP per capita globally, premium positioning",
    academic: "Advanced education system, English-medium instruction",
    viability: "Excellent visa approval, direct flight connectivity",
    programs: ["STEM", "Business", "Engineering", "Medicine"],
    highlights: [
      "Highest concentration of affluent families",
      "Premium positioning, quality over quantity",
      "Strong government scholarship ecosystem",
      "Regional hub positioning for Southeast Asia expansion"
    ]
  },
  Bangkok: {
    regions: 8,
    students_annual: "12.4k",
    top_region: "Bangkok",
    top_score: 75,
    visa_approval: "88%",
    demand: "Emerging market with strong English-educated middle class",
    economic: "Growing affluence in metropolitan areas, increasing spending power",
    academic: "International school network, English proficiency rising significantly",
    viability: "Straightforward visa process, improving flight connectivity",
    programs: ["STEM", "Business", "Engineering", "Health"],
    highlights: [
      "Untapped market with high growth potential",
      "Strong education quality in major metros",
      "Emerging scholarship ecosystem developing",
      "Gateway to Greater Mekong region expansion"
    ]
  }
};

export function CorridorModal({ corridor, isOpen, onClose }: CorridorModalProps) {
  if (!isOpen || !corridor) return null;

  const details = CORRIDOR_DETAILS[corridor.city as keyof typeof CORRIDOR_DETAILS];

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end md:items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-white rounded-t-3xl md:rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative"
        onClick={e => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 z-10"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Header with image */}
        <div className="relative h-48 md:h-64 overflow-hidden">
          <Image
            src={corridor.img}
            alt={`${corridor.city} skyline`}
            fill
            className="object-cover"
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-8">
            <div className="text-gold-400 text-xs font-semibold uppercase tracking-wider">{corridor.country} → United States</div>
            <h2 className="text-white text-5xl font-black mt-2">{corridor.city}</h2>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 space-y-8">
          {/* Key stats grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 rounded-xl p-4">
              <div className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-1">Regions</div>
              <div className="text-3xl font-black text-navy-900">{details.regions}</div>
            </div>
            <div className="bg-emerald-50 rounded-xl p-4">
              <div className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-1">Annual</div>
              <div className="text-3xl font-black text-emerald-600">{details.students_annual}</div>
              <div className="text-[10px] text-gray-500 mt-1">students/year</div>
            </div>
            <div className="bg-gold-50 rounded-xl p-4">
              <div className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-1">Top Score</div>
              <div className="text-3xl font-black text-gold-600">{details.top_score}</div>
              <div className="text-[10px] text-gray-500 mt-1">{details.top_region}</div>
            </div>
            <div className="bg-purple-50 rounded-xl p-4">
              <div className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-1">F-1 Rate</div>
              <div className="text-3xl font-black text-purple-600">{details.visa_approval}</div>
            </div>
          </div>

          {/* Factors */}
          <div className="space-y-4">
            <h3 className="font-black text-navy-900 text-lg">Opportunity Factors</h3>
            <div className="grid gap-3">
              {[
                { icon: Users, label: "Student Demand", text: details.demand, color: "text-blue-500 bg-blue-50" },
                { icon: BarChart2, label: "Economic Fit", text: details.economic, color: "text-green-500 bg-green-50" },
                { icon: TrendingUp, label: "Academic Pipeline", text: details.academic, color: "text-amber-500 bg-amber-50" },
                { icon: Zap, label: "Corridor Viability", text: details.viability, color: "text-purple-500 bg-purple-50" },
              ].map(({ icon: Icon, label, text, color }) => (
                <div key={label} className="flex gap-3">
                  <div className={`${color} rounded-lg p-3 shrink-0 flex items-center justify-center`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 text-sm">{label}</div>
                    <div className="text-gray-600 text-sm">{text}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Programs and highlights */}
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-black text-navy-900 text-lg mb-3">Popular Programs</h3>
              <div className="flex flex-wrap gap-2">
                {details.programs.map(prog => (
                  <span key={prog} className="inline-block bg-gray-100 text-gray-700 text-sm font-semibold px-3 py-1 rounded-full">
                    {prog}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-black text-navy-900 text-lg mb-3">Key Insights</h3>
              <ul className="space-y-2 text-sm">
                {details.highlights.map((h, i) => (
                  <li key={i} className="flex gap-2 text-gray-600">
                    <span className="text-gold-400 font-bold shrink-0">★</span>
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* CTA */}
          <button
            onClick={onClose}
            className="w-full bg-navy-900 hover:bg-navy-950 text-white font-bold py-3 px-6 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
