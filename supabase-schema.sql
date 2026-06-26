-- =============================================
-- ULUSMEYDAN HABER SİTESİ - VERİTABANI ŞEMASI
-- Supabase SQL Editor'da bu dosyayı çalıştırın
-- =============================================

-- Kategoriler tablosu
CREATE TABLE IF NOT EXISTS categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  color TEXT NOT NULL DEFAULT '#e63946',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Haberler tablosu
CREATE TABLE IF NOT EXISTS news (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  summary TEXT NOT NULL,
  content TEXT NOT NULL,
  image_url TEXT,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  author TEXT NOT NULL DEFAULT 'Editör',
  is_published BOOLEAN NOT NULL DEFAULT false,
  is_breaking BOOLEAN NOT NULL DEFAULT false,
  view_count INTEGER NOT NULL DEFAULT 0,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Slider tablosu
CREATE TABLE IF NOT EXISTS sliders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT,
  image_url TEXT NOT NULL,
  link TEXT,
  order_index INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Son güncelleme trigger fonksiyonu
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Haberler tablosu updated_at trigger
CREATE TRIGGER update_news_updated_at
  BEFORE UPDATE ON news
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- RLS (Row Level Security) - Okuma herkese açık
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE news ENABLE ROW LEVEL SECURITY;
ALTER TABLE sliders ENABLE ROW LEVEL SECURITY;

-- Kategoriler: Herkes okuyabilir
CREATE POLICY "categories_public_read" ON categories
  FOR SELECT USING (true);

-- Haberler: Herkes yayınlanmış haberleri okuyabilir
CREATE POLICY "news_public_read" ON news
  FOR SELECT USING (is_published = true);

-- Slider: Herkes aktif sliderleri okuyabilir
CREATE POLICY "sliders_public_read" ON sliders
  FOR SELECT USING (is_active = true);

-- Admin politikaları (service role ile bypass edilir)
CREATE POLICY "categories_admin_all" ON categories
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "news_admin_all" ON news
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "sliders_admin_all" ON sliders
  FOR ALL USING (auth.role() = 'authenticated');

-- Örnek kategoriler
INSERT INTO categories (name, slug, color) VALUES
  ('Gündem', 'gundem', '#e63946'),
  ('Spor', 'spor', '#2a9d8f'),
  ('Ekonomi', 'ekonomi', '#e9c46a'),
  ('Siyaset', 'siyaset', '#264653'),
  ('Kültür-Sanat', 'kultur-sanat', '#a8dadc'),
  ('Teknoloji', 'teknoloji', '#457b9d'),
  ('Dünya', 'dunya', '#6d6875'),
  ('Yerel', 'yerel', '#f4a261')
ON CONFLICT (slug) DO NOTHING;

-- Supabase Storage bucket oluştur (Storage sekmesinden de yapılabilir)
-- INSERT INTO storage.buckets (id, name, public) VALUES ('news-images', 'news-images', true);