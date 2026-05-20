---
name: bsmv-stopaj-calc
description: Skeleton — compute BSMV (Banka Sigorta Muameleleri Vergisi) and stopaj (withholding tax) obligations for fund distributions, management fees, and treasury transactions under TR Gelir Vergisi Kanunu and Gider Vergileri Kanunu. PLACEHOLDER for Faz 2 — full implementation pending TR tax counsel review.
---

# BSMV + Stopaj computation (TR) — SKELETON (Faz 2)

> **This skill is a placeholder.** The full computation engine requires sign-off from a SnP-engaged TR vergi danışmanı before it can compute production figures. Faz 1 ships the skeleton, the reference matrix, and the dispatching shell; Faz 2 wires the rates and the GİB-aligned ledger.

## Scope (Faz 2)

| Transaction class | Tax | Reference |
|---|---|---|
| Banka kredi faizi | BSMV %5 | Gider Vergileri Kanunu Art. 28 |
| Sigorta primi | BSMV %10 (life), %5 (non-life) | GVK Art. 28 |
| Mevduat faizi (gerçek kişi, TL) | Stopaj — vade bazlı oran | GVK Geçici 67 |
| Mevduat faizi (kurumsal) | Stopaj %0 (kurumlar vergisi mükellefi) | KVK |
| Dağıtılan kâr payı (yerli gerçek kişi) | Stopaj %10 | GVK Art. 94 |
| Dağıtılan kâr payı (yabancı yatırımcı) | ÇVÖA-bazlı (TR-DE %15, TR-NL %10 vb.) | ÇVÖA |
| Yönetim ücreti (fund manager) | KDV %20 + Stopaj if cross-border | GVK Art. 94 |
| Carried interest | Stopaj — sınıflandırma açık değil | Henüz tebliğ yok |

## Faz 1 output

For each transaction line, classify under the matrix above and emit:

- `tax_class` — one of `bsmv | stopaj | both | neither`
- `applicable_rule` — citation
- `requires_review` — `true` if the line hits any of: cross-border counterparty, carried interest, novel instrument, post-2024 tebliğ unclear
- `placeholder_amount` — null in Faz 1

No actual tax computation. The output is a routing manifest for the tax desk.

## Faz 2 plan

- Wire rates from `tr-compliance/bsmv-stopaj-rates.json` (versioned, dated, signed off by tax counsel).
- Add ÇVÖA (double-tax treaty) lookup by counterparty country.
- Cross-check against muhtasar beyanname (Form 1003B).
- Add carried interest carve-out once the relevant GİB tebliğ lands.

## Why this is a skeleton

TR vergi mevzuatı is one of the highest-velocity rate sets in fund admin: BSMV oranları, stopaj oranları, ÇVÖA hükümleri ve Geçici 67 uzatmaları her yıl en az bir kez değişir. Shipping a hard-coded rate table in Faz 1 would create a compliance landmine. The skeleton enforces routing to a human tax-desk in every case until the rate engine is signed off.
