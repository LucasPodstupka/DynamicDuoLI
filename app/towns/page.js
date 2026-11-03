import { TOWNS, listingsForTown } from "../../lib/towns";
import { SiteHeader, SiteFooter } from "../../components/SiteChrome";
import "../site-pages.css";

export const revalidate = 86400;

export const metadata = {
  title: "Long Island Towns — Every Nassau & Suffolk Community | Dynamic Duo LI",
  description: `${TOWNS.length} Nassau and Suffolk County cities, towns, villages and hamlets, with the homes Dynamic Duo LI has listed and sold in each.`,
  alternates: { canonical: "/towns" },
  openGraph: { url: "/towns", title: "Long Island Towns | Dynamic Duo LI", siteName: "Dynamic Duo LI", type: "website", images: ["/og-image.png"] },
};

function County({ county }) {
  const list = TOWNS.filter((t) => t.county === county);
  return (
    <div className={`tw-panel tw-p-${county.toLowerCase()}`} id={county.toLowerCase()}>
      <p className="tw-count">{list.length} communities in {county} County</p>
      <ul className="tw-list">
        {list.map((t) => {
          const n = listingsForTown(t).length;
          return (
            <li key={t.slug}>
              <a href={`/towns/${t.slug}`}>
                <b>{t.name}</b>
                <span>{n ? `${n} of our ${n === 1 ? "homes" : "homes"}` : t.blurb.replace(/\.$/, "")}</span>
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default function TownsIndex() {
  return (
    <>
      <SiteHeader current="/towns" />
      <main className="sp" id="main">
        <section className="sp-hero wrap">
          <span className="eyebrow">Where we work</span>
          <h1 className="sp-title">Long Island Towns</h1>
          <p className="sp-lead">We&rsquo;re based in Wantagh and work across Nassau and Suffolk. Pick a town to see the basics and the homes we&rsquo;ve handled there.</p>
        </section>
        <section className="sp-section wrap tw">
          <input type="radio" name="twc" id="tw-n" className="tw-r" defaultChecked />
          <input type="radio" name="twc" id="tw-s" className="tw-r" />
          <div className="tw-tabs" role="presentation">
            <label htmlFor="tw-n">Nassau</label>
            <label htmlFor="tw-s">Suffolk</label>
          </div>
          <County county="Nassau" />
          <County county="Suffolk" />
          <script dangerouslySetInnerHTML={{ __html: `(function(){function s(){var h=location.hash.slice(1);var el=document.getElementById(h==="suffolk"?"tw-s":h==="nassau"?"tw-n":"");if(el)el.checked=true}s();addEventListener("hashchange",s)})()` }} />
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
