// Bright Data REST client — SERP API + Web Unlocker.
// Reads credentials from the environment. Safe to import without a key:
// isConfigured() returns false and the pipeline falls back to mock scores.
//
// Env:
//   BRIGHTDATA_API_KEY        — your Bright Data API token
//   BRIGHTDATA_SERP_ZONE      — SERP zone name (default: cli_unlocker)
//   BRIGHTDATA_UNLOCKER_ZONE  — Web Unlocker zone name (default: cli_unlocker)

const BASE = "https://api.brightdata.com";

export function isConfigured() {
  return Boolean(process.env.BRIGHTDATA_API_KEY);
}

function key() {
  const k = process.env.BRIGHTDATA_API_KEY;
  if (!k) throw new Error("BRIGHTDATA_API_KEY is not set");
  return k;
}

const SERP_ZONE = () => process.env.BRIGHTDATA_SERP_ZONE || "cli_unlocker";
const UNLOCKER_ZONE = () => process.env.BRIGHTDATA_UNLOCKER_ZONE || "cli_unlocker";

async function request(body, { retries = 2 } = {}) {
  let lastErr;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await fetch(`${BASE}/request`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${key()}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error(`Bright Data ${res.status}: ${(await res.text()).slice(0, 200)}`);
      return await res.text();
    } catch (e) {
      lastErr = e;
      await new Promise(r => setTimeout(r, 800 * (attempt + 1)));
    }
  }
  throw lastErr;
}

// Google SERP for a query → parsed JSON (organic results + counts).
// Uses brd_json=1 so Bright Data returns structured JSON instead of HTML.
export async function serp(query, { num = 20 } = {}) {
  const url = `https://www.google.com/search?q=${encodeURIComponent(query)}&num=${num}&brd_json=1`;
  const raw = await request({ url, zone: SERP_ZONE(), format: "raw" });
  try {
    return JSON.parse(raw);
  } catch {
    return { organic: [], _raw: raw.slice(0, 500) };
  }
}

// Fetch any URL as clean markdown (CAPTCHA + JS handled).
export async function unlock(url, { dataFormat = "markdown" } = {}) {
  return request({ url, zone: UNLOCKER_ZONE(), format: "raw", data_format: dataFormat });
}
