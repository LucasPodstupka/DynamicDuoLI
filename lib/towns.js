import { allDeals } from "./listings";
import { MORE_TOWNS } from "./towns-more";
import { LI_TOWNS } from "./towns-li";

// Town pages. Copy is general and descriptive; no market statistics.
// Every number shown on these pages is computed from data/listings.json.
const CORE_TOWNS = [
  {
    slug: "wantagh",
    name: "Wantagh",
    county: "Nassau",
    region: "South Shore",
    match: ["Wantagh", "North Wantagh"],
    blurb: "Our home base on the South Shore, with Jones Beach a short drive down the Wantagh Parkway.",
    copy: [
      "Wantagh is where our office sits, at 3341 Park Avenue, so it is the town we know street by street. It is a South Shore hamlet in the Town of Hempstead, with the Wantagh LIRR station on the Babylon Branch and the Wantagh State Parkway running south to Jones Beach.",
      "Homes range from capes and high ranches on quiet blocks north of Sunrise Highway to waterfront properties on the canals south of Merrick Road. Buyers here tend to weigh school district, flood zone and commute together, and we walk through each of those on every home we show.",
      "If you are selling in Wantagh, we price from recent closed sales on your block and the ones around it, not from a citywide average.",
    ],
  },
  {
    slug: "massapequa",
    name: "Massapequa",
    county: "Nassau",
    region: "South Shore",
    match: ["Massapequa", "Massapequa Park", "North Massapequa", "East Massapequa"],
    blurb: "Waterfront sections like Nassau Shores, the Massapequa Preserve, and two LIRR stations.",
    copy: [
      "Massapequa covers the southeastern corner of Nassau County in the Town of Oyster Bay, along with the Village of Massapequa Park. It has two stops on the LIRR Babylon Branch, Massapequa and Massapequa Park, and the Massapequa Preserve runs north to south through the middle of town.",
      "South of Merrick Road, neighborhoods like Nassau Shores and Harbor Green sit on canals and the Great South Bay, so bulkheads, elevation and flood insurance come up on almost every showing. North of Sunrise Highway the blocks are more inland and the conversation turns to lot size and updates.",
      "We list and sell homes across all of Massapequa, and you can see the ones we have handled below.",
    ],
  },
  {
    slug: "seaford",
    name: "Seaford",
    county: "Nassau",
    region: "South Shore",
    match: ["Seaford"],
    blurb: "A quieter South Shore hamlet between Wantagh and Massapequa, with its own LIRR stop.",
    copy: [
      "Seaford sits between Wantagh and Massapequa in the Town of Hempstead, with the Seaford LIRR station on the Babylon Branch and the Seaford-Oyster Bay Expressway running along its eastern side.",
      "It is a mix of inland streets and canal-front homes south of Merrick Road. Because it is right next door to our Wantagh office, many of our clients compare Seaford with Wantagh and Massapequa in the same search, and we can show all three side by side.",
    ],
  },
  {
    slug: "bellmore-merrick",
    name: "Bellmore-Merrick",
    county: "Nassau",
    region: "South Shore",
    match: ["Bellmore", "North Bellmore", "Merrick", "North Merrick"],
    blurb: "Two neighboring hamlets that share a high school district and the LIRR Babylon Branch.",
    copy: [
      "Bellmore and Merrick are neighboring South Shore hamlets in the Town of Hempstead, just west of Wantagh. They share the Bellmore-Merrick Central High School District, and each has its own station on the LIRR Babylon Branch.",
      "Like the rest of the South Shore, the area runs from inland neighborhoods north of Sunrise Highway down to waterfront homes on the canals by the bay. We cover Bellmore, North Bellmore, Merrick and North Merrick, and we group them here because so many buyers search them together.",
    ],
  },
  {
    slug: "lindenhurst",
    name: "Lindenhurst",
    county: "Suffolk",
    region: "South Shore",
    match: ["Lindenhurst"],
    blurb: "A Suffolk County village on the Great South Bay with canals, a walkable downtown and LIRR service.",
    copy: [
      "Lindenhurst is an incorporated village in the Town of Babylon, in Suffolk County, on the Great South Bay. It has a station on the LIRR Babylon Branch and a downtown along Wellwood Avenue.",
      "South of Montauk Highway, many streets back onto canals with water access to the bay, while the northern part of the village is more inland. Village taxes and services are part of the math here, and we break them down for buyers before they make an offer.",
    ],
  },
  {
    slug: "babylon",
    name: "Babylon",
    county: "Suffolk",
    region: "South Shore",
    match: ["Babylon", "West Babylon", "North Babylon"],
    blurb: "The Village of Babylon and its neighbors, at the end of the LIRR Babylon Branch.",
    copy: [
      "Babylon covers the Village of Babylon plus West Babylon and North Babylon, all in the Town of Babylon in Suffolk County. The Babylon LIRR station is the end of the Babylon Branch, with transfers to the Montauk Branch.",
      "The village has a walkable downtown along Main Street and Deer Park Avenue and sits on the Great South Bay, while West and North Babylon offer more inland blocks and a wider range of home styles.",
    ],
  },
];

const CURATED = [...CORE_TOWNS, ...MORE_TOWNS];
const taken = new Set(CURATED.map((t) => t.slug));
export const TOWNS = [...CURATED, ...LI_TOWNS.filter((t) => !taken.has(t.slug))]
  .sort((a, b) => a.name.replace(/^Town of /, "").localeCompare(b.name.replace(/^Town of /, "")));

export const findTown = (slug) => TOWNS.find((t) => t.slug === slug);

export const townForListing = (l) => TOWNS.find((t) => t.name === l.town) || TOWNS.find((t) => t.match.includes(l.town));

const order = { Active: 0, Pending: 1, Sold: 2 };
export function listingsForTown(t) {
  return allDeals()
    .filter((l) => t.match.includes(l.town) || l.town === t.name)
    .sort((a, b) => order[a.status] - order[b.status] || String(b.soldDate || "").localeCompare(String(a.soldDate || "")));
}

export function townStats(list) {
  const sold = list.filter((l) => l.status === "Sold");
  return {
    total: list.length,
    active: list.filter((l) => l.status === "Active").length,
    pending: list.filter((l) => l.status === "Pending").length,
    sold: sold.length,
    soldVolume: sold.reduce((s, l) => s + (l.soldPrice || 0), 0),
    since: sold.length ? Math.min(...sold.map((l) => +l.soldDate.slice(0, 4))) : null,
  };
}
