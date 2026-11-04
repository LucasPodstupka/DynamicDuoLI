// Build-time fair housing check: fails the build if site copy or (filtered) listing
// descriptions contain flagged wording. Rules live in lib/fair-housing.js.
import fs from "fs";
import path from "path";
import { FLAGGED, cleanDescription } from "../lib/fair-housing.js";

// Pages whose job is to explain the law (they must name protected classes, Section 8, etc.).
const ALLOW = new Set(["lib/fair-housing.js", "lib/compliance.js", "app/fair-housing/page.js", "scripts/fh-check.mjs"]);
const problems = [];
const check = (where, text) => {
  for (const re of FLAGGED) {
    const m = re.exec(text);
    if (m) problems.push(`${where}: "${text.slice(Math.max(0, m.index - 40), m.index + m[0].length + 30).replace(/\s+/g, " ")}"`);
  }
};
const walk = (dir) => fs.readdirSync(dir, { withFileTypes: true }).flatMap((d) => (d.isDirectory() ? walk(path.join(dir, d.name)) : [path.join(dir, d.name)]));

for (const f of [...walk("app"), ...walk("components"), ...walk("lib")].filter((f) => /\.(js|jsx|ts|tsx|md)$/.test(f))) {
  if (ALLOW.has(f)) continue;
  // Strip comments so notes to ourselves don't trip the check.
  const src = fs.readFileSync(f, "utf8").replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "");
  check(f, src);
}
for (const f of ["data/listings.json", "data/office-listings.json"]) {
  for (const l of JSON.parse(fs.readFileSync(f, "utf8")).listings) {
    const d = cleanDescription(l.mls, l.description);
    if (d) check(`${f} #${l.mls} (filtered description)`, d);
  }
}
if (problems.length) {
  console.error(`Fair housing check failed (${problems.length}):\n  ` + problems.join("\n  "));
  process.exit(1);
}
console.log("Fair housing check passed.");
