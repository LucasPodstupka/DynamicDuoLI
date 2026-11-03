import { notFound } from "next/navigation";
import { TOWNS, findTown, listingsForTown, townStats, isIndexedTown, median } from "../../../lib/towns";
import { reviewsForTown } from "../../../lib/town-reviews";
import LeadForm from "../../../components/LeadForm";
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
  const indexed = isIndexedTown(t);
  const title = t.hub
    ? `${t.name}, NY — Hamlets & Villages We Cover | Dynamic Duo LI`
    : indexed
      ? `${t.name} Homes for Sale & Recently Sold | Dynamic Duo LI`
      : `${t.name}, NY Real Estate Agents | Dynamic Duo LI`;
  const description = indexed
    ? `See the ${t.name} homes Dynamic Duo LI (Lucas, Nick & Jeff at Realty Advisors) has listed and sold, with prices from our own closed sales.`
    : `Buying or selling in ${t.name}, ${t.county} County? Dynamic Duo LI works anywhere on Long Island, across Nassau and Suffolk.`;
  return {
    title,
    description,
    alternates: { canonical: path },
    ...(indexed ? {} : { robots: { index: false, follow: true } }),
    openGraph: { url: path, title, description, siteName: "Dynamic Duo LI", type: "website", images: ["/og-image.png"] },
  };
}

const fmt = (n) => "$" + n.toLocaleString("en-US");

function faqFor(t, li, s) {
  const sold = li.filter((l) => l.status === "Sold");
  const prices = sold.map((l) => l.soldPrice).filter((n) => n != null);
  const q = [];
  if (sold.length) {
    q.push([`How many homes has Dynamic Duo LI sold in ${t.name}?`, `${sold.length} ${sold.length === 1 ? "home" : "homes"} since ${s.since}, counting both homes we listed and buyers we represented, from our OneKey MLS records.`]);
  }
  if (prices.length >= 2) {
    q.push([`What have our ${t.name} sales sold for?`, `Our ${t.name} sales closed between ${fmt(Math.min(...prices))} and ${fmt(Math.max(...prices))}, with a median of ${fmt(median(prices))}. That covers only the homes we handled, not the whole ${t.name} market.`]);
  }
  q.push([`Do you only work in ${t.name}?`, `No. We work anywhere on Long Island, across Nassau and Suffolk, out of our office at 3341 Park Avenue in Wantagh.`]);
  q.push([`How do I get started?`, `Fill out the short form on this page, or tap Talk With Our Team to call Lucas, Nick or Jeff directly.`]);
  return q;
}

