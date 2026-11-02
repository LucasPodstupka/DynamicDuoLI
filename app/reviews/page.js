import { SiteHeader, SiteFooter } from "../../components/SiteChrome";
import ReviewsTabs from "../../components/ReviewsTabs";
import "../site-pages.css";

export const metadata = {
  title: "Zillow Reviews | Dynamic Duo LI",
  description: "Real Zillow reviews, word for word, for Lucas Podstupka, Nick Barberio and Jeff Memisha of Dynamic Duo LI.",
  alternates: { canonical: "/reviews" },
  openGraph: { url: "/reviews", title: "Zillow Reviews | Dynamic Duo LI", siteName: "Dynamic Duo LI", type: "website", images: ["/og-image.png"] },
};

export default function ReviewsPage() {
  return (
    <>
      <SiteHeader current="/reviews" />
      <main className="sp" id="main">
        <ReviewsTabs />
      </main>
      <SiteFooter />
    </>
  );
}
