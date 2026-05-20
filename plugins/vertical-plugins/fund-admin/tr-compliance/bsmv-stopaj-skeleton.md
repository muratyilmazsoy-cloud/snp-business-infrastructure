# BSMV + Stopaj Skeleton — Banka Sigorta Muameleleri Vergisi + Withholding Tax

> **Status: Faz 2 skeleton — NOT production.** This document is the placeholder for the BSMV / stopaj rate matrix that the `bsmv-stopaj-calc` skill will consult once SnP-engaged TR vergi danışmanı signs off the rate engine. Faz 1 ships the routing shell only.

## Why a skeleton

TR vergi mevzuatı'nın bu kesimi yıl içinde **en az bir kez** değişen oran setlerinden oluşur:

- BSMV oranları (Gider Vergileri Kanunu Md. 28)
- Stopaj oranları (Gelir Vergisi Kanunu Md. 94, Geçici 67)
- Çifte Vergilendirmeyi Önleme Anlaşmaları (ÇVÖA) — ülke bazlı, sürekli güncelleniyor
- Carried interest ve novel instrument sınıflandırması — açık değil, tebliğ bekliyor

Hard-coded bir rate table Faz 1'de canlıya çıkarsa compliance landmine yaratır. Bu nedenle:

- Faz 1 yalnızca **routing manifest** üretir. Her satır human tax-desk'e yönlendirilir.
- Faz 2 sign-off sonrası rate engine devreye alınır.

## Kapsam matrisi (sign-off pending)

| Transaction class | Tax | Rate band (illustrative — VERIFY before use) | Reference |
|---|---|---|---|
| Banka kredisi faizi | BSMV | %5 | Gider Vergileri Kanunu Md. 28 |
| Hayat sigortası primi | BSMV | %10 | GVK Md. 28 |
| Diğer sigorta primi | BSMV | %5 | GVK Md. 28 |
| Mevduat faizi (TL, gerçek kişi) | Stopaj | Geçici 67 — vade bazlı (6+ ay tipik %10) | GVK Geçici 67 |
| Mevduat faizi (FX, gerçek kişi) | Stopaj | Geçici 67 — TL'ye kıyasla farklı band | GVK Geçici 67 |
| Mevduat faizi (kurumsal mükellef) | Stopaj | %0 (KV mükellefi) | KVK |
| Dağıtılan kâr payı (yerli gerçek kişi) | Stopaj | %10 | GVK Md. 94 |
| Dağıtılan kâr payı (yerli kurumsal) | Stopaj | %0 (kurumlar vergisi düzeyinde) | KVK |
| Dağıtılan kâr payı (yabancı yatırımcı) | Stopaj | ÇVÖA bazlı (TR-DE %15, TR-NL %10, TR-LU %15 tipik) | ÇVÖA |
| Yönetim ücreti (TR fund manager → TR LP) | KDV %20 | (BSMV/stopaj yok) | KDVK |
| Yönetim ücreti (sınır ötesi) | KDV + Stopaj | ÇVÖA + sorumlu sıfatıyla KDV | KDVK + ÇVÖA |
| Carried interest | Sınıflandırma açık değil | — | Henüz tebliğ yok |

> Tüm oranlar **illustrative**. Faz 2 öncesinde hiçbir hesaplamada kullanılamaz. Bu liste yalnızca routing class'larının kapsamını belirler.

## Faz 1 routing shell — bekleten çıktı

`bsmv-stopaj-calc` her satırı şu yapıda emit eder:

```yaml
- transaction_id: <id>
  tax_class: bsmv | stopaj | both | neither
  applicable_rule: <citation>
  requires_review: true   # Faz 1'de daima true
  placeholder_amount: null
  routing: tax-desk
  reason: faz-1-skeleton
```

Hiçbir satır otomatik hesaplanmaz. Hiçbir muhtasar beyanname auto-fill edilmez. Hiçbir tutar muhasebeye otomatik yazılmaz. Output insanın eline gider.

## Faz 2 hazırlık planı

1. **SnP TR vergi danışmanı engage edilir** (Faz 1 lansman sonrası, Haziran-Temmuz 2026 window).
2. `tr-compliance/bsmv-stopaj-rates.json` versiyonlu, tarihli, signed-off rate dosyası oluşturulur.
3. `tr-compliance/cvoa-treaties/` altında ülke bazlı ÇVÖA matrisleri toplanır (~80 ülke).
4. Muhtasar beyanname (Form 1003B) ile cross-check eklenir.
5. Carried interest sınıflandırması için GİB tebliğ takibi (cron job — `tr-compliance/regulatory-watch/`).
6. Skill `requires_review: true` default'u, signed-off case'lerde `false`'a düşer.

## Sign-off kapısı

Faz 2'ye geçiş için iki ıslak imza zorunlu:

1. SnP CFO veya equivalent
2. SnP-engaged SMMM / YMM, TR vergi uzmanı

Sign-off paketinde:
- Rate dosyası versiyonu + tarihi + dayanak (kanun, tebliğ, karar)
- Test sonuçları (paralel hesaplama vs. manuel SMMM hesaplaması)
- Hata payı raporu (%0 zorunlu — KDV-recon §10.1 mantığı burada da geçerli)

Sign-off paketi olmadan Faz 2 deploy edilemez. Skill kodu `placeholder` modunda kilitli kalır.
