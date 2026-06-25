// Scoring model: turns Bright Data web signals into a 0–100 yield-probability
// score per region, across six weighted dimensions.
//
// Flow per corridor:
//   1. For each region, run one SERP query per dimension → a raw magnitude.
//   2. Normalize each dimension across the corridor's regions (relative rank).
//   3. Weighted-combine into a 0–100 score, with confidence + top factors.

import { serp } from "../brightdata/client.mjs";

// Country-level F-1 visa approval baseline (the "corridor strength" anchor).
export const VISA_BASELINE = { CHN: 0.66, JPN: 0.95, KOR: 0.89, IND: 0.80, SGP: 0.97 };

// How much the demand prior anchors the final score vs. the live web signal.
// 0 = pure live web data, 1 = pure prior. ~0.6 keeps rankings sensible while
// letting live signals nudge them and refresh nightly.
export const BLEND_PRIOR = 0.6;

// Each dimension: how to query it, its weight, and whether more = worse.
// `invert: true` means a higher raw signal LOWERS the score (competition).
export const DIMENSIONS = [
  {
    key: "demand", label: "Student Demand", weight: 0.25,
    query: (r, c) => `study abroad USA university "${r}" ${c} students`,
  },
  {
    key: "whitespace", label: "Competitive White Space", weight: 0.25, invert: true,
    query: (r, c) => `US university recruitment fair OR admissions event "${r}" ${c}`,
  },
  {
    key: "economic", label: "Economic Ability-to-Pay", weight: 0.15,
    query: (r) => `"${r}" international school OR private school tuition`,
  },
  {
    key: "academic", label: "Academic Readiness", weight: 0.15,
    query: (r) => `"${r}" IELTS OR TOEFL OR SAT preparation center`,
  },
  {
    key: "migration", label: "Migration Intent", weight: 0.10,
    query: (r, c) => `"${r}" ${c} F-1 student visa USA agency`,
  },
];

// Pull a magnitude out of a Bright Data SERP JSON payload.
// Prefers Google's total-results estimate, falls back to organic count.
export function extractMagnitude(serpJson) {
  if (!serpJson) return 0;
  const cnt =
    serpJson?.general?.results_cnt ??
    serpJson?.general?.results_cnt_total ??
    null;
  if (typeof cnt === "number" && cnt > 0) return cnt;
  const organic = Array.isArray(serpJson?.organic) ? serpJson.organic.length : 0;
  return organic; // 0..~20
}

// Collect raw signals for one region (one SERP call per dimension).
export async function collectRegion(region, country) {
  const raw = {};
  for (const d of DIMENSIONS) {
    try {
      const json = await serp(d.query(region, country));
      raw[d.key] = extractMagnitude(json);
    } catch {
      raw[d.key] = 0;
    }
  }
  return raw;
}

// Min-max normalize on a log scale → 0..1 (web magnitudes are heavy-tailed).
function normalize(values) {
  const logs = values.map(v => Math.log10(Math.max(1, v)));
  const min = Math.min(...logs), max = Math.max(...logs);
  const span = max - min || 1;
  return logs.map(l => (l - min) / span);
}

// Given every region's raw signals for a corridor, produce final scores.
// `regions` = [{ id, name, raw:{demand,whitespace,...} }]
export function scoreCorridor(regions, iso) {
  const norm = {};
  for (const d of DIMENSIONS) {
    const vals = regions.map(r => r.raw?.[d.key] ?? 0);
    let n = normalize(vals);
    if (d.invert) n = n.map(x => 1 - x); // low competition = high white space
    norm[d.key] = n;
  }
  const visa = VISA_BASELINE[iso] ?? 0.8;

  const scored = regions.map((r, i) => {
    const factors = DIMENSIONS.map(d => ({
      factor_name: d.key,
      factor_label: d.label,
      factor_value: Math.round(norm[d.key][i] * 100),
      factor_weight: d.weight,
      shap_contribution: +(norm[d.key][i] * d.weight).toFixed(3),
      data_source: "Bright Data (live web)",
    }));
    // Corridor strength (visa) folded in as a fixed 10% on top of the 90% above.
    const dimSum = factors.reduce((a, f) => a + norm[f.factor_name][i] * f.factor_weight, 0); // 0..0.9
    const liveComposite = dimSum + visa * 0.10; // 0..1 — pure live web signal

    // Blend the live signal with the demand prior (expert/population-anchored
    // baseline) so big known source regions can't be buried by a small region
    // that happens to return a clean web-result count.
    const prior = (r.prior ?? 50) / 100;
    const composite = BLEND_PRIOR * prior + (1 - BLEND_PRIOR) * liveComposite;
    const score = Math.round(composite * 100);
    factors.push({
      factor_name: "corridor", factor_label: "Corridor Strength (visa)",
      factor_value: Math.round(visa * 100), factor_weight: 0.10,
      shap_contribution: +(visa * 0.10).toFixed(3), data_source: "U.S. Dept. of State F-1 data",
    });
    const top = [...factors].sort((a, b) => b.shap_contribution - a.shap_contribution).slice(0, 3);
    return { ...r, score, factors, top };
  });

  // Rank within corridor, attach confidence + a generated insight.
  scored.sort((a, b) => b.score - a.score);
  return scored.map((r, idx) => {
    const confidence = r.score >= 70 ? "high" : r.score >= 50 ? "medium" : "low";
    const lead = r.top[0]?.factor_label ?? "demand";
    const key_insight =
      r.score >= 70 ? `Strong opportunity — led by ${lead.toLowerCase()}. Low recruiter saturation relative to demand.`
      : r.score >= 50 ? `Emerging opportunity. ${lead} is the strongest signal; watch competition.`
      : `Limited corridor today. Smaller pipeline and weaker ${lead.toLowerCase()} signal.`;
    const risk_flag = r.score < 50 ? "Smaller pipeline / weaker signals — lower marginal ROI." : null;
    return {
      rank: idx + 1,
      score: r.score,
      confidence,
      target_entity_type: "region",
      target_entity_id: r.id,
      target_entity_name: r.name,
      target_country_iso: iso,
      dest_country_iso: "USA",
      key_insight,
      risk_flag,
      optimal_visit_window: null,
      top_factors: r.top,
      recommended_schools: [],
    };
  });
}
