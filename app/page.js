"use client";
import { useEffect } from "react";
import REV from "../data/reviews.json";
import { MARKUP, SCRIPT } from "../lib/home-markup";
import { fillHomeStrip } from "../components/OpenHouse";

const esc = (t) => String(t).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const stars = (n) => `<span class="rv-stars" aria-label="${n} out of 5 stars">${"\u2605".repeat(Math.round(n))}${"\u2606".repeat(5 - Math.round(n))}</span>`;
function reviewsHtml() {
  const chips = REV.agents.map((a) =>
    `<li><span class="rvt-name">${esc(a.tab)}</span>${stars(a.rating)}<span class="rvt-score"><b>${a.rating.toFixed(1)}</b> \u00b7 ${a.count} reviews</span></li>`).join("");
  return `<section class="rvteaser" id="reviews"><div class="wrap"><div class="rvt-card reveal"><div class="rvt-copy"><span class="eyebrow">Client Reviews</span><h2 class="rvt-title">In their words.</h2><p class="rvt-sub">Real reviews, word for word, from our Zillow profiles.</p></div><ul class="rvt-list">${chips}</ul><a class="btn btn-navy rvt-cta" href="/reviews">Read our Zillow reviews <span>&rarr;</span></a></div></div></section>`;
}

export default function Home() {
  useEffect(() => {
    fillHomeStrip();
    const t = setTimeout(() => {
      try {
        const s = document.createElement("script");
        s.textContent = SCRIPT;
        document.body.appendChild(s);
      } catch (e) { console.error("Page script error:", e); }
    }, 0);
    return () => clearTimeout(t);
  }, []);

  return <div dangerouslySetInnerHTML={{ __html: MARKUP.replace("<!--REVIEWS-->", reviewsHtml()) }} />;
}
