import { SiteHeader, SiteFooter } from "../../components/SiteChrome";
import ListingCard from "../../components/ListingCard";
import DealRail from "../../components/DealRail";
import ClientFeedback from "../../components/ClientFeedback";
import { publicListings, allDeals, dealStats, shortMoney } from "../../lib/listings";
import { MARKUP } from "../../lib/home-markup";
import { teaserHtml, TOTAL as ZILLOW_REVIEWS } from "../../lib/reviews-html";
import { WEB3FORMS_KEY, TEAM_EMAILS } from "../../lib/web3forms";
import "../site-pages.css";
import "../listings/listings.css";
import "./welcome.css";

// Hidden client page: sent by link after a listing appointment, CMA or buyer consultation.
// Not linked from the nav, footer or sitemap, and kept out of search results.
export const revalidate = 86400;
export const metadata = {
  title: "Nice to Meet You | Dynamic Duo LI",
  description: "Who we are, what we do, our current and past deals, and our videos, from Nick, Jeff and Lucas at Dynamic Duo LI.",
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
  alternates: { canonical: "/welcome" },
  openGraph: { url: "/welcome", title: "Nice to Meet You | Dynamic Duo LI", description: "Who we are, what we do, and the homes we've sold.", siteName: "Dynamic Duo LI", type: "website", images: ["/og-image.png"] },
};

// Reuse the homepage's team cards and Instagram section as-is (no scroll-reveal script on this page).
const noReveal = (html) => html.replace(/ reveal\b/g, "").replace(/ data-d="\d"/g, "");
function divBlock(start) {
  const re = /<\/?div\b[^>]*>/g;
  re.lastIndex = start;
  let depth = 0, m;
  while ((m = re.exec(MARKUP))) {
    depth += m[0][1] === "/" ? -1 : 1;
    if (depth === 0) return MARKUP.slice(start, re.lastIndex);
  }
  return "";
}
// Order on this page: Nick, Jeff, Lucas.
const agent = (k) => divBlock(MARKUP.indexOf(`<div class="agent reveal agent-${k}">`));
const TEAM_HTML = noReveal(`<div class="team">${["nick", "jeff", "lucas"].map(agent).join("")}</div>`);
const igAt = MARKUP.indexOf('<section class="igsec"');
const IG_HTML = noReveal(MARKUP.slice(igAt, MARKUP.indexOf("</section>", igAt) + "</section>".length))
  .replace(/<h2 class="ig-title">[\s\S]*?<\/h2>/, '<h2 class="ig-title">Our videos.</h2>');

const SERVICES = [
  ["Selling", "A pricing plan built from real closed sales, professional photos, MLS exposure and a video walkthrough on our Instagram. We compare offers on terms as well as price and stay on the deal through closing."],
  ["Buying", "We talk budget, towns, timing and must-haves, send homes that fit, and base your offer on recent closed sales. Jeff can walk you through financing as a licensed loan officer (NMLS #2042222)."],
  ["Renting", "For renters, we line up showings that fit and help you put together a strong application. For landlords, we market and show the rental and screen every applicant with the same lawful criteria."],
];

export default function Welcome() {
  const d = dealStats();
  const current = publicListings().filter((l) => l.status === "Active" || l.status === "Pending")
    .sort((a, b) => (a.status === b.status ? 0 : a.status === "Active" ? -1 : 1));
  const sold = allDeals().filter((l) => l.status === "Sold" && l.soldDate && !l.nyc && l.photos && l.photos.length)
    .sort((a, b) => b.soldDate.localeCompare(a.soldDate)).slice(0, 12);
  const activeN = current.filter((l) => l.status === "Active").length;
  const pendingN = current.length - activeN;
  return (
    <>
      <SiteHeader />
      <main className="sp wl" id="main">
        <section className="sp-hero wrap wl-hero">
          <span className="eyebrow">Thanks for meeting with us</span>
          <h1 className="sp-title">Nice to meet you.</h1>
          <p className="sp-lead">
            We&rsquo;re Dynamic Duo LI: Nick Barberio, Jeff Memisha and Lucas Podstupka at Realty Advisors in Wantagh. Here&rsquo;s who we are, what we do and the homes we&rsquo;ve sold, all in one place.
          </p>
          <div className="sp-stats">
            <div className="sp-stat"><b>{d.allTime.count}</b><span>Homes sold · since {d.allTime.since}</span></div>
            <div className="sp-stat"><b>{shortMoney(d.allTime.volume)}</b><span>Sold volume · since {d.allTime.since}</span></div>
            <div className="sp-stat"><b>{d.last12.count}</b><span>Homes sold · last 12 mo</span></div>
            <div className="sp-stat"><b>{ZILLOW_REVIEWS}</b><span>Zillow reviews</span></div>
          </div>
          <nav className="wl-jump" aria-label="On this page">
            <a href="#feedback">How&rsquo;d we do?</a><a href="#team">Team</a><a href="#services">What we do</a><a href="#current">Current deals</a><a href="#sold">Past deals</a><a href="#instagram">Videos</a>
          </nav>
        </section>

        <section className="sp-section wrap" id="feedback">
          <span className="eyebrow">Your feedback</span>
          <h2 className="sp-h2 wl-h2">How&rsquo;d we do?</h2>
          <p className="wl-sub">Rate your appointment out of five stars, and leave any questions or comments. It&rsquo;s anonymous unless you add your name.</p>
          <ClientFeedback accessKey={WEB3FORMS_KEY} teamEmails={TEAM_EMAILS} />
        </section>

        <section className="sp-section wrap" id="team">
          <span className="eyebrow">Who we are</span>
          <h2 className="sp-h2 wl-h2">The team</h2>
          <div className="wl-team" dangerouslySetInnerHTML={{ __html: TEAM_HTML }} />
        </section>

        <section className="sp-section wrap" id="services">
          <span className="eyebrow">What we do</span>
          <h2 className="sp-h2 wl-h2">Buy · Sell · Rent</h2>
          <ol className="sp-steps wl-services">{SERVICES.map(([b, s], i) => <li key={b} style={{ "--i": i }}><b>{b}</b><span>{s}</span></li>)}</ol>
        </section>

        <section className="sp-section wrap" id="current">
          <span className="eyebrow">Current deals</span>
          <h2 className="sp-h2 wl-h2">On the market &amp; under contract</h2>
          <p className="wl-sub">{activeN} active · {pendingN} pending, including buyers we&rsquo;re representing.</p>
          <DealRail label="Current deals">{current.map((l, i) => <ListingCard key={l.mls} l={l} idx={i} />)}</DealRail>
        </section>

        <section className="sp-section wrap" id="sold">
          <span className="eyebrow">Past deals</span>
          <h2 className="sp-h2 wl-h2">Recently sold</h2>
          <p className="wl-sub">
            {d.last12.count} homes and {shortMoney(d.last12.volume)} sold in the last 12 months; {d.allTime.count} homes and {shortMoney(d.allTime.volume)} since {d.allTime.since}.
          </p>
          <DealRail label="Recently sold homes">{sold.map((l, i) => <ListingCard key={l.mls} l={l} idx={i} />)}</DealRail>
          <div className="sp-cta"><a className="sp-btn ghost" href="/listings">See every listing and sale &rarr;</a></div>
        </section>

        <div className="wl-ig" dangerouslySetInnerHTML={{ __html: IG_HTML }} />

        <div className="wl-reviews" dangerouslySetInnerHTML={{ __html: teaserHtml() }} />

      </main>
      <SiteFooter />
    </>
  );
}
