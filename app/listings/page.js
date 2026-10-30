import data from "../../data/listings.json";
import ListingsClient from "./ListingsClient";
import "./listings.css";

export const revalidate = 86400;

export const metadata = {
  title: "Listings — Dynamic Duo LI",
  description:
    "Active, pending and sold Long Island homes represented by Dynamic Duo LI (Nick Barberio & Lucas Podstupka, Realty Advisors).",
};

export default function ListingsPage() {
  return (
    <>
      <header className="topbar scrolled" id="topbar">
        <div className="topbar-inner">
          <a className="brand" href="/">
            <span className="brand-logo"><img src="/logo.png" alt="Dynamic Duo LI" /></span>
            <span className="brand-txt"><b>Dynamic Duo LI</b><span>Long Island Real Estate</span></span>
          </a>
          <nav className="topnav">
            <a href="/listings" aria-current="page">Listings</a>
            <a className="topcall" href="tel:+15168261111" aria-label="Call Dynamic Duo LI at 516-826-1111"><span>516-826-1111</span></a>
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
        <ListingsClient listings={data.listings} />
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
