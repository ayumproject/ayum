import { createClient } from '@/lib/supabase/server'
import HeroSlider from '@/components/HeroSlider'
import NewsCard from '@/components/NewsCard'
import Link from 'next/link'
import type { News, Slider } from '@/lib/types'

export const revalidate = 60

async function getSliders(): Promise<Slider[]> {
  const supabase = await createClient()
  const { data } = await supabase.from('sliders').select('*').eq('is_active', true).order('order_index')
  return data || []
}
async function getLatestNews(limit = 24): Promise<News[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('news').select('*, category:categories(*)')
    .eq('is_published', true).order('published_at', { ascending: false }).limit(limit)
  return (data as News[]) || []
}
async function getBreakingNews(): Promise<News[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('news').select('id, title, slug')
    .eq('is_published', true).eq('is_breaking', true)
    .order('published_at', { ascending: false }).limit(8)
  return (data as News[]) || []
}
async function getCategoryNews(slug: string, limit = 6): Promise<News[]> {
  const supabase = await createClient()
  const { data: cat } = await supabase.from('categories').select('id').eq('slug', slug).single()
  if (!cat) return []
  const { data } = await supabase
    .from('news').select('*, category:categories(*)')
    .eq('is_published', true).eq('category_id', cat.id)
    .order('published_at', { ascending: false }).limit(limit)
  return (data as News[]) || []
}

const catSections = [
  { name: 'Gündem', slug: 'gundem', color: '#C0282D' },
  { name: 'Spor',   slug: 'spor',   color: '#1d4ed8' },
  { name: 'Ekonomi',slug: 'ekonomi',color: '#047857' },
]

function SectionHeader({ title, slug, color }: { title: string; slug: string; color: string }) {
  return (
    <div className="flex items-center justify-between mb-3 pb-2 border-b-2" style={{ borderColor: color }}>
      <div className="flex items-center gap-2">
        <span className="w-1 h-5 rounded" style={{ background: color }} />
        <h2 className="text-base font-black text-gray-900 uppercase tracking-wide">{title}</h2>
      </div>
      <Link href={`/kategori/${slug}`} className="text-[11px] font-semibold text-gray-500 hover:text-gray-800 uppercase tracking-wider transition-colors">
        Tümü →
      </Link>
    </div>
  )
}

