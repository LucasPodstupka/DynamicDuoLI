import data from "../../data/listings.json";
import office from "../../data/office-listings.json";
import ListingsClient from "./ListingsClient";
import { OpenHouseStrip } from "../../components/OpenHouse";
import { publicListings, listingSlug, allDeals } from "../../lib/listings";
import "./listings.css";
import "../site-pages.css";

import { SiteHeader, SiteFooter } from "../../components/SiteChrome";

export const revalidate = 3600;

export const metadata = {
  title: "Listings — Dynamic Duo LI",
  alternates: { canonical: "/listings" },
  openGraph: { url: "/listings", title: "Listings — Dynamic Duo LI", siteName: "Dynamic Duo LI", type: "website", images: ["/og-image.png"] },
  description:
    "Active, pending and sold Long Island homes represented by Dynamic Duo LI (Nick Barberio & Lucas Podstupka, Realty Advisors).",
};

function itemList() {
  const items = publicListings().map((l, i) => ({
    "@type": "ListItem",
    position: i + 1,
    item: {
      "@type": "SingleFamilyResidence",
      name: `${l.address}, ${l.town}, NY`,
      address: { "@type": "PostalAddress", streetAddress: l.address, addressLocality: l.town, addressRegion: "NY", addressCountry: "US" },
      ...(l.beds != null ? { numberOfRooms: l.beds } : {}),
      ...(l.photos && l.photos[0] ? { image: `https://www.dynamicduoli.com${l.photos[0]}.webp` } : {}),
      ...(l.status === "Active" && l.listPrice ? { offers: { "@type": "Offer", price: l.listPrice, priceCurrency: "USD", availability: "https://schema.org/InStock" } } : {}),
    },
  }));
  return { "@context": "https://schema.org", "@type": "ItemList", name: "Dynamic Duo LI listings", numberOfItems: items.length, itemListElement: items };
}

export default function ListingsPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemList()) }} />
      <SiteHeader current="/listings" />
      <main className="lx">
        <OpenHouseStrip listings={publicListings()} />
        <section className="lx-hero wrap">
          <span className="eyebrow">Our Portfolio</span>
          <h1 className="lx-title">Listings</h1>
          <p className="lx-sub">
            Homes we&rsquo;ve listed and buyers we&rsquo;ve represented across Long Island. Active and pending homes are current; Sold goes back through our full closed-sale history.
          </p>
        </section>
        <ListingsClient listings={allDeals()} office={office.listings} />
        <section className="wrap sp-section">
          <details className="lx-index">
            <summary>Every home on this page, by address ({allDeals().length})</summary>
            <ul>{allDeals().map((l) => <li key={l.mls}><a href={`/listings/${listingSlug(l)}`}>{l.address}, {l.town}</a> <span>{l.status}</span></li>)}</ul>
          </details>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
