import { notFound } from "next/navigation";
import { publicListings, findBySlug, listingSlug, money, fmtDate, fmtBaths, sideLabel } from "../../../lib/listings";
import { townForListing } from "../../../lib/towns";
import { SiteHeader, SiteFooter } from "../../../components/SiteChrome";
import { OpenHouseBadge } from "../../../components/OpenHouse";
import Gallery from "../../../components/Gallery";
import LeadForm from "../../../components/LeadForm";
import "../listings.css";
import "../../site-pages.css";

export const revalidate = 3600;
export const dynamicParams = false;

const SITE = "https://www.dynamicduoli.com";

export function generateStaticParams() {
  return publicListings().map((l) => ({ slug: listingSlug(l) }));
}

const priceLine = (l) => (l.status === "Sold" ? `Sold ${money(l.soldPrice)}` : `${l.status} · ${money(l.listPrice)}`);

export function generateMetadata({ params }) {
  const l = findBySlug(params.slug);
  if (!l) return {};
  const path = `/listings/${params.slug}`;
  const facts = [l.beds != null && `${l.beds} bed`, l.baths != null && `${fmtBaths(l.baths)} bath`].filter(Boolean).join(", ");
  const title = `${l.address}, ${l.town}, NY — ${priceLine(l)} | Dynamic Duo LI`;
  const description = `${l.address}, ${l.town}, NY${facts ? ` (${facts})` : ""}. ${priceLine(l)}. ${sideLabel(l.side)} by Dynamic Duo LI at Realty Advisors.`;
  const img = l.photos && l.photos[0] ? `${l.photos[0]}.webp` : "/og-image.png";
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { url: path, title, description, siteName: "Dynamic Duo LI", type: "website", images: [img] },
  };
}

function jsonLd(l, slug) {
  const url = `${SITE}/listings/${slug}`;
  const home = {
    "@type": "SingleFamilyResidence",
    "@id": `${url}#home`,
    name: `${l.address}, ${l.town}, NY`,
    url,
    address: { "@type": "PostalAddress", streetAddress: l.address, addressLocality: l.town, addressRegion: "NY", addressCountry: "US" },
    ...(l.beds != null ? { numberOfBedrooms: l.beds, numberOfRooms: l.beds } : {}),
    ...(l.baths != null ? { numberOfBathroomsTotal: l.baths } : {}),
    ...(l.photos && l.photos.length ? { image: l.photos.slice(0, 10).map((p) => `${SITE}${p}.webp`) } : {}),
  };
  const graph = [home];
  if (l.status !== "Sold" && l.listPrice) {
    graph.push({
      "@type": "Offer",
      url,
      price: l.listPrice,
      priceCurrency: "USD",
      availability: l.status === "Active" ? "https://schema.org/InStock" : "https://schema.org/LimitedAvailability",
      itemOffered: { "@id": `${url}#home` },
      offeredBy: { "@id": `${SITE}/#team` },
    });
  }
  graph.push({
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Listings", item: `${SITE}/listings` },
      { "@type": "ListItem", position: 2, name: l.address, item: url },
    ],
  });
  return { "@context": "https://schema.org", "@graph": graph };
}

export default function ListingPage({ params }) {
  const l = findBySlug(params.slug);
  if (!l) notFound();
  const town = townForListing(l);
  const agents = l.ourAgents && l.ourAgents.length ? l.ourAgents.join(" & ") : null;
  const label = `${l.address}, ${l.town} (MLS #${l.mls})`;
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd(l, params.slug)) }} />
      <SiteHeader current="/listings" />
      <main className="sp" id="main">
        <div className="wrap">
          <p className="sp-crumbs" style={{ marginTop: 34 }}>
            <a href="/listings">Listings</a> / {town ? <><a href={`/towns/${town.slug}`}>{town.name}</a> / </> : null}{l.address}
          </p>
          <div className="ld">
            <Gallery photos={l.photos || []} alt={`${l.address}, ${l.town}`} />
            <div className="ld-info">
              <div className="lx-info-head">
                <span className={`lx-badge lx-badge-${l.status.toLowerCase()}`}>{l.status}</span>
                <span className="lx-side">{sideLabel(l.side)}</span>
              </div>
              <h1 className="ld-addr">{l.address}</h1>
              <OpenHouseBadge l={l} variant="inline" />
              <p className="lx-town">{l.town}, NY{l.county ? ` · ${l.county} County` : ""}</p>
              <div className="ld-price">
                {l.status === "Sold" ? money(l.soldPrice) : money(l.listPrice)}
                <small>{l.status === "Sold" ? `Sold ${fmtDate(l.soldDate)} · List price ${money(l.listPrice)}` : "List price"}</small>
              </div>
              <div className="ld-facts">
                {l.beds != null && <div><b>{l.beds}</b><span>Beds</span></div>}
                {l.baths != null && <div><b>{fmtBaths(l.baths)}</b><span>Baths</span></div>}
                {l.sqft != null && <div><b>{l.sqft.toLocaleString("en-US")}</b><span>Sq Ft</span></div>}
                <div><b>{(l.photos || []).length}</b><span>Photos</span></div>
              </div>
              <dl className="lx-dl">
                <dt>MLS #</dt><dd>{l.mls}</dd>
                {agents && (<><dt>Represented by</dt><dd>{agents}, Realty Advisors</dd></>)}
              </dl>
              {l.instagramUrl && (
                <a className="lx-ig" href={l.instagramUrl} target="_blank" rel="noopener noreferrer">
                  <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="currentColor" d="M8 5v14l11-7z"/></svg>
                  Watch Walkthrough
                </a>
              )}
              <div className="sp-cta">
                {l.status === "Active" ? (
                  <a className="sp-btn" href="#interested">I&rsquo;m Interested</a>
                ) : (
                  <a className="sp-btn" href="/sell">Thinking of selling nearby?</a>
                )}
                <a className="sp-btn ghost" href="/listings">All Listings</a>
              </div>
            </div>
          </div>
          {l.description && (
            <section className="sp-section">
              <h2 className="sp-h2">About this home</h2>
              <p className="ld-desc sp-prose">{l.description}</p>
            </section>
          )}
          <p className="lx-courtesy">Listing courtesy of {l.listAgent || "listing agent"}. Source: OneKey&reg; MLS. Information deemed reliable but not guaranteed.</p>
          {l.status === "Active" && (
            <section className="sp-section" id="interested">
              <h2 className="sp-h2">Interested in {l.address}?</h2>
              <LeadForm intent="buy" title="Request a showing" sub="Tell us a little about you and we'll reach out within 24 hours." notes={`Interested in ${label}`} />
            </section>
          )}
          {town && (
            <p className="sp-section" style={{ paddingTop: 10 }}>
              <a className="sp-btn ghost" href={`/towns/${town.slug}`}>More from {town.name} &rarr;</a>
            </p>
          )}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
