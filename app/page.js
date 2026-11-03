import HomeClient from "../components/HomeClient";
import { dealStats } from "../lib/listings";
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
  return <HomeClient meta={meta} wws={wws} />;
}
