import { SiteHeader, SiteFooter } from "../../components/SiteChrome";
import { NOTICE_URL, NOTICE_PDF, HUD_COMPLAINT_URL, DHR_COMPLAINT_URL, DOS_FAIR_HOUSING_URL, SOP_URL } from "../../lib/compliance";
import "../site-pages.css";

export const metadata = {
  title: "Fair Housing & Equal Housing Opportunity | Dynamic Duo LI",
  description: "Dynamic Duo LI at Realty Advisors follows all federal, New York State and local fair housing laws. Protected characteristics, your rights and how to file a complaint.",
  alternates: { canonical: "/fair-housing" },
  openGraph: { url: "/fair-housing", title: "Fair Housing | Dynamic Duo LI", siteName: "Dynamic Duo LI", type: "website", images: ["/og-image.png"] },
};

// Protected characteristics as listed on the NYS Housing and Anti-Discrimination Notice (DOS, Rev. 02/25).
const PROTECTED = ["race", "creed", "color", "national origin", "citizenship or immigration status", "sexual orientation", "gender identity or expression", "military status", "sex", "age", "disability", "marital status", "status as a victim of domestic violence", "lawful source of income", "familial status"];

export default function FairHousing() {
  return (
    <>
      <SiteHeader current="/fair-housing" />
      <main className="sp" id="main">
        <section className="sp-hero wrap">
          <span className="eyebrow">Equal Housing Opportunity</span>
          <h1 className="sp-title">Fair Housing</h1>
          <p className="sp-lead">We are pledged to the letter and spirit of U.S. and New York State policy for equal housing opportunity. We serve every buyer, seller, renter and landlord the same way, anywhere on Long Island.</p>
        </section>
        <section className="sp-section wrap sp-prose">
          <h2 className="sp-h2">NYS Housing and Anti-Discrimination Notice</h2>
          <p>New York requires real estate brokers to share the Department of State&rsquo;s notice. <a href={NOTICE_URL} target="_blank" rel="noopener noreferrer">Read the NYS Housing and Anti-Discrimination Notice</a> (<a href={NOTICE_PDF} target="_blank" rel="noopener noreferrer">PDF</a>). It explains your rights under the New York State Human Rights Law and how to file a complaint.</p>

          <h2 className="sp-h2">Protected characteristics</h2>
          <p>Under federal, state and local fair housing and anti-discrimination laws, it is unlawful to discriminate in housing based on protected characteristics, which include, but are not limited to: {PROTECTED.join(", ")}.</p>
          <p className="sp-source">Source: <a href={NOTICE_URL} target="_blank" rel="noopener noreferrer">NYS Department of State, Housing and Anti-Discrimination Notice (Rev. 02/25)</a>.</p>

          <h2 className="sp-h2">Source of income</h2>
          <p>In New York it is illegal to refuse to rent to someone because of their lawful source of income, including Section 8 vouchers or other government subsidies. We apply the same criteria to every applicant.</p>

          <h2 className="sp-h2">Service and assistance animals</h2>
          <p>A &ldquo;no pet&rdquo; policy must be waived for a tenant or buyer who needs a service, assistance or emotional support animal. We help landlords and sellers follow this rule.</p>

          <h2 className="sp-h2">How we work</h2>
          <p>We don&rsquo;t steer anyone toward or away from a neighborhood, and we can&rsquo;t follow a seller&rsquo;s or landlord&rsquo;s preference about who buys or rents. We describe homes, not the people who should live in them. If you have questions about schools, safety or a neighborhood, we&rsquo;ll point you to official sources so you can decide for yourself.</p>

          <h2 className="sp-h2">File a complaint</h2>
          <ul>
            <li>NYS Division of Human Rights: <a href={DHR_COMPLAINT_URL} target="_blank" rel="noopener noreferrer">file a complaint</a> or call (844) 862-8703</li>
            <li>NYS Department of State: <a href={DOS_FAIR_HOUSING_URL} target="_blank" rel="noopener noreferrer">fair housing resources</a> or call (518) 474-4429</li>
            <li>U.S. Department of Housing and Urban Development (HUD): <a href={HUD_COMPLAINT_URL} target="_blank" rel="noopener noreferrer">file a fair housing complaint</a></li>
          </ul>
          {SOP_URL && (<><h2 className="sp-h2">Standard Operating Procedures</h2><p><a href={SOP_URL} target="_blank" rel="noopener noreferrer">Read Realty Advisors&rsquo; Standard Operating Procedures</a> for prospective buyers.</p></>)}
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
