---
description: Screen a fund administration document against KVKK 6698 — identify personal data, classify by sensitivity, and flag fields lacking lawful basis or cross-border safeguards.
---

Run the `kvkk-screen` skill on the attached document or document set.

The output is a four-section screening report:

1. Identified fields (every personal data field, with KVKK category).
2. Gaps (no lawful basis, special category without explicit consent, cross-border without safeguards).
3. VERBİS reconciliation (drift between processed fields and registered inventory).
4. Recommended actions (one-line remediation per gap).

The fund administrator is the veri sorumlusu (controller). The DPO must sign before any remediation action — this command produces a screening report only, not a remediation decision.
