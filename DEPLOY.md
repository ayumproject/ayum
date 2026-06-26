# 🚀 Ulusmeydan Gazetesi - Deploy Kılavuzu

## 1. Supabase Kurulumu

### Proje Oluştur
1. [supabase.com](https://supabase.com) adresine git ve yeni proje oluştur
2. **Settings > API** bölümünden şu değerleri kopyala:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY`

### Veritabanını Kur
1. Supabase Dashboard'da **SQL Editor** sekmesine git
2. `supabase-schema.sql` dosyasının içeriğini yapıştır ve çalıştır

### Storage Bucket Oluştur
1. **Storage** sekmesine git
2. **New bucket** tıkla: `news-images`, **Public** olarak ayarla
3. Bucket policy olarak "Allow public access" seç

### Auth Kullanıcısı Oluştur
1. **Authentication > Users** sekmesine git
2. **Add user > Create new user** ile admin kullanıcısı oluştur
   - E-posta: `admin@ulusmeydan.com`
   - Şifre: güçlü bir şifre belirle

---

## 2. Vercel Deploy

### GitHub'a Push
```bash
git add .
git commit -m "Initial commit: Ulusmeydan haber sitesi"
git push origin main
```

### Vercel'de Deploy
1. [vercel.com](https://vercel.com) → **New Project**
2. GitHub repo'yu seç
3. **Environment Variables** bölümüne şunları ekle:

| Değişken | Değer |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service_role key |

4. **Deploy** butonuna tıkla

---

## 3. Yerel Geliştirme

```bash
# .env.local dosyasını doldur
cp .env.local.example .env.local
# Değerleri gir

# Bağımlılıkları yükle
npm install

# Geliştirme sunucusunu başlat
npm run dev
```

Site: http://localhost:3000
Admin: http://localhost:3000/admin/giris

---

## 4. Proje Yapısı

```
app/
├── page.tsx                    # Anasayfa
├── haber/[slug]/page.tsx       # Haber detay
├── kategori/[slug]/page.tsx    # Kategori sayfası
├── admin/
│   ├── giris/page.tsx          # Admin girişi
│   └── (dashboard)/
│       ├── page.tsx            # Dashboard
│       ├── haberler/           # Haber yönetimi
│       ├── slider/             # Slider yönetimi
│       └── kategoriler/        # Kategori yönetimi
├── api/
│   └── admin/news/[id]/delete/ # Haber silme API
components/
├── Navbar.tsx                  # Navigasyon
├── Footer.tsx                  # Footer
├── HeroSlider.tsx              # Anasayfa slider
└── NewsCard.tsx                # Haber kartı
lib/
├── supabase/
│   ├── client.ts               # Browser Supabase client
│   └── server.ts               # Server Supabase client
└── types.ts                    # TypeScript tipleri
```

---

## 5. Özellikler

- ✅ Anasayfa (Hero Slider, Son Haberler, Kategori bölümleri)
- ✅ Haber detay sayfası (paylaşım, ilgili haberler)
- ✅ Kategori sayfası (sayfalama)
- ✅ Son Dakika kayan yazısı
- ✅ Admin paneli (sidebar, responsive)
- ✅ Haber ekleme/düzenleme/silme
- ✅ Slider yönetimi (görsel yükleme)
- ✅ Kategori yönetimi (renk seçici)
- ✅ Supabase Auth ile güvenli giriş
- ✅ Görsel yükleme (Supabase Storage)
- ✅ SEO metadata (OG tags)
- ✅ Türkçe karakter destekli slug üretimi
- ✅ Mobil uyumlu tasarım