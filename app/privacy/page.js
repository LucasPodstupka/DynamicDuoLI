import { SiteFooter } from "../../components/SiteChrome";
export const metadata = {
  title: "Privacy Policy — Dynamic Duo LI",
  description: "How Dynamic Duo LI handles the information you send through our website forms.",
  alternates: { canonical: "/privacy" },
  openGraph: { url: "/privacy", title: "Privacy Policy — Dynamic Duo LI", siteName: "Dynamic Duo LI", type: "website" },
};

const h2 = { fontFamily: "'Oswald',sans-serif", textTransform: "uppercase", fontSize: 22, letterSpacing: ".04em", margin: "34px 0 10px", color: "var(--ink-2)" };
const p = { color: "var(--ink-2)", lineHeight: 1.7, marginTop: 10 };

export default function Privacy() {
  return (
    <>
    <main className="wrap" style={{ maxWidth: 820, padding: "90px 28px 110px" }}>
      <a href="/" style={{ color: "var(--brass)" }}>&larr; Back to Dynamic Duo LI</a>
      <h1 style={{ fontFamily: "'Oswald',sans-serif", textTransform: "uppercase", fontSize: 42, margin: "20px 0 6px", color: "var(--ink-2)" }}>Privacy Policy</h1>
      <p style={{ color: "var(--muted)" }}>Last updated: November 1, 2026</p>

      <h2 style={h2}>Who we are</h2>
      <p style={p}>Dynamic Duo LI is a team of licensed real estate professionals (Lucas Podstupka, Nick Barberio and Jeff Memisha) with Realty Advisors, 3341 Park Avenue, Wantagh, NY 11793, tel. 516-826-1111.</p>

      <h2 style={h2}>What we collect</h2>
      <p style={p}>When you fill out a form on this site we receive what you enter: your name, email, phone number and, depending on the form, property address, budget, timeline, how you found us and any notes. We don&rsquo;t ask for financial account numbers or government IDs on this site.</p>

      <h2 style={h2}>How we use it</h2>
      <p style={p}>We use your information only to respond to your inquiry and help with your purchase, sale or rental, for example by calling, texting or emailing you about homes, pricing or next steps.</p>

      <h2 style={h2}>How it reaches us</h2>
      <p style={p}>Form submissions are delivered to our team&rsquo;s email inboxes through Web3Forms, a third-party form delivery service. Our site is hosted on Vercel. These providers process data on our behalf to run the site.</p>

      <h2 style={h2}>Sharing</h2>
      <p style={p}>We don&rsquo;t sell your personal information. We may share details with people involved in your transaction, such as a lender, attorney or inspector, when you ask us to or when it&rsquo;s needed to move your deal forward. [confirm]</p>

      <h2 style={h2}>Cookies and analytics</h2>
      <p style={p}>This site doesn&rsquo;t run advertising trackers. Our hosting and font providers may log standard technical data such as IP address and browser type. [confirm]</p>

      <h2 style={h2}>Retention and your choices</h2>
      <p style={p}>You can ask us to update or delete the information you sent, or to stop contacting you, at any time by emailing <a href="mailto:dynamicduoli@therealtyadvisors.com">dynamicduoli@therealtyadvisors.com</a> or calling 516-826-1111. We keep inquiries only as long as needed to serve you and meet any legal record-keeping requirements. [confirm]</p>

      <h2 style={h2}>Listing data</h2>
      <p style={p}>Listing information is courtesy of OneKey&reg; MLS and is deemed reliable but not guaranteed.</p>
    </main>
    <SiteFooter />
    </>
  );
}
