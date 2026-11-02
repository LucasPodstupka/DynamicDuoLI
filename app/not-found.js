export const metadata = { title: "Page not found — Dynamic Duo LI", robots: { index: false } };

export default function NotFound() {
  return (
    <main className="wrap" style={{ padding: "120px 28px", textAlign: "center" }}>
      <span className="eyebrow">404</span>
      <h1 style={{ fontFamily: "'Oswald',sans-serif", textTransform: "uppercase", fontSize: 44, marginTop: 12 }}>Page not found</h1>
      <p style={{ color: "var(--muted)", marginTop: 14 }}>That page doesn&rsquo;t exist. Head back home or browse our listings.</p>
      <p style={{ marginTop: 28, display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
        <a className="btn btn-gold" href="/">Home</a>
        <a className="btn btn-line" href="/listings">Listings</a>
      </p>
    </main>
  );
}
