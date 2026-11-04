// Fair housing wording rules, shared by the listing description filter and scripts/fh-check.mjs.
// Words/phrases that describe who a home or area suits, judge schools, or set
// buyer/renter qualifications. Sentences containing them are dropped from MLS descriptions on this site.
export const FLAGGED = [
  /\bperfect for (first[- ]time|young|famil|downsiz|retir|couples?|singles?|commuters?|empty)/i,
  /\bideal for (first[- ]time|young|famil|downsiz|retir|couples?|singles?)/i,
  /\b(great|top[- ]rated|best|blue ribbon|award[- ]winning|excellent) schools?\b/i,
  /\bblue ribbon\b/i,
  /\bfamily[- ](friendly|neighborhood|oriented)\b/i,
  /\bfamily gatherings\b/i,
  /\b(friends (and|&) family|family (and|&) friends)\b/i,
  /\bextended family\b/i,
  /\byoung (famil(y|ies)|couples?|professionals?)\b/i,
  /\b(empty[- ]nesters?|retirees|bachelors?|singles)\b/i,
  /\b(55|62)\+/,
  /\bmust be (55|62)\b/i,
  /\b(adult|senior) community\b/i,
  /\bno pets\b/i,
  /\bcredit score\b/i,
  /\bincome of at least\b/i,
  /\bsection 8\b/i,
  /\b(exclusive|prestigious|affluent)\b/i,
  /\b(safe|crime[- ]free|low[- ]crime)\b/i,
  /\b(church|synagogue|temple|mosque)\b/i,
  /\btenants who (actually )?pay\b/i,
];

// Descriptions hidden entirely on the site (source data unchanged).
export const HIDDEN_DESCRIPTIONS = new Set(["815799"]); // 37 Hubbard Ave Unit #85

export const isFlagged = (text) => FLAGGED.some((re) => re.test(text));

export function cleanDescription(mls, text) {
  if (!text || HIDDEN_DESCRIPTIONS.has(String(mls))) return null;
  if (!isFlagged(text)) return text;
  // Split into sentence-ish pieces, keeping each piece's trailing separator.
  const pieces = text.match(/(?:[^.!?…*]|\.(?=\d))+(?:[.!?…*]+|$)\s*/g) || [text];
  const out = pieces.filter((p) => !isFlagged(p)).join("").replace(/\s{2,}/g, " ").trim();
  return out.length >= 40 ? out : null;
}
