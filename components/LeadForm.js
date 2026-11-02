"use client";
import { useEffect, useRef } from "react";
import { MARKUP, SCRIPT } from "../lib/home-markup";

// Reuses the homepage lead form (same fields, same Web3Forms submit) on other pages.
function formCard(intent, title, sub) {
  const formAt = MARKUP.indexOf(`<form class="lead-form" data-intent="${intent}"`);
  const card = MARKUP.lastIndexOf(`<div class="form-card">`, formAt);
  const end = MARKUP.indexOf("</form>", formAt) + "</form>".length;
  let html = MARKUP.slice(card, end) + "</div>";
  if (title) html = html.replace(/(<h3 class="form-title">)[\s\S]*?(<\/h3>)/, `$1${title}$2`);
  if (sub) html = html.replace(/(<p class="form-sub">)[\s\S]*?(<\/p>)/, `$1${sub}$2`);
  return html;
}

const SUBMIT = SCRIPT.slice(SCRIPT.indexOf("const WEB3FORMS"), SCRIPT.indexOf("// Prefill"));

export default function LeadForm({ intent = "buy", title, sub, notes }) {
  const ref = useRef(null);
  useEffect(() => {
    if (!window.__ddLeadForms) {
      window.__ddLeadForms = true;
      const s = document.createElement("script");
      s.textContent = `(function(){${SUBMIT}})();`;
      document.body.appendChild(s);
    }
    if (notes && ref.current) {
      const n = ref.current.querySelector("[name=notes]");
      if (n && !n.value) n.value = notes;
    }
  }, [notes]);
  return <div className="form-wrap" ref={ref} dangerouslySetInnerHTML={{ __html: formCard(intent, title, sub) }} />;
}
