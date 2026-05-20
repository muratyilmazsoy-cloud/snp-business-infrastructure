---
name: kvkk-screen
description: Screen fund administration documents for KVKK (Turkish Personal Data Protection Law 6698) compliance — identify personal data, classify by sensitivity, and flag fields requiring explicit consent, anonymisation, or VERBİS registration. Use before any document containing investor or beneficiary records crosses a border or is shared with a third party.
---

# KVKK personal data screen (TR — Law 6698)

Given a fund document (LP statement, KYC pack, subscription agreement, cap table extract), screen every field against KVKK Article 3 (definitions), Article 5 (lawful processing), Article 6 (special category), and Article 9 (cross-border transfer).

> **The fund administrator is the "veri sorumlusu" (data controller).** The skill outputs a screening report only. A KVKK-qualified DPO (`Veri Koruma Görevlisi`) must sign before any remediation action.

## Step 1: Identify personal data fields

Tag every field that meets KVKK Article 3 "kişisel veri" definition. Common in fund admin:

| Field family | Example fields | KVKK category |
|---|---|---|
| Identity | TC kimlik no, ad/soyad, doğum tarihi | Kişisel veri (Art. 5) |
| Contact | adres, e-posta, telefon | Kişisel veri (Art. 5) |
| Financial | banka hesap, IBAN, vergi no | Kişisel veri (Art. 5) |
| Special category | sağlık, din, siyasi görüş, biyometrik | Özel nitelikli (Art. 6) |
| Behavioural | IP adres, çerez ID, lokasyon | Kişisel veri (Art. 5) |

## Step 2: Lawful basis check

For each identified field, verify at least one Art. 5 lawful basis is documented:

- Açık rıza (explicit consent)
- Kanunlarda açıkça öngörülmesi
- Sözleşmenin kurulması/ifası için zorunlu
- Veri sorumlusunun hukuki yükümlülüğü
- Veri sahibinin temel hak ve özgürlüklerine zarar vermeyen meşru menfaat

Special category data (Art. 6) requires **either** explicit consent **or** an Art. 6/3 exception (e.g., law explicitly permits).

## Step 3: Cross-border transfer screen (Art. 9)

If the document will leave Turkey or be processed in foreign infrastructure:

- Is the recipient country on KVKK Kurul's "yeterli koruma sağlayan ülke" list? (Currently: a short, evolving list — verify against latest Kurul karari.)
- If not, is there a Kurul-approved "taahhütname" or "bağlayıcı şirket kuralları" in force?
- Otherwise: explicit consent of the data subject for each transfer.

## Step 4: VERBİS registration check

If the fund's annual processing volume crosses the VERBİS threshold (currently 100+ employees or 25M ₺ revenue), confirm the fund administrator is registered and the inventory matches the screened fields.

## Output

A four-section screening report:

1. **Identified fields** — table of every personal data field with KVKK category.
2. **Gaps** — fields lacking documented lawful basis, special category without explicit consent, cross-border transfers without safeguards.
3. **VERBİS reconciliation** — fields present in document vs. inventory; flag drift.
4. **Recommended actions** — one-line remediation per gap, routed to the DPO.

Hand the report to `masak-watchlist` for any flagged identity-sensitive fields that also need AML screening.
