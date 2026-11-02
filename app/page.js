"use client";
import { useEffect } from "react";
import REV from "../data/reviews.json";
import { MARKUP, SCRIPT } from "../lib/home-markup";

const esc = (t) => String(t).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const stars = (n) => `<span class="rv-stars" aria-label="${n} out of 5 stars">${"\u2605".repeat(Math.round(n))}${"\u2606".repeat(5 - Math.round(n))}</span>`;
function reviewsHtml() {
  const tabs = REV.agents.map((a, i) =>
    `<button class="rv-tab${i === 1 ? " on" : ""}" role="tab" aria-selected="${i === 1}" data-rv="${a.key}">${esc(a.tab)}<span>${a.rating.toFixed(1)} \u2605 \u00b7 ${a.count}</span></button>`).join("");
  const panels = REV.agents.map((a, i) => {
    const cards = a.reviews.map((r, j) =>
      `<figure class="rv-card" style="--i:${j}">${r.rating ? stars(r.rating) : ""}${r.title ? `<p class="rv-title">${esc(r.title)}</p>` : ""}<blockquote class="rv-text">\u201c${esc(r.text)}\u201d</blockquote><figcaption><b>${esc(r.reviewer)}</b><span>${esc(r.date)}</span>${r.detail ? `<em>${esc(r.detail)}</em>` : ""}</figcaption></figure>`).join("");
    return `<div class="rv-panel" data-rvp="${a.key}"${i === 1 ? "" : " hidden"}><div class="rv-head"><div><span class="rv-name">${esc(a.name)}</span><span class="rv-score">${stars(a.rating)} <b>${a.rating.toFixed(1)}</b> \u00b7 ${a.count} Zillow reviews</span></div><a class="btn btn-line" href="${a.profileUrl}" target="_blank" rel="noopener noreferrer">Read more on Zillow <span>&rarr;</span></a></div><div class="rv-grid">${cards}</div></div>`;
  }).join("");
  return `<section class="rvsec" id="reviews"><div class="wrap"><div class="rv-intro reveal"><span class="eyebrow">Client Reviews</span><h2 class="ig-title">In their words.</h2><p class="ig-sub">Real reviews, word for word, from our Zillow profiles.</p></div><div class="rv-tabs" role="tablist">${tabs}</div>${panels}</div></section>`;
}



export default function Home() {
  useEffect(() => {
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
