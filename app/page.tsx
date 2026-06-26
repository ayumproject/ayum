import { createClient } from '@/lib/supabase/server'
import HeroSlider from '@/components/HeroSlider'
import NewsCard from '@/components/NewsCard'
import Link from 'next/link'
import type { News, Slider } from '@/lib/types'

export const revalidate = 60

/* ── data helpers ── */
async function getSliders(): Promise<Slider[]> {
  const sb = await createClient()
  const { data } = await sb.from('sliders').select('*').eq('is_active', true).order('order_index')
  return data || []
}
async function getLatestNews(limit = 20): Promise<News[]> {
  const sb = await createClient()
  const { data } = await sb
    .from('news').select('*, category:categories(*)')
    .eq('is_published', true).order('published_at', { ascending: false }).limit(limit)
  return (data as News[]) || []
}
async function getBreakingNews(): Promise<News[]> {
  const sb = await createClient()
  const { data } = await sb
    .from('news').select('id, title, slug')
    .eq('is_published', true).eq('is_breaking', true)
    .order('published_at', { ascending: false }).limit(8)
  return (data as News[]) || []
}
async function getCatNews(slug: string, limit = 5): Promise<News[]> {
  const sb = await createClient()
  const { data: cat } = await sb.from('categories').select('id').eq('slug', slug).single()
  if (!cat) return []
  const { data } = await sb
    .from('news').select('*, category:categories(*)')
    .eq('is_published', true).eq('category_id', cat.id)
    .order('published_at', { ascending: false }).limit(limit)
  return (data as News[]) || []
}

/* ── section header ── */
function SectionHeader({ title, slug, color = '#2B59FF' }: { title: string; slug?: string; color?: string }) {
  return (
    <div className="flex items-center justify-between mb-5">
      <div className="flex items-center gap-3">
        <span className="w-1 h-7 rounded-full" style={{ background: color }} />
        <h2 className="text-[18px] font-extrabold text-[#2B2C35]" style={{ letterSpacing: '-0.02em' }}>
          {title}
        </h2>
      </div>
      {slug && (
        <Link href={`/kategori/${slug}`}
          className="text-[12px] font-bold text-[#2B59FF] hover:text-[#1e46e8] flex items-center gap-1 transition-colors">
          Tümü
          <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      )}
    </div>
  )
}

