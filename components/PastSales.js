"use client";
import { useMemo, useState } from "react";

const money = (n) => (n == null ? "—" : "$" + n.toLocaleString("en-US"));
const fmtDate = (d) => new Date(d + "T12:00:00").toLocaleDateString("en-US", { month: "short", year: "numeric" });
const side = (s) => (s === "listing" ? "Our Listing" : s === "buyer" ? "Buyer Represented" : "Listing & Buyer");
const AGENTS = ["Lucas Podstupka", "Nick Barberio", "Jeff Memisha"];
const PAGE = 12;

export function SaleRow({ s }) {
  return (
    <li className="ps-row">
      <div className="ps-main">
        <b className="ps-price">{money(s.soldPrice)}</b>
        <span className="ps-addr">{s.address}</span>
        <span className="ps-town">{s.town}, NY</span>
      </div>
      <div className="ps-meta">
        <span>Sold {fmtDate(s.soldDate)}</span>
        {s.beds != null && <span>{s.beds} bd</span>}
        {s.baths != null && <span>{s.baths} ba</span>}
        <span className="ps-side">{side(s.side)}</span>
        {s.ourAgents.length > 0 && <span className="ps-agents">{s.ourAgents.map((a) => a.split(" ")[0]).join(" · ")}</span>}
      </div>
    </li>
  );
}

export default function PastSales({ sales, filters = true, initial = PAGE }) {
  const [agent, setAgent] = useState("all");
  const [year, setYear] = useState("all");
  const [n, setN] = useState(initial);
  const years = useMemo(() => [...new Set(sales.map((s) => s.soldDate.slice(0, 4)))].sort().reverse(), [sales]);
  const list = sales.filter((s) => (agent === "all" || s.ourAgents.includes(agent)) && (year === "all" || s.soldDate.startsWith(year)));
  const reset = (f) => (e) => { f(e.target.value); setN(initial); };
  return (
    <div className="ps">
      {filters && (
        <div className="ps-filters">
          <label>Agent<select value={agent} onChange={reset(setAgent)}><option value="all">Whole team</option>{AGENTS.map((a) => <option key={a} value={a}>{a}</option>)}</select></label>
          <label>Year<select value={year} onChange={reset(setYear)}><option value="all">All years</option>{years.map((y) => <option key={y}>{y}</option>)}</select></label>
          <span className="ps-count">{list.length} {list.length === 1 ? "sale" : "sales"}</span>
        </div>
      )}
      <ul className="ps-list">{list.slice(0, n).map((s) => <SaleRow key={s.mls} s={s} />)}</ul>
      {n < list.length && <button className="ps-more" onClick={() => setN(n + PAGE)}>Show more ({list.length - n} left)</button>}
    </div>
  );
}
