import "./globals.css";
import "./concept.css";
import { Cormorant_Garamond, Inter } from "next/font/google";

const serif = Cormorant_Garamond({ subsets: ["latin"], weight: ["500", "600", "700"], style: ["normal", "italic"], variable: "--font-serif", display: "swap" });
const sans = Inter({ subsets: ["latin"], variable: "--font-sans", display: "swap" });

export const metadata = {
  metadataBase: new URL("https://www.dynamicduoli.com"),
  alternates: { canonical: "/" },
  title: "Dynamic Duo LI — Long Island Real Estate",
  description:
    "Long Island real estate, played to win. Buy, sell, or rent with Dynamic Duo LI — strategy, speed, and straight talk on every move.",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "Dynamic Duo LI — Long Island Real Estate",
    description:
      "Buy, sell, or rent on Long Island with Dynamic Duo LI — strategy, speed, and straight talk on every move.",
    url: "/",
    siteName: "Dynamic Duo LI",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Dynamic Duo LI — Long Island Real Estate",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Dynamic Duo LI — Long Island Real Estate",
    description:
      "Buy, sell, or rent on Long Island with Dynamic Duo LI.",
    images: ["/og-image.png"],
  },
};

const LD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "RealEstateAgent",
      "@id": "https://www.dynamicduoli.com/#team",
      name: "Dynamic Duo LI",
      url: "https://www.dynamicduoli.com",
      logo: "https://www.dynamicduoli.com/logo.png",
      image: "https://www.dynamicduoli.com/og-image.png",
      telephone: "+1-516-826-1111",
      email: "dynamicduoli@therealtyadvisors.com",
      parentOrganization: { "@type": "Organization", name: "Realty Advisors" },
      address: {
        "@type": "PostalAddress",
        streetAddress: "3341 Park Avenue",
        addressLocality: "Wantagh",
        addressRegion: "NY",
        postalCode: "11793",
        addressCountry: "US",
      },
      areaServed: [
        { "@type": "AdministrativeArea", name: "Nassau County, NY" },
        { "@type": "AdministrativeArea", name: "Suffolk County, NY" },
      ],
      sameAs: ["https://instagram.com/dynamicduoli"],
      member: [
        { "@id": "https://www.dynamicduoli.com/#lucas" },
        { "@id": "https://www.dynamicduoli.com/#nick" },
        { "@id": "https://www.dynamicduoli.com/#jeff" },
      ],
    },
    {
      "@type": "Person", "@id": "https://www.dynamicduoli.com/#lucas",
      name: "Lucas Podstupka", jobTitle: "Licensed Real Estate Salesperson",
      telephone: "+1-631-310-7488", email: "lucas@therealtyadvisors.com",
      worksFor: { "@id": "https://www.dynamicduoli.com/#team" },
      sameAs: ["https://instagram.com/lucaspods", "https://www.zillow.com/profile/lucas6626"],
    },
    {
      "@type": "Person", "@id": "https://www.dynamicduoli.com/#nick",
      name: "Nick Barberio", jobTitle: "Licensed Associate Real Estate Broker",
      telephone: "+1-516-404-9544", email: "nickbarberio@therealtyadvisors.com",
      worksFor: { "@id": "https://www.dynamicduoli.com/#team" },
    },
    {
      "@type": "Person", "@id": "https://www.dynamicduoli.com/#jeff",
      name: "Jeff Memisha", jobTitle: "Licensed Associate Real Estate Broker · Licensed Loan Officer · NMLS #2042222",
      telephone: "+1-516-741-3375", email: "jeff@therealtyadvisors.com",
      worksFor: { "@id": "https://www.dynamicduoli.com/#team" },
    },
  ],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable}`}>
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(LD) }} />
        {children}
      </body>
    </html>
  );
}
