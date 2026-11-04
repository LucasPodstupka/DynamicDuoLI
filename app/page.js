import HomeClient from "../components/HomeClient";
import { dealStats, publicListings, listingSlug } from "../lib/listings";
import { upcomingOpenHouses, fmtOpenHouse } from "../lib/open-houses";
import { TOWNS, listingsForTown } from "../lib/towns";
import "./site-pages.css";

export const revalidate = 86400;

export const metadata = { alternates: { canonical: "/" } };

const vol = (n) => (n >= 1e6 ? `$${(n / 1e6).toFixed(1)}M` : `$${Math.round(n / 1e3)}K`);
const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;");

// Hero stats and "Where we sell" are computed from data/listings.json + data/past-sales.json.
export default function Home() {
  const s = dealStats();
  const meta =
    `<div><b data-count="${s.allTime.count}" data-suffix="">${s.allTime.count}</b><span>Homes Sold · Since ${s.allTime.since}</span></div>` +
    `<div><b>${vol(s.allTime.volume)}</b><span>Sold Volume · Since ${s.allTime.since}</span></div>`;
  const top = TOWNS.filter((t) => !t.hub)
    .map((t) => [t, listingsForTown(t).filter((l) => !l.nyc).length])
    .filter(([, n]) => n > 0)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 12);
  const wws =
    `<section class="wws" id="where-we-sell"><div class="wrap">` +
    `<span class="eyebrow">Where We Sell</span>` +
    `<h2 class="sp-h2">Anywhere on Long Island</h2>` +
    `<p class="wws-lead">We work <b>anywhere on Long Island, across Nassau and Suffolk</b>. These are the towns where we've closed the most deals:</p>` +
    `<div class="sp-towns-inline">${top.map(([t, n]) => `<a href="/towns/${t.slug}">${esc(t.name)} <small>(${n})</small></a>`).join("")}</div>` +
    `<a class="wws-all" href="/towns">See every Long Island town &rarr;</a></div></section>`;
  const team =
    `<div class="hf-team reveal" aria-label="Lucas, Nick and Jeff">` +
    [["lucas", "Lucas Podstupka"], ["nick", "Nick Barberio"], ["jeff", "Jeff Memisha"]]
      .map(([k, n]) => `<img src="/${k}_color.jpg" alt="${n}" width="56" height="56" decoding="async">`).join("") +
    `<span>Lucas · Nick · Jeff</span></div>`;
  const live = publicListings().filter((l) => (l.status === "Active" || l.status === "Pending") && l.photos && l.photos.length);
    const card = (l) =>
    `<a class="hf-card" href="/listings/${listingSlug(l)}"><img src="${l.photos[0]}-sm.webp" alt="${esc(l.address)}, ${esc(l.town)}" width="240" height="160" loading="lazy" decoding="async">` +
    `<span class="hf-badge hf-${l.status.toLowerCase()}">${l.status}</span><b>${esc(l.address)}</b><small>${esc(l.town)}</small></a>`;
  const ohs = upcomingOpenHouses();
  const ohItem = (o) => {
    const parts = o.address.split(",").map((x) => x.trim());
    const l = publicListings().find((x) => String(x.mls) === String(o.mls));
    const town = (l && l.town) || parts[1] || "";
    const when = fmtOpenHouse(o).replace(", ", " · ");
    return `<a class="oht-item" data-oh-end="${o.end}" href="/listings/${o.slug || ""}"><b>Open House</b> · ${esc(when)} · ${esc(parts[0])}${town ? `, ${esc(town)}` : ""}</a>`;
  };
  // Two equal halves (translateX -50% loops seamlessly); each half repeats the list so it is wider than the screen.
  // Only the first copy is exposed to assistive tech / keyboard.
  const k = ohs.length ? Math.max(1, Math.ceil(6 / ohs.length)) : 0;
  const one = ohs.map(ohItem).join("");
  const hid = (n) => n > 0 ? `<span class="oht-run oht-dup" aria-hidden="true">${Array(n).fill(one).join("").replace(/<a /g, '<a tabindex="-1" ')}</span>` : "";
  const ticker = ohs.length
    ? `<div class="oht" role="region" aria-label="Upcoming open houses"><div class="oht-track"><span class="oht-run">${one}</span>${hid(k - 1)}${hid(k)}</div></div>`
    : "";
  const items = live.map(card).join("");
  const strip = live.length
    ? `<div class="hf-strip reveal" aria-label="Current listings"><div class="hf-track">${items}<span class="hf-dup" aria-hidden="true">${items.replace(/<a /g, '<a tabindex="-1" ')}</span></div></div>`
    : "";
  return <HomeClient meta={meta} wws={wws} team={team} strip={strip + ticker} />;
}
