import { TOWNS, listingsForTown } from "../../lib/towns";
import { SiteHeader, SiteFooter } from "../../components/SiteChrome";
import "../site-pages.css";

export const revalidate = 86400;

export const metadata = {
  title: "Long Island Towns We Cover — Nassau & Suffolk | Dynamic Duo LI",
  description: `${TOWNS.length} Nassau and Suffolk towns Dynamic Duo LI works in, from Wantagh and Massapequa to Smithtown and Port Jefferson, with the homes we've listed and sold in each.`,
  alternates: { canonical: "/towns" },
  openGraph: { url: "/towns", title: "Towns We Cover | Dynamic Duo LI", siteName: "Dynamic Duo LI", type: "website", images: ["/og-image.png"] },
};

const GROUPS = [["Nassau","South Shore"],["Nassau","Central Nassau"],["Nassau","Western Nassau"],["Nassau","North Shore"],["Suffolk","South Shore"],["Suffolk","Western Suffolk"],["Suffolk","Central Suffolk"],["Suffolk","North Shore"],["Suffolk","North Fork"]];

export default function TownsIndex() {
  return (
    <>
      <SiteHeader current="/towns" />
      <main className="sp" id="main">
        <section className="sp-hero wrap">
          <span className="eyebrow">Where we work</span>
          <h1 className="sp-title">Long Island Towns</h1>
          <p className="sp-lead">We&rsquo;re based in Wantagh and work across Nassau and Suffolk. Pick a town to see what it&rsquo;s like and the homes we&rsquo;ve handled there.</p>
        </section>
        {GROUPS.map(([county, region]) => {
          const list = TOWNS.filter((t) => t.county === county && t.region === region);
          if (!list.length) return null;
          return (
            <section key={county + region} className="sp-section wrap">
              <h2 className="sp-h2">{region} · {county} County</h2>
              <div className="sp-towns">
                {list.map((t, i) => {
                  const n = listingsForTown(t).length;
                  return (
                    <a key={t.slug} className="sp-town" href={`/towns/${t.slug}`} style={{ "--i": i }}>
                      <h3>{t.name}</h3>
                      <p>{t.blurb}</p>
                      <span className="n">{n ? `${n} ${n === 1 ? "home" : "homes"} in the last 12 months` : "See the town"} &rarr;</span>
                    </a>
                  );
                })}
              </div>
            </section>
          );
        })}
      </main>
      <SiteFooter />
    </>
  );
}
