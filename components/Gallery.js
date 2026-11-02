"use client";
import { useState, useCallback } from "react";

export default function Gallery({ photos, alt }) {
  const [i, setI] = useState(0);
  const n = photos.length;
  const prev = useCallback(() => setI((x) => (x - 1 + n) % n), [n]);
  const next = useCallback(() => setI((x) => (x + 1) % n), [n]);
  if (!n) {
    return (
      <div className="ld-stage"><div className="lx-ph" style={{ position: "absolute", inset: 0 }} aria-hidden="true"><img src="/logo.png" alt="" /><span>Photos coming soon</span></div></div>
    );
  }
  return (
    <div onKeyDown={(e) => { if (e.key === "ArrowLeft") prev(); if (e.key === "ArrowRight") next(); }}>
      <div className="ld-stage">
        <img key={photos[i]} src={`${photos[i]}.webp`} alt={`${alt} photo ${i + 1} of ${n}`} fetchPriority={i === 0 ? "high" : undefined} />
        {n > 1 && (
          <>
            <button className="ld-nav ld-prev" onClick={prev} aria-label="Previous photo">&#8249;</button>
            <button className="ld-nav ld-next" onClick={next} aria-label="Next photo">&#8250;</button>
            <span className="ld-idx">{i + 1} / {n}</span>
          </>
        )}
      </div>
      {n > 1 && (
        <div className="ld-thumbs">
          {photos.map((p, k) => (
            <button key={p} className={k === i ? "on" : ""} onClick={() => setI(k)} aria-label={`Show photo ${k + 1}`}>
              <img src={`${p}-sm.webp`} alt="" loading="lazy" decoding="async" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
