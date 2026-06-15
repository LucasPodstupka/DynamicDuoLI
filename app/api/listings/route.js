// Server-side IDX Broker proxy. Holds the API key (env var) and never exposes it
// to the browser. Normalizes listings into a clean shape for the UI.
//
// Set IDX_ACCESS_KEY in Vercel: Project → Settings → Environment Variables.

export const revalidate = 0; // we handle our own caching below

const IDX_BASE = "https://api.idxbroker.com/clients";
const CACHE_MS = 30 * 60 * 1000; // 30 minutes — respects IDX hourly call limits

// simple in-memory cache (per server instance)
let _cache = { ts: 0, data: null };

async function idxGet(path) {
  const key = process.env.IDX_ACCESS_KEY;
  if (!key) return { error: "no_key", listings: [] };
  try {
    const res = await fetch(`${IDX_BASE}/${path}`, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        accesskey: key,
        outputtype: "json",
      },
      // up to 1 year of data
      cache: "no-store",
    });
    if (!res.ok) {
      // 204 = no data; 4xx often = MLS prohibits this endpoint
      return { error: `status_${res.status}`, listings: [] };
    }
    const json = await res.json();
    return { listings: json };
  } catch (e) {
    return { error: String(e), listings: [] };
  }
}

// IDX returns an object keyed by listing index, OR sometimes an array.
// Each property has varying field names; normalize defensively.
function normalize(raw, statusFallback) {
  if (!raw || typeof raw !== "object") return [];
  const items = Array.isArray(raw) ? raw : Object.values(raw);
  return items
    .filter((p) => p && typeof p === "object" && (p.address || p.streetName || p.listingID))
    .map((p) => {
      // photos: IDX exposes image arrays in a few shapes
      let photos = [];
      if (Array.isArray(p.image)) photos = p.image.map((x) => (typeof x === "string" ? x : x?.url)).filter(Boolean);
      else if (p.image && typeof p.image === "object") {
        photos = Object.values(p.image).map((x) => (typeof x === "string" ? x : x?.url)).filter(Boolean);
      }
      if (!photos.length && p.imageURL) photos = [p.imageURL];

      const num = (v) => {
        if (v == null) return null;
        const n = Number(String(v).replace(/[^0-9.]/g, ""));
        return isFinite(n) ? n : null;
      };

      const address =
        p.address ||
        [p.streetNumber, p.streetName].filter(Boolean).join(" ") ||
        p.fullAddress ||
        "";

      return {
        id: p.listingID || p.idxID || address,
        address,
        city: p.cityName || p.city || "",
        state: p.state || "",
        zip: p.zipcode || p.zip || "",
        listPrice: num(p.listingPrice ?? p.price ?? p.currentPrice),
        soldPrice: num(p.soldPrice ?? p.salePrice),
        beds: num(p.bedrooms ?? p.totalBedrooms ?? p.beds),
        baths: num(p.totalBaths ?? p.bathrooms ?? p.baths),
        sqft: num(p.sqFt ?? p.squareFeet ?? p.acres),
        dom: num(p.daysOnMarket ?? p.dom),
        status: (p.propStatus || p.status || statusFallback || "").toString(),
        photos,
        detailUrl: p.fullDetailsURL || p.detailsURL || p.url || "",
        propType: p.idxPropType || p.propType || "",
      };
    });
}

export async function GET() {
  // serve cache if fresh
  if (_cache.data && Date.now() - _cache.ts < CACHE_MS) {
    return Response.json(_cache.data, { headers: { "x-cache": "HIT" } });
  }

  const year = "&interval=8760"; // ~1 year in hours, where supported
  const [featured, soldpending, historical] = await Promise.all([
    idxGet("featured"),
    idxGet(`soldpending?${year}`),
    idxGet(`historical?${year}`),
  ]);

  const active = normalize(featured.listings, "Active");
  // soldpending may include both; split by status text
  const sp = normalize(soldpending.listings, "");
  const pending = sp.filter((x) => /pend|contract|contingent/i.test(x.status));
  let sold = sp.filter((x) => /sold|closed/i.test(x.status));
  // historical is sold MLS data; merge if present
  const hist = normalize(historical.listings, "Sold");
  if (hist.length) sold = [...sold, ...hist];

  const data = {
    active,
    pending,
    sold,
    meta: {
      featuredError: featured.error || null,
      soldpendingError: soldpending.error || null,
      historicalError: historical.error || null,
      counts: { active: active.length, pending: pending.length, sold: sold.length },
      cachedAt: new Date().toISOString(),
    },
  };

  _cache = { ts: Date.now(), data };
  return Response.json(data, { headers: { "x-cache": "MISS" } });
}
