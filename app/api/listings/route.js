/* =====================================================================
   LISTINGS API  —  /api/listings
   ---------------------------------------------------------------------
   Fetches the team's IDXBroker featured + sold/pending listings, maps
   them into the shape the homepage Listings section expects, and splits
   them into { active, pending, sold }.

   The IDXBroker API key MUST be set as a Vercel environment variable
   named  IDX_ACCESS_KEY  (Project → Settings → Environment Variables).
   It is read here on the server only and never sent to the browser.

   Endpoints used (IDXBroker Partners API):
     GET clients/featured          -> the team's own active/pending listings
     GET clients/soldpending       -> the team's sold + pending listings
   ===================================================================== */

export const runtime = "nodejs";
// Re-fetch from IDXBroker at most once every 10 minutes (ISR-style cache).
export const revalidate = 600;

const IDX_BASE = "https://api.idxbroker.com";

/* ---- map one raw IDXBroker listing object to our card shape ---- */
function mapListing(raw) {
  // Photos: IDXBroker returns an `image` object keyed "0","1",... plus a
  // numeric `totalCount`. Pull the .url off each numbered entry, in order.
  let photos = [];
  if (raw.image && typeof raw.image === "object") {
    photos = Object.keys(raw.image)
      .filter((k) => /^\d+$/.test(k))
      .sort((a, b) => Number(a) - Number(b))
      .map((k) => raw.image[k] && raw.image[k].url)
      .filter(Boolean);
  }

  // sqft arrives as a formatted string like "2,160" — strip commas to a number.
  const sqft =
    raw.sqFt != null && String(raw.sqFt).trim() !== ""
      ? Number(String(raw.sqFt).replace(/[^0-9.]/g, "")) || null
      : null;

  // Days on market, when we can compute it from onMarketDate.
  let dom = null;
  const onMarket = raw.advanced && raw.advanced.onMarketDate;
  if (onMarket) {
    const start = new Date(onMarket).getTime();
    if (!Number.isNaN(start)) {
      dom = Math.max(0, Math.round((Date.now() - start) / 86400000));
    }
  }

  return {
    id: raw.listingID || raw.detailsURL || raw.address,
    photos,
    listPrice: raw.price != null ? Number(raw.price) : null,
    soldPrice: raw.soldPrice != null ? Number(raw.soldPrice) : null,
    address: raw.address || "",
    city: raw.cityName || (raw.advanced && raw.advanced.city) || "",
    state: raw.state || "",
    zip: raw.zipcode || "",
    beds: raw.bedrooms != null ? Number(raw.bedrooms) : null,
    baths: raw.totalBaths != null ? Number(raw.totalBaths) : null,
    sqft,
    dom,
    status: (raw.propStatus || "").toLowerCase(),
    url: raw.fullDetailsURL || null,
  };
}

/* ---- normalize an IDXBroker response into an array of listings ----
   IDXBroker returns an object keyed by an internal id (e.g. "c056!%894908")
   whose values are the listing objects. We just want the values. */
function toArray(payload) {
  if (!payload || typeof payload !== "object") return [];
  return Object.keys(payload)
    .filter((k) => payload[k] && typeof payload[k] === "object" && payload[k].address)
    .map((k) => payload[k]);
}

async function idxFetch(path, apiKey) {
  const res = await fetch(`${IDX_BASE}/${path}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      accesskey: apiKey,
      outputtype: "json",
    },
    // Let Next cache the upstream response per `revalidate` above.
    next: { revalidate },
  });
  const text = await res.text();
  let body = null;
  try {
    body = JSON.parse(text);
  } catch {
    body = text; // non-JSON (e.g. an error string)
  }
  return { ok: res.ok, status: res.status, body };
}

export async function GET(request) {
  const apiKey = process.env.IDX_ACCESS_KEY;

  if (!apiKey) {
    // No key configured yet — return empty sets so the page shows its
    // graceful "check back soon" state instead of crashing.
    return Response.json(
      { active: [], pending: [], sold: [], error: "missing_api_key" },
      { status: 200 }
    );
  }

  // TEMPORARY DIAGNOSTICS: hit /api/listings?debug=1 to see exactly what
  // IDXBroker returns. Remove this block once listings are flowing.
  let debug = null;
  try {
    debug = new URL(request.url).searchParams.get("debug");
  } catch {
    debug = null;
  }

  try {
    // Featured = the team's own listings (active + pending live here).
    // soldpending = sold + pending. We use featured for active/pending
    // and soldpending for the sold set.
    const [feat, soldRes] = await Promise.all([
      idxFetch("clients/featured", apiKey).catch((e) => ({
        ok: false,
        status: 0,
        body: String(e && e.message),
      })),
      idxFetch("clients/soldpending", apiKey).catch((e) => ({
        ok: false,
        status: 0,
        body: String(e && e.message),
      })),
    ]);

    if (debug) {
      return Response.json(
        {
          featured: {
            status: feat.status,
            ok: feat.ok,
            type: Array.isArray(feat.body) ? "array" : typeof feat.body,
            keys:
              feat.body && typeof feat.body === "object"
                ? Object.keys(feat.body).slice(0, 5)
                : null,
            sample: feat.body,
          },
          soldpending: {
            status: soldRes.status,
            ok: soldRes.ok,
            type: Array.isArray(soldRes.body) ? "array" : typeof soldRes.body,
            keys:
              soldRes.body && typeof soldRes.body === "object"
                ? Object.keys(soldRes.body).slice(0, 5)
                : null,
          },
        },
        { status: 200 }
      );
    }

    const featured = toArray(feat.body).map(mapListing);
    const soldPending = toArray(soldRes.body).map(mapListing);

    const active = featured.filter((l) => l.status === "active");
    const pending = featured.filter((l) => l.status === "pending");

    // Sold: take closed/sold from the soldpending feed. IDXBroker marks
    // these with propStatus "Closed" (and idxStatus "sold").
    const sold = soldPending
      .filter((l) => l.status === "closed" || l.status === "sold")
      .sort((a, b) => (b.soldPrice || 0) - (a.soldPrice || 0));

    // Sort active/pending high-to-low by price for a clean grid.
    active.sort((a, b) => (b.listPrice || 0) - (a.listPrice || 0));
    pending.sort((a, b) => (b.listPrice || 0) - (a.listPrice || 0));

    return Response.json({ active, pending, sold }, { status: 200 });
  } catch (err) {
    return Response.json(
      { active: [], pending: [], sold: [], error: String(err && err.message) },
      { status: 200 }
    );
  }
}
