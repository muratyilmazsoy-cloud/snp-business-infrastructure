---
name: masak-watchlist
description: Screen fund administration parties (investors, beneficial owners, signatories, vendors) against MASAK (Turkish Financial Crimes Investigation Board) sanctions and PEP lists. Use during onboarding, before each capital call disbursement, and on the quarterly periodic review.
---

# MASAK AML / sanctions screen (TR — Law 5549)

Given a list of parties (name + identifier — TC no, vergi no, pasaport, MERSİS), screen against MASAK lists published under Law 5549 (Suç Gelirlerinin Aklanmasının Önlenmesi).

> **MASAK screening hits are leads, not decisions.** A MASAK-certified compliance officer must adjudicate every hit before any onboarding decision or transaction release.

## Step 1: Build the screening identity pack

For each party, assemble:

| Field | Notes |
|---|---|
| Full legal name (TR + translit) | Both Latin and Turkish-script forms |
| Date of birth (individuals) | YYYY-MM-DD |
| TC kimlik no (Turkish citizens) | 11 digits |
| Pasaport no (non-citizens) | |
| Vergi no / MERSİS no (legal entities) | |
| Country of residence / incorporation | ISO 3166 |
| Beneficial owner chain | Required for legal entities (≥25% UBO) |

## Step 2: Run against MASAK lists

Screen each identity against:

1. **MASAK Liste A** — UN Security Council consolidated list (transposed to TR by Cumhurbaşkanlığı Kararnamesi)
2. **MASAK Liste B** — Turkish-specific sanctioned persons (terror, drug trafficking)
3. **MASAK Liste C** — Frozen assets list (varlık dondurma)
4. **PEP list** — Politically Exposed Persons (foreign PEPs always in scope; domestic PEPs in scope per firm's risk policy)
5. **Adverse media** — open-source media hits relevant to financial crime

Use fuzzy matching for transliteration variants. Document the matching score and the reviewer's adjudication.

## Step 3: Risk scoring

For each party, compute a risk band based on:

- Hit category (Liste A/B/C > PEP > adverse media)
- Confidence of name match
- Country risk (FATF grey/black list, MASAK high-risk country list)
- Source-of-wealth plausibility
- Transaction profile (cash-intensive sector, complex ownership chain)

Bands: `low / medium / high / prohibited`.

## Step 4: Trigger thresholds

- **Liste A/B/C hit (any confidence)** → block, escalate to compliance officer, file şüpheli işlem bildirimi (STR) if confirmed.
- **PEP hit (confirmed)** → enhanced due diligence, senior management approval before onboarding.
- **High-risk country** → enhanced source-of-funds documentation.
- **High-value transaction** (≥75,000 ₺ or equivalent threshold per current MASAK genelgesi) → record-keeping and reporting obligation.

## Output

A screening pack:

1. **Hit list** — every party with at least one match, sorted by risk band.
2. **Adjudication queue** — pending decisions with required evidence.
3. **STR drafts** — auto-prepared şüpheli işlem bildirimi for confirmed hits; the compliance officer reviews and submits via MASAK ONLINE.
4. **Audit trail** — every screen, every adjudication, signed and timestamped.

Hand confirmed onboarding cases to the fund onboarding pipeline; route blocks to compliance with the screening pack attached.
