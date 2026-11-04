import raw from "../data/listings.json";
import officeRaw from "../data/office-listings.json";
import { cleanDescription } from "./fair-housing";

// Fair housing: MLS descriptions are filtered at build time (source data unchanged).
const clean = (l) => ({ ...l, description: cleanDescription(l.mls, l.description) });
const data = { ...raw, listings: raw.listings.map(clean) };
export const officeListings = () => officeRaw.listings.map(clean);

// Same 12-month rule the /listings page uses: sold homes older than a year drop off.
export function inWindow(l, now = new Date()) {
  if (l.status !== "Sold") return true;
  if (!l.soldDate) return false;
  const from = new Date(now); from.setFullYear(now.getFullYear() - 1);
  const d = new Date(l.soldDate + "T12:00:00");
  return d >= from && d <= now;
}

const BLOCKED = [/74\s+w(est)?\.?\s+hoffman/i];
const isPublishable = (l) =>
  ["Active", "Pending", "Sold"].includes(l.status) &&
  !/rent|lease/i.test(l.propertyType || "") &&
  !BLOCKED.some((re) => re.test(l.address || ""));

export const slugify = (s) =>
  String(s).toLowerCase().replace(/&/g, " and ").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

export const listingSlug = (l) => `${slugify(l.address)}-${slugify(l.town)}-${l.mls}`;

export function publicListings(now = new Date()) {
  return data.listings.filter((l) => isPublishable(l) && inWindow(l, now));
}

// Full deal history (older sold deals from future multi-year MLS exports).
// Older sold rows can be added to data/listings.json with the same fields; they stay off
// the 12-month pages via inWindow(), and are available here for history/stat views.
export function dealHistory() {
  return data.listings.filter(isPublishable).filter((l) => l.status !== "Sold" || l.soldDate);
}

// One page per record: current listings plus every closed sale in the history.
export const findBySlug = (slug) => allDeals().find((l) => listingSlug(l) === slug);

export const money = (n) => (n == null ? "—" : "$" + n.toLocaleString("en-US"));
export const fmtDate = (d) =>
  d ? new Date(d + "T12:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : null;
export const fmtBaths = (b) => (b == null ? null : Number.isInteger(b) ? b : b.toFixed(1));
export const sideLabel = (s) =>
  s === "listing" ? "Our Listing" : s === "buyer" ? "Buyer Represented" : s === "both" ? "Listing & Buyer" : "Office Listing";

export function teamStats() {
  const list = publicListings();
  const sold = list.filter((l) => l.status === "Sold");
  return {
    sold: sold.length,
    soldVolume: sold.reduce((s, l) => s + (l.soldPrice || 0), 0),
    buyerSide: list.filter((l) => l.side === "buyer" || l.side === "both").length,
    listingSide: list.filter((l) => l.side === "listing" || l.side === "both").length,
    active: list.filter((l) => l.status === "Active").length,
    pending: list.filter((l) => l.status === "Pending").length,
  };
}
export const shortMoney = (n) => (n >= 1e6 ? `$${(n / 1e6).toFixed(1)}M` : money(n));

// ---- All-time deals: listings.json (publishable) + MLS closed-sale history, deduped by MLS #.
import past from "../data/past-sales.json";
// Sales outside Long Island (Queens). Shown, but labeled and left out of Long Island totals.
export const NYC_TOWNS = ["Woodside", "Ozone Park", "Douglaston"];
export const isNYC = (l) => NYC_TOWNS.includes(l.town);

export function allDeals() {
  const seen = new Set();
  const out = [];
  data.listings.filter(isPublishable).forEach((l) => { if (!seen.has(l.mls)) { seen.add(l.mls); out.push(l); } });
  past.sales.forEach((s) => {
    if (seen.has(s.mls) || !s.soldDate || BLOCKED.some((re) => re.test(s.address || ""))) return;
    seen.add(s.mls);
    out.push({ ...s, status: "Sold", listPrice: null, photos: [], history: true, ...(isNYC(s) ? { nyc: true } : {}) });
  });
  return out;
}
const soldSum = (a) => a.reduce((s, l) => s + (l.soldPrice || 0), 0);
export function dealStats(now = new Date()) {
  const all = allDeals().filter((l) => !isNYC(l));
  const sold = all.filter((l) => l.status === "Sold" && l.soldDate);
  const recent = sold.filter((l) => inWindow(l, now));
  const firstYear = sold.reduce((y, l) => Math.min(y, +l.soldDate.slice(0, 4)), 9999);
  return {
    allTime: { count: sold.length, volume: soldSum(sold), since: firstYear },
    last12: { count: recent.length, volume: soldSum(recent) },
    buyerSideAll: sold.filter((l) => l.side === "buyer" || l.side === "both").length,
    listingSideAll: sold.filter((l) => l.side === "listing" || l.side === "both").length,
  };
}
