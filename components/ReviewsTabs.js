"use client";
import { useEffect } from "react";
import { reviewsHtml } from "../lib/reviews-html";

export default function ReviewsTabs() {
  useEffect(() => {
    const tabs = [...document.querySelectorAll(".rv-tab")];
    const fns = tabs.map((b) => {
      const f = () => {
        tabs.forEach((x) => { const on = x === b; x.classList.toggle("on", on); x.setAttribute("aria-selected", on); });
        document.querySelectorAll(".rv-panel").forEach((p) => { p.hidden = p.dataset.rvp !== b.dataset.rv; });
      };
      b.addEventListener("click", f);
      return f;
    });
    return () => tabs.forEach((b, i) => b.removeEventListener("click", fns[i]));
  }, []);
  return <div dangerouslySetInnerHTML={{ __html: reviewsHtml() }} />;
}
