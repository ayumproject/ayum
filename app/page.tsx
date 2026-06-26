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
  { name: 'Spor', slug: 'spor', color: '#3b82f6' },
  { name: 'Ekonomi', slug: 'ekonomi', color: '#10b981' },
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
  const moreNews = rest.slice(15)

  const catSections = [
    { ...sections[0], news: gundem },
    { ...sections[1], news: spor },
    { ...sections[2], news: ekonomi },
  ]

  return (
    <div className="min-h-screen bg-[#09090b]">

      {/* ── Breaking ticker ── */}
      {breaking.length > 0 && (
        <div className="relative overflow-hidden border-b border-white/5" style={{ background: 'linear-gradient(135deg, #7f1d1d, #991b1b)' }}>
          <div className="max-w-7xl mx-auto flex items-stretch">
            <div className="flex items-center gap-2 px-4 py-2 bg-red-600/50 border-r border-white/10 shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              <span className="text-white font-black text-[9px] uppercase tracking-[0.2em] whitespace-nowrap">Son Dakika</span>
            </div>
            <div className="overflow-hidden flex-1 py-2 relative">
              <div className="ticker-inner px-6">
                {[...breaking, ...breaking].map((n, i) => (
                  <Link key={`${n.id}-${i}`} href={`/haber/${n.slug}`} className="text-white/90 hover:text-white text-xs font-medium mr-16 hover:underline">
                    {n.title}
                    {i < breaking.length * 2 - 1 && <span className="mx-8 text-white/30">•</span>}
                  </Link>
                ))}
              </div>
              {/* Fade edges */}
              <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-red-900 to-transparent" />
              <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-red-900 to-transparent" />
            </div>
          </div>
        </div>
      )}

      {/* ── Hero Slider ── */}
      <HeroSlider sliders={sliders} />

      <div className="max-w-7xl mx-auto px-4 py-10 space-y-14">

        {/* ── Top Stories ── */}
        {latest.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="section-title">Son Haberler</h2>
              <Link href="/kategori/gundem" className="text-xs text-zinc-500 hover:text-red-400 uppercase tracking-wider font-semibold flex items-center gap-1 transition-colors">
                Tümü
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
              {/* Hero */}
              {heroNews && (
                <div className="lg:col-span-7 h-[480px]">
                  <NewsCard news={heroNews} variant="hero" />
                </div>
              )}
              {/* Featured stack */}
              <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-3">
                {featured.map((n) => (
                  <NewsCard key={n.id} news={n} variant="featured" />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── Grid + Sidebar ── */}
        {(gridNews.length > 0 || sidebarNews.length > 0) && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Main grid */}
            <div className="lg:col-span-2 space-y-6">
              <h2 className="section-title">Öne Çıkanlar</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {gridNews.map((n) => (
                  <NewsCard key={n.id} news={n} />
                ))}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-5">
              {/* Most read */}
              <div className="rounded-2xl border border-white/5 bg-zinc-900/50 overflow-hidden">
                <div className="px-5 py-4 border-b border-white/5 flex items-center justify-between">
                  <h3 className="section-title text-sm">En Çok Okunanlar</h3>
                </div>
                <div className="p-3">
                  {latest
                    .slice()
                    .sort((a, b) => b.view_count - a.view_count)
                    .slice(0, 5)
                    .map((n, i) => (
                      <Link
                        key={n.id}
                        href={`/haber/${n.slug}`}
                        className="group flex gap-3.5 items-start py-3.5 border-b border-white/5 last:border-0 px-2"
                      >
                        <span className="text-3xl font-black text-white/8 group-hover:text-red-500/30 transition-colors shrink-0 leading-none tabular-nums w-8">
                          {i + 1}
                        </span>
                        <div>
                          <p className="text-sm font-semibold text-zinc-300 group-hover:text-white transition-colors leading-snug line-clamp-2"
                             style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
                            {n.title}
                          </p>
                          <p className="text-[11px] text-zinc-600 mt-1">{n.view_count.toLocaleString('tr-TR')} görüntülenme</p>
                        </div>
                      </Link>
                    ))}
                </div>
              </div>

              {/* Latest sidebar */}
              {sidebarNews.length > 0 && (
                <div className="rounded-2xl border border-white/5 bg-zinc-900/50 overflow-hidden">
                  <div className="px-5 py-4 border-b border-white/5">
                    <h3 className="section-title text-sm">Son Eklenenler</h3>
                  </div>
                  <div className="p-2">
                    {sidebarNews.slice(0, 6).map((n) => (
                      <NewsCard key={n.id} news={n} variant="compact" />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── Category Sections ── */}
        {catSections.map(({ name, slug, color, news }) => {
          if (!news || news.length === 0) return null
          const [main, ...rest] = news

          return (
            <section key={slug}>
              {/* Header */}
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <span className="w-0.5 h-6 rounded-full" style={{ background: `linear-gradient(180deg, ${color}, ${color}50)`, boxShadow: `0 0 8px ${color}60` }} />
                  <h2 className="font-black text-base uppercase tracking-wider text-white"
                      style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
                    {name}
                  </h2>
                </div>
                <div className="flex-1 h-px bg-white/5" />
                <Link href={`/kategori/${slug}`} className="text-xs font-semibold uppercase tracking-wider flex items-center gap-1 hover:opacity-80 transition-opacity" style={{ color }}>
                  Tümü
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-5 gap-3">
                {/* Featured */}
                <div className="lg:col-span-2 h-[300px]">
                  <NewsCard news={main} variant="featured" />
                </div>
                {/* List */}
                <div className="lg:col-span-3 rounded-2xl border border-white/5 bg-zinc-900/40 divide-y divide-white/5">
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
          <div className="text-center py-32">
            <div className="w-20 h-20 rounded-3xl bg-zinc-900 border border-white/5 flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-zinc-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
            </div>
            <h3 className="text-xl font-black text-zinc-400 mb-2" style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
              Henüz haber yok
            </h3>
            <p className="text-zinc-600 text-sm mb-6">Admin panelinden ilk haberi ekleyin</p>
            <Link
              href="/admin"
              className="inline-flex items-center gap-2 bg-red-500 text-white font-bold text-sm px-5 py-2.5 rounded-full hover:bg-red-600 transition-colors"
              style={{ boxShadow: '0 0 20px rgba(239,68,68,0.3)' }}
            >
              Admin Paneli
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}