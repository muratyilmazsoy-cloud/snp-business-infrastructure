---
description: Run GL ↔ subledger reconciliation for a date or period, classify breaks, and produce a sign-off package for the controller.
---

Run the `gl-recon` skill on the supplied GL and subledger extracts.

Inputs expected:

- `gl_extract` — general ledger lines for the scope.
- `subledger_extract` — subledger lines for the same scope (custodian, position keeper, or transactional system).
- `scope` — entity, asset class, trade date or period.
- `tolerance` — default `0.01` on amounts, `0` on quantity.

The skill produces:

1. A break report (one row per break, sorted by absolute base-amount delta).
2. A summary (counts and totals by bucket and likely cause, plus matched percentage).

Material breaks are routed to `break-trace` automatically; the summary goes to the resolver for sign-off formatting. Do not post any adjustment — outputs are evidence for human action.
