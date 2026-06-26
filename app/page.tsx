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
    .order('published_at', { ascending: false }).limit(8)
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

const sections = [
  { name: 'Gündem', slug: 'gundem', color: '#ef4444' },
  { name: 'Spor', slug: 'spor', color: '#2B59FF' },
  { name: 'Ekonomi', slug: 'ekonomi', color: '#059669' },
]

export default async function HomePage() {
  const [sliders, latest, breaking, gundem, spor, ekonomi] = await Promise.all([
    getSliders(),
    getLatestNews(20),
    getBreakingNews(),
    getCategoryNews('gundem', 5),
    getCategoryNews('spor', 5),
    getCategoryNews('ekonomi', 5),
  ])

  const [heroNews, ...rest] = latest
  const featured = rest.slice(0, 3)
  const gridNews = rest.slice(3, 9)
  const sidebarNews = rest.slice(9, 15)

  const catSections = [
    { ...sections[0], news: gundem },
    { ...sections[1], news: spor },
    { ...sections[2], news: ekonomi },
  ]

  return (
    <div className="min-h-screen" style={{ background: '#F0F4FA' }}>

      {/* ── Breaking ticker ── */}
      {breaking.length > 0 && (
        <div className="relative overflow-hidden bg-[#2B59FF]">
          <div className="max-w-[1440px] mx-auto sm:px-16 px-6 flex items-stretch">
            <div className="flex items-center gap-2 py-2.5 pr-5 border-r border-white/20 shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              <span className="text-white font-extrabold text-[9px] uppercase tracking-[0.2em] whitespace-nowrap">Son Dakika</span>
            </div>
            <div className="overflow-hidden flex-1 py-2.5 relative">
              <div className="ticker-inner pl-6">
                {[...breaking, ...breaking].map((n, i) => (
                  <Link key={`${n.id}-${i}`} href={`/haber/${n.slug}`} className="text-white/90 hover:text-white text-xs font-medium mr-14 hover:underline">
                    {n.title}
                    {i < breaking.length * 2 - 1 && <span className="mx-6 text-white/30">•</span>}
                  </Link>
                ))}
              </div>
              <div className="absolute left-0 top-0 bottom-0 w-6 bg-gradient-to-r from-[#2B59FF] to-transparent" />
              <div className="absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-l from-[#2B59FF] to-transparent" />
            </div>
          </div>
        </div>
      )}

      {/* ── Hero Slider ── */}
      <HeroSlider sliders={sliders} />

      {/* ── Main content ── */}
      <div className="max-w-[1440px] mx-auto sm:px-16 px-6 py-12 space-y-16" id="haberler">

        {/* ── Top Stories ── */}
        {latest.length > 0 && (
          <section>
            {/* Section header - car site style */}
            <div className="home__text-container mb-8">
              <h1 className="section-title">Son Haberler</h1>
              <p className="section-subtitle">En güncel haberleri keşfedin</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              {heroNews && (
                <div className="lg:col-span-7 h-[500px]">
                  <NewsCard news={heroNews} variant="hero" />
                </div>
              )}
              <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-4">
                {featured.map((n) => (
                  <NewsCard key={n.id} news={n} variant="featured" />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── News catalogue (car-card grid) ── */}
        {gridNews.length > 0 && (
          <section>
            <div className="home__text-container mb-8">
              <h2 className="section-title">Öne Çıkanlar</h2>
              <p className="section-subtitle">Seçilmiş haberler</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Car-card style grid */}
              <div className="lg:col-span-2">
                {/* home__cars-wrapper from car site */}
                <div className="grid 2xl:grid-cols-3 xl:grid-cols-2 md:grid-cols-2 grid-cols-1 gap-6">
                  {gridNews.map((n) => (
                    <NewsCard key={n.id} news={n} />
                  ))}
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-5">
                {/* Most read widget */}
                <div className="bg-white rounded-3xl p-6" style={{ boxShadow: '0 4px 20px rgba(43,89,255,0.06)' }}>
                  <div className="home__text-container mb-5">
                    <h3 className="text-lg font-extrabold text-[#2B2C35]">En Çok Okunanlar</h3>
                  </div>
                  <div>
                    {latest
                      .slice().sort((a, b) => b.view_count - a.view_count).slice(0, 5)
                      .map((n, i) => (
                        <Link key={n.id} href={`/haber/${n.slug}`} className="group flex gap-3 items-start py-3.5 border-b border-[#F5F8FF] last:border-0">
                          <span
                            className="text-3xl font-extrabold shrink-0 leading-none w-8 tabular-nums"
                            style={{ color: i === 0 ? '#2B59FF' : i === 1 ? '#f79761' : '#e2e8f0' }}
                          >
                            {i + 1}
                          </span>
                          <div>
                            <p className="text-sm font-semibold text-[#2B2C35] group-hover:text-[#2B59FF] transition-colors leading-snug line-clamp-2">
                              {n.title}
                            </p>
                            <p className="text-[11px] text-[#747A88] mt-1">{n.view_count.toLocaleString('tr-TR')} görüntülenme</p>
                          </div>
                        </Link>
                      ))}
                  </div>
                </div>

                {/* Latest compact */}
                {sidebarNews.length > 0 && (
                  <div className="bg-white rounded-3xl p-5" style={{ boxShadow: '0 4px 20px rgba(43,89,255,0.06)' }}>
                    <h3 className="text-base font-extrabold text-[#2B2C35] mb-4">Son Eklenenler</h3>
                    <div>
                      {sidebarNews.slice(0, 6).map((n) => (
                        <NewsCard key={n.id} news={n} variant="compact" />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* ── Category Sections ── */}
        {catSections.map(({ name, slug, color, news }) => {
          if (!news || news.length === 0) return null
          const [main, ...rest] = news

          return (
            <section key={slug}>
              <div className="flex-between mb-8">
                <div className="home__text-container">
                  <h2 className="text-2xl font-extrabold text-[#2B2C35] flex items-center gap-3">
                    <span className="w-1 h-7 rounded-full" style={{ background: color }} />
                    {name}
                  </h2>
                  <p className="section-subtitle">{name} kategorisindeki son haberler</p>
                </div>
                <Link
                  href={`/kategori/${slug}`}
                  className="custom-btn rounded-full text-xs font-bold px-4 py-2 border-2 bg-transparent"
                  style={{ color, borderColor: `${color}30`, backgroundColor: `${color}08` }}
                >
                  Tümünü Gör
                </Link>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
                <div className="lg:col-span-2 h-[280px]">
                  <NewsCard news={main} variant="featured" />
                </div>
                <div className="lg:col-span-3 bg-white rounded-3xl px-2 py-1 divide-y divide-[#F5F8FF]" style={{ boxShadow: '0 4px 20px rgba(43,89,255,0.05)' }}>
                  {rest.map((n) => (
                    <div key={n.id} className="px-4">
                      <NewsCard news={n} variant="horizontal" />
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )
        })}

        {/* ── Empty state ── */}
        {latest.length === 0 && (
          <div className="home__error-container py-20">
            <div className="w-24 h-24 rounded-3xl bg-[#F5F8FF] flex items-center justify-center mb-6">
              <svg className="w-12 h-12 text-[#a0aec0]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
            </div>
            <h2 className="text-xl font-extrabold text-[#2B2C35]">Henüz haber yok</h2>
            <p className="text-[#747A88] text-sm mt-2 mb-6">Admin panelinden ilk haberi ekleyin</p>
            <Link
              href="/admin"
              className="custom-btn bg-[#2B59FF] text-white rounded-full px-6 py-3 text-sm"
              style={{ boxShadow: '0 8px 25px rgba(43,89,255,0.3)' }}
            >
              Admin Paneline Git
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}