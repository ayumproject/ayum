import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import HeroSlider from '@/components/HeroSlider'
import NewsCard from '@/components/NewsCard'
import SecondarySlider from '@/components/SecondarySlider'
import ColumnistsSlider from '@/components/ColumnistsSlider'
import StandingsWidget from '@/components/StandingsWidget'
import Image from 'next/image'
import Link from 'next/link'
import type { News, Slider, Columnist } from '@/lib/types'

// revalidate — Next.js ISR: her 60 saniyede bir yeniden oluştur
export const revalidate = 60

export const metadata: Metadata = {
  title: 'Ulusmeydan — Güncel Haberler, Son Dakika Ankara',
  description: "Ankara ve Türkiye'den güncel haberler, son dakika gelişmeleri. Doğru, tarafsız ve güvenilir gazetecilik.",
  alternates: { canonical: 'https://ulusmeydan.com' },
  openGraph: {
    type: 'website',
    url: 'https://ulusmeydan.com',
    title: 'Ulusmeydan — Güncel Haberler, Son Dakika Ankara',
    description: "Ankara ve Türkiye'den güncel haberler, son dakika gelişmeleri.",
  },
}

async function getSliders(): Promise<Slider[]> {
  const sb = await createClient()
  const { data } = await sb.from('sliders').select('*').eq('is_active', true).eq('type', 'main').order('order_index')
  return data || []
}
async function getSecondarySliders(): Promise<Slider[]> {
  const sb = await createClient()
  const { data } = await sb.from('sliders').select('*').eq('is_active', true).eq('type', 'secondary').order('order_index')
  return data || []
}
async function getLatestNews(limit = 24): Promise<News[]> {
  const sb = await createClient()
  const { data } = await sb.from('news').select('*, category:categories(*)').eq('is_published', true).order('published_at', { ascending: false }).limit(limit)
  return (data as News[]) || []
}
async function getCatNews(slug: string, limit = 6): Promise<News[]> {
  const sb = await createClient()
  const { data: cat } = await sb.from('categories').select('id').eq('slug', slug).single()
  if (!cat) return []
  const { data } = await sb.from('news').select('*, category:categories(*)').eq('is_published', true).eq('category_id', cat.id).order('published_at', { ascending: false }).limit(limit)
  return (data as News[]) || []
}
async function getColumnists(): Promise<Columnist[]> {
  const sb = await createClient()
  const { data } = await sb.from('columnists').select('*').eq('is_active', true).order('order_index')
  return (data as Columnist[]) || []
}

