"use client";
import { useEffect } from "react";
import { teaserHtml } from "../lib/reviews-html";
import { MARKUP, SCRIPT, HERO_META } from "../lib/home-markup";
import { FOOTER_FH_HTML, FORM_FH_NOTE } from "../lib/compliance";
import { fillHomeStrip } from "./OpenHouse";

export default function HomeClient({ meta, wws = "" }) {
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

  return <div dangerouslySetInnerHTML={{ __html: MARKUP.replace(HERO_META, meta).replace("<!--WHERE-WE-SELL-->", wws).replace("<!--REVIEWS-->", teaserHtml()).replace("<!--FH-FOOT-->", FOOTER_FH_HTML).split("<!--FH-NOTE-->").join(FORM_FH_NOTE) }} />;
}
