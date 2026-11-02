import ServicePage from "../../components/ServicePage";
import { teamStats } from "../../lib/listings";
import "../site-pages.css";

export const revalidate = 86400;
export const metadata = {
  title: "Buy a Home on Long Island's South Shore | Dynamic Duo LI",
  description: "Buying in Nassau or Suffolk? Lucas, Nick and Jeff at Realty Advisors help you find the right home, price it right and write an offer that gets accepted.",
  alternates: { canonical: "/buy" },
  openGraph: { url: "/buy", title: "Buy with Dynamic Duo LI", siteName: "Dynamic Duo LI", type: "website", images: ["/og-image.png"] },
};

export default function Buy() {
  const s = teamStats();
  return (
    <ServicePage
      path="/buy"
      eyebrow="Buyers"
      title="Buy on Long Island"
      lead="Buying on the South Shore is competitive. We help you understand the market, move fast and write offers that hold up."
      stats={[[s.buyerSide, "Buyer-side deals · last 12 mo"], [s.sold, "Homes sold · last 12 mo"]]}
      steps={[
        ["Plan", "We talk budget, towns, timing and must-haves, and Jeff can walk you through financing as a licensed loan officer."],
        ["Search", "We send homes that fit, flag the ones worth seeing fast, and tell you plainly what we think of each."],
        ["Offer", "We pull recent closed sales so your offer is based on real numbers, then structure terms that make it stand out."],
        ["Close", "We stay on inspection, appraisal, attorneys and the lender through closing day."],
      ]}
      prose={[
        "Dynamic Duo LI is Lucas Podstupka, Nick Barberio and Jeff Memisha at Realty Advisors, working out of our office at 3341 Park Avenue in Wantagh. Most of our deals are on Long Island's South Shore, in towns like Wantagh, Massapequa, Seaford and Bellmore-Merrick, and we work across Nassau and Suffolk.",
        "Jeff is both an associate broker and a licensed loan officer (NMLS #2042222), so you can get answers about pre-approval and monthly cost from the same team that is showing you homes.",
      ]}
      forms={[{ id: "start", intent: "buy", heading: "Start your search" }]}
    />
  );
}
