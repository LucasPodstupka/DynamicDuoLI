import { publicListings, listingSlug } from "../lib/listings";
import { TOWNS } from "../lib/towns";

export const revalidate = 86400;

export default function sitemap() {
  const base = "https://www.dynamicduoli.com";
  const now = new Date();
  return [
    { url: `${base}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/listings`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/buy`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/sell`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/rent`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/towns`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    ...TOWNS.map((t) => ({ url: `${base}/towns/${t.slug}`, lastModified: now, changeFrequency: "weekly", priority: 0.7 })),
    ...publicListings().map((l) => ({ url: `${base}/listings/${listingSlug(l)}`, lastModified: now, changeFrequency: "weekly", priority: l.status === "Sold" ? 0.5 : 0.7 })),
    { url: `${base}/reviews`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/privacy`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
  ];
}
