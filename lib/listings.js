import data from "../data/listings.json";

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

export const findBySlug = (slug) => publicListings().find((l) => listingSlug(l) === slug);

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
