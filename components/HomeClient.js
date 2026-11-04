"use client";
import { useEffect } from "react";
import { teaserHtml } from "../lib/reviews-html";
import { MARKUP, SCRIPT, HERO_META } from "../lib/home-markup";
import { fillHomeStrip } from "./OpenHouse";

export default function HomeClient({ meta, wws = "", team = "", strip = "" }) {
  useEffect(() => {
    fillHomeStrip();
    document.querySelectorAll("[data-oh-end]").forEach((a) => { if (new Date(a.dataset.ohEnd).getTime() <= Date.now()) a.remove(); });
    const t = setTimeout(() => {
      try {
        const s = document.createElement("script");
        s.textContent = SCRIPT;
        document.body.appendChild(s);
      } catch (e) { console.error("Page script error:", e); }
    }, 0);
    return () => clearTimeout(t);
  }, []);

  return <div dangerouslySetInnerHTML={{ __html: MARKUP.replace(HERO_META, meta).replace('<div class="hero-copy">', '<div class="hero-copy">' + team).replace('<div class="wrap team-band">', strip + '<div class="wrap team-band">').replace("<!--WHERE-WE-SELL-->", wws).replace("<!--REVIEWS-->", teaserHtml()) }} />;
}
