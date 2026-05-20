---
description: Screen fund parties (investors, UBOs, signatories, vendors) against MASAK sanctions and PEP lists under TR Law 5549.
---

Run the `masak-watchlist` skill on the supplied party list.

For each party, the skill assembles an identity pack (name + identifier + UBO chain + country) and screens against:

- MASAK Liste A (UN consolidated)
- MASAK Liste B (TR-specific sanctioned persons)
- MASAK Liste C (frozen-assets list)
- PEP list (foreign always; domestic per firm policy)
- Adverse media (open-source financial-crime hits)

Output:

1. Hit list (sorted by risk band).
2. Adjudication queue (pending decisions with required evidence).
3. STR drafts (auto-prepared şüpheli işlem bildirimi for confirmed hits; compliance officer reviews before MASAK ONLINE submission).
4. Audit trail (every screen, every adjudication, signed and timestamped).

Hits are leads, not decisions. A MASAK-certified compliance officer adjudicates every hit before any onboarding or transaction-release action.
