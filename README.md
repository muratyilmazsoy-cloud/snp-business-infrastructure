# AUROCH x Anthropic financial-services — SnP Fork

> **Partner-built plugin for the Anthropic Claude Cowork marketplace.**
> Fork of [`anthropics/financial-services`](https://github.com/anthropics/financial-services) — Apache-2.0 licensed.
> Authored by **SnP Danismanlik A.S. (Standards And Partners)** under the AUROCH Business Infrastructure brand.

```
┌─────────────────────────────┐      ┌─────────────────────────────┐
│  SnP VORTEX                 │      │  Anthropic                  │
│  Business Infrastructure    │  x   │  financial-services         │
│  AUROCH                     │      │  (Apache-2.0)               │
└─────────────────────────────┘      └─────────────────────────────┘
                  │                                │
                  └────────────────┬───────────────┘
                                   │
                         snp-business-infrastructure
                         (this repo — Faz 1)
                                   │
                  ┌────────────────┴───────────────┐
                  │                                │
            fund-admin                       TR mevzuat
            (6 upstream skills               (KVKK + MASAK + KDV
             + 4 TR-specific skills)          adapters + BSMV skeleton)
```

## What this is

The upstream Anthropic `financial-services` repo ships a `fund-admin` vertical plugin with six skills covering GL reconciliation, break tracing, accruals, roll-forwards, variance commentary, and NAV tie-out. This fork:

1. **Preserves the upstream six skills unchanged** (Apache-2.0 license carried forward).
2. **Adds four TR-mevzuat skills** — `kvkk-screen`, `masak-watchlist`, `kdv-recon`, `bsmv-stopaj-calc` (the last is a Faz 2 skeleton).
3. **Adds five slash commands** — `/nav-tieout`, `/gl-recon`, `/kvkk-screen`, `/masak-screen`, `/kdv-recon`.
4. **Adds a TR mevzuat adapter layer** — versioned reference docs (`tr-compliance/`) that the TR skills consult at runtime so legal updates do not require code changes.
5. **Rebrands the plugin** to `snp-fund-admin` under SnP authorship while crediting upstream.

## Why a TR fork is necessary

Generic fund administration skills assume an FATF/GDPR-aligned operating environment. In Turkey:

- **Personal data** is governed by KVKK 6698, not GDPR — the special-category list and cross-border rules diverge from EU SCCs.
- **AML screening** runs against MASAK's four-list structure (Liste A/B/C + PEP) with TR-specific reporting deadlines and the MASAK ONLINE portal.
- **VAT (KDV)** has TR-specific rate bands (0/1/10/20 %), a tevkifat (partial withholding) regime, and the constitutional **§10.1 birebir eşleşme** rule — no rounding allowance, no approximate matching.
- **BSMV + stopaj** rates change at least once a year and require ÇVÖA (double-tax treaty) lookups by counterparty country.

These cannot be handled by language localisation. They are first-class regulatory primitives.

## Structure

```
.
├── README.md                                  ← you are here
├── SUBMISSION.md                              ← reviewer checklist for Anthropic
├── LICENSE                                    ← Apache-2.0 (upstream carry-forward)
├── .anthropic-plugin.json                     ← repo-level Anthropic plugin manifest
└── plugins/
    └── vertical-plugins/
        └── fund-admin/
            ├── .claude-plugin/plugin.json     ← snp-fund-admin manifest
            ├── skills/
            │   ├── nav-tieout/SKILL.md        ← upstream (Apache-2.0)
            │   ├── gl-recon/SKILL.md          ← upstream
            │   ├── break-trace/SKILL.md       ← upstream
            │   ├── accrual-schedule/SKILL.md  ← upstream
            │   ├── roll-forward/SKILL.md      ← upstream
            │   ├── variance-commentary/SKILL.md← upstream
            │   ├── kvkk-screen/SKILL.md       ← SnP-added (TR — KVKK 6698)
            │   ├── masak-watchlist/SKILL.md   ← SnP-added (TR — Law 5549)
            │   ├── kdv-recon/SKILL.md         ← SnP-added (TR — Law 3065)
            │   └── bsmv-stopaj-calc/SKILL.md  ← SnP-added (Faz 2 skeleton)
            ├── commands/
            │   ├── nav-tieout.md
            │   ├── gl-recon.md
            │   ├── kvkk-screen.md
            │   ├── masak-screen.md
            │   └── kdv-recon.md
            └── tr-compliance/
                ├── kvkk-adapter.md            ← runtime adapter for kvkk-screen
                ├── masak-adapter.md           ← runtime adapter for masak-watchlist
                ├── kdv-adapter.md             ← runtime adapter for kdv-recon
                └── bsmv-stopaj-skeleton.md    ← Faz 2 placeholder
```

## Charter integration

This plugin honours four non-negotiable SnP charter rules:

| Rule | Where enforced |
|---|---|
| **§10.1 birebir eşleşme** — zero tolerance on financial reconciliation | `kdv-recon` skill + `kdv-adapter.md` |
| **No emoji in code/docs** | Entire repo |
| **Brand voice: Standards And Partners (not `&`)** | All author fields |
| **AUROCH = Business Infrastructure category** | README + manifest |

## License

Apache-2.0. The upstream Anthropic plugins retain their original Apache-2.0 license; all SnP-added material is also Apache-2.0. See `LICENSE`.

## Authorship

| Field | Value |
|---|---|
| Author | SnP Danismanlik A.S. (Standards And Partners) |
| Contact | info@businessmetaverse.io |
| Web | https://businessmetaverse.io |
| WhatsApp | +90 539 673 58 80 |
| Submission category | `partner-built` |
| Based on | [`anthropics/financial-services`](https://github.com/anthropics/financial-services) `plugins/vertical-plugins/fund-admin` |

## Cache integration (forward reference)

Runtime invocations of the TR skills are cached through `@snp/ai-cache` (see SnP PR #378 preamble) when called from inside the AUROCH platform. The cache layer is plugin-external; outside AUROCH, the skills run with their default Anthropic SDK behaviour.

## Submission roadmap

- **Cuma 23 May 2026** — submit to Anthropic plugin marketplace as `partner-built`.
- **Faz 2 (Haziran-Temmuz 2026)** — TR vergi danışmanı sign-off on BSMV/stopaj rate engine; promote skeleton to live.
- **Faz 3 (Q3 2026)** — extend the plugin model to the other AUROCH verticals (operasyon-4-0, compliance-4-0, auditing-4-0, potential-4-0).

See `SUBMISSION.md` for the reviewer checklist.

---

*Bu repo SnP'nin Anthropic plugin marketplace'ine ilk submission'ıdır. Aksiyon AUROCH ekibi tarafından, Apache-2.0 lisansı altında, mevcut SnP charter'a uygun olarak yürütülmüştür.*
