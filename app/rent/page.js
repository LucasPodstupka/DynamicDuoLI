import ServicePage from "../../components/ServicePage";
import "../site-pages.css";

export const revalidate = 86400;
export const metadata = {
  title: "Rent or Rent Out a Home on Long Island | Dynamic Duo LI",
  description: "Looking for a rental on the South Shore, or a tenant for your property? Dynamic Duo LI at Realty Advisors helps renters and landlords in Nassau and Suffolk.",
  alternates: { canonical: "/rent" },
  openGraph: { url: "/rent", title: "Rentals with Dynamic Duo LI", siteName: "Dynamic Duo LI", type: "website", images: ["/og-image.png"] },
};

export default function Rent() {
  return (
    <ServicePage
      path="/rent"
      eyebrow="Renters & Landlords"
      title="Rent on Long Island"
      lead="Whether you need a place to live or a reliable tenant for your property, we handle the search, the showings and the paperwork."
      steps={[
        ["Tell us what you need", "Budget, move-in date, towns, pets, and anything else that matters to you."],
        ["See the right places", "We line up showings for rentals that actually fit, so you don't waste weekends."],
        ["Apply with confidence", "We help you put together an application landlords take seriously."],
        ["Landlords", "We market your rental, screen applicants and help you sign a tenant you can count on."],
      ]}
      prose={[
        "Dynamic Duo LI is Lucas Podstupka, Nick Barberio and Jeff Memisha at Realty Advisors, based at 3341 Park Avenue in Wantagh. We help renters and landlords across Long Island's South Shore and the rest of Nassau and Suffolk.",
      ]}
      forms={[
        { id: "renters", intent: "rent", heading: "Looking to rent" },
        { id: "landlords", intent: "rentout", heading: "Renting out your property" },
      ]}
    />
  );
}
