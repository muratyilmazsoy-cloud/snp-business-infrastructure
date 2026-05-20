# KVKK Adapter — Kişisel Verilerin Korunması Kanunu (Law 6698)

> **Purpose.** This document maps the generic GDPR-style personal-data screening logic in the upstream Anthropic `financial-services` fund-admin plugin onto Turkish specifics. It is the "TR adapter" that the `kvkk-screen` skill consults at runtime.

## 1. Legal frame

| Layer | Reference |
|---|---|
| Primary law | 6698 sayılı Kişisel Verilerin Korunması Kanunu (07/04/2016 RG: 29677) |
| Regulator | Kişisel Verileri Koruma Kurumu (KVKK) — `kvkk.gov.tr` |
| Registry | VERBİS — Veri Sorumluları Sicili |
| Cross-border | KVKK Kurul kararları (yeterli koruma listesi + taahhütname rejimi) |
| EU bridge | KVKK is GDPR-aligned but not identical. EU SCCs ≠ KVKK taahhütname. Adequacy is not reciprocal. |

## 2. Definitions delta vs. GDPR

| Concept | GDPR | KVKK 6698 |
|---|---|---|
| Personal data | "Personal data" Art. 4(1) | "Kişisel veri" Art. 3(1)(d) — broader; includes identifiable through any reasonable means |
| Special category | Art. 9 (incl. ethnic, religious, biometric, genetic, health, sex life) | Art. 6 — same families plus **ceza mahkûmiyeti ve güvenlik tedbirleri** (criminal convictions + security measures) listed as special category |
| Controller | "Data controller" | "Veri sorumlusu" |
| Processor | "Data processor" | "Veri işleyen" |
| Consent | "Freely given, specific, informed, unambiguous" | "Açık rıza" — must be free, informed, specific to the processing |
| Lawful basis | Art. 6 (six) | Art. 5 (six) — substantially similar, with TR-specific "kanunlarda açıkça öngörülmesi" carve-out |

## 3. Mapping table — generic field → KVKK category

For every personal-data field the upstream skill identifies, attach this TR category before flagging gaps:

| Generic field | KVKK category | Lawful basis typical for fund admin |
|---|---|---|
| Full name | Kişisel veri (Art. 5) | Sözleşmenin ifası |
| TC kimlik no | Kişisel veri (Art. 5) | Kanuni yükümlülük (KYC) |
| Doğum tarihi | Kişisel veri (Art. 5) | Sözleşmenin ifası |
| Adres | Kişisel veri (Art. 5) | Sözleşmenin ifası |
| E-posta, telefon | Kişisel veri (Art. 5) | Sözleşmenin ifası / açık rıza (marketing) |
| IBAN, banka bilgisi | Kişisel veri (Art. 5) | Sözleşmenin ifası |
| Vergi numarası | Kişisel veri (Art. 5) | Kanuni yükümlülük (vergi) |
| Pasaport, vize | Kişisel veri (Art. 5) | Kanuni yükümlülük (KYC) |
| Sağlık bilgisi | Özel nitelikli (Art. 6) | Açık rıza zorunlu |
| Biyometrik (parmak izi, yüz) | Özel nitelikli (Art. 6) | Açık rıza zorunlu |
| Adli sicil | Özel nitelikli (Art. 6) | Açık rıza veya kanun |

## 4. Cross-border transfer (Art. 9) decision tree

```
1. Recipient country on Kurul "yeterli koruma" list?
   ├─ Yes → transfer permitted under standard contractual safeguards
   └─ No
       ├─ Kurul-onaylı taahhütname in force? → permitted
       ├─ Bağlayıcı şirket kuralları (BCR) approved by Kurul? → permitted
       └─ Else → explicit consent of each data subject required
```

> **Yeterli koruma listesi** is short and slow-moving. As of 2026, the list contains: <to be verified at runtime from current Kurul kararı>. Do not hard-code; the adapter reads the live list before each transfer screen.

## 5. VERBİS thresholds

A controller must register in VERBİS if **any** of:

- Annual gross sales ≥ 25 million ₺, OR
- Employee count ≥ 50, OR
- Special category data processed as primary business, OR
- Public institution (always).

The threshold values update by Kurul karari; the adapter reads from `tr-compliance/verbis-thresholds.json` (versioned, dated).

## 6. Sanctions for non-compliance

| Article | Fine band (2026) |
|---|---|
| Failure to inform data subject (Art. 10) | 13.000 - 271.000 ₺ |
| Failure to fulfil data security obligations (Art. 12) | 41.000 - 2.715.000 ₺ |
| Failure to comply with Kurul decisions (Art. 15) | 68.000 - 2.715.000 ₺ |
| Failure to register in VERBİS (Art. 16) | 54.000 - 2.715.000 ₺ |

Bands are annually revaluated for inflation; the adapter pulls the current year band from `tr-compliance/kvkk-fines.json`.

## 7. Relationship to upstream skill

The upstream `kvkk-screen` skill (in `skills/kvkk-screen/SKILL.md`) is generic; it does not embed any of the above tables. At runtime, the skill loads this adapter to:

1. Map identified fields to KVKK categories.
2. Look up the appropriate lawful basis.
3. Run the cross-border decision tree.
4. Check VERBİS thresholds.
5. Format fine bands in the gap report.

This separation lets the upstream skill stay platform-agnostic while the adapter is updated as TR mevzuatı evolves (typically twice a year).
