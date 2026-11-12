"use client";
import { useEffect, useRef, useState } from "react";

// Manual left/right browse (arrows + swipe), same idea as the homepage listings rail. No auto-scroll.
export default function DealRail({ label, children }) {
  const ref = useRef(null);
  const [edge, setEdge] = useState({ start: true, end: false });
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const sync = () => setEdge({ start: el.scrollLeft <= 2, end: el.scrollLeft >= el.scrollWidth - el.clientWidth - 2 });
    sync();
    el.addEventListener("scroll", sync, { passive: true });
    addEventListener("resize", sync, { passive: true });
    return () => { el.removeEventListener("scroll", sync); removeEventListener("resize", sync); };
  }, []);
  const go = (dir) => {
    const el = ref.current;
    if (el) el.scrollBy({ left: dir * Math.floor(el.clientWidth * 0.85), behavior: "smooth" });
  };
  const both = edge.start && edge.end;
  return (
    <div className="wl-rail" role="region" aria-label={label}>
      {!both && (
        <div className="wl-nav">
          <button type="button" onClick={() => go(-1)} disabled={edge.start} aria-label={`Previous: ${label}`}>
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M15 18l-6-6 6-6" /></svg>
          </button>
          <button type="button" onClick={() => go(1)} disabled={edge.end} aria-label={`Next: ${label}`}>
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M9 18l6-6-6-6" /></svg>
          </button>
        </div>
      )}
      <div className="wl-track" ref={ref}>{children}</div>
    </div>
  );
}
