"use client";
import { useState } from "react";

// Private feedback after an appointment. Sent to the team inboxes through the same Web3Forms
// path as the site's lead forms. Never shown on the site.
const APPTS = ["Listing appointment", "CMA", "Buyer consultation"];
const WORDS = ["", "Poor", "Fair", "Good", "Great", "Excellent"];

export default function ClientFeedback({ accessKey, teamEmails = [] }) {
  const [rating, setRating] = useState(0);
  const [state, setState] = useState({ kind: "", msg: "" });
  const [busy, setBusy] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    const comments = (data.comments || "").trim();
    if (!rating && !comments) return setState({ kind: "err", msg: "Pick a star rating or leave a comment." });
    if (data.email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(data.email)) return setState({ kind: "err", msg: "That email doesn't look right (it's optional)." });
    const done = () => { form.reset(); setRating(0); setState({ kind: "ok", msg: "Thank you. Your note went straight to Lucas, Nick and Jeff." }); };
    if (data.botcheck || data.website) return done(); // honeypot: bots fill hidden fields
    setBusy(true);
    setState({ kind: "", msg: "" });
    const lines = [
      `Rating: ${rating ? `${rating}/5 (${WORDS[rating]})` : "No rating"}`,
      `Appointment: ${data.appointment || "Not given"}`,
      `Name: ${(data.name || "").trim() || "Anonymous"}`,
      `Email: ${(data.email || "").trim() || "Not given"}`,
      "",
      `Comments / questions:\n${comments || "(none)"}`,
    ].join("\n");
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: accessKey,
          subject: `Private Client Feedback${rating ? ` (${rating}/5)` : ""} — DynamicDuoLI`,
          from_name: "DynamicDuoLI Website",
          cc: teamEmails.join(","),
          replyto: (data.email || "").trim(),
          botcheck: false,
          "Lead Type": "Private Client Feedback",
          Rating: rating ? `${rating}/5` : "No rating",
          Appointment: data.appointment || "",
          Name: (data.name || "").trim() || "Anonymous",
          message: `Private feedback from the client welcome page:\n\n${lines}`,
        }),
      });
      const out = await res.json();
      if (!out.success) throw new Error(out.message || "Submit failed");
      done();
    } catch (err) {
      setState({ kind: "err", msg: "Something went wrong. Please call or text us directly." });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="form-card wl-form">
      <div className="form-card-head">
        <h3 className="form-title">How did we do?</h3>
        <p className="form-sub wl-form-sub">This goes privately to our team, never on the website. Your name is optional.</p>
      </div>
      <form className="lead-form" onSubmit={onSubmit} noValidate>
        <fieldset className="field field-full wl-stars-field">
          <legend className="field-label">Your rating</legend>
          <div className="wl-stars" role="radiogroup" aria-label="Rating out of 5 stars">
            {[1, 2, 3, 4, 5].map((n) => (
              <label key={n} className={`wl-star${n <= rating ? " on" : ""}`}>
                <input type="radio" name="rating" value={n} checked={rating === n} onChange={() => setRating(n)} aria-label={`${n} star${n > 1 ? "s" : ""}`} />
                <span aria-hidden="true">&#9733;</span>
              </label>
            ))}
            <span className="wl-star-word" aria-live="polite">{rating ? `${rating}/5 · ${WORDS[rating]}` : "Tap a star"}</span>
          </div>
        </fieldset>
        <div className="fields">
          <fieldset className="field field-full">
            <legend className="field-label">Which appointment? <span className="wl-opt">(optional)</span></legend>
            <div className="radios">
              {APPTS.map((a) => (
                <label className="radio" key={a}><input type="radio" name="appointment" value={a} /><span>{a}</span></label>
              ))}
            </div>
          </fieldset>
          <div className="field field-full">
            <label className="field-label" htmlFor="wl-comments">Questions or comments</label>
            <textarea id="wl-comments" className="ctrl" name="comments" rows="4" placeholder="Anything we could do better, or anything you'd like us to follow up on." />
          </div>
          <div className="field">
            <label className="field-label" htmlFor="wl-name">Name <span className="wl-opt">(optional)</span></label>
            <input id="wl-name" className="ctrl" type="text" name="name" autoComplete="name" />
          </div>
          <div className="field">
            <label className="field-label" htmlFor="wl-email">Email <span className="wl-opt">(optional, if you want a reply)</span></label>
            <input id="wl-email" className="ctrl" type="email" name="email" autoComplete="email" />
          </div>
          <div className="wl-hp" aria-hidden="true">
            <label>Leave this empty<input type="checkbox" name="botcheck" tabIndex={-1} autoComplete="off" /></label>
            <label>Website<input type="text" name="website" tabIndex={-1} autoComplete="off" /></label>
          </div>
        </div>
        <button className="submit" type="submit" disabled={busy}>{busy ? "Sending…" : <>Send to the team <span className="arr">&rarr;</span></>}</button>
        <p className="micro">Sent privately to Lucas, Nick and Jeff. <a className="privacy-link" href="/privacy">Privacy policy</a></p>
        <p className={`form-status ${state.kind}`} aria-live="polite">{state.msg}</p>
      </form>
    </div>
  );
}
