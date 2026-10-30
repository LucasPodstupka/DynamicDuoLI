"use client";
import { useEffect, useMemo, useState, useCallback } from "react";

const TABS = [
  { key: "Active", label: "Active" },
  { key: "Pending", label: "Pending" },
  { key: "Sold", label: "Sold" },
  { key: "Office", label: "Office Listings" },
];

const money = (n) => (n == null ? "—" : "$" + n.toLocaleString("en-US"));
const fmtDate = (d) =>
  d ? new Date(d + "T12:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : null;
const credit = (l) => `Listed by ${l.listAgent}, Realty Advisors Inc`;
const sideLabel = (s) => (s === "office" ? "Office Listing" : s === "listing" ? "Our Listing" : s === "buyer" ? "Buyer Represented" : "Listing & Buyer");
const baths = (b) => (b == null ? null : Number.isInteger(b) ? b : b.toFixed(1));

function Photo({ src, alt, sizes, className, eager }) {
  if (!src) return <Placeholder className={className} />;
  return (
    <img
      className={className}
      src={`${src}-sm.webp`}
      srcSet={`${src}-sm.webp 480w, ${src}.webp 1400w`}
      sizes={sizes}
      alt={alt}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
    />
  );
}

function Placeholder({ className }) {
  return (
    <div className={`lx-ph ${className || ""}`} aria-hidden="true">
      <img src="/logo.png" alt="" />
      <span>Photos coming soon</span>
    </div>
  );
}

function Badge({ status }) {
  return <span className={`lx-badge lx-badge-${status.toLowerCase()}`}>{status}</span>;
}

function Card({ l, onOpen }) {
  const cover = l.photos[0];
  return (
    <article className="lx-card" onClick={() => onOpen(l)} tabIndex={0}
      onKeyDown={(e) => (e.key === "Enter" ? onOpen(l) : null)} aria-label={`${l.address}, ${l.town}`}>
      <div className="lx-card-media">
        <Photo src={cover} alt={`${l.address}, ${l.town}`} sizes="(max-width: 700px) 100vw, 380px" className="lx-card-img" />
        <Badge status={l.status} />
        {l.photos.length > 1 && <span className="lx-count">{l.photos.length} photos</span>}
      </div>
      <div className="lx-card-body">
        <div className="lx-price">
          {l.status === "Sold" ? (
            <>
              <span className="lx-price-main">{money(l.soldPrice)}</span>
              <span className="lx-price-note">Sold {fmtDate(l.soldDate)}</span>
            </>
          ) : (
            <span className="lx-price-main">{money(l.listPrice)}</span>
          )}
        </div>
        <h3 className="lx-addr">{l.address}</h3>
        <p className="lx-town">{l.town}, NY</p>
        <div className="lx-facts">
          {l.beds != null && <span><b>{l.beds}</b> Beds</span>}
          {l.baths != null && <span><b>{baths(l.baths)}</b> Baths</span>}
          <span className="lx-side">{sideLabel(l.side)}</span>
        </div>
        {l.side === "office" && <p className="lx-credit">{credit(l)}</p>}
      </div>
    </article>
  );
}

function Detail({ l, onClose }) {
  const [i, setI] = useState(0);
  const n = l.photos.length;
  const prev = useCallback(() => setI((x) => (x - 1 + n) % n), [n]);
  const next = useCallback(() => setI((x) => (x + 1) % n), [n]);
  useEffect(() => {
    const k = (e) => {
      if (e.key === "Escape") onClose();
      if (n > 1 && e.key === "ArrowLeft") prev();
      if (n > 1 && e.key === "ArrowRight") next();
    };
    document.addEventListener("keydown", k);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", k); document.body.style.overflow = ""; };
  }, [onClose, prev, next, n]);

  const interestHref = `/?interest=${encodeURIComponent(`${l.address}, ${l.town} (MLS #${l.mls})`)}#panel-buy`;

  return (
    <div className="lx-modal" role="dialog" aria-modal="true" aria-label={l.address} onClick={onClose}>
      <div className="lx-sheet" onClick={(e) => e.stopPropagation()}>
        <button className="lx-close" onClick={onClose} aria-label="Close">&times;</button>
        <div className="lx-gallery">
          <div className="lx-stage">
            {n ? (
              <img key={l.photos[i]} src={`${l.photos[i]}.webp`} alt={`${l.address} photo ${i + 1} of ${n}`} />
            ) : (
              <Placeholder className="lx-stage-ph" />
            )}
            {n > 1 && (
              <>
                <button className="lx-nav lx-prev" onClick={prev} aria-label="Previous photo">&#8249;</button>
                <button className="lx-nav lx-next" onClick={next} aria-label="Next photo">&#8250;</button>
                <span className="lx-idx">{i + 1} / {n}</span>
              </>
            )}
          </div>
          {n > 1 && (
            <div className="lx-thumbs">
              {l.photos.map((p, k) => (
                <button key={p} className={k === i ? "on" : ""} onClick={() => setI(k)} aria-label={`Photo ${k + 1}`}>
                  <img src={`${p}-sm.webp`} alt="" loading="lazy" />
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="lx-info">
          <div className="lx-info-head">
            <Badge status={l.status} />
            <span className="lx-side">{sideLabel(l.side)}</span>
          </div>
          <h2 className="lx-info-addr">{l.address}</h2>
          <p className="lx-town">{l.town}, NY · {l.county} County</p>
          <div className="lx-info-price">
            {l.status === "Sold" ? (
              <>
                <div><span className="k">Sold Price</span><span className="v">{money(l.soldPrice)}</span></div>
                <div><span className="k">List Price</span><span className="v sm">{money(l.listPrice)}</span></div>
                <div><span className="k">Closed</span><span className="v sm">{fmtDate(l.soldDate)}</span></div>
              </>
            ) : (
              <div><span className="k">List Price</span><span className="v">{money(l.listPrice)}</span></div>
            )}
          </div>
          <dl className="lx-dl">
            {l.beds != null && (<><dt>Bedrooms</dt><dd>{l.beds}</dd></>)}
            {l.baths != null && (<><dt>Bathrooms</dt><dd>{baths(l.baths)}</dd></>)}
            <dt>MLS #</dt><dd>{l.mls}</dd>
            {l.propertyType && l.propertyType !== "Residential" && (<><dt>Type</dt><dd>{l.propertyType}</dd></>)}
            {l.ourAgents ? (<><dt>Represented by</dt><dd>{l.ourAgents.join(" & ")}</dd></>) : (<><dt>Listed by</dt><dd>{l.listAgent}, Realty Advisors Inc</dd></>)}
          </dl>
          {l.description && <p className="lx-desc">{l.description}</p>}
          {l.status === "Active" && (
            <a className="lx-interest" href={interestHref}>I&rsquo;m Interested <span>&rarr;</span></a>
          )}
          {l.instagramUrl && (
            <a className="lx-ig" href={l.instagramUrl} target="_blank" rel="noopener noreferrer">
              <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="currentColor" d="M8 5v14l11-7z"/></svg>
              Watch Walkthrough
            </a>
          )}
          <p className="lx-courtesy">
            {l.side === "office" ? credit(l) : `Listing courtesy of ${l.listAgent || "listing agent"}`}. Source: OneKey&reg; MLS.
          </p>
        </div>
      </div>
    </div>
  );
}

const compact = (n) =>
  n >= 1e6 ? "$" + (n / 1e6).toFixed(n >= 1e8 ? 0 : 1) + "M" : "$" + Math.round(n / 1e3) + "K";

function Volume({ listings }) {
  const v = useMemo(() => {
    const now = new Date();
    const from = new Date(now); from.setFullYear(now.getFullYear() - 1);
    const out = { Active: [0, 0], Pending: [0, 0], Sold: [0, 0] };
    listings.forEach((l) => {
      if (l.status === "Sold") {
        if (!l.soldDate) return;
        const d = new Date(l.soldDate + "T12:00:00");
        if (d < from || d > now) return;
        out.Sold[0]++; out.Sold[1] += l.soldPrice ?? l.listPrice ?? 0;
      } else if (out[l.status]) {
        out[l.status][0]++; out[l.status][1] += l.listPrice ?? 0;
      }
    });
    const total = Object.values(out).reduce((a, [c, s]) => [a[0] + c, a[1] + s], [0, 0]);
    return { out, total };
  }, [listings]);
  return (
    <div className="lx-vol" aria-label="Trailing 12-month volume">
      <div className="lx-vol-total">
        <span className="lbl">Total Volume · Last 12 Months</span>
        <b>{money(v.total[1])}</b>
        <span className="sub">{v.total[0]} homes</span>
      </div>
      {["Active", "Pending", "Sold"].map((k) => (
        <div key={k} className={`lx-vol-cell lx-vol-${k.toLowerCase()}`}>
          <span className="lbl"><span className="dot" />{k}</span>
          <b>{compact(v.out[k][1])}</b>
          <span className="sub">{v.out[k][0]} {v.out[k][0] === 1 ? "home" : "homes"}</span>
        </div>
      ))}
    </div>
  );
}

export default function ListingsClient({ listings, office = [] }) {
  const counts = useMemo(() => {
    const c = { Active: 0, Pending: 0, Sold: 0 };
    listings.forEach((l) => (c[l.status] = (c[l.status] || 0) + 1));
    c.Office = office.length;
    return c;
  }, [listings, office]);
  const [tab, setTab] = useState("Active");
  const [open, setOpen] = useState(null);

  useEffect(() => {
    const h = window.location.hash.replace("#", "");
    const t = TABS.find((x) => x.key.toLowerCase() === h.toLowerCase());
    if (t) setTab(t.key);
  }, []);

  const choose = (k) => {
    setTab(k);
    history.replaceState(null, "", `#${k.toLowerCase()}`);
  };

  const shown = tab === "Office" ? office : listings.filter((l) => l.status === tab);

  return (
    <section className="wrap lx-body">
      <Volume listings={listings} />
      <div className="lx-tabs" role="tablist">
        {TABS.map((t) => (
          <button key={t.key} role="tab" aria-selected={tab === t.key}
            className={`lx-tab lx-tab-${t.key.toLowerCase()} ${tab === t.key ? "on" : ""}`} onClick={() => choose(t.key)}>
            <span className="dot" />{t.label}<span className="n">{counts[t.key] || 0}</span>
          </button>
        ))}
      </div>
      {shown.length ? (
        <div className="lx-grid">
          {shown.map((l) => <Card key={l.mls} l={l} onOpen={setOpen} />)}
        </div>
      ) : (
        <p className="lx-empty">No {tab === "Office" ? "office" : tab.toLowerCase()} listings right now — check back soon.</p>
      )}
      {open && <Detail l={open} onClose={() => setOpen(null)} />}
    </section>
  );
}
