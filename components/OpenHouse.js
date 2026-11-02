"use client";
import { useEffect, useState } from "react";
import { upcomingOpenHouses, openHouseFor, fmtOpenHouse } from "../lib/open-houses";

// Re-checks the clock in the browser so a finished open house disappears
// even on a cached/static page, without a redeploy.
function useNow() {
  const [now, setNow] = useState(null);
  useEffect(() => {
    setNow(Date.now());
    const t = setInterval(() => setNow(Date.now()), 60000);
    return () => clearInterval(t);
  }, []);
  return now;
}

export function OpenHouseBadge({ l, variant = "card" }) {
  const now = useNow();
  if (now == null) return null;
  const o = openHouseFor(l, now);
  if (!o) return null;
  return (
    <span className={`oh-badge oh-${variant}`}>
      <b>Open House</b> <span>{fmtOpenHouse(o)}</span>
    </span>
  );
}

export function OpenHouseStrip({ listings = [], hrefFor }) {
  const now = useNow();
  if (now == null) return null;
  const items = upcomingOpenHouses(now).map((o) => ({ o, l: listings.find((l) => String(l.mls) === String(o.mls)) }));
  if (!items.length) return null;
  return (
    <section className="oh-strip" aria-label="Upcoming open houses">
      <div className="wrap oh-wrap">
        <span className="oh-eyebrow">Open Houses</span>
        <ul className="oh-list">
          {items.map(({ o, l }) => {
            const href = l && hrefFor ? hrefFor(l) : o.slug ? `/listings/${o.slug}` : "/listings";
            return (
              <li key={o.start + o.mls}>
                <a href={href}>
                  <b>{o.address}</b>
                  <span>{fmtOpenHouse(o)}</span>
                  <i aria-hidden="true">&rarr;</i>
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

// Homepage markup is a static HTML string, so the strip is drawn into a placeholder.
export function fillHomeStrip() {
  const el = document.getElementById("oh-home");
  if (!el) return;
  const items = upcomingOpenHouses(Date.now());
  if (!items.length) { el.innerHTML = ""; return; }
  const esc = (t) => String(t).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
  el.innerHTML = `<section class="oh-strip" aria-label="Upcoming open houses"><div class="wrap oh-wrap"><span class="oh-eyebrow">Open Houses</span><ul class="oh-list">${items
    .map((o) => `<li><a href="${o.slug ? `/listings/${esc(o.slug)}` : "/listings"}"><b>${esc(o.address)}</b><span>${esc(fmtOpenHouse(o))}</span><i aria-hidden="true">&rarr;</i></a></li>`)
    .join("")}</ul></div></section>`;
}
