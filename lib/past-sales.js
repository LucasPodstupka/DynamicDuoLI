import past from "../data/past-sales.json";
import data from "../data/listings.json";
import { inWindow } from "./listings";

const BLOCKED = [/74\s+w(est)?\.?\s+hoffman/i];
const ok = (s) => s.soldDate && !BLOCKED.some((re) => re.test(s.address || ""));

// Closed-sale history: the MLS history export plus any sold rows in listings.json
// that have aged out of the 12-month window. Only fields from the MLS exports.
export function pastSales() {
  const seen = new Set();
  const rows = [];
  const add = (s) => {
    if (!ok(s) || seen.has(s.mls)) return;
    seen.add(s.mls);
    rows.push({ mls: s.mls, address: s.address, town: s.town, soldPrice: s.soldPrice, soldDate: s.soldDate, beds: s.beds, baths: s.baths, side: s.side, ourAgents: s.ourAgents || [] });
  };
  // Sold rows still inside the 12-month window already show as listing cards; skip them here.
  data.listings.filter((l) => l.status === "Sold" && inWindow(l)).forEach((l) => seen.add(l.mls));
  data.listings.filter((l) => l.status === "Sold" && !inWindow(l)).forEach(add);
  past.sales.forEach(add);
  return rows.sort((a, b) => b.soldDate.localeCompare(a.soldDate));
}

export const pastSalesForTown = (t) => pastSales().filter((s) => s.town === t.name || t.match.includes(s.town));
