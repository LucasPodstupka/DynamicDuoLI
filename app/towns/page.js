import { TOWNS, listingsForTown } from "../../lib/towns";
import { SiteHeader, SiteFooter } from "../../components/SiteChrome";
import "../site-pages.css";

export const revalidate = 86400;

export const metadata = {
  title: "Towns We Cover — South Shore Long Island | Dynamic Duo LI",
  description: "Wantagh, Massapequa, Seaford, Bellmore-Merrick, Lindenhurst and Babylon: the South Shore towns Dynamic Duo LI works in, with the homes we've listed and sold in each.",
  alternates: { canonical: "/towns" },
  openGraph: { url: "/towns", title: "Towns We Cover | Dynamic Duo LI", siteName: "Dynamic Duo LI", type: "website", images: ["/og-image.png"] },
};

export default function TownsIndex() {
  return (
    <>
      <SiteHeader current="/towns" />
      <main className="sp" id="main">
        <section className="sp-hero wrap">
          <span className="eyebrow">Where we work</span>
          <h1 className="sp-title">South Shore Towns</h1>
          <p className="sp-lead">We&rsquo;re based in Wantagh and work across Long Island&rsquo;s South Shore. Pick a town to see what it&rsquo;s like and the homes we&rsquo;ve handled there.</p>
        </section>
        <section className="sp-section wrap">
          <div className="sp-towns">
            {TOWNS.map((t, i) => {
              const n = listingsForTown(t).length;
              return (
                <a key={t.slug} className="sp-town" href={`/towns/${t.slug}`} style={{ "--i": i }}>
                  <h2>{t.name}</h2>
                  <p>{t.blurb}</p>
                  <span className="n">{n ? `${n} ${n === 1 ? "home" : "homes"} in the last 12 months` : "See the town"} &rarr;</span>
                </a>
              );
            })}
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
