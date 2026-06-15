// Server-side IDX Broker proxy. Holds the API key (env var) and never exposes it
// to the browser. Normalizes listings into a clean shape for the UI.
// Set IDX_ACCESS_KEY in Vercel: Project → Settings → Environment Variables.

export const revalidate = 0;

const IDX_BASE = "https://api.idxbroker.com/clients";
const CACHE_MS = 30 * 60 * 1000;

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
      cache: "no-store",
    });
    if (!res.ok) return { error: `status_${res.status}`, listings: [] };
    const json = await res.json();
    return { listings: json };
  } catch (e) {
    return { error: String(e), listings: [] };
  }
}

const num = (v) => {
  if (v == null) return null;
  const n = Number(String(v).replace(/[^0-9.]/g, ""));
  return isFinite(n) && n > 0 ? n : null;
};

function collectPhotos(p) {
  let photos = [];
  const img = p.image || p.images || p.photos;
  if (Array.isArray(img)) photos = img.map((x) => (typeof x === "string" ? x : x?.url || x?.URL)).filter(Boolean);
  else if (img && typeof img === "object") {
    photos = Object.values(img)
      .map((x) => (typeof x === "string" ? x : x?.url || x?.URL))
      .filter((u) => typeof u === "string" && /^https?:/.test(u));
  }
  if (!photos.length && p.imageURL) photos = [p.imageURL];
  return photos;
}

function normalize(raw, statusFallback) {
  if (!raw || typeof raw !== "object") return [];
  let items = Array.isArray(raw) ? raw : Object.values(raw);
  // drop non-object entries (IDX sometimes includes a count/legend key)
  items = items.filter((p) => p && typeof p === "object");
  return items
    .map((p) => {
      const address =
        p.address ||
        [p.streetNumber || p.streetNum, p.streetName].filter(Boolean).join(" ").trim() ||
        p.fullAddress ||
        p.streetName ||
        "";
      return {
        id: p.listingID || p.idxID || p.listingId || address || Math.random().toString(36).slice(2),
        address,
        city: p.cityName || p.city || "",
        state: p.state || p.stateAbrv || "",
        zip: p.zipcode || p.zip || "",
        listPrice: num(p.listingPrice ?? p.price ?? p.currentPrice ?? p.listPrice),
        soldPrice: num(p.soldPrice ?? p.salePrice ?? p.closePrice),
        beds: num(p.bedrooms ?? p.totalBedrooms ?? p.beds ?? p.beds),
        baths: num(p.totalBaths ?? p.bathrooms ?? p.baths ?? p.bathsTotal),
        sqft: num(p.sqFt ?? p.squareFeet ?? p.sqft ?? p.livingArea),
        dom: num(p.daysOnMarket ?? p.dom ?? p.daysOnMkt),
        status: (p.propStatus || p.status || statusFallback || "").toString(),
        photos: collectPhotos(p),
        detailUrl: p.fullDetailsURL || p.detailsURL || p.url || "",
      };
    })
    // keep anything that has at least an address or a price
    .filter((x) => x.address || x.listPrice);
}

export async function GET(request) {
  const debug = new URL(request.url).searchParams.get("debug");

  const year = "interval=8760";
  const [featured, soldpending, historical] = await Promise.all([
    idxGet(`featured?${year}`),
    idxGet(`soldpending?${year}`),
    idxGet(`historical?${year}`),
  ]);

  if (debug) {
    // Return raw shapes so we can see exact field names. Trim to first item each.
    const sample = (r) => {
      const v = r.listings;
      if (!v || typeof v !== "object") return { error: r.error || null, sample: v };
      const items = Array.isArray(v) ? v : Object.values(v);
      return { error: r.error || null, count: items.length, firstItem: items.find((x) => x && typeof x === "object") || null };
    };
    return Response.json({
      featured: sample(featured),
      soldpending: sample(soldpending),
      historical: sample(historical),
    });
  }

  if (_cache.data && Date.now() - _cache.ts < CACHE_MS) {
    return Response.json(_cache.data, { headers: { "x-cache": "HIT" } });
  }

  const active = normalize(featured.listings, "Active");
  const sp = normalize(soldpending.listings, "");
  const pending = sp.filter((x) => /pend|contract|contingent/i.test(x.status));
  let sold = sp.filter((x) => /sold|closed/i.test(x.status));
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
