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

// Hidden client page: sent by link after a listing appointment.
// Not linked from the nav, footer or sitemap, and kept out of search results.
export const revalidate = 86400;
export const metadata = {
  title: "Thanks for Meeting | Dynamic Duo LI",
  description: "A little more about our team: Nick, Jeff and Lucas at Dynamic Duo LI, our walkthrough videos, and the homes we've sold.",
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
  alternates: { canonical: "/welcome" },
  openGraph: { url: "/welcome", title: "Thanks for Meeting | Dynamic Duo LI", description: "A little more about our team, our videos and the homes we've sold.", siteName: "Dynamic Duo LI", type: "website", images: ["/og-image.png"] },
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
  .replace(/<span class="eyebrow">Follow Along<\/span>/, '<span class="eyebrow">How we market your home</span>')
  .replace(/<h2 class="ig-title">[\s\S]*?<\/h2>/, '<h2 class="ig-title">Our walkthrough videos.</h2>')
  .replace(/<p class="ig-sub">[\s\S]*?<\/p>/, '<!--IG-EXPLAIN-->');
const IG_EXPLAIN =
  '<ol class="wl-how">' +
  '<li><b>We film it</b><span>Every home we list gets a video walkthrough, room by room.</span></li>' +
  '<li><b>We post it</b><span>The video goes on our Instagram, @dynamicduoli, so buyers can tour your home from their phone.</span></li>' +
  '<li><b>Buyers comment, we follow up</b><span>When someone comments the keyword on the video, we automatically send them the listing information. It&rsquo;s how we funnel buyers in for your home.</span></li>' +
  '</ol>';

export default function Welcome() {
  const d = dealStats();
  const current = publicListings().filter((l) => l.status === "Active" || l.status === "Pending")
    // Actives first, and within each group homes with photos before "photos coming soon".
    .sort((a, b) => (a.status === "Active" ? 0 : 2) + (a.photos && a.photos.length ? 0 : 1) - ((b.status === "Active" ? 0 : 2) + (b.photos && b.photos.length ? 0 : 1)));
  const sold = allDeals().filter((l) => l.status === "Sold" && l.soldDate && !l.nyc && l.photos && l.photos.length)
    .sort((a, b) => b.soldDate.localeCompare(a.soldDate)).slice(0, 12);
  const activeN = current.filter((l) => l.status === "Active").length;
  const pendingN = current.length - activeN;
  return (
    <>
      <SiteHeader />
      <main className="sp wl" id="main">
        <section className="sp-hero wrap wl-hero">
          <span className="eyebrow">Dynamic Duo LI</span>
          <h1 className="sp-title">Thanks for meeting.</h1>
          <p className="sp-lead wl-lead">Thanks for inviting us into your home. It was a pleasure meeting you.</p>
          <p className="wl-lead2">Here&rsquo;s a little additional information about our team.</p>
          <div className="sp-stats wl-stats">
            <div className="sp-stat"><b>{d.allTime.count}</b><span>Homes sold · since {d.allTime.since}</span></div>
            <div className="sp-stat"><b>{shortMoney(d.allTime.volume)}</b><span>Sold volume · since {d.allTime.since}</span></div>
            <div className="sp-stat"><b>{d.last12.count}</b><span>Homes sold · last 12 mo</span></div>
            <div className="sp-stat"><b>{ZILLOW_REVIEWS}</b><span>Zillow reviews</span></div>
          </div>
          <nav className="wl-jump" aria-label="On this page">
            <a href="#team">Team</a><a href="#instagram">Videos</a><a href="#current">Current listings</a><a href="#sold">Sold</a><a href="#reviews">Reviews</a><a href="#feedback">Questions</a>
          </nav>
        </section>

        <section className="sp-section wrap" id="team">
          <span className="eyebrow">Who we are</span>
          <h2 className="sp-h2 wl-h2">The team</h2>
          <div className="wl-team" dangerouslySetInnerHTML={{ __html: TEAM_HTML }} />
        </section>

        <div className="wl-ig" dangerouslySetInnerHTML={{ __html: IG_HTML.replace("<!--IG-EXPLAIN-->", IG_EXPLAIN) }} />

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

        <div className="wl-reviews" dangerouslySetInnerHTML={{ __html: teaserHtml() }} />

        <section className="sp-section wrap" id="feedback">
          <span className="eyebrow">Your feedback</span>
          <h2 className="sp-h2 wl-h2">How&rsquo;d we do?</h2>
          <p className="wl-sub">Rate your appointment out of five stars, and leave any questions or comments. It&rsquo;s anonymous unless you add your name.</p>
          <ClientFeedback accessKey={WEB3FORMS_KEY} teamEmails={TEAM_EMAILS} />
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
