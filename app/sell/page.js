import ServicePage from "../../components/ServicePage";
import { teamStats, shortMoney, dealStats } from "../../lib/listings";
import "../site-pages.css";

export const revalidate = 86400;
export const metadata = {
  title: "Sell Your Long Island Home | Dynamic Duo LI",
  description: "Selling on the South Shore? Get a pricing plan based on recent closed sales, professional marketing and a team that negotiates for you. Realty Advisors, Wantagh.",
  alternates: { canonical: "/sell" },
  openGraph: { url: "/sell", title: "Sell with Dynamic Duo LI", siteName: "Dynamic Duo LI", type: "website", images: ["/og-image.png"] },
};

export default function Sell() {
  const s = teamStats();
  const d = dealStats();
  return (
    <ServicePage
      path="/sell"
      eyebrow="Sellers"
      title="Sell Your Home"
      lead="A pricing plan built from real closed sales, marketing that gets your home seen, and a team that negotiates for you start to finish."
      stats={[[d.allTime.count, `Homes sold · since ${d.allTime.since}`], [shortMoney(d.allTime.volume), `Sold volume · since ${d.allTime.since}`], [d.last12.count, "Homes sold · last 12 mo"], [shortMoney(d.last12.volume), "Sold volume · last 12 mo"]]}
      steps={[
        ["Price", "We pull the recent closed sales around you and give you a price range with the reasoning behind it."],
        ["Prepare", "We tell you which fixes are worth it before photos, and which ones aren't."],
        ["Market", "Professional photos, MLS exposure and video walkthroughs on our Instagram, @dynamicduoli."],
        ["Negotiate", "We compare offers on terms as well as price, and stay on the deal through closing."],
      ]}
      prose={[
        "Dynamic Duo LI is Lucas Podstupka, Nick Barberio and Jeff Memisha at Realty Advisors in Wantagh. We sell homes across Long Island's South Shore, and every home we've listed or sold in the last 12 months is on our listings page so you can see the work for yourself.",
        "The numbers above are counted straight from those listings, which come from OneKey MLS.",
      ]}
      extra={<section className="sp-section wrap"><div className="sp-cta"><a className="sp-btn ghost" href="/listings">See our listings &rarr;</a></div></section>}
      forms={[{ id: "start", intent: "sell", heading: "Get your home's value" }]}
    />
  );
}
