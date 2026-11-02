const IG = (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>
);

const NAV = [
  ["/listings", "Listings"],
  ["/buy", "Buy"],
  ["/sell", "Sell"],
  ["/rent", "Rent"],
  ["/towns", "Towns"],
];

export function SiteHeader({ current }) {
  return (
    <header className="topbar scrolled" id="topbar">
      <div className="topbar-inner">
        <a className="brand" href="/">
          <span className="brand-logo"><img src="/logo.png" alt="Dynamic Duo LI" /></span>
          <span className="brand-txt"><b>Dynamic Duo LI</b><span>Long Island Real Estate</span></span>
        </a>
        <nav className="topnav">
          {NAV.map(([href, label]) => (
            <a key={href} href={href} aria-current={current === href ? "page" : undefined}>{label}</a>
          ))}
          <details className="callmenu"><summary className="topcall" aria-label="Call our team: choose who to call"><span>Talk With Our Team</span></summary><div className="callpop" role="menu"><span className="callpop-h">Call our team</span><a href="tel:+16313107488"><b>Lucas Podstupka</b><span>631-310-7488</span></a><a href="tel:+15164049544"><b>Nick Barberio</b><span>516-404-9544</span></a><a href="tel:+15167413375"><b>Jeff Memisha</b><span>516-741-3375</span></a></div></details>
          <a className="topig" href="https://instagram.com/dynamicduoli" target="_blank" rel="noopener noreferrer" aria-label="@dynamicduoli on Instagram">{IG}</a>
          <a className="topcta" href="/#selector">Work With Us</a>
        </nav>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
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
        <nav className="footer-links" aria-label="Site">
          {NAV.map(([href, label]) => <a key={href} href={href}>{label}</a>)}
          <a href="/privacy">Privacy</a>
        </nav>
        <div className="footer-note">
          Realty Advisors · Licensed Real Estate Professionals · Long Island, NY<br />
          Listing data courtesy of OneKey&reg; MLS. Information deemed reliable but not guaranteed.<br />
          &copy; 2026 Dynamic Duo LI. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
