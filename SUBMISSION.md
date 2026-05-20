# Anthropic Plugin Marketplace — Submission Package

> **Submission target:** Cuma 23 Mayıs 2026.
> **Submitting org:** SnP Danismanlik A.S. (Standards And Partners).
> **Category:** `partner-built`.
> **License:** Apache-2.0 (upstream preserved, SnP additions also Apache-2.0).

This file is the reviewer-facing summary for the Anthropic plugin marketplace review team.

## 1. What we are submitting

A partner-built fork of the upstream `anthropics/financial-services` repository, specifically the `plugins/vertical-plugins/fund-admin` plugin, extended with a Turkish regulatory layer (KVKK 6698, MASAK / Law 5549, KDV / Law 3065, BSMV/stopaj skeleton).

## 2. Reviewer checklist

| Item | Status | Where |
|---|---|---|
| License preserved (Apache-2.0) | ok | `LICENSE` (root) — identical to upstream |
| Plugin manifest present and valid JSON | ok | `plugins/vertical-plugins/fund-admin/.claude-plugin/plugin.json` |
| Repo-level Anthropic plugin manifest | ok | `.anthropic-plugin.json` |
| Upstream attribution clear | ok | `README.md` + `plugin.json.vendor.based_on` field |
| Brand vendor disclosed | ok | `SnP Danismanlik A.S. (Standards And Partners)` |
| Six upstream skills carried forward unchanged | ok | `skills/{nav-tieout, gl-recon, break-trace, accrual-schedule, roll-forward, variance-commentary}` |
| New SnP skills follow SKILL.md format | ok | YAML frontmatter (`name`, `description`) + body |
| New commands follow command-md format | ok | YAML frontmatter (`description`) + body |
| TR mevzuat layer documented | ok | `tr-compliance/` — 3 production adapters + 1 skeleton |
| No hardcoded secrets / tokens / credentials | ok | grep-clean (see test 50+) |
| No emoji in shipped files | ok | per SnP charter |
| Brand voice clean (no forbidden words) | ok | "Standards And Partners" never abbreviated to ampersand |
| Skeleton (BSMV/stopaj) clearly labelled and gated | ok | `bsmv-stopaj-skeleton.md` + skill body explicit |
| §10.1 birebir-eşleşme enforced | ok | `kdv-recon` skill + `kdv-adapter.md` |

## 3. Test results (run before submission)

| Test | Result |
|---|---|
| `plugin.json` parses as valid JSON | pass |
| `.anthropic-plugin.json` parses as valid JSON | pass |
| All 10 `SKILL.md` files have YAML frontmatter with `name` and `description` | pass |
| All 5 command markdown files have YAML frontmatter with `description` | pass |
| All 4 TR mevzuat docs are >500 characters | pass |
| `grep -rEi "TODO|FIXME|XXX"` in shipped files | clean |
| `grep -rEi "(api_key|secret|password|token).*=.*['\"]"` in shipped files | clean |
| Forbidden-word check (per SnP brand voice) | clean |
| Apache-2.0 LICENSE present at root | pass |

## 4. Manifest contents

`.anthropic-plugin.json`:

```json
{
  "name": "snp-business-infrastructure",
  "vendor": "SnP Danismanlik A.S. (Standards And Partners)",
  "category": "partner-built",
  "license": "Apache-2.0",
  "verticals": ["fund-admin"],
  "regions": ["TR"],
  "compliance": ["KVKK-6698", "MASAK-5549", "KDV-3065"]
}
```

## 5. Skills inventory

Six upstream + four SnP-added:

| Skill | Source | Description |
|---|---|---|
| `nav-tieout` | Upstream | Tie an LP statement to the fund's NAV pack |
| `gl-recon` | Upstream | GL ↔ subledger reconciliation |
| `break-trace` | Upstream | Root-cause investigation for matched breaks |
| `accrual-schedule` | Upstream | Period accrual schedule construction |
| `roll-forward` | Upstream | Balance roll-forward from prior period |
| `variance-commentary` | Upstream | Variance analysis narrative |
| `kvkk-screen` | SnP | Personal data screen under TR Law 6698 |
| `masak-watchlist` | SnP | AML / sanctions screen against MASAK lists |
| `kdv-recon` | SnP | VAT (KDV) reconciliation, birebir eşleşme |
| `bsmv-stopaj-calc` | SnP (skeleton) | BSMV + withholding routing (Faz 2 gated) |

## 6. Commands inventory

| Command | Skill it invokes |
|---|---|
| `/nav-tieout` | `nav-tieout` |
| `/gl-recon` | `gl-recon` |
| `/kvkk-screen` | `kvkk-screen` |
| `/masak-screen` | `masak-watchlist` |
| `/kdv-recon` | `kdv-recon` |

## 7. License + attribution statement

This work is a derivative of `anthropics/financial-services` (Apache-2.0). The upstream copyright headers, NOTICE, and LICENSE are preserved unchanged. All SnP-added material in `skills/{kvkk-screen, masak-watchlist, kdv-recon, bsmv-stopaj-calc}`, `commands/`, and `tr-compliance/` is also released under Apache-2.0, copyright SnP Danismanlik A.S., contributed back to the open marketplace.

## 8. Brand integration notes

- Repo name: `snp-business-infrastructure` (canonical AUROCH brand).
- Plugin name: `snp-fund-admin` (clear lineage from upstream `fund-admin`).
- All author / vendor fields use `Standards And Partners` (the "And" is spelled out per SnP brand voice — never the ampersand).
- Logo: SnP VORTEX (navy `#030b18` / cyan `#4ab8ff` / white `#f0f4ff`) shown alongside the Anthropic mark in the README header. Logo files are not bundled in the repo (per file-size guidance); they are referenced by URL.

## 9. Reviewer questions — pre-emptive answers

**Q: Why a fork instead of a contribution back to upstream?**
A: The Turkish regulatory layer (KVKK, MASAK, KDV birebir-eşleşme rule, ÇVÖA matrices) is jurisdiction-specific and unlikely to fit in an Anthropic-maintained generic FSI plugin. Forks keep upstream lean while letting regional partners ship verified specifics. We will sync forward when upstream releases new versions of the six base skills.

**Q: Is the BSMV/stopaj skeleton safe to ship?**
A: Yes. The skill explicitly emits `requires_review: true` on every line in Faz 1 and routes all output to a human tax desk. No automated computation, no auto-fill of muhtasar beyanname, no muhasebe write. Faz 2 promotion requires two wet signatures (CFO + SMMM/YMM) and a signed-off rate file.

**Q: Why is the §10.1 zero-tolerance rule "constitutional"?**
A: Because Maliye (the TR revenue authority) rejects refund claims and issues additional assessments over 1-kuruş differences. Any "≈" or "rounding allowance" in a KDV reconciliation engine produces compliance risk for the customer. The skill enforces what the auditor would do.

**Q: What is "AUROCH"?**
A: SnP's brand for the Business Infrastructure category. The plugin's name in the manifest is `snp-fund-admin`; AUROCH is the umbrella under which SnP organises its Operasyon 4.0, Compliance 4.0, Auditing 4.0, and Potential 4.0 verticals. This submission is part of the Compliance 4.0 vertical's TR rollout.

## 10. Contact for reviewer follow-up

- Murat Yilmazsoy, Founder / CEO — `info@businessmetaverse.io`
- WhatsApp: +90 539 673 58 80
- GitHub: `@muratyilmazsoy-cloud`

We will respond to reviewer requests within 24 hours (TR business hours, GMT+3).
