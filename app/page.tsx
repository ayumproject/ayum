import { createClient } from '@/lib/supabase/server'
import HeroSlider from '@/components/HeroSlider'
import NewsCard from '@/components/NewsCard'
import Link from 'next/link'
import type { News, Slider } from '@/lib/types'

export const revalidate = 60

async function getSliders(): Promise<Slider[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('sliders').select('*').eq('is_active', true).order('order_index')
  return data || []
}

async function getLatestNews(limit = 20): Promise<News[]> {
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
    .order('published_at', { ascending: false }).limit(6)
  return (data as News[]) || []
}

async function getCategoryNews(slug: string, limit = 5): Promise<News[]> {
  const supabase = await createClient()
  const { data: cat } = await supabase.from('categories').select('id').eq('slug', slug).single()
  if (!cat) return []
  const { data } = await supabase
    .from('news').select('*, category:categories(*)')
    .eq('is_published', true).eq('category_id', cat.id)
    .order('published_at', { ascending: false }).limit(limit)
  return (data as News[]) || []
}

const featuredSections = [
  { name: 'Gündem', slug: 'gundem', color: '#dc2626' },
  { name: 'Spor', slug: 'spor', color: '#2563eb' },
  { name: 'Ekonomi', slug: 'ekonomi', color: '#059669' },
]

export default async function HomePage() {
  const [sliders, latestNews, breakingNews, gundem, spor, ekonomi] = await Promise.all([
    getSliders(),
    getLatestNews(20),
    getBreakingNews(),
    getCategoryNews('gundem', 5),
    getCategoryNews('spor', 5),
    getCategoryNews('ekonomi', 5),
  ])

  const heroNews = latestNews.slice(0, 1)[0]
  const secondaryNews = latestNews.slice(1, 4)
  const sideNews = latestNews.slice(4, 10)
  const moreNews = latestNews.slice(10)

  const categorySections = [
    { ...featuredSections[0], news: gundem },
    { ...featuredSections[1], news: spor },
    { ...featuredSections[2], news: ekonomi },
  ]

  return (
    <div className="min-h-screen bg-[#f1f5f9]">
      {/* Breaking News Ticker */}
      {breakingNews.length > 0 && (
        <div className="bg-[#dc2626] overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 flex items-stretch">
            <div className="bg-[#b91c1c] flex items-center px-4 py-2 shrink-0 gap-2 z-10">
              <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
              <span className="text-white font-black text-[10px] uppercase tracking-widest whitespace-nowrap">Son Dakika</span>
            </div>
            <div className="overflow-hidden flex-1 py-2">
              <div className="ticker-track text-white text-sm font-medium pl-6">
                {breakingNews.map((n, i) => (
                  <Link key={n.id} href={`/haber/${n.slug}`} className="inline hover:underline mr-16">
                    {i > 0 && <span className="mr-16 opacity-40">●</span>}
                    {n.title}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hero Slider */}
      <HeroSlider sliders={sliders} />

      <div className="max-w-7xl mx-auto px-4 py-8 space-y-10">

        {/* ── Top Stories ── */}
        {latestNews.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-5">
              <h2 className="section-title">Son Haberler</h2>
              <Link href="/kategori/gundem" className="text-xs font-bold text-[#dc2626] hover:text-[#b91c1c] uppercase tracking-wider flex items-center gap-1 transition-colors">
                Tümü
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              {/* Hero card - large */}
              {heroNews && (
                <div className="lg:col-span-7 h-[460px]">
                  <NewsCard news={heroNews} variant="hero" />
                </div>
              )}

              {/* Side cards */}
              <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
                {secondaryNews.map((news) => (
                  <NewsCard key={news.id} news={news} variant="featured" />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── Main Content + Sidebar ── */}
        {(sideNews.length > 0 || moreNews.length > 0) && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main */}
            <div className="lg:col-span-2 space-y-4">
              <h2 className="section-title">Öne Çıkanlar</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {sideNews.map((news) => (
                  <NewsCard key={news.id} news={news} />
                ))}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Most read */}
              <div className="bg-white rounded-2xl p-5 shadow-sm">
                <h3 className="section-title text-sm mb-4">En Çok Okunanlar</h3>
                <div className="space-y-1">
                  {latestNews
                    .slice()
                    .sort((a, b) => b.view_count - a.view_count)
                    .slice(0, 5)
                    .map((news, i) => (
                      <Link
                        key={news.id}
                        href={`/haber/${news.slug}`}
                        className="group flex gap-3 items-start py-3 border-b border-slate-100 last:border-0"
                      >
                        <span className="font-black text-2xl text-slate-200 group-hover:text-[#dc2626] transition-colors w-7 shrink-0 leading-none mt-0.5">
                          {i + 1}
                        </span>
                        <div>
                          <p className="text-sm font-bold text-slate-800 group-hover:text-[#dc2626] transition-colors leading-snug line-clamp-2">
                            {news.title}
                          </p>
                          <p className="text-[11px] text-slate-400 mt-1">
                            {news.view_count.toLocaleString('tr-TR')} görüntülenme
                          </p>
                        </div>
                      </Link>
                    ))}
                </div>
              </div>

              {/* Latest compact */}
              {moreNews.length > 0 && (
                <div className="bg-white rounded-2xl p-5 shadow-sm">
                  <h3 className="section-title text-sm mb-4">Son Eklenenler</h3>
                  <div>
                    {moreNews.slice(0, 6).map((news) => (
                      <NewsCard key={news.id} news={news} variant="compact" />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── Category Sections ── */}
        {categorySections.map(({ name, slug, color, news }) => {
          if (!news || news.length === 0) return null
          const [main, ...rest] = news

          return (
            <section key={slug}>
              {/* Section header */}
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <span className="w-1 h-6 rounded" style={{ backgroundColor: color }} />
                  <h2 className="text-lg font-black uppercase tracking-wider text-[#0f172a]">{name}</h2>
                  <span className="hidden sm:block h-px flex-1 bg-slate-200 min-w-[40px]" />
                </div>
                <Link
                  href={`/kategori/${slug}`}
                  className="text-xs font-bold uppercase tracking-wider flex items-center gap-1 transition-colors hover:opacity-70"
                  style={{ color }}
                >
                  Tümü
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
                {/* Main featured */}
                <div className="lg:col-span-2 h-[320px]">
                  <NewsCard news={main} variant="featured" />
                </div>
                {/* Rest */}
                <div className="lg:col-span-3 bg-white rounded-xl shadow-sm p-1 divide-y divide-slate-100">
                  {rest.map((news) => (
                    <div key={news.id} className="px-3">
                      <NewsCard news={news} variant="horizontal" />
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )
        })}

        {/* ── Empty State ── */}
        {latestNews.length === 0 && (
          <div className="text-center py-24">
            <div className="w-20 h-20 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-5">
              <svg className="w-10 h-10 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
            </div>
            <h3 className="text-xl font-black text-slate-600 mb-2">Henüz haber yok</h3>
            <p className="text-slate-400 text-sm mb-5">Admin panelinden ilk haberi ekleyerek başlayın</p>
            <Link
              href="/admin"
              className="inline-flex items-center gap-2 bg-[#dc2626] text-white font-bold text-sm px-5 py-2.5 rounded-lg hover:bg-[#b91c1c] transition-colors"
            >
              Admin Paneli
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}