# Live corridor scores via Bright Data

Polaris ships with built-in **mock scores** so the maps always work. This
pipeline replaces them with **real, nightly web signals** collected through
[Bright Data](https://brightdata.com) — for all five corridors:
**China, Japan, South Korea, India, Singapore → US** (136 regions total).

Until you add a Bright Data key, the app keeps using the mock scores. Nothing
breaks. The moment a key is present and the pipeline runs, the maps and
standings switch to live data automatically.

## How it works

```
data/regions.json ──► scripts/build-scores.mjs ──► data/scores.generated.json ──► the app
                          │
                          ├─ lib/brightdata/client.mjs   (SERP + Web Unlocker REST)
                          └─ lib/scoring/model.mjs        (6 dimensions → 0–100 score)
```

Each region is scored on **six weighted dimensions**, each backed by a live
Bright Data search:

| Dimension | Weight | Signal |
|-----------|--------|--------|
| Student Demand | 25% | study-abroad interest for the region |
| Competitive White Space | 25% | *fewer* US recruiters present = higher score |
| Economic Ability-to-Pay | 15% | international/private-school footprint |
| Academic Readiness | 15% | IELTS/TOEFL/SAT prep density |
| Migration Intent | 10% | F-1 visa / agency activity |
| Corridor Strength | 10% | country F-1 visa-approval baseline |

Signals are normalized **within each corridor** (relative ranking), so the
colors mean "best opportunities in *this* country," exactly like the mock data.

`lib/scores.ts` is the single switch: it serves `data/scores.generated.json`
when non-empty, otherwise the mock scores.

## One-time setup

1. **Get a key** (free tier needs no card — 5,000 requests/month):
   ```bash
   npx --yes @brightdata/cli login      # browser OAuth, creates zones + key
   # or grab a key from https://brightdata.com/cp
   ```
2. **Add it locally** (`.env`):
   ```dotenv
   BRIGHTDATA_API_KEY=your_key_here
   BRIGHTDATA_SERP_ZONE=cli_unlocker
   BRIGHTDATA_UNLOCKER_ZONE=cli_unlocker
   ```
3. **Run it:**
   ```bash
   npm run scores            # all 5 corridors
   npm run scores CHN JPN    # just these corridors
   ```
   This writes `data/scores.generated.json`. Commit it and deploy.

## Nightly automation

`.github/workflows/refresh-scores.yml` runs the pipeline every night (02:00
UTC), commits the refreshed JSON, and Vercel auto-deploys. To enable it, add
the key as a GitHub Actions secret:

> Repo → Settings → Secrets and variables → Actions → New repository secret
> `BRIGHTDATA_API_KEY` (and optionally the two zone names).

You can also trigger it any time from the Actions tab → "Refresh corridor
scores" → Run workflow.

## Cost

Roughly **5 requests per region** (one per searchable dimension) × 136 regions
= **~680 requests per full refresh**.

| Cadence | Requests / month | Cost* |
|---------|------------------|-------|
| Weekly  | ~2,700 | **Free** (within the 5,000/mo free tier) |
| Nightly | ~20,400 | ~5,000 free + ~15,400 paid ≈ **$20–30 / mo** |

\* Pay-as-you-go SERP/Unlocker is about **$1.5 per 1,000 requests**; volume
plans are cheaper. Confirm current rates at
<https://brightdata.com/pricing>. The Browser API is **not** used here, so it
doesn't add cost.

**Recommendation:** start on **weekly** refresh — it's free and the underlying
demand/competition signals don't move daily. Switch the cron to nightly only if
you want the "updated nightly" claim to be literal.
