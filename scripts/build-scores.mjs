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

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");

// Load BRIGHTDATA_* from .env.local / .env so `npm run scores` works without
// exporting anything (plain node doesn't read env files like Next.js does).
for (const file of [".env.local", ".env"]) {
  const p = join(ROOT, file);
  if (!existsSync(p)) continue;
  for (const line of readFileSync(p, "utf8").split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
}

const { isConfigured } = await import("../lib/brightdata/client.mjs");
const { collectRegion, scoreCorridor } = await import("../lib/scoring/model.mjs");
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

const CACHE = join(ROOT, "data/_signals.cache.json");

async function main() {
  const args = process.argv.slice(2);
  const rescore = args.includes("--rescore"); // re-score from cached raw signals (no API calls)
  const want = args.filter(a => !a.startsWith("--")).map(s => s.toUpperCase());
  const isos = Object.keys(REGIONS).filter(k => !want.length || want.includes(k));

  // --rescore: skip Bright Data entirely, just re-run the scoring on cached
  // signals. Lets us tune BLEND_PRIOR / weights for free.
  if (rescore) {
    if (!existsSync(CACHE)) { console.error("✖ No signal cache — run a full collection first."); process.exit(1); }
    const cache = JSON.parse(readFileSync(CACHE, "utf8"));
    const all = [];
    for (const iso of isos) {
      if (!cache[iso]) continue;
      const scored = scoreCorridor(cache[iso], iso);
      console.log(`▶ ${iso} top: ${scored.slice(0, 5).map(s => `${s.target_entity_name} ${s.score}`).join("  |  ")}`);
      all.push(...scored);
    }
    writeFileSync(OUT, JSON.stringify(all, null, 1));
    console.log(`\n✅ Re-scored ${all.length} regions from cache → data/scores.generated.json\n`);
    return;
  }

  if (!isConfigured()) {
    console.log("\n⚠  BRIGHTDATA_API_KEY not set — skipping live collection.");
    console.log("   The app will keep using built-in mock scores.");
    console.log("   Set the key (see BRIGHTDATA.md) and re-run to go live.\n");
    process.exit(0);
  }

  const all = [];
  const cache = {};
  for (const iso of isos) {
    const { country, regions } = REGIONS[iso];
    console.log(`\n▶ ${iso} (${country}) — ${regions.length} regions`);
    const withRaw = await mapLimit(regions, CONCURRENCY, async (r, idx) => {
      const raw = await collectRegion(r.name, country);
      process.stdout.write(`  [${idx + 1}/${regions.length}] ${r.name}\r`);
      return { ...r, raw };
    });
    cache[iso] = withRaw; // keep raw signals for free re-scoring later
    const scored = scoreCorridor(withRaw, iso);
    console.log(`\n  ✓ scored — top: ${scored[0]?.target_entity_name} (${scored[0]?.score})`);
    all.push(...scored);
  }

  writeFileSync(CACHE, JSON.stringify(cache, null, 1));
  writeFileSync(OUT, JSON.stringify(all, null, 1));
  console.log(`\n✅ Wrote ${all.length} scored regions → data/scores.generated.json`);
  console.log("   Commit & deploy (or it's picked up on next build).\n");
}

main().catch(e => { console.error("\n✖ build-scores failed:", e.message); process.exit(1); });
