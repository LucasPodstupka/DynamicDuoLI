"use client";
import { useEffect } from "react";
import { teaserHtml } from "../lib/reviews-html";
import { MARKUP, SCRIPT, HERO_META } from "../lib/home-markup";
import { FOOTER_FH_HTML, FORM_FH_NOTE } from "../lib/compliance";
import { fillHomeStrip } from "./OpenHouse";

function initListingsCarousel() {
  document.querySelectorAll(".hf-rail").forEach((rail) => {
    const strip = rail.querySelector(".hf-strip");
    const prev = rail.querySelector(".hf-prev");
    const next = rail.querySelector(".hf-next");
    if (!strip || !prev || !next) return;
    const step = () => {
      const card = strip.querySelector(".hf-card");
      const gap = 14;
      const w = card ? card.getBoundingClientRect().width : 200;
      return Math.max(w + gap, Math.floor(strip.clientWidth * 0.85));
    };
    const sync = () => {
      const max = strip.scrollWidth - strip.clientWidth - 2;
      prev.disabled = strip.scrollLeft <= 2;
      next.disabled = strip.scrollLeft >= max;
    };
    prev.addEventListener("click", () => strip.scrollBy({ left: -step(), behavior: "smooth" }));
    next.addEventListener("click", () => strip.scrollBy({ left: step(), behavior: "smooth" }));
    strip.addEventListener("scroll", sync, { passive: true });
    addEventListener("resize", sync, { passive: true });
    sync();
  });
}

export default function HomeClient({ meta, wws = "", team = "", strip = "" }) {
  useEffect(() => {
    fillHomeStrip();
    document.querySelectorAll("[data-oh-end]").forEach((a) => {
      if (new Date(a.dataset.ohEnd).getTime() <= Date.now()) a.remove();
    });
    document.querySelectorAll(".oht").forEach((t) => {
      if (!t.querySelector(".oht-item")) t.remove();
    });
    initListingsCarousel();
    const t = setTimeout(() => {
      try {
        const s = document.createElement("script");
        s.textContent = SCRIPT;
        document.body.appendChild(s);
      } catch (e) { console.error("Page script error:", e); }
    }, 0);
    return () => clearTimeout(t);
  }, []);

  return <div dangerouslySetInnerHTML={{ __html: MARKUP.replace(HERO_META, meta).replace('<div class="hero-copy">', '<div class="hero-copy">' + team).replace('<div class="wrap team-band">', strip + '<div class="wrap team-band">').replace("<!--WHERE-WE-SELL-->", wws).replace("<!--REVIEWS-->", teaserHtml()).replace("<!--FH-FOOT-->", FOOTER_FH_HTML).split("<!--FH-NOTE-->").join(FORM_FH_NOTE) }} />;
}
