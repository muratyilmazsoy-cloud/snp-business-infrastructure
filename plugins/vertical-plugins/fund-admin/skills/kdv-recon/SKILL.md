---
name: kdv-recon
description: Reconcile a fund's invoices against its KDV beyannamesi (Turkish VAT return — Form KDV-1) line by line. Verify rate selection (1/10/20%), check tevkifat (withholding) where applicable, and surface every kuruş of mismatch. Use before the 26th of the month, before the beyanname is filed.
---

# KDV (VAT) reconciliation (TR — Law 3065)

Given the period's invoices (alış + satış) and the draft KDV beyannamesi, reconcile line by line — `birebir eşleşme zorunlu, yaklaşık eşleşme yasak`.

> **MALİYE 1 KURUŞ İÇİN İADE REDDEDER.** This skill enforces the SnP §10.1 birebir-eşleşme kuralı. There is no "≈", no "≤1 ₺ rounding", no "yaklaşık eşleşti". Every line either ties to the kuruş or is reported as **UYUMSUZ**.

## Step 1: Normalize the invoice register

For each invoice line:

| Field | Source | Rule |
|---|---|---|
| `belge_no` | Fatura header | Unique key |
| `tarih` | Fatura header | ISO date |
| `karsi_taraf` | Fatura header | Vergi no + ünvan |
| `matrah` | Fatura line | KDV-hariç tutar |
| `kdv_orani` | Fatura line | 0 / 1 / 10 / 20 (TR rates as of 2026) |
| `kdv_tutari` | Fatura line | Computed: `matrah × oran / 100` |
| `gtoplam` | Fatura line | KDV-DAHIL toplam (Gtoplam ≠ matrah — see Op4.0 glossary) |
| `tevkifat_orani` | Fatura line | Default 0; sector-specific values per Tebliğ 117 |
| `tevkifat_tutari` | Fatura line | `kdv × tevkifat / 10` (typical 3/10, 5/10, 7/10, 9/10) |

**Critical:** in Operasyon 4.0 API, `Gtoplam = KDV-DAHIL toplam`, NOT matrah. Confirm via `auroch-console/docs/op40-field-glossary.md` before any computation.

## Step 2: Reconcile to the beyanname

Group invoices by KDV rate. For each rate bucket:

- Sum of `matrah` in invoices vs. matrah declared on beyanname line `Tablo I` (or Tablo III for tevkifat).
- Sum of `kdv_tutari` vs. declared KDV.
- Sum of tevkifat where applicable.

Tolerance: **`0.00`**. Not 0.01. Not "küçük fark". Zero.

## Step 3: Classify any mismatch

If matrah or KDV sums don't tie:

| Bucket | Symptom |
|---|---|
| **Missing invoice** | Invoice in register, not in beyanname source |
| **Phantom line** | Beyanname declares more than register supports |
| **Rate misclassification** | Matrah agrees but oran differs (1% misposted as 10%, etc.) |
| **Tevkifat omission** | Sector requires tevkifat but invoice doesn't apply it |
| **İskonto / iade** | Subsequent credit note not reflected on one side |
| **Kur farkı** | FX adjustment on foreign-currency invoice |
| **Rounding accumulation** | Per-line rounding sums to a delta — still UYUMSUZ; no "≤1 ₺" allowance |

## Step 4: Output

Two artifacts, both required:

1. **Reconciliation table** — per rate bucket and per invoice, with register value, beyanname value, delta, and bucket classification. Sort by absolute delta descending.
2. **Beyanname-readiness verdict**:
   - `HAZIR — 0 uyumsuzluk` (file the return)
   - `HAZIR DEĞIL — N uyumsuzluk, M ₺ toplam delta` (do not file; route to muhasebe with the table)

There is no third option. There is no "%99 audit kapsamı". The verdict is binary.

Hand the table to `bsmv-stopaj-calc` for BSMV (Banka Sigorta Muameleleri Vergisi) and stopaj implications where the underlying transactions trigger them.
