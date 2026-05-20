# KDV Adapter — Katma Değer Vergisi (Law 3065)

> **Purpose.** The TR-specific tax rate, tevkifat, and beyanname-mapping table that the `kdv-recon` skill consults at runtime. Enforces §10.1 of the SnP charter — birebir eşleşme zorunlu, sıfır tolerans.

## 1. Legal frame

| Layer | Reference |
|---|---|
| Primary law | 3065 sayılı Katma Değer Vergisi Kanunu (02/11/1984 RG: 18563) |
| Implementing tebliğ | KDV Genel Uygulama Tebliği (Maliye, periodik güncellenir) |
| Tevkifat rules | KDV Tebliği No. 117 ve sonraki güncellemeler |
| Beyanname forms | KDV-1 (genel), KDV-2 (sorumlu sıfatıyla), KDV-9015 (özel) |
| Filing deadline | Vergilendirme dönemini takip eden ayın 26'sı (mali müşavir) / 28'i (e-beyanname) |
| Payment deadline | Aynı ayın 28'i |
| Regulator | Gelir İdaresi Başkanlığı (GİB) — `gib.gov.tr` |

## 2. KDV oranları (2026 itibarıyla yürürlükte)

| Oran | Kapsam | İlgili karar |
|---|---|---|
| **%0 (istisna)** | İhracat, uluslararası taşıma, transit | Md. 11-19 |
| **%1** | Temel gıda (ekmek, süt, yumurta vb.), bazı tarımsal girdiler, ikinci el konut (KDV Karar I sayılı liste) | Md. 28 |
| **%10** | Sağlık hizmetleri, otel/lokanta hizmetleri, eğitim, bazı gıda kalemleri | Md. 28 |
| **%20** | Standart oran (mal ve hizmetlerin büyük çoğunluğu) | Md. 28 |

Bu tablo Karar Sayılı Kararname ile değişebilir. Adapter `tr-compliance/kdv-rates.json` üzerinden güncellenir; yıl içinde 1-2 kez güncelleme olağandır.

## 3. Tevkifat (kısmi withholding)

Bazı sektörlerde KDV'nin bir kısmı alıcı tarafından kesilip doğrudan Maliye'ye yatırılır. Yaygın oranlar:

| Sektör | Tevkifat oranı | Açıklama |
|---|---|---|
| Yapım işleri (kamu) | 3/10 | KDV'nin %30'u alıcıdan kesilir |
| Temizlik, çevre ve bahçe bakım | 9/10 | KDV'nin %90'ı |
| Servis taşımacılığı | 5/10 | KDV'nin %50'si |
| Yemek servisi | 5/10 | KDV'nin %50'si |
| Danışmanlık, müşavirlik (kamu) | 5/10 | KDV'nin %50'si |
| Hurda metal | 9/10 | KDV'nin %90'ı |
| Bakır ürünleri | 5/10 | |
| Tekstil ve konfeksiyon (toptan) | 5/10 (genelde) | |

Tam tablo KDV Genel Uygulama Tebliği'nde; adapter `tr-compliance/tevkifat-table.json` üzerinden okur.

## 4. Beyanname satır eşlemesi

Reconciliation için her fatura aşağıdaki KDV-1 satırlarına eşlenir:

| Beyanname satırı | Kapsam |
|---|---|
| Tablo I — Matrah ve KDV | İndirim hakkı veren teslim ve hizmetler, normal vergi |
| Tablo I — İstisna | İstisna kapsamındaki teslimler |
| Tablo II — İndirilemeyecek KDV | İndirim hakkı vermeyen alımlar |
| Tablo III — Tevkifata tabi işlemler | Sorumlu sıfatıyla beyan edilen KDV |
| Tablo IV — İade hakkı doğuran işlemler | İhracat, indirimli orana tabi mahsup |
| Tablo V — Sonuç | Ödenecek / devreden / iade KDV |

`kdv-recon` skill her fatura'yı uygun satıra eşler; mismatch durumunda hem fatura hem satır referansı raporlanır.

## 5. Gtoplam ≠ matrah — kritik tuzak

Operasyon 4.0 API'sinde `Gtoplam = KDV-DAHIL toplam`. Matrah hesaplaması için ya `Matrah` field'ı kullanılır ya da `Gtoplam ÷ (1 + oran/100)` formülü uygulanır. Bu tuzak v39'da yakalanana kadar 39 sürüm boyunca yanlış raporlama üretti — bkz. `auroch-console/docs/op40-field-glossary.md`. KDV reconciliation kodu bu glossary'yi runtime'da consult eder.

## 6. İade ve mahsup

KDV iadesi süreçleri (ihracatçı, indirimli oran, yatırım teşvikli) ayrı bir akış. Bu plugin'in Faz 1 kapsamı yalnızca **periyodik beyan reconciliation**. İade ve mahsup akışları Faz 2+ kapsamında ayrı bir SKILL.md olarak eklenececk (Faz 2: `kdv-iade-mahsup.md`).

## 7. Tolerans ve verdict — §10.1 birebir eşleşme

> Maliye 1 kuruş için iade reddeder, ek tarhiyat çıkarır.

Skill ve adapter düzeyinde:

- Tolerance constant `0.00` ile sabittir. Yapılandırılamaz.
- `0.01` yuvarlama affı yoktur.
- "Yaklaşık eşleşti", "≈", "küçük fark" gibi ifadeler skill çıktısında **görünmez**.
- Verdict ikilidir: `HAZIR — 0 uyumsuzluk` veya `HAZIR DEĞIL — N uyumsuzluk, M ₺ delta`.

Bu kural anayasal — değiştirilemez. Skill içinde override yoktur, environment variable veya parametre ile gevşetilemez.

## 8. Eksiklik bildirimi

`HAZIR DEĞIL` verdict'inde rapor şu yapıyı taşır:

```
HAZIR DEĞIL — 7 uyumsuzluk, 24.317,42 ₺ toplam delta

Eksiklikler:
  1) Fatura 2026-A-0118: matrah 12.500,00 ₺ — beyannamede yok (Eksik fatura)
  2) Fatura 2026-A-0124: register %20, beyannamede %10 (Oran yanlış)
  ...

Bu beyanname filed edilmemelidir.
Aksiyon: muhasebeye yönlendir + 7 eksikliği gider + yeniden recon çalıştır.
```

Aralık yok. Gri yok. Audit oranı yok.

## 9. Relationship to upstream skill

`kdv-recon` skill rate-agnostic mantığı içerir; bu adapter TR oranlarını, tevkifat tablosunu, beyanname satırlarını ve §10.1 verdict kuralını sağlar. Mevzuat değişimleri (Karar sayılı kararname, yeni tebliğ) burada güncellenir; skill kodu dokunulmaz.
