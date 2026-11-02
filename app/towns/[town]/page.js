import { notFound } from "next/navigation";
import { TOWNS, findTown, listingsForTown, townStats } from "../../../lib/towns";
import { money } from "../../../lib/listings";
import { SiteHeader, SiteFooter } from "../../../components/SiteChrome";
import ListingCard from "../../../components/ListingCard";
import "../../listings/listings.css";
import "../../site-pages.css";

export const revalidate = 86400;
export const dynamicParams = false;

export function generateStaticParams() {
  return TOWNS.map((t) => ({ town: t.slug }));
}

export function generateMetadata({ params }) {
  const t = findTown(params.town);
  if (!t) return {};
  const path = `/towns/${t.slug}`;
  const title = `${t.name}, NY Real Estate — Homes We've Sold | Dynamic Duo LI`;
  const description = `Buying or selling in ${t.name}, ${t.county} County? See the ${t.name} homes Dynamic Duo LI (Lucas, Nick & Jeff at Realty Advisors) has listed and sold.`;
  return { title, description, alternates: { canonical: path }, openGraph: { url: path, title, description, siteName: "Dynamic Duo LI", type: "website", images: ["/og-image.png"] } };
}

export default function TownPage({ params }) {
  const t = findTown(params.town);
  if (!t) notFound();
  const list = listingsForTown(t);
  const s = townStats(list);
  const ld = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: `${t.name}, NY real estate`,
    about: { "@type": "Place", name: `${t.name}, NY`, address: { "@type": "PostalAddress", addressLocality: t.name, addressRegion: "NY", addressCountry: "US" } },
    provider: { "@id": "https://www.dynamicduoli.com/#team" },
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <SiteHeader current="/towns" />
      <main className="sp" id="main">
        <section className="sp-hero wrap">
          <p className="sp-crumbs"><a href="/towns">Towns</a> / {t.name}</p>
          <span className="eyebrow">{t.county} County · South Shore</span>
          <h1 className="sp-title">{t.name} Real Estate</h1>
          <p className="sp-lead">{t.blurb}</p>
          {s.total > 0 && (
            <div className="sp-stats" aria-label={`Our ${t.name} deals in the last 12 months`}>
              <div className="sp-stat"><b>{s.total}</b><span>Deals · last 12 mo</span></div>
              {s.sold > 0 && <div className="sp-stat"><b>{s.sold}</b><span>Sold</span></div>}
              {s.active + s.pending > 0 && <div className="sp-stat"><b>{s.active + s.pending}</b><span>Active &amp; pending</span></div>}
              {s.soldVolume > 0 && <div className="sp-stat"><b>{money(s.soldVolume)}</b><span>Sold volume</span></div>}
            </div>
          )}
        </section>
        <section className="sp-section wrap sp-prose">
          <h2 className="sp-h2">Living in {t.name}</h2>
          {t.copy.map((p, i) => <p key={i}>{p}</p>)}
        </section>
        <section className="sp-section wrap">
          <h2 className="sp-h2">Our {t.name} homes</h2>
          {list.length ? (
            <div className="lx-grid">{list.map((l, i) => <ListingCard key={l.mls} l={l} idx={i} />)}</div>
          ) : (
            <div className="sp-empty">We don&rsquo;t have a {t.name} home on the site right now. Reach out and we&rsquo;ll send you what&rsquo;s on the market and what has sold nearby.</div>
          )}
          <div className="sp-cta">
            <a className="sp-btn" href="/buy">Buy in {t.name}</a>
            <a className="sp-btn ghost" href="/sell">Sell in {t.name}</a>
          </div>
        </section>
        <section className="sp-section wrap">
          <h2 className="sp-h2">Other towns we cover</h2>
          <div className="sp-towns-inline">{TOWNS.filter((x) => x.slug !== t.slug).map((x) => <a key={x.slug} href={`/towns/${x.slug}`}>{x.name}</a>)}</div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