function SectionTitle({ title, href, hrefLabel = 'Tümü' }: { title: string; href?: string; hrefLabel?: string }) {
  return (
    <div className="flex items-center justify-between mb-4 pb-2 border-b-2 border-[#1a1a2e]">
      <div className="flex items-center gap-2">
        <span className="w-[4px] h-5 bg-red-600 shrink-0" />
        <h2 className="text-[15px] font-extrabold uppercase tracking-wide text-[#1a1a2e]">{title}</h2>
      </div>
      {href && (
        <Link href={href} className="text-[11px] font-bold text-red-600 hover:underline flex items-center gap-0.5 transition-colors">
          {hrefLabel}
          <svg width="10" height="10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      )}
    </div>
  )
}

export default async function HomePage() {
  const [
    sliders, secondarySliders, latest, columnists,
    gundem, ankara, siyaset, ekonomi, spor, kulturSanat, dunya, yasam, video,
  ] = await Promise.all([
    getSliders(), getSecondarySliders(), getLatestNews(24), getColumnists(),
    getCatNews('gundem', 6), getCatNews('ankara', 6), getCatNews('siyaset', 6),
    getCatNews('ekonomi', 6), getCatNews('spor', 6), getCatNews('kultur-sanat', 6),
    getCatNews('dunya', 6), getCatNews('yasam', 6), getCatNews('video', 6),
  ])

  const featured    = latest.slice(0, 4)
  const sonHaberler = latest.slice(4, 8)
  const mostRead    = [...latest].sort((a, b) => b.view_count - a.view_count).slice(0, 6)

  const catSections = [
    { title: 'Gündem',       slug: 'gundem',       news: gundem,      accent: '#1e3a7a' },
    { title: 'Ankara',       slug: 'ankara',       news: ankara,      accent: '#b91c1c' },
    { title: 'Siyaset',      slug: 'siyaset',      news: siyaset,     accent: '#7c3aed' },
    { title: 'Ekonomi',      slug: 'ekonomi',      news: ekonomi,     accent: '#0f766e' },
    { title: 'Spor',         slug: 'spor',         news: spor,        accent: '#16a34a' },
    { title: 'Kültür Sanat', slug: 'kultur-sanat', news: kulturSanat, accent: '#be185d' },
    { title: 'Dünya',        slug: 'dunya',        news: dunya,       accent: '#0369a1' },
    { title: 'Yaşam',        slug: 'yasam',        news: yasam,       accent: '#d97706' },
    { title: 'Video',        slug: 'video',        news: video,       accent: '#374151' },
  ]

  return (
    <div className="min-h-screen bg-[#f3f4f6]">

      {/* ── ANA BLOK: Hero + Öne Çıkanlar + Yazarlar ───────── */}
      <div className="bg-white border-b border-gray-200">
        <div className="flex flex-col lg:flex-row gap-5 px-4 sm:px-6 py-4" style={{ minHeight: 0 }}>

          {sliders.length > 0 && (
            <div className="w-full lg:w-[55%] shrink-0 h-56 sm:h-80 lg:h-auto lg:min-h-[480px] flex flex-col rounded-lg overflow-hidden">
              <HeroSlider sliders={sliders} stretch />
            </div>
          )}

          {/* Sağ taraf */}
          <div className="flex flex-col lg:flex-row flex-1 min-w-0 gap-6">

            {/* Öne Çıkanlar */}
            {featured.length > 0 && (
              <div className="hidden lg:flex flex-col flex-1 min-w-0">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-[14px] font-extrabold uppercase tracking-wide text-[#1a1a2e]">Öne Çıkanlar</h2>
                </div>
                <div className="divide-y divide-gray-100 flex-1">
                  {featured.map(n => {
                    const cat = n.category as any
                    const dt = n.published_at ? new Date(n.published_at) : null
                    const dateStr = dt ? dt.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' }) : ''
                    return (
                      <Link key={n.id} href={`/haber/${n.slug}`}
                        className="flex items-start gap-3 py-3 hover:bg-gray-50 transition-colors group">
                        {n.image_url && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={n.image_url} alt={n.title} className="w-20 h-14 object-cover shrink-0 rounded" />
                        )}
                        <div className="min-w-0 flex-1">
                          {cat && <span className="text-[10px] font-extrabold uppercase text-red-600 block mb-0.5">{cat.name}</span>}
                          <p className="text-[13px] font-bold text-[#1a1a2e] group-hover:text-red-600 transition-colors leading-snug line-clamp-2">{n.title}</p>
                          {dateStr && <span className="text-[10px] text-gray-400 mt-0.5 block">{dateStr}</span>}
                        </div>
                      </Link>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Yazarlar + WhatsApp */}
            <div className="hidden xl:flex flex-col gap-5 w-56 shrink-0">
              {columnists.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-[14px] font-extrabold uppercase tracking-wide text-[#1a1a2e]">Yazarlar</h2>
                    <Link href="/yazar" className="text-[11px] font-bold text-red-600 hover:underline">Tümü →</Link>
                  </div>
                  <div className="space-y-4">
                    {columnists.slice(0, 4).map(c => (
                      <Link key={c.id} href={`/yazar/${c.slug}`}
                        className="flex items-center gap-3 group hover:bg-gray-50 rounded p-1.5 -mx-1.5 transition-colors">
                        <div className="w-11 h-11 overflow-hidden bg-gray-100 shrink-0 rounded-full">
                          {c.photo_url
                            ? <Image src={c.photo_url} alt={c.name} width={44} height={44} className="w-full h-full object-cover" />
                            : <div className="w-full h-full bg-[#1a1a2e] flex items-center justify-center text-white font-bold text-[15px]">{c.name[0]}</div>
                          }
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-[12px] font-extrabold text-[#1a1a2e] group-hover:text-red-600 transition-colors leading-tight">{c.name}</p>
                          <p className="text-[11px] text-gray-500 line-clamp-1 mt-0.5">{c.title}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
              <div className="bg-[#1a1a2e] px-4 py-4 text-center rounded-lg">
                <div className="text-[9px] font-extrabold text-white/50 uppercase tracking-widest mb-1.5">WhatsApp İhbar Hattı</div>
                <div className="text-[18px] font-black text-white leading-tight">0541 215 01 06</div>
                <a href="https://wa.me/905412150106" target="_blank" rel="noopener noreferrer"
                  className="mt-2.5 inline-flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white text-[11px] font-extrabold px-4 py-1.5 transition-colors">
                  <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  Haber Gönder
                </a>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ── SON HABERLER — 6 sütun, tam genişlik ─────────── */}
      {sonHaberler.length > 0 && (
        <div className="bg-white border-b border-gray-200">
          <div className="w-full px-4 sm:px-6 py-5">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-white text-[13px] font-extrabold uppercase tracking-widest px-3 py-1 shrink-0 bg-[#1a1a2e]">
                Son Haberler
              </span>
              <div className="flex-1 h-px bg-gray-200" />
              <Link href="/kategori/gundem"
                className="text-[11px] font-bold text-[#1a1a2e] shrink-0 hover:underline flex items-center gap-0.5">
                Tüm Haberler
                <svg width="10" height="10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {latest.slice(0, 6).map(n => {
                const cat = n.category as any
                const dt = n.published_at ? new Date(n.published_at) : null
                const dateStr = dt ? dt.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' }) : ''
                return (
                  <Link key={n.id} href={`/haber/${n.slug}`} className="group flex flex-col">
                    <div className="relative w-full overflow-hidden bg-gray-100 rounded-md" style={{ aspectRatio: '16/9' }}>
                      {n.image_url
                        ? <Image src={n.image_url} alt={n.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                        : <div className="absolute inset-0 bg-gray-200" />
                      }
                    </div>
                    <div className="pt-2">
                      {cat && <span className="text-[9px] font-extrabold uppercase tracking-wider block mb-0.5 text-red-600">{cat.name}</span>}
                      <p className="text-[13px] font-bold text-[#1a1a2e] leading-snug line-clamp-3 group-hover:text-red-600 transition-colors">{n.title}</p>
                      {dateStr && <span className="text-[10px] text-gray-400 mt-0.5 block">{dateStr}</span>}
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* ── KATEGORİ BÖLÜMLERİ — full width, 6 sütun grid ─── */}
      <div className="w-full px-4 sm:px-6 py-4">

        {secondarySliders.length > 0 && (
          <div className="mb-4">
            <SecondarySlider sliders={secondarySliders} />
          </div>
        )}

        {columnists.length > 0 && (
          <div className="bg-white mb-4 px-4 sm:px-5 pt-4 pb-3 rounded-xl">
            <ColumnistsSlider columnists={columnists} />
          </div>
        )}

        {/* Her kategori: renkli badge + 6 kart */}
        <div className="divide-y-2 divide-gray-100 bg-white rounded-xl overflow-hidden">
          {catSections.map(sec => {
            if (!sec.news.length) return null
            return (
              <div key={sec.slug} className="px-4 sm:px-5 py-5">
                {/* Kategori badge başlığı — referans gibi */}
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-white text-[13px] font-extrabold uppercase tracking-widest px-3 py-1 shrink-0"
                    style={{ background: sec.accent }}>
                    {sec.title}
                  </span>
                  <div className="flex-1 h-px" style={{ background: sec.accent, opacity: 0.25 }} />
                  <Link href={`/kategori/${sec.slug}`}
                    className="text-[11px] font-bold shrink-0 hover:underline flex items-center gap-0.5"
                    style={{ color: sec.accent }}>
                    Tümü
                    <svg width="10" height="10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>

                {/* 6 kart — eşit boyut */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                  {sec.news.map(n => {
                    const dt = n.published_at ? new Date(n.published_at) : null
                    const dateStr = dt ? dt.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' }) : ''
                    return (
                      <Link key={n.id} href={`/haber/${n.slug}`} className="group flex flex-col">
                        <div className="relative w-full overflow-hidden bg-gray-100 rounded-md" style={{ aspectRatio: '16/9' }}>
                          {n.image_url
                            ? <Image src={n.image_url} alt={n.title} fill
                                className="object-cover group-hover:scale-105 transition-transform duration-500" />
                            : <div className="absolute inset-0 bg-gray-200" />
                          }
                        </div>
                        <div className="pt-2">
                          <span className="text-[9px] font-extrabold uppercase tracking-wider block mb-0.5"
                            style={{ color: sec.accent }}>
                            {sec.title}
                          </span>
                          <p className="text-[13px] font-bold text-[#1a1a2e] leading-snug line-clamp-3 group-hover:text-red-600 transition-colors">
                            {n.title}
                          </p>
                          {dateStr && <span className="text-[10px] text-gray-400 mt-0.5 block">{dateStr}</span>}
                        </div>
                      </Link>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>

        {/* Alt: sidebar içerikleri yatay band olarak */}
        <div className="mt-4 grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* En çok okunanlar */}
          <div className="bg-white lg:col-span-2 px-5 py-4">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-[4px] h-5 bg-red-600 shrink-0" />
              <h3 className="text-[14px] font-extrabold text-[#1a1a2e] uppercase tracking-wide">En Çok Okunanlar</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6">
              {mostRead.map((n, i) => (
                <Link key={n.id} href={`/haber/${n.slug}`}
                  className="group flex gap-3 items-center py-2.5 border-b border-gray-100 last:border-0 hover:bg-gray-50 -mx-2 px-2 transition-colors rounded">
                  {/* Sıra numarası */}
                  <span className="text-[22px] font-black shrink-0 w-7 text-center leading-none tabular-nums"
                    style={{ color: i === 0 ? '#dc2626' : i === 1 ? '#1a1a2e' : '#d1d5db' }}>
                    {i + 1}
                  </span>
                  {/* Thumbnail */}
                  <div className="relative w-[72px] h-[48px] shrink-0 overflow-hidden rounded bg-gray-100">
                    {n.image_url
                      ? <Image src={n.image_url} alt={n.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
                      : <div className="absolute inset-0 bg-gray-200" />
                    }
                  </div>
                  {/* Başlık + görüntülenme */}
                  <div className="min-w-0 flex-1">
                    <p className="text-[12px] font-bold text-[#1a1a2e] group-hover:text-red-600 transition-colors leading-snug line-clamp-2">{n.title}</p>
                    <p className="text-[10px] text-gray-400 mt-1 flex items-center gap-1">
                      <svg className="w-3 h-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      {n.view_count?.toLocaleString('tr-TR')}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* WhatsApp + Puan Tablosu */}
          <div className="flex flex-col gap-4">

            {/* Brand Tanıtım Kartı — referans tarzı, lacivert + kırmızı, diagonal */}
            <div className="rounded-xl overflow-hidden relative" style={{ minHeight: 150 }}>
              {/* Lacivert taban */}
              <div className="absolute inset-0 bg-[#1a1a2e]" />
              {/* Kırmızı sağ panel — diagonal ayraç */}
              <div className="absolute right-0 top-0 bottom-0 bg-red-600"
                style={{ width: '55%', clipPath: 'polygon(18% 0, 100% 0, 100% 100%, 0% 100%)' }} />

              {/* İçerik katmanı */}
              <div className="relative z-10 flex items-center" style={{ minHeight: 150 }}>

                {/* Sol: Logo (büyük, ortalı) */}
                <div className="flex items-center justify-center w-[45%] px-3 py-5">
                  <Image
                    src="https://res.cloudinary.com/dfbwqwibi/image/upload/sjbiqbjcew51rhcdqy2w"
                    alt="Ulusmeydan Haber"
                    width={130}
                    height={85}
                    className="object-contain w-full max-w-[130px]"
                  />
                </div>

                {/* Sağ: Slogan + site + sosyal */}
                <div className="flex flex-col items-center justify-center flex-1 text-center px-3 py-4 gap-2">
                  <p className="text-white font-black text-[13px] leading-snug uppercase tracking-wide">
                    GERÇEĞİN<br />PEŞİNDE<br />
                    <span className="text-white/90 font-extrabold text-[11px] normal-case tracking-wider">HALKIN YANINDA</span>
                  </p>
                  <p className="text-white/70 text-[8px] tracking-widest uppercase">www.ulusmeydan.com</p>
                  <div className="flex gap-3">
                    <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-white/80 hover:text-white transition-colors">
                      <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                    </a>
                    <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="text-white/80 hover:text-white transition-colors">
                      <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                    </a>
                    <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-white/80 hover:text-white transition-colors">
                      <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                    </a>
                    <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="text-white/80 hover:text-white transition-colors">
                      <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                    </a>
                  </div>
                </div>

              </div>
            </div>

            <div className="bg-white rounded-xl overflow-hidden">
              <StandingsWidget />
            </div>
          </div>
        </div>

        {latest.length === 0 && (
          <div className="text-center py-24 bg-white mt-4">
            <h2 className="text-xl font-extrabold text-[#1a1a2e] mb-2">Henüz haber yok</h2>
            <p className="text-gray-400 text-sm mb-6">Admin panelinden ilk haberi ekleyin</p>
            <Link href="/admin/giris" className="inline-flex items-center gap-2 bg-red-600 text-white font-bold text-sm px-6 py-3 hover:bg-red-700 transition-all">
              Admin Paneline Git
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}