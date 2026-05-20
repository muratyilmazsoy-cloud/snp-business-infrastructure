---
description: Reconcile a period's invoices against the draft KDV beyannamesi — birebir eşleşme, sıfır tolerans. Run before the 26th of the month.
---

Run the `kdv-recon` skill on the period's invoice register and the draft KDV-1 beyannamesi.

Hard rules (locked by §10.1 of the SnP charter):

- Birebir eşleşme zorunlu. No "yaklaşık", no "≈", no "≤1 ₺ rounding allowance".
- Tolerance is `0.00`. Not `0.01`. Zero.
- The verdict is binary: `HAZIR — 0 uyumsuzluk` or `HAZIR DEĞIL — N uyumsuzluk, M ₺ delta`.

The output is:

1. Per-bucket and per-invoice reconciliation table (register value vs. beyanname value, delta, classification).
2. Readiness verdict.

If `HAZIR DEĞIL`: do not file. Route to muhasebe with the table. Maliye 1 kuruş için iade reddeder — the system enforces what the auditor would.

Follow-on: any line with a BSMV / stopaj implication is routed to `bsmv-stopaj-calc` (Faz 2 — currently a skeleton; routes to the tax desk).
