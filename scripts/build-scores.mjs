#!/usr/bin/env node
// Nightly score builder for all five corridors.
//
//   node scripts/build-scores.mjs            # all corridors
//   node scripts/build-scores.mjs CHN JPN    # specific corridors
//
// Reads region lists from data/regions.json, collects live web signals via
// Bright Data, scores them, and writes data/scores.generated.json — which the
// app prefers over the built-in mock scores (see lib/scores.ts).
//
// Without BRIGHTDATA_API_KEY it exits cleanly and leaves the mock scores in
// place, so the build never breaks before the account is connected.

import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { isConfigured } from "../lib/brightdata/client.mjs";
import { collectRegion, scoreCorridor } from "../lib/scoring/model.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const REGIONS = JSON.parse(readFileSync(join(ROOT, "data/regions.json"), "utf8"));
const OUT = join(ROOT, "data/scores.generated.json");

const CONCURRENCY = 4; // be gentle on the API / your credit budget

async function mapLimit(items, limit, fn) {
  const out = new Array(items.length);
  let i = 0;
  await Promise.all(
    Array.from({ length: Math.min(limit, items.length) }, async () => {
      while (i < items.length) {
        const idx = i++;
        out[idx] = await fn(items[idx], idx);
      }
    })
  );
  return out;
}

async function main() {
  const want = process.argv.slice(2).map(s => s.toUpperCase());
  const isos = Object.keys(REGIONS).filter(k => !want.length || want.includes(k));

  if (!isConfigured()) {
    console.log("\n⚠  BRIGHTDATA_API_KEY not set — skipping live collection.");
    console.log("   The app will keep using built-in mock scores.");
    console.log("   Set the key (see BRIGHTDATA.md) and re-run to go live.\n");
    process.exit(0);
  }

  const all = [];
  for (const iso of isos) {
    const { country, regions } = REGIONS[iso];
    console.log(`\n▶ ${iso} (${country}) — ${regions.length} regions`);
    const withRaw = await mapLimit(regions, CONCURRENCY, async (r, idx) => {
      const raw = await collectRegion(r.name, country);
      process.stdout.write(`  [${idx + 1}/${regions.length}] ${r.name}\r`);
      return { ...r, raw };
    });
    const scored = scoreCorridor(withRaw, iso);
    console.log(`\n  ✓ scored — top: ${scored[0]?.target_entity_name} (${scored[0]?.score})`);
    all.push(...scored);
  }

  writeFileSync(OUT, JSON.stringify(all, null, 1));
  console.log(`\n✅ Wrote ${all.length} scored regions → data/scores.generated.json`);
  console.log("   Commit & deploy (or it's picked up on next build).\n");
}

main().catch(e => { console.error("\n✖ build-scores failed:", e.message); process.exit(1); });
