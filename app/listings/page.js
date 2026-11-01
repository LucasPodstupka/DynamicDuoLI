import data from "../../data/listings.json";
import office from "../../data/office-listings.json";
import ListingsClient from "./ListingsClient";
import "./listings.css";

export const revalidate = 86400;

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
      <header className="topbar scrolled" id="topbar">
        <div className="topbar-inner">
          <a className="brand" href="/">
            <span className="brand-logo"><img src="/logo.png" alt="Dynamic Duo LI" /></span>
            <span className="brand-txt"><b>Dynamic Duo LI</b><span>Long Island Real Estate</span></span>
          </a>
          <nav className="topnav">
            <a href="/listings" aria-current="page">Listings</a>
            <details className="callmenu"><summary className="topcall" aria-label="Call our team: choose who to call"><span>Call Our Team</span></summary><div className="callpop" role="menu"><span className="callpop-h">Call our team</span><a href="tel:+16313107488"><b>Lucas Podstupka</b><span>631-310-7488</span></a><a href="tel:+15164049544"><b>Nick Barberio</b><span>516-404-9544</span></a><a href="tel:+15167413375"><b>Jeff Memisha</b><span>516-741-3375</span></a></div></details>
            <a className="topig" href="https://instagram.com/dynamicduoli" target="_blank" rel="noopener noreferrer" aria-label="@dynamicduoli on Instagram"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg></a>
            <a className="topcta" href="/#selector">Work With Us</a>
          </nav>
        </div>
      </header>
      <main className="lx">
        <section className="lx-hero wrap">
          <span className="eyebrow">Our Portfolio</span>
          <h1 className="lx-title">Listings</h1>
          <p className="lx-sub">
            Homes we&rsquo;ve listed and buyers we&rsquo;ve represented across Long Island over the last twelve months.
          </p>
        </section>
        <ListingsClient listings={data.listings} office={office.listings} />
      </main>
      <footer className="footer">
        <div className="wrap footer-inner">
          <div className="brand">
            <span className="brand-logo" style={{ width: 38, height: 38 }}><img src="/logo.png" alt="" style={{ width: 38, height: 38 }} /></span>
            <span className="brand-txt"><b>Dynamic Duo LI</b><span>Lucas · Nick · Jeff</span></span>
          </div>
          <div className="footer-contact">
            <a href="tel:+15168261111">516-826-1111</a>
            <a href="mailto:dynamicduoli@therealtyadvisors.com">dynamicduoli@therealtyadvisors.com</a>
            <a href="https://maps.google.com/?q=3341+Park+Avenue+Wantagh+NY+11793" target="_blank" rel="noopener noreferrer">3341 Park Ave, Wantagh, NY</a>
          </div>
          <div className="footer-note">
            Realty Advisors · Licensed Real Estate Professionals · Long Island, NY<br />
            Listing data courtesy of OneKey&reg; MLS. Information deemed reliable but not guaranteed.<br />
            &copy; 2026 Dynamic Duo LI. All rights reserved.
          </div>
        </div>
      </footer>
    </>
  );
}
