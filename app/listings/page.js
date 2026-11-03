import data from "../../data/listings.json";
import office from "../../data/office-listings.json";
import ListingsClient from "./ListingsClient";
import { OpenHouseStrip } from "../../components/OpenHouse";
import { publicListings, listingSlug } from "../../lib/listings";
import "./listings.css";
import "../site-pages.css";
import PastSales from "../../components/PastSales";
import { pastSales } from "../../lib/past-sales";
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
  const items = data.listings.map((l, i) => ({
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
            Homes we&rsquo;ve listed and buyers we&rsquo;ve represented across Long Island over the last twelve months.
          </p>
        </section>
        <ListingsClient listings={data.listings} office={office.listings} />
        <section className="wrap sp-section" id="past-sales">
          <span className="eyebrow">Deal History</span>
          <h2 className="sp-h2">Past Sales</h2>
          <p className="lx-sub">Closed sales where Lucas, Nick or Jeff represented the seller or the buyer, from OneKey MLS records. The totals above cover the last twelve months only.</p>
          <PastSales sales={pastSales()} />
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
