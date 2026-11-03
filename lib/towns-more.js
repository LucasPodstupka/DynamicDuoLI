// Additional town pages. Facts come only from Wikipedia community articles
// (municipality, village/hamlet status) and the LIRR station list (station + branch).
// No prices, populations or market numbers. Copy is assembled from those facts.
// [name, county, municipality, kind, region, stations [[station, branch]], note?, extra match names?]
const RAW = [
  ["Freeport", "Nassau", "Town of Hempstead", "village", "South Shore", [["Freeport", "Babylon Branch"]], "It is the second-largest village in New York State by population."],
  ["Baldwin", "Nassau", "Town of Hempstead", "hamlet", "South Shore", [["Baldwin", "Babylon Branch"]]],
  ["Oceanside", "Nassau", "Town of Hempstead", "hamlet", "South Shore", [["Oceanside", "Long Beach Branch"]]],
  ["Rockville Centre", "Nassau", "Town of Hempstead", "village", "South Shore", [["Rockville Centre", "Babylon Branch"]]],
  ["Lynbrook", "Nassau", "Town of Hempstead", "village", "South Shore", [["Lynbrook", "Long Beach and Babylon Branches"]]],
  ["Valley Stream", "Nassau", "Town of Hempstead", "village", "South Shore", [["Valley Stream", "Far Rockaway Branch"]], "It sits along the Queens border."],
  ["Long Beach", "Nassau", null, "city", "South Shore", [["Long Beach", "Long Beach Branch"]], "It sits on the Long Beach Barrier Island, the westernmost of the outer barrier islands off the South Shore."],
  ["Island Park", "Nassau", "Town of Hempstead", "village", "South Shore", [["Island Park", "Long Beach Branch"]], "It sits between Oceanside to the north and Long Beach to the south."],
  ["East Rockaway", "Nassau", "Town of Hempstead", "village", "South Shore", [["East Rockaway", "Long Beach Branch"]]],
  ["Malverne", "Nassau", "Town of Hempstead", "village", "South Shore", [["Malverne", "West Hempstead Branch"]]],
  ["Woodmere", "Nassau", "Town of Hempstead", "hamlet", "South Shore", [["Woodmere", "Far Rockaway Branch"]]],
  ["Hewlett", "Nassau", "Town of Hempstead", "hamlet", "South Shore", [["Hewlett", "Far Rockaway Branch"]]],
  ["Levittown", "Nassau", "Town of Hempstead", "hamlet", "Central Nassau", [], "It sits roughly halfway between the villages of Hempstead and Farmingdale."],
  ["East Meadow", "Nassau", "Town of Hempstead", "hamlet", "Central Nassau", []],
  ["Uniondale", "Nassau", "Town of Hempstead", "hamlet", "Central Nassau", []],
  ["Franklin Square", "Nassau", "Town of Hempstead", "hamlet", "Western Nassau", []],
  ["Elmont", "Nassau", "Town of Hempstead", "hamlet", "Western Nassau", [["Elmont–UBS Arena", "Hempstead Branch"]], "It sits along the Queens border."],
  ["Garden City", "Nassau", "Towns of Hempstead and North Hempstead", "village", "Central Nassau", [["Garden City", "Hempstead Branch"], ["Nassau Boulevard", "Hempstead Branch"]]],
  ["Floral Park", "Nassau", "Towns of Hempstead and North Hempstead", "village", "Western Nassau", [["Floral Park", "Hempstead Branch and Main Line"]]],
  ["Mineola", "Nassau", "Towns of North Hempstead and Hempstead", "village", "Central Nassau", [["Mineola", "Main Line"]], "It is the county seat of Nassau County."],
  ["Westbury", "Nassau", "Town of North Hempstead", "village", "Central Nassau", [["Westbury", "Main Line"]]],
  ["Bethpage", "Nassau", "Town of Oyster Bay", "hamlet", "Central Nassau", [["Bethpage", "Main Line"]]],
  ["Farmingdale", "Nassau", "Town of Oyster Bay", "village", "Central Nassau", [["Farmingdale", "Main Line"]]],
  ["Plainview", "Nassau", "Town of Oyster Bay", "hamlet", "Central Nassau", [], "Plainview shares its school system with neighboring Old Bethpage.", ["Old Bethpage"]],
  ["Hicksville", "Nassau", "Town of Oyster Bay", "hamlet", "Central Nassau", [["Hicksville", "Main Line and Port Jefferson Branch"]]],
  ["Syosset", "Nassau", "Town of Oyster Bay", "hamlet", "North Shore", [["Syosset", "Port Jefferson Branch"]]],
  ["Glen Cove", "Nassau", null, "city", "North Shore", [["Glen Cove", "Oyster Bay Branch"], ["Glen Street", "Oyster Bay Branch"]]],
  ["Port Washington", "Nassau", null, "hamlet", "North Shore", [["Port Washington", "Port Washington Branch"]], "It sits on the Cow Neck Peninsula."],
  ["Manhasset", "Nassau", "Town of North Hempstead", "hamlet", "North Shore", [["Manhasset", "Port Washington Branch"]]],
  ["Great Neck", "Nassau", "Town of North Hempstead", "peninsula", "North Shore", [["Great Neck", "Port Washington Branch"]], "The Great Neck peninsula includes nine incorporated villages."],
  ["Copiague", "Suffolk", "Town of Babylon", "hamlet", "South Shore", [["Copiague", "Babylon Branch"]]],
  ["Amityville", "Suffolk", "Town of Babylon", "village", "South Shore", [["Amityville", "Babylon Branch"]]],
  ["Deer Park", "Suffolk", "Town of Babylon", "hamlet", "Western Suffolk", [["Deer Park", "Main Line"]]],
  ["West Islip", "Suffolk", "Town of Islip", "hamlet", "South Shore", []],
  ["Bay Shore", "Suffolk", "Town of Islip", "hamlet", "South Shore", [["Bay Shore", "Montauk Branch"]], "It sits on the Great South Bay."],
  ["Brightwaters", "Suffolk", "Town of Islip", "village", "South Shore", []],
  ["Islip", "Suffolk", "Town of Islip", "hamlet", "South Shore", [["Islip", "Montauk Branch"]]],
  ["Islip Terrace", "Suffolk", "Town of Islip", "hamlet", "South Shore", []],
  ["East Islip", "Suffolk", "Town of Islip", "hamlet", "South Shore", []],
  ["Oakdale", "Suffolk", "Town of Islip", "hamlet", "South Shore", [["Oakdale", "Montauk Branch"]]],
  ["West Sayville", "Suffolk", null, "hamlet", "South Shore", []],
  ["Sayville", "Suffolk", "Town of Islip", "hamlet", "South Shore", [["Sayville", "Montauk Branch"]]],
  ["Bohemia", "Suffolk", "Town of Islip", "hamlet", "South Shore", []],
  ["Ronkonkoma", "Suffolk", "Town of Islip", "hamlet", "Central Suffolk", [["Ronkonkoma", "Main Line"]]],
  ["Holbrook", "Suffolk", "Towns of Brookhaven and Islip", "hamlet", "Central Suffolk", [], "It borders the eastern side of Long Island MacArthur Airport."],
  ["Patchogue", "Suffolk", "Town of Brookhaven", "village", "South Shore", [["Patchogue", "Montauk Branch"]]],
  ["Medford", "Suffolk", "Town of Brookhaven", "hamlet", "Central Suffolk", [["Medford", "Main Line"]]],
  ["Bellport", "Suffolk", "Town of Brookhaven", "village", "South Shore", [["Bellport", "Montauk Branch"]]],
  ["Shirley", "Suffolk", "Town of Brookhaven", "hamlet", "South Shore", [["Mastic–Shirley", "Montauk Branch"]]],
  ["Mastic", "Suffolk", "Town of Brookhaven", "hamlet", "South Shore", []],
  ["Mastic Beach", "Suffolk", "Town of Brookhaven", "hamlet", "South Shore", [], "It is a former incorporated village."],
  ["Center Moriches", "Suffolk", "Town of Brookhaven", "hamlet", "South Shore", []],
  ["East Moriches", "Suffolk", "Town of Brookhaven", "hamlet", "South Shore", []],
  ["Ridge", "Suffolk", "Town of Brookhaven", "hamlet", "Central Suffolk", []],
  ["Centereach", "Suffolk", "Town of Brookhaven", "hamlet", "Central Suffolk", []],
  ["Selden", "Suffolk", "Town of Brookhaven", "hamlet", "Central Suffolk", []],
  ["Lake Grove", "Suffolk", "Town of Brookhaven", "village", "Central Suffolk", []],
  ["Stony Brook", "Suffolk", "Town of Brookhaven", "hamlet", "North Shore", [["Stony Brook", "Port Jefferson Branch"]]],
  ["Setauket", "Suffolk", "Town of Brookhaven", "hamlet", "North Shore", [], "Founded in 1655, it was the first settlement in what became the Town of Brookhaven.", ["East Setauket"]],
  ["Port Jefferson", "Suffolk", "Town of Brookhaven", "village", "North Shore", [], "The Port Jefferson LIRR station, the end of the Port Jefferson Branch, is named for the village and sits in neighboring Port Jefferson Station."],
  ["Port Jefferson Station", "Suffolk", "Town of Brookhaven", "hamlet", "North Shore", [["Port Jefferson", "Port Jefferson Branch"]]],
  ["Miller Place", "Suffolk", "Town of Brookhaven", "hamlet", "North Shore", []],
  ["Rocky Point", "Suffolk", "Town of Brookhaven", "hamlet", "North Shore", []],
  ["Smithtown", "Suffolk", "Town of Smithtown", "town", "North Shore", [["Smithtown", "Port Jefferson Branch"]]],
  ["St. James", "Suffolk", "Town of Smithtown", "hamlet", "North Shore", [["St. James", "Port Jefferson Branch"]]],
  ["Kings Park", "Suffolk", "Town of Smithtown", "hamlet", "North Shore", [["Kings Park", "Port Jefferson Branch"]]],
  ["Nesconset", "Suffolk", "Town of Smithtown", "hamlet", "North Shore", []],
  ["Commack", "Suffolk", "Towns of Huntington and Smithtown", "hamlet", "Western Suffolk", []],
  ["Hauppauge", "Suffolk", "Towns of Islip and Smithtown", "hamlet", "Western Suffolk", [], "Many Suffolk County government offices are located here."],
  ["Huntington", "Suffolk", "Town of Huntington", "town", "North Shore", [["Huntington", "Port Jefferson Branch"]], "The Town of Huntington was founded in 1653."],
  ["Huntington Station", "Suffolk", "Town of Huntington", "hamlet", "North Shore", []],
  ["Northport", "Suffolk", "Town of Huntington", "village", "North Shore", [["Northport", "Port Jefferson Branch"]], "It was known as Great Cow Harbour before being renamed Northport in 1837."],
  ["East Northport", "Suffolk", "Town of Huntington", "hamlet", "North Shore", []],
  ["Melville", "Suffolk", "Town of Huntington", "hamlet", "Western Suffolk", []],
  ["Dix Hills", "Suffolk", "Town of Huntington", "hamlet", "Western Suffolk", []],
  ["Riverhead", "Suffolk", "Town of Riverhead", "town", "North Fork", [["Riverhead", "Main Line"]], "It sits at the mouth of the Peconic River, which gives it its name."],
];

