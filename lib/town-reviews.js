import data from "../data/reviews.json";

// Zillow agent reviews whose deal line names the town ("Bought a ... home in 2026 in Sayville, NY").
// Lender reviews only say where the reviewer is from, so they are not matched.
export function reviewsForTown(t) {
  const names = [t.name, ...t.match].map((n) => n.toLowerCase());
  const out = [];
  data.agents.forEach((a) => {
    if (a.role && a.role !== "Agent") return;
    a.reviews.forEach((r) => {
      const m = /\bin (?:\d{4} in )?([^.]+?), NY\b/i.exec(r.detail || "");
      if (!m) return;
      const parts = m[1].split(",").map((x) => x.trim().toLowerCase());
      if (parts.some((p) => names.includes(p))) out.push({ ...r, agent: a.name, profileUrl: a.profileUrl });
    });
  });
  return out;
}