export default function TownPage({ params }) {
  const t = findTown(params.town);
  if (!t) notFound();
  const list = listingsForTown(t);
  const li = list.filter((l) => !l.nyc);
  const s = townStats(li);
  const indexed = li.length > 0;
  const reviews = indexed ? reviewsForTown(t).slice(0, 3) : [];
  const reels = li.filter((l) => l.instagramUrl).slice(0, 4);
  const med = median(li.filter((l) => l.status === "Sold").map((l) => l.soldPrice));
  const faq = indexed ? faqFor(t, li, s) : [];
  const members = t.hub ? TOWNS.filter((x) => !x.hub && x.region === `Town of ${t.hub}`) : [];
  // [confirm] Team notes for this town (neighborhoods, housing stock, schools) go here once
  // Lucas, Nick or Jeff write them. Intentionally not rendered until then.
  const ld = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: `${t.name}, NY real estate`,
    about: { "@type": "Place", name: `${t.name}, NY`, address: { "@type": "PostalAddress", addressLocality: t.name, addressRegion: "NY", addressCountry: "US" } },
    provider: { "@id": "https://www.dynamicduoli.com/#team" },
  };
  const faqLd = faq.length ? { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faq.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })) } : null;
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      {faqLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />}
      <SiteHeader current="/towns" />
      <main className="sp" id="main">
        <section className="sp-hero wrap">
          <p className="sp-crumbs"><a href="/towns">Towns</a> / {t.name}</p>
          <span className="eyebrow">{t.county} County{t.region && !t.region.endsWith("County") ? ` · ${t.region}` : ""}</span>
          <h1 className="sp-title">{t.hub ? t.name : indexed ? `${t.name} Homes` : `${t.name} Real Estate`}</h1>
          <p className="sp-lead">{t.blurb}</p>
          {s.total > 0 && (
            <div className="sp-stats" aria-label={`Our ${t.name} deals`}>
              <div className="sp-stat"><b>{s.total}</b><span>Deals{s.since ? ` · since ${s.since}` : ""}</span></div>
              {s.sold > 0 && <div className="sp-stat"><b>{s.sold}</b><span>Sold</span></div>}
              {s.active + s.pending > 0 && <div className="sp-stat"><b>{s.active + s.pending}</b><span>Active &amp; pending now</span></div>}
              {s.soldVolume > 0 && <div className="sp-stat"><b>{money(s.soldVolume)}</b><span>Sold volume{s.since ? ` · since ${s.since}` : ""}</span></div>}
              {med != null && s.sold > 1 && <div className="sp-stat"><b>{money(med)}</b><span>Median of our sales</span></div>}
            </div>
          )}
        </section>
        <section className="sp-section wrap sp-prose">
          <h2 className="sp-h2">Living in {t.name}</h2>
          {t.copy.map((p, i) => <p key={i}>{p}</p>)}
          {t.source && <p className="sp-source">Source: <a href={t.source} rel="noopener noreferrer" target="_blank">Wikipedia</a> and the LIRR station list.</p>}
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
        {members.length > 0 && (
          <section className="sp-section wrap">
            <h2 className="sp-h2">Hamlets &amp; villages in the {t.name}</h2>
            <div className="sp-towns-inline">{members.map((x) => <a key={x.slug} href={`/towns/${x.slug}`}>{x.name}</a>)}</div>
          </section>
        )}
        {reels.length > 0 && (
          <section className="sp-section wrap">
            <h2 className="sp-h2">{t.name} walkthrough videos</h2>
            <div className="sp-towns-inline">{reels.map((l) => <a key={l.mls} href={l.instagramUrl} target="_blank" rel="noopener noreferrer">&#9654; {l.address}</a>)}</div>
          </section>
        )}
        {reviews.length > 0 && (
          <section className="sp-section wrap">
            <h2 className="sp-h2">What {t.name} clients said</h2>
            <div className="tr-list">{reviews.map((r) => (
              <figure key={r.reviewer + r.date} className="tr-card">
                <blockquote>{r.text.length > 420 ? r.text.slice(0, 420).replace(/\s+\S*$/, "") + "…" : r.text}</blockquote>
                <figcaption>{r.reviewer} · {r.detail} · <a href={r.profileUrl} target="_blank" rel="noopener noreferrer">Zillow review of {r.agent}</a></figcaption>
              </figure>))}</div>
          </section>
        )}
        {faq.length > 0 && (
          <section className="sp-section wrap">
            <h2 className="sp-h2">{t.name} FAQ</h2>
            <div className="tr-faq">{faq.map(([q, a]) => <details key={q}><summary>{q}</summary><p>{a}</p></details>)}</div>
          </section>
        )}
        <section className="sp-section wrap" id="talk">
          <h2 className="sp-h2">Talk to us about {t.name}</h2>
          <p className="sp-source">We work anywhere on Long Island, across Nassau and Suffolk.</p>
          <LeadForm intent="buy" title={`Buying or selling in ${t.name}?`} sub="Tell us a little about you and we'll reach out within 24 hours." notes={`From the ${t.name} town page`} />
        </section>
        <section className="sp-section wrap">
          <h2 className="sp-h2">More in {t.region}</h2>
          <p className="sp-source"><a href={`/towns#${t.county.toLowerCase()}`}>All {t.county} County towns &rarr;</a></p>
          <div className="sp-towns-inline">{TOWNS.filter((x) => x.slug !== t.slug && x.county === t.county && x.region === t.region).slice(0, 16).map((x) => <a key={x.slug} href={`/towns/${x.slug}`}>{x.name}</a>)}</div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
