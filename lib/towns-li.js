// Every Nassau and Suffolk community (cities, towns, villages, hamlets/CDPs) from the
// "Communities" lists on Wikipedia's Nassau County and Suffolk County articles.
// Each entry's kind and Town come from that community's own Wikipedia intro (link in `source`);
// LIRR station names/branches from Wikipedia's list of LIRR stations. No other claims.
import RAW from "../data/towns-li.json";

const TOWN_COUNT = { Nassau: 3, Suffolk: 10 };
const list = (a) => (a.length > 1 ? a.slice(0, -1).join(", ") + " and " + a[a.length - 1] : a[0]);

function describe(r) {
  const towns = r.towns.length ? `the ${r.towns.length > 1 ? "Towns" : "Town"} of ${list(r.towns)}, ` : "";
  let p1;
  if (r.kind === "town") p1 = `The ${r.name} is one of the ${TOWN_COUNT[r.county]} towns that make up ${r.county} County on Long Island.`;
  else if (r.kind === "city") p1 = `${r.name} is a city in ${r.county} County on Long Island.`;
  else if (r.kind === "village") p1 = `${r.name} is an incorporated village in ${towns}${r.county} County, on Long Island.`;
  else if (r.kind === "hamlet") p1 = `${r.name} is a hamlet in ${towns}${r.county} County, on Long Island.`;
  else p1 = `${r.name} is a community in ${towns}${r.county} County, on Long Island.`;
  const p2 = r.stations.length
    ? `The LIRR has a station named ${r.stations[0][0]} on the ${list([...new Set(r.stations.map((s) => s[1]))])}.`
    : `None of the LIRR's stations carries the ${r.place} name, so if you commute we'll map out the closest stations for the homes you're looking at.`;
  const p3 = `Thinking about buying or selling in ${r.place}? We'll pull the recent closed sales there and walk you through what they mean for your home or your offer.`;
  return [p1, p2, p3];
}

// Communities in each Town (from each community's own intro), for the "Town of X" hub pages.
const MEMBERS = {};
RAW.forEach((r) => { if (r.kind !== "town") r.towns.forEach((tn) => (MEMBERS[tn] = MEMBERS[tn] || []).push(r.place)); });

export const LI_TOWNS = RAW.map((r) => ({
  slug: r.slug,
  name: r.name,
  county: r.county,
  region: r.kind === "town" ? "Towns" : r.towns[0] ? `Town of ${r.towns[0]}` : `${r.county} County`,
  match: r.kind === "town" ? MEMBERS[r.place] || [] : [r.place],
  hub: r.kind === "town" ? r.place : null,
  blurb: `${r.kind[0].toUpperCase() + r.kind.slice(1)} in ${r.towns.length && r.kind !== "town" ? "the Town of " + r.towns.join(" / ") : r.county + " County"}.`,
  copy: describe(r),
  source: r.source,
  generated: true,
}));
