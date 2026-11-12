import { SCRIPT } from "./home-markup";

// Same Web3Forms access key + team inboxes the homepage lead forms use (read from that script,
// so there is one place to change them). The access key is a public, form-only key by design.
const pick = (re) => (SCRIPT.match(re) || [])[1] || "";
export const WEB3FORMS_KEY = pick(/ACCESS_KEY:\s*"([^"]+)"/);
export const TEAM_EMAILS = (pick(/TEAM_EMAILS:\s*\[([^\]]*)\]/).match(/"[^"]+"/g) || []).map((s) => s.slice(1, -1));