export default async function HomePage() {
  const [sliders, latest, breaking, gundem, spor, ekonomi] = await Promise.all([
    getSliders(),
    getLatestNews(24),
    getBreakingNews(),
    getCategoryNews('gundem', 6),
    getCategoryNews('spor', 6),
    getCategoryNews('ekonomi', 6),
  ])

  const heroNews = latest[0]
  const featured = latest.slice(1, 4)
  const gridNews = latest.slice(4, 12)
  const sidebarLatest = latest.slice(0, 8)
  const mostRead = [...latest].sort((a, b) => b.view_count - a.view_count).slice(0, 6)

  const sections = [
    { ...catSections[0], news: gundem },
    { ...catSections[1], news: spor },
    { ...catSections[2], news: ekonomi },
  ]

  return (
    <div className="min-h-screen bg-gray-100">

      {/* ── Breaking news ticker ── */}
      {breaking.length > 0 && (
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-screen-xl mx-auto px-4">
            <div className="flex items-center h-10 overflow-hidden">
              {/* Label */}
              <div className="flex items-center gap-2 shrink-0 pr-4 border-r border-gray-200 mr-4">
                <svg className="w-4 h-4 text-[#C0282D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-[#C0282D] text-xs font-black uppercase tracking-wider whitespace-nowrap">Son Dakika</span>
              </div>
              {/* Ticker */}
              <div className="overflow-hidden flex-1">
                <div className="ticker-inner">
                  {[...breaking, ...breaking].map((n, i) => (
                    <Link key={`${n.id}-${i}`} href={`/haber/${n.slug}`} className="text-gray-700 hover:text-[#C0282D] text-xs font-medium mr-12 hover:underline transition-colors">
                      {n.title}
                      <span className="mx-6 text-gray-300">|</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Hero Slider ── */}
      <HeroSlider sliders={sliders} />

      {/* ── Main Content ── */}
      <div className="max-w-screen-xl mx-auto px-4 py-5">

        {/* ── Featured news grid ── */}
        {latest.length > 0 && (
          <div className="mb-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">

              {/* Big hero card */}
              {heroNews && (
                <div className="lg:col-span-7">
                  <NewsCard news={heroNews} variant="hero" />
                </div>
              )}

              {/* 3 smaller featured */}
              <div className="lg:col-span-5 grid grid-cols-1 gap-3">
                {featured.map((n) => (
                  <div key={n.id} style={{ minHeight: '130px', flex: 1 }}>
                    <NewsCard news={n} variant="featured" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Main 2-column layout ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

          {/* Left: news grid */}
          <div className="lg:col-span-2 space-y-5">

            {/* Latest news grid */}
            {gridNews.length > 0 && (
              <div>
                <SectionHeader title="Son Haberler" slug="gundem" color="#C0282D" />
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {gridNews.map((n) => (
                    <NewsCard key={n.id} news={n} />
                  ))}
                </div>
              </div>
            )}

            {/* Category sections */}
            {sections.map(({ name, slug, color, news }) => {
              if (!news.length) return null
              const [main, ...rest] = news
              return (
                <div key={slug}>
                  <SectionHeader title={name} slug={slug} color={color} />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Main featured */}
                    <div style={{ minHeight: '220px' }}>
                      <NewsCard news={main} variant="featured" />
                    </div>
                    {/* List of rest */}
                    <div className="bg-white rounded-lg p-3">
                      {rest.slice(0, 4).map((n) => (
                        <NewsCard key={n.id} news={n} variant="horizontal" />
                      ))}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Right: sidebar */}
          <div className="space-y-5">

            {/* En çok okunanlar */}
            <div className="bg-white rounded-lg overflow-hidden">
              <div className="px-4 py-3 border-b-2 border-[#C0282D] flex items-center gap-2">
                <svg className="w-4 h-4 text-[#C0282D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                <h3 className="text-sm font-black text-gray-900 uppercase tracking-wide">En Çok Okunanlar</h3>
              </div>
              <div className="p-3">
                {mostRead.map((n, i) => (
                  <Link key={n.id} href={`/haber/${n.slug}`} className="group flex gap-3 items-start py-3 border-b border-gray-100 last:border-0">
                    <span className="text-2xl font-black shrink-0 w-7 leading-none" style={{ color: i < 2 ? '#C0282D' : '#d1d5db' }}>
                      {i + 1}
                    </span>
                    <div>
                      <p className="text-[13px] font-semibold text-gray-800 group-hover:text-[#C0282D] transition-colors leading-snug line-clamp-2">
                        {n.title}
                      </p>
                      <p className="text-[11px] text-gray-400 mt-0.5">{n.view_count.toLocaleString('tr-TR')} görüntülenme</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Son haberler sidebar */}
            <div className="bg-white rounded-lg overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-100">
                <h3 className="text-sm font-black text-gray-900 uppercase tracking-wide">Son Haberler</h3>
              </div>
              <div className="p-3">
                {sidebarLatest.map((n) => (
                  <NewsCard key={n.id} news={n} variant="list" />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Empty state */}
        {latest.length === 0 && (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
            </div>
            <h2 className="text-lg font-bold text-gray-600 mb-1">Henüz haber yok</h2>
            <p className="text-gray-400 text-sm mb-4">Admin panelinden ilk haberi ekleyin</p>
            <Link href="/admin" className="inline-flex items-center gap-2 bg-[#C0282D] text-white font-semibold text-sm px-5 py-2.5 rounded-lg hover:bg-[#9b1f23] transition-colors">
              Admin Paneline Git
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}