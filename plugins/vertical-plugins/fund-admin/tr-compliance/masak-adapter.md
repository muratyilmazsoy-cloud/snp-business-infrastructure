# MASAK Adapter — Mali Suçları Araştırma Kurulu (Law 5549)

> **Purpose.** The TR-specific adapter that the `masak-watchlist` skill consults at runtime. Translates generic FATF-aligned AML screening into Turkish list structure, thresholds, and reporting obligations.

## 1. Legal frame

| Layer | Reference |
|---|---|
| Primary law | 5549 sayılı Suç Gelirlerinin Aklanmasının Önlenmesi Hakkında Kanun (18/10/2006 RG: 26323) |
| Secondary | 6415 sayılı Terörizmin Finansmanının Önlenmesi Hakkında Kanun |
| Regulator | MASAK (Mali Suçları Araştırma Kurulu) — `masak.hmb.gov.tr` |
| Reporting portal | MASAK ONLINE |
| Sanctions transposition | Cumhurbaşkanlığı Kararnamesi (BM Güvenlik Konseyi kararlarını TR'ye aktarır) |
| FATF coordination | Türkiye FATF üyesi; grey list / blacklist statüsü politika döngüsünden etkilenir |

## 2. The lists

| List | Source | Scope |
|---|---|---|
| **Liste A** | BM Güvenlik Konseyi konsolide listesi (UNSC) | Terör finansmanı, kitle imha silahları yayılması |
| **Liste B** | Cumhurbaşkanlığı kararıyla yayımlanan TR-spesifik liste | Yerel terör örgütleri, uyuşturucu kaçakçılığı |
| **Liste C** | Varlık dondurma listesi (6415 sayılı kanun çerçevesinde) | Donmuş malvarlığı sahipleri |
| **PEP** | Liste değil, kategori — yabancı her zaman, yerli politika gereği | Politically exposed persons |

All four are consulted on every onboarding and on the periodic review cycle.

## 3. Reporting obligations

### Şüpheli İşlem Bildirimi (STR — Suspicious Transaction Report)

- **Trigger** — herhangi bir tutarda işlemde, varlık veya işlemin suç gelirinden kaynaklandığına dair şüphe oluşması.
- **Deadline** — şüphe oluştuktan itibaren 10 iş günü içinde.
- **Channel** — MASAK ONLINE portalı.
- **Confidentiality** — STR bildirildiği gerçeği müşteriye **açıklanamaz** (tipping-off yasağı, Md. 6).

### Yüksek Tutarlı İşlem Bildirimi

- **Threshold (2026)** — 75.000 ₺ veya muadili (kümülatif 24 saat içinde — dilimleme önlemi).
- **Channel** — Periyodik (genelde 2 ay) MASAK ONLINE.
- **Sektör genelgeleri** — sigorta, döviz büfeleri, gayrimenkul ayrı eşik tabloları kullanır.

Threshold is annually revaluated; the adapter pulls from `tr-compliance/masak-thresholds.json`.

## 4. KYC/CDD obligations (Müşterini Tanı)

Fund administrators are "yükümlü" under Law 5549 Art. 2/d (finansal kuruluş). Minimum CDD pack:

| Party type | Required documents |
|---|---|
| Yerli gerçek kişi | TC kimlik kartı, adres beyanı, vergi numarası, iş/gelir kaynağı beyanı |
| Yabancı gerçek kişi | Pasaport, ikametgah belgesi, vergi numarası (yabancı veya potansiyel TR), kaynak ülke risk değerlendirmesi |
| Yerli tüzel kişi | Vergi levhası, MERSİS no, ticaret sicil gazetesi, imza sirküleri, ortaklık yapısı (UBO ≥%25) |
| Yabancı tüzel kişi | Eşdeğeri + apostil/legalizasyon, UBO yapısı tam zincir |

**Enhanced Due Diligence (EDD)** zorunludur:

- Yüksek risk ülkeden müşteri (FATF grey/black liste veya MASAK yüksek risk listesi)
- Konfirme PEP
- Karmaşık ortaklık yapısı (offshore, vakıf, blind trust)
- Açıklanamayan büyük tutarlı işlem profili

## 5. Risk scoring matrix (default for fund admin)

| Faktör | Düşük | Orta | Yüksek | Yasak |
|---|---|---|---|---|
| Liste eşleşmesi | Yok | Adverse media | PEP onaylı | Liste A/B/C |
| Ülke | OECD + AB | FATF gri | FATF kara | OFAC SDN |
| Sektör | Reel sektör | Gayrimenkul | Kıymetli maden, kripto | Anonim varlık aracısı |
| İşlem profili | Düzenli, açıklanabilir | Beklenmedik tutarlı | Dilimleme şüphesi | Nakit yoğun, kaynak yok |
| UBO yapısı | Tek seviye | İki seviye | Üç+ seviye | Anonim, açıklanamayan |

Final band = max of factor bands. `Yasak` → block + STR. `Yüksek` → EDD + senior management approval.

## 6. Audit trail

Every screen and adjudication is logged with:

- `screened_at` (ISO timestamp)
- `screened_by` (operator)
- `lists_consulted` (Liste A/B/C/PEP/adverse with version date)
- `match_details` (fuzzy match score, transliteration variants)
- `adjudication` (decision + rationale + adjudicator)
- `evidence_refs` (document IDs)

Trail is retained for **8 yıl** post-relationship-end (Law 5549 Art. 8 retention rule).

## 7. Relationship to upstream skill

The upstream `masak-watchlist` skill performs the screen mechanics; this adapter provides the TR-specific list structure, thresholds, EDD triggers, and reporting deadlines. Updates to genelge or eşik are reflected here without touching skill logic.
