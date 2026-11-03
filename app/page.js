import HomeClient from "../components/HomeClient";
import { dealStats } from "../lib/listings";

export const revalidate = 86400;

const vol = (n) => (n >= 1e6 ? `$${(n / 1e6).toFixed(1)}M` : `$${Math.round(n / 1e3)}K`);

// Hero stats computed from data/listings.json + data/past-sales.json (deduped by MLS #).
export default function Home() {
  const s = dealStats();
  const meta =
    `<div><b data-count="${s.allTime.count}" data-suffix="">${s.allTime.count}</b><span>Homes Sold · Since ${s.allTime.since}</span></div>` +
    `<div><b>${vol(s.allTime.volume)}</b><span>Sold Volume · Since ${s.allTime.since}</span></div>`;
  return <HomeClient meta={meta} />;
}
