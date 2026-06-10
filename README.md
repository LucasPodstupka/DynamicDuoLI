# Dynamic Duo LI — Website

Next.js (App Router) site. The landing page lives at `/work-with-us`; the homepage
`/` currently redirects there. Add more pages later under `app/`.

## Local preview (optional)
```
npm install
npm run dev
```
Then open http://localhost:3000

## Lead emails (Web3Forms)
Open `app/work-with-us/page.js`, find `ACCESS_KEY`, and paste your Web3Forms key.
All three team emails are CC'd on every lead (see `TEAM_EMAILS`).

## Deploy (Vercel)
Push this folder to a new GitHub repo, then import it at vercel.com — no settings to change.
