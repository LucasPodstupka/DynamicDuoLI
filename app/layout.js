import "./globals.css";

export const metadata = {
  metadataBase: new URL("https://dynamicduoli.com"),
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
    url: "https://dynamicduoli.com",
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

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Oswald:wght@500;600;700&family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
