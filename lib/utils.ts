import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function scoreColor(score: number) {
  if (score >= 70) return { text: "text-emerald-700", bg: "bg-emerald-500", badge: "bg-emerald-50 text-emerald-700 border-emerald-200" };
  if (score >= 50) return { text: "text-amber-700",   bg: "bg-amber-400",   badge: "bg-amber-50 text-amber-700 border-amber-200" };
  return               { text: "text-red-700",     bg: "bg-red-400",     badge: "bg-red-50 text-red-700 border-red-200" };
}

export function confidenceColor(c: string) {
  if (c === "high")   return "text-emerald-600";
  if (c === "medium") return "text-amber-600";
  return "text-gray-400";
}

export function fmt(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000)     return `${(n / 1_000).toFixed(0)}k`;
  return String(n);
}

export function usd(n: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);
}
