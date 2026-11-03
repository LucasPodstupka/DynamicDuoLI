"use client";
import { useEffect } from "react";
import { teaserHtml } from "../lib/reviews-html";
import { MARKUP, SCRIPT } from "../lib/home-markup";
import { fillHomeStrip } from "../components/OpenHouse";

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

  return <div dangerouslySetInnerHTML={{ __html: MARKUP.replace("<!--REVIEWS-->", teaserHtml()) }} />;
}
