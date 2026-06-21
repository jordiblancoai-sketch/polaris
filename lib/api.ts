import { RankedOpportunityList, TripPlanResponse } from "./types";
import { MOCK_SCORES } from "./types";

const BASE = "/api/v1";

async function fetchWithAuth(path: string, init?: RequestInit) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json", ...init?.headers },
    ...init,
  });
  if (!res.ok) throw new Error(`API error ${res.status}: ${await res.text()}`);
  return res.json();
}

export async function getOpportunities(
  destCountry = "USA",
  programType?: string,
  topN = 50
): Promise<RankedOpportunityList> {
  try {
    const params = new URLSearchParams({ dest_country_iso: destCountry, top_n: String(topN) });
    if (programType) params.set("program_type", programType);
    return await fetchWithAuth(`/scores/opportunities?${params}`);
  } catch {
    // Demo mode: return mock data
    return {
      total: MOCK_SCORES.length,
      dest_country_iso: destCountry,
      program_type: programType ?? null,
      results: MOCK_SCORES,
      computed_at: new Date().toISOString().split("T")[0],
      model_version: "baseline-v1 (demo)",
    };
  }
}

export async function planTrip(payload: {
  dest_country_iso: string;
  budget_usd: number;
  trip_duration_days: number;
  target_enrollments: number;
  program_type?: string;
}): Promise<TripPlanResponse> {
  return fetchWithAuth("/trips/plan", { method: "POST", body: JSON.stringify(payload) });
}

export async function getUniversity() {
  return fetchWithAuth("/universities/me");
}
