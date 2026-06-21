"use client";
import { MessageCircle } from "lucide-react";

export function WhatsAppButton() {
  return (
    <a
      href="https://wa.me/?text=Hi%20Polaris%20team"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-8 right-8 group z-40 flex items-center justify-center"
      aria-label="Contact us on WhatsApp"
      title="Chat with us on WhatsApp"
    >
      {/* Animated background pulse with premium green */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-teal-400/40 to-emerald-500/40 group-hover:from-teal-400/60 group-hover:to-emerald-500/60 blur-xl group-hover:blur-2xl transition-all duration-300 animate-pulse" />

      {/* Main button with glassmorphism and premium green */}
      <div className="relative w-14 h-14 rounded-full bg-gradient-to-br from-teal-500/20 to-emerald-600/20 backdrop-blur-md border border-teal-400/40 group-hover:from-teal-500/40 group-hover:to-emerald-600/40 group-hover:border-teal-400/70 transition-all duration-300 flex items-center justify-center shadow-xl hover:shadow-2xl hover:shadow-teal-500/30">
        <MessageCircle className="w-6 h-6 text-white group-hover:scale-110 transition-transform duration-300" />
      </div>

      {/* Tooltip on hover */}
      <div className="absolute bottom-full right-0 mb-3 px-3 py-1.5 bg-white/90 backdrop-blur-md text-emerald-700 text-xs font-semibold rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap border border-white/30">
        Chat with us
      </div>
    </a>
  );
}