export default async function HomePage() {
  const [sliders, latest, breaking, gundem, spor, ekonomi] = await Promise.all([
    getSliders(),
    getLatestNews(20),
    getBreakingNews(),
    getCatNews('gundem', 5),
    getCatNews('spor', 5),
    getCatNews('ekonomi', 5),
  ])

  const heroNews   = latest[0]
  const featured   = latest.slice(1, 4)
  const gridNews   = latest.slice(4, 10)
  const sideLatest = latest.slice(0, 6)
  const mostRead   = [...latest].sort((a, b) => b.view_count - a.view_count).slice(0, 5)

  const catSections = [
    { title: 'Gündem',  slug: 'gundem',  color: '#2B59FF', news: gundem  },
    { title: 'Spor',    slug: 'spor',    color: '#f79761', news: spor    },
    { title: 'Ekonomi', slug: 'ekonomi', color: '#2B2C35', news: ekonomi },
  ]

  return (
    <div className="min-h-screen bg-[#F5F8FF]">

      {/* ── Breaking news ticker ── */}
      {breaking.length > 0 && (
        <div className="bg-white border-b border-gray-100">
          <div className="max-w-[1440px] mx-auto px-6 sm:px-16">
            <div className="flex items-center h-10 overflow-hidden gap-4">
              <div className="flex items-center gap-2 shrink-0 pr-4 border-r border-gray-100">
                <span className="w-2 h-2 rounded-full bg-[#f79761] animate-pulse" />
                <span className="text-[#f79761] text-[11px] font-extrabold uppercase tracking-widest whitespace-nowrap">
                  Son Dakika
                </span>
              </div>
              <div className="ticker-wrap">
                <div className="ticker-inner">
                  {[...breaking, ...breaking].map((n, i) => (
                    <Link key={`${n.id}-${i}`} href={`/haber/${n.slug}`}
                      className="text-[#2B2C35] hover:text-[#2B59FF] text-[12px] font-semibold mr-10 hover:underline transition-colors whitespace-nowrap">
                      {n.title}
                      <span className="mx-6 text-gray-200">|</span>
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

      {/* ── Main content ── */}
      <div className="max-w-[1440px] mx-auto px-6 sm:px-16 py-8">

        {/* ── Featured grid: 1 hero + 3 stacked ── */}
        {latest.length > 0 && (
          <div className="mb-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              {heroNews && (
                <div className="lg:col-span-7">
                  <NewsCard news={heroNews} variant="hero" />
                </div>
              )}
              <div className="lg:col-span-5 grid grid-rows-3 gap-3">
                {featured.map((n) => (
                  <NewsCard key={n.id} news={n} variant="featured" />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Main 2-col layout ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Left 2/3: content */}
          <div className="lg:col-span-2 space-y-10">

            {/* Son haberler grid */}
            {gridNews.length > 0 && (
              <div>
                <SectionHeader title="Son Haberler" slug="gundem" />
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {gridNews.map((n) => <NewsCard key={n.id} news={n} />)}
                </div>
              </div>
            )}

            {/* Category sections */}
            {catSections.map(({ title, slug, color, news }) => {
              if (!news.length) return null
              const [main, ...rest] = news
              return (
                <div key={slug}>
                  <SectionHeader title={title} slug={slug} color={color} />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Main card */}
                    <div style={{ minHeight: 220 }}>
                      <NewsCard news={main} variant="featured" />
                    </div>
                    {/* List */}
                    <div className="bg-white rounded-3xl p-4">
                      {rest.slice(0, 4).map((n) => (
                        <NewsCard key={n.id} news={n} variant="horizontal" />
                      ))}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Right 1/3: sidebar */}
          <div className="space-y-6">

            {/* En çok okunanlar */}
            <div className="bg-white rounded-3xl overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-50 flex items-center gap-2">
                <span className="w-1 h-5 rounded-full bg-[#f79761]" />
                <h3 className="text-[15px] font-extrabold text-[#2B2C35]" style={{ letterSpacing: '-0.02em' }}>
                  En Çok Okunanlar
                </h3>
              </div>
              <div className="px-5 py-2">
                {mostRead.map((n, i) => (
                  <Link key={n.id} href={`/haber/${n.slug}`}
                    className="group flex gap-3 items-start py-3 border-b border-gray-50 last:border-0">
                    <span className="text-3xl font-extrabold shrink-0 w-8 leading-none"
                      style={{ color: i < 2 ? '#2B59FF' : '#e5e7eb' }}>
                      {i + 1}
                    </span>
                    <div>
                      <p className="text-[13px] font-bold text-[#2B2C35] group-hover:text-[#2B59FF] transition-colors leading-snug line-clamp-2">
                        {n.title}
                      </p>
                      <p className="text-[11px] text-[#747A88] mt-0.5 font-medium flex items-center gap-1">
                        <svg width="10" height="10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        {n.view_count.toLocaleString('tr-TR')}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Son haberler list */}
            <div className="bg-white rounded-3xl overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-50 flex items-center gap-2">
                <span className="w-1 h-5 rounded-full bg-[#2B59FF]" />
                <h3 className="text-[15px] font-extrabold text-[#2B2C35]" style={{ letterSpacing: '-0.02em' }}>
                  Son Haberler
                </h3>
              </div>
              <div className="px-5 py-2">
                {sideLatest.map((n) => (
                  <NewsCard key={n.id} news={n} variant="list" />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Empty state */}
        {latest.length === 0 && (
          <div className="text-center py-24">
            <div className="w-20 h-20 bg-[#F5F8FF] rounded-3xl flex items-center justify-center mx-auto mb-5 shadow-[0_4px_24px_rgba(43,89,255,0.1)]">
              <svg className="w-10 h-10 text-[#2B59FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
            </div>
            <h2 className="text-xl font-extrabold text-[#2B2C35] mb-2" style={{ letterSpacing: '-0.02em' }}>
              Henüz haber yok
            </h2>
            <p className="text-[#747A88] text-sm mb-6">Admin panelinden ilk haberi ekleyin</p>
            <Link href="/admin/giris"
              className="inline-flex items-center gap-2 bg-[#2B59FF] text-white font-bold text-sm px-6 py-3 rounded-full hover:bg-[#1e46e8] transition-all shadow-[0_8px_30px_rgba(43,89,255,0.35)]">
              Admin Paneline Git
              <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}