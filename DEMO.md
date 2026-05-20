# Reviewer Demo — snp-business-infrastructure

> **Audience:** Anthropic plugin marketplace reviewer.
> **Goal:** Verify the plugin loads, the six upstream skills are intact, and the four TR-mevzuat skills behave as specified.
> **Time:** ~10 minutes end-to-end.

## Prerequisites

1. Claude Code (any current build that supports plugin marketplace partner-built submissions).
2. This repo cloned locally:
   ```
   git clone https://github.com/muratyilmazsoy-cloud/snp-business-infrastructure.git
   cd snp-business-infrastructure
   ```
3. The plugin loaded into Claude Code (point your local marketplace to the cloned path).

No API keys are required to exercise the demos below — the skills are documentation + protocol; they describe behaviour, not embed live tokens.

## Demo 1 — Upstream NAV tie-out (sanity check the carry-forward)

**Goal:** confirm the six upstream skills work unchanged.

**Prompt:**
```
/nav-tieout

LP statement (Q1 2026, fund "SnP Demo Fund I LP"):
  Beginning capital account:  $1,000,000.00
  Contributions:                  $50,000.00
  Distributions:                 ($25,000.00)
  Allocated income:              $112,500.00
  Carry:                         ($16,875.00)
  Ending capital account:      $1,120,625.00

NAV pack (same period, same LP):
  Beginning:                   $1,000,000.00
  Contributions:                  $50,000.00
  Distributions:                 ($25,000.00)
  Allocated income (8% Q):       $112,500.00
  Carry (20% over hurdle):       ($16,500.00)
  Ending:                      $1,121,000.00
```

**Expected output:**
A table with **all five lines** compared, the carry difference of $375.00 flagged, a root-cause hypothesis (carry computation method mismatch), and a sign-off block reserved for the controller. The statement is identified as **the thing under test** and the NAV pack as **source of truth**, per the upstream skill protocol.

## Demo 2 — TR mevzuat (KVKK personal data screen)

**Goal:** exercise the SnP-added `kvkk-screen` skill on a realistic snippet.

**Prompt:**
```
/kvkk-screen

Document type: KYC pack for fund subscription
Document body (excerpt):

  Yatırımcı: Ahmet Yılmaz
  T.C. Kimlik No: 12345678901
  Doğum tarihi: 14/03/1972
  Adres: Etiler Mah., İstanbul
  Telefon: +90 532 *** ** **
  E-posta: ahmet.yilmaz@example.com
  Banka hesabı (IBAN): TR33 0006 1005 1978 6457 8413 26
  Vergi numarası: 5320101011
  Sağlık beyanı: Önemli sağlık sorunu yok.
  Adli sicil beyanı: Yok.
```

**Expected output:**
A four-section report:
1. **Identification** — every field labelled (`ad`, `tc_kimlik`, `iban`, etc.) with KVKK Article 3 classification.
2. **Sensitivity** — `tc_kimlik` and `iban` flagged as personal; **`sağlık beyanı`** and **`adli sicil beyanı`** flagged as **özel nitelikli (Article 6)** — explicit consent required.
3. **Lawful basis** — for each field, a candidate basis under Article 5 (or Article 6 for özel nitelikli).
4. **Cross-border + VERBİS hooks** — explicit reminder that any third-country transfer requires Article 9 instruments and that fund-admin processing must appear on the VERBİS registration of the veri sorumlusu.

The skill output is **a screening report only**. The protocol requires a KVKK-qualified DPO to sign before any remediation action — verify this clause is present.

## Demo 3 — TR mevzuat (KDV birebir-eşleşme reconciliation)

**Goal:** verify the §10.1 zero-tolerance rule is enforced (no `≈`, no "≤1 ₺ rounding").

**Prompt:**
```
/kdv-recon

Period: Nisan 2026 (Mayıs 26'da beyan edilecek)
Mükellef: SnP Demo Fund I LP

Faturalar (satış — KDV-1):
  F-2026-0411  Müşteri A   matrah   100.000,00 ₺   KDV %20    20.000,00 ₺   Genel toplam 120.000,00 ₺
  F-2026-0412  Müşteri B   matrah    50.000,00 ₺   KDV %10     5.000,00 ₺   Genel toplam  55.000,00 ₺
  F-2026-0413  Müşteri C   matrah   200.000,00 ₺   KDV %20    40.000,00 ₺   Genel toplam 240.000,00 ₺

Beyanname taslağı (KDV-1):
  Toplam matrah: 350.000,00 ₺
  Toplam hesaplanan KDV: 65.000,01 ₺  (← bilinçli 1-kuruşluk fark)
```

**Expected output:**
- Three-line reconciliation table.
- The reconciliation **DOES NOT** report "≈ 65.000,00 ₺" or "1-kuruş yuvarlama farkı, ihmal edilebilir".
- It **MUST** report: **`UYUMSUZ — 0,01 ₺ fark`**, with the source line (`F-2026-04??` — the skill must identify which) and a directive that the beyanname is **not ready to file** until the kuruş is resolved.
- Audit coverage: **3/3 fatura denetlendi**, not "3 of 3 sampled (99%)".

This single test is the strongest enforcement signal that the §10.1 charter rule is wired into the skill, not merely documented.

## Demo 4 — Brand voice spot-check (any open prompt)

**Goal:** confirm the plugin never abbreviates the brand to the ampersand form (S&P, with `&`).

**Prompt:**
```
Who authored this plugin?
```

**Expected output:**
Any natural-language answer that mentions the brand must spell out **`Standards And Partners`** (the "And" is the canonical form per SnP brand voice). The ampersand form must never appear in skill or command output.

## Cleanup

There is no state to clean up — the skills are stateless protocol descriptions, and no external services are called in any of the four demos above.

## What was demonstrated

| Demo | What it proves |
|---|---|
| 1 | Upstream skills are intact and behave per their original protocol |
| 2 | New SnP skill executes a TR-specific screening with the right legal hooks |
| 3 | §10.1 birebir-eşleşme is **enforced**, not merely mentioned |
| 4 | Brand voice rule is honoured in runtime output |

If all four demos behave as expected, the plugin is ready for marketplace listing.
