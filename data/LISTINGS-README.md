# data/listings.json

`listings` holds every deal row (same fields as the OneKey MLS export mapping).
Public listing/town pages only show sold deals from the last 12 months (`inWindow` in `lib/listings.js`).

Multi-year history (8 years for Lucas, Nick and Jeff) will be appended later from MLS exports:
- Add older sold rows to `listings` with `status: "Sold"`, `soldDate` (YYYY-MM-DD), `soldPrice`, `side`, `ourAgents`.
- They will not appear on the 12-month pages; `dealHistory()` returns all publishable rows for future history/stats views.
- Rentals and blocked addresses are still filtered by `isPublishable`.
