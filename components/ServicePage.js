import { SiteHeader, SiteFooter } from "./SiteChrome";
import LeadForm from "./LeadForm";
import { TOWNS, listingsForTown } from "../lib/towns";

export default function ServicePage({ path, eyebrow, title, lead, stats, steps, prose, forms, extra }) {
  return (
    <>
      <SiteHeader current={path} />
      <main className="sp" id="main">
        <section className="sp-hero wrap">
          <span className="eyebrow">{eyebrow}</span>
          <h1 className="sp-title">{title}</h1>
          <p className="sp-lead">{lead}</p>
          {stats && stats.length > 0 && (
            <div className="sp-stats">{stats.map(([v, k]) => <div className="sp-stat" key={k}><b>{v}</b><span>{k}</span></div>)}</div>
          )}
        </section>
        <section className="sp-section wrap">
          <h2 className="sp-h2">How we work</h2>
          <ol className="sp-steps">{steps.map(([b, s], i) => <li key={b} style={{ "--i": i }}><b>{b}</b><span>{s}</span></li>)}</ol>
        </section>
        <section className="sp-section wrap sp-prose">{prose.map((p, i) => <p key={i}>{p}</p>)}</section>
        {extra}
        {forms.map((f) => (
          <section className="sp-section wrap" id={f.id} key={f.id}>
            <h2 className="sp-h2">{f.heading}</h2>
            <LeadForm intent={f.intent} />
          </section>
        ))}
        <section className="sp-section wrap">
          <h2 className="sp-h2">Towns we cover</h2>
          <div className="sp-towns-inline">{TOWNS.filter((t) => listingsForTown(t).length).map((t) => <a key={t.slug} href={`/towns/${t.slug}`}>{t.name}</a>)}<a href="/towns">All Long Island towns &rarr;</a></div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
