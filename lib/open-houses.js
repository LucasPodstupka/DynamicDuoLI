import data from "../data/open-houses.json";

const TZ = "America/New_York";
const parts = (d, o) => new Intl.DateTimeFormat("en-US", { timeZone: TZ, ...o }).formatToParts(d)
  .reduce((m, p) => ((m[p.type] = p.value), m), {});

// Entries still to come (or in progress), soonest first. Dropped once `end` passes.
export function upcomingOpenHouses(now = Date.now()) {
  return (data.openHouses || [])
    .filter((o) => new Date(o.end).getTime() > now)
    .sort((a, b) => new Date(a.start) - new Date(b.start));
}

const matches = (o, l) => (o.mls && String(o.mls) === String(l.mls)) || (o.slug && l.slug && o.slug === l.slug);
export const openHouseFor = (l, now) => upcomingOpenHouses(now).find((o) => matches(o, l)) || null;

function time(d) {
  const p = parts(d, { hour: "numeric", minute: "2-digit", hour12: true });
  return { t: p.minute === "00" ? p.hour : `${p.hour}:${p.minute}`, ap: p.dayPeriod.toUpperCase() };
}
// "Sat Nov 7, 12–2 PM" (or "11 AM–1 PM" across noon)
export function fmtOpenHouse(o) {
  const s = new Date(o.start), e = new Date(o.end);
  const d = parts(s, { weekday: "short", month: "short", day: "numeric" });
  const a = time(s), b = time(e);
  const range = a.ap === b.ap ? `${a.t}\u2013${b.t} ${b.ap}` : `${a.t} ${a.ap}\u2013${b.t} ${b.ap}`;
  return `${d.weekday} ${d.month} ${d.day}, ${range}`;
}
