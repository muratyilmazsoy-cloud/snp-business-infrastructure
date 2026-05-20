# Anthropic plugin marketplace — submission email draft

> **Status:** Ready to send. Murat reviews → forwards to Anthropic marketplace intake.
> **Send from:** `info@businessmetaverse.io` (or Murat's personal address — both verified on the repo).
> **Send to:** Anthropic plugin marketplace intake address (current channel: refer to Anthropic partner portal; if no portal account yet, send to `plugins@anthropic.com` and CC `partnerships@anthropic.com`).

---

## Subject

```
snp-business-infrastructure plugin submission — partner-built
```

## Body

```
Hello Anthropic marketplace team,

We are submitting "snp-business-infrastructure" for review as a partner-built plugin. It is a derivative of your "anthropics/financial-services" fund-admin vertical, preserved verbatim and extended with a Turkish regulatory layer (KVKK 6698, MASAK / Law 5549, KDV / Law 3065, plus a BSMV-stopaj skeleton gated for Faz 2 sign-off).

The work is authored by SnP Danismanlik A.S. (Standards And Partners), under our AUROCH Business Infrastructure brand. We are an Istanbul-based partner with 15 live operational tenants (multi-tenant MCP gateway in production since April 2026) and a launch event scheduled for 23 June 2026. This submission is the first deliverable in our Faz 3 roadmap and our first contribution to the Anthropic marketplace.

The submission is Apache-2.0 licensed end-to-end: the upstream LICENSE is carried forward unchanged, a NOTICE file enumerates the six unchanged upstream skills, and all SnP additions (four new skills, five commands, four tr-compliance adapter docs) are also Apache-2.0. The repository contains zero secrets, zero emoji, and zero forbidden brand-voice abbreviations; a SUBMISSION.md reviewer checklist and a DEMO.md walkthrough are at the repo root.

Three points worth flagging on review:

  1) The §10.1 birebir-eşleşme (zero-tolerance) rule is wired into the kdv-recon skill — there is no approximate matching, no rounding allowance, and no audit-coverage sampling. This is a constitutional rule in our charter because Maliye (the TR revenue authority) rejects refund claims and issues additional assessments over 1-kuruş differences.
  2) The BSMV-stopaj skill is a skeleton only. It explicitly emits requires_review: true on every line, and it does not auto-fill any muhtasar beyanname. Faz 2 promotion will require wet signatures from a SnP-engaged TR vergi danışmanı.
  3) The TR layer is jurisdictional and unlikely to fit cleanly in an Anthropic-maintained generic FSI plugin, so we have kept it as a partner-built fork. We will sync forward when upstream releases new versions of the six base skills.

Repo:        https://github.com/muratyilmazsoy-cloud/snp-business-infrastructure
Release tag: v0.1.0-rc1
SUBMISSION:  SUBMISSION.md (reviewer checklist)
DEMO:        DEMO.md (four-step walkthrough, ~10 minutes)
Web:         https://businessmetaverse.io

We will respond to reviewer requests within 24 hours, TR business hours (GMT+3). Either reply directly or open an issue against the repo and tag @muratyilmazsoy-cloud.

Thank you for the review.

Murat Yılmazsoy
Founder / CEO, SnP Danismanlik A.S. (Standards And Partners)
info@businessmetaverse.io | WhatsApp +90 539 673 58 80
```

## Pre-send checklist

- [ ] Repo is public and the release tag `v0.1.0-rc1` is visible on the Releases page.
- [ ] SUBMISSION.md, DEMO.md, NOTICE, LICENSE, README.md, `.anthropic-plugin.json` are all at the repo root.
- [ ] The fund-admin plugin manifest validates as JSON (already enforced by `test-plugin-submission.js`).
- [ ] No Anthropic API tokens, NocoDB tokens, or gateway bearer tokens have been pushed.
- [ ] If a private demo is requested, prepare a screencap or live walkthrough using DEMO.md.

## After-send

- [ ] Open a tracking issue in `snp-business-infrastructure` titled "Anthropic marketplace submission — sent <date>" with the email timestamp and any reference ID Anthropic returns.
- [ ] Add a row to the SnP Connect catalog so the plugin appears alongside other AUROCH integrations once published.
