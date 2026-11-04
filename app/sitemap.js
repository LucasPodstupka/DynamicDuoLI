import { allDeals, listingSlug } from "../lib/listings";
import { TOWNS, listingsForTown } from "../lib/towns";

export const revalidate = 86400;

// lastmod only where the data has a real date (a sale's close date); otherwise omitted.
const latest = (list) => list.map((l) => l.soldDate).filter(Boolean).sort().pop();
const lm = (d) => (d ? { lastModified: new Date(d + "T12:00:00Z") } : {});

export default function sitemap() {
  const base = "https://www.dynamicduoli.com";
  const deals = allDeals();
  const towns = TOWNS.map((t) => [t, listingsForTown(t).filter((l) => !l.nyc)]).filter(([, l]) => l.length);
  return [
    { url: `${base}/`, ...lm(latest(deals)), changeFrequency: "weekly", priority: 1 },
    { url: `${base}/listings`, ...lm(latest(deals)), changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/buy`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/sell`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/rent`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/towns`, changeFrequency: "monthly", priority: 0.7 },
    ...towns.map(([t, l]) => ({ url: `${base}/towns/${t.slug}`, ...lm(latest(l)), changeFrequency: "weekly", priority: 0.7 })),
    ...deals.map((l) => ({ url: `${base}/listings/${listingSlug(l)}`, ...lm(l.soldDate), changeFrequency: "weekly", priority: l.status === "Sold" ? 0.5 : 0.7 })),
    { url: `${base}/reviews`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/fair-housing`, changeFrequency: "yearly", priority: 0.4 },
    { url: `${base}/privacy`, changeFrequency: "yearly", priority: 0.2 },
  ];
}
