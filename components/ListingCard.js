import { OpenHouseBadge } from "./OpenHouse";
import { listingSlug, money, fmtDate, fmtBaths, sideLabel } from "../lib/listings";

export default function ListingCard({ l, idx = 0 }) {
  const cover = l.photos && l.photos[0];
  return (
    <a className="lx-card sp-card" href={`/listings/${listingSlug(l)}`} style={{ "--i": Math.min(idx, 12) }} aria-label={`${l.address}, ${l.town}`}>
      <div className="lx-card-media">
        {cover ? (
          <img className="lx-card-img" src={`${cover}-sm.webp`} srcSet={`${cover}-sm.webp 480w, ${cover}.webp 1400w`} sizes="(max-width: 700px) 100vw, 380px" alt={`${l.address}, ${l.town}`} loading="lazy" decoding="async" />
        ) : (
          <div className="lx-ph lx-card-img" aria-hidden="true"><img src="/logo.png" alt="" /><span>Photos coming soon</span></div>
        )}
        <span className={`lx-badge lx-badge-${l.status.toLowerCase()}`}>{l.status}</span>
        <OpenHouseBadge l={l} />
      </div>
      <div className="lx-card-body">
        <div className="lx-price">
          {l.status === "Sold" ? (
            <><span className="lx-price-main">{money(l.soldPrice)}</span><span className="lx-price-note">Sold {fmtDate(l.soldDate)}</span></>
          ) : (
            <span className="lx-price-main">{money(l.listPrice)}</span>
          )}
        </div>
        <h3 className="lx-addr">{l.address}</h3>
        <p className="lx-town">{l.town}, NY</p>
        <div className="lx-facts">
          {l.beds != null && <span><b>{l.beds}</b> Beds</span>}
          {l.baths != null && <span><b>{fmtBaths(l.baths)}</b> Baths</span>}
          <span className="lx-side">{sideLabel(l.side)}</span>
        </div>
      </div>
    </a>
  );
}