const slug = (s) => s.toLowerCase().replace(/\./g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const article = (k) => (/^[aeiou]/.test(k) ? "an" : "a");

function describe([name, county, muni, kind, region, stations, note]) {
  const where = muni ? `in the ${muni}, ${county} County` : `in ${county} County`;
  const what =
    kind === "town" ? `${name} is a town in ${county} County, on Long Island's ${region}` :
    kind === "city" ? `${name} is one of the two cities in ${county} County` :
    kind === "peninsula" ? `Great Neck is a peninsula on the North Shore ${where}` :
    `${name} is ${kind === "village" ? "an incorporated village" : "a hamlet"} ${where}, on Long Island's ${region}`;
  const p1 = [what + ".", note].filter(Boolean).join(" ");
  const rail = stations.length
    ? `On the LIRR it is served by ${stations.map(([s, b]) => `the ${s} station on the ${b}`).join(" and ")}.`
    : `There is no LIRR station in ${name} itself, so we map out the nearest stations and drive times for buyers who commute.`;
  const p2 = `${rail} ${kind === "village" || kind === "city" ? `As ${article(kind)} ${kind}, ${name} has its own ${kind} government, which shapes taxes and services, and we lay those out for buyers before they make an offer.` : `${kind === "town" ? "Taxes and services vary by hamlet and village within the town" : `As an unincorporated hamlet, its local services run through the ${muni || "surrounding town"}`}, and we walk buyers through what that means for a given home.`}`;
  const p3 = `Whether you are buying or selling in ${name}, we price from recent closed sales on your street and the blocks around it, not from a countywide average.`;
  return [p1, p2, p3];
}

export const MORE_TOWNS = RAW.map((r) => ({
  slug: slug(r[0]),
  name: r[0],
  county: r[1],
  region: r[4],
  match: [r[0], ...(r[7] || [])],
  blurb: `${r[3] === "village" ? "Village" : r[3] === "city" ? "City" : r[3] === "town" ? "Town" : r[3] === "peninsula" ? "Peninsula" : "Hamlet"} in ${r[2] ? "the " + r[2] : r[1] + " County"}${r[5].length ? ` · LIRR ${r[5][0][1].replace(/ and .*/, "")}` : ""}.`,
  copy: describe(r),
}));
