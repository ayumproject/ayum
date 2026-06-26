import { createClient } from '@/lib/supabase/server'
import HeroSlider from '@/components/HeroSlider'
import NewsCard from '@/components/NewsCard'
import Link from 'next/link'
import type { News, Slider } from '@/lib/types'

export const revalidate = 60

async function getSliders(): Promise<Slider[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('sliders')
    .select('*')
    .eq('is_active', true)
    .order('order_index', { ascending: true })
  return data || []
}

async function getLatestNews(): Promise<News[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('news')
    .select('*, category:categories(*)')
    .eq('is_published', true)
    .order('published_at', { ascending: false })
    .limit(10)
  return (data as News[]) || []
}

async function getBreakingNews(): Promise<News[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('news')
    .select('*, category:categories(*)')
    .eq('is_published', true)
    .eq('is_breaking', true)
    .order('published_at', { ascending: false })
    .limit(5)
  return (data as News[]) || []
}

async function getNewsByCategory(): Promise<Record<string, News[]>> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('news')
    .select('*, category:categories(*)')
    .eq('is_published', true)
    .order('published_at', { ascending: false })
    .limit(30)

  const result: Record<string, News[]> = {}
  if (data) {
    for (const item of data as News[]) {
      if (item.category) {
        if (!result[item.category.slug]) {
          result[item.category.slug] = []
        }
        if (result[item.category.slug].length < 4) {
          result[item.category.slug].push(item)
        }
      }
    }
  }
  return result
}

const featuredCategories = [
  { name: 'Gündem', slug: 'gundem', color: '#e63946' },
  { name: 'Spor', slug: 'spor', color: '#2a9d8f' },
  { name: 'Ekonomi', slug: 'ekonomi', color: '#e9c46a' },
]

export default async function HomePage() {
  const [sliders, latestNews, breakingNews, newsByCategory] = await Promise.all([
    getSliders(),
    getLatestNews(),
    getBreakingNews(),
    getNewsByCategory(),
  ])

  const featuredNews = latestNews.slice(0, 5)
  const sideNews = latestNews.slice(5)

  return (
    <div className="min-h-screen">
      {/* Son Dakika Bandı */}
      {breakingNews.length > 0 && (
        <div className="bg-[#c0392b] text-white py-2 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 flex items-center gap-3">
            <span className="shrink-0 font-black text-xs uppercase tracking-widest bg-white text-[#c0392b] px-2 py-0.5">
              SON DAKİKA
            </span>
            <div className="overflow-hidden flex-1">
              <div className="ticker-content text-sm font-medium">
                {breakingNews.map((n) => (
                  <Link key={n.id} href={`/haber/${n.slug}`} className="mr-12 hover:underline">
                    ● {n.title}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hero Slider */}
      <HeroSlider sliders={sliders} />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Öne Çıkan Haberler */}
        {latestNews.length > 0 && (
          <section className="mb-10">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-black text-[#2c3e50] flex items-center gap-2">
                <span className="w-1 h-6 bg-[#c0392b] inline-block rounded" />
                Son Haberler
              </h2>
              <Link href="/kategori/gundem" className="text-sm text-[#c0392b] font-semibold hover:underline">
                Tümünü Gör →
              </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              {/* Sol - büyük haber */}
              {featuredNews[0] && (
                <div className="lg:col-span-2 h-[380px]">
                  <NewsCard news={featuredNews[0]} variant="featured" />
                </div>
              )}

              {/* Sağ - küçük haberler */}
              <div className="flex flex-col gap-3">
                {featuredNews.slice(1, 5).map((news) => (
                  <NewsCard key={news.id} news={news} variant="horizontal" />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Kategoriye Göre Haberler */}
        {featuredCategories.map(({ name, slug, color }) => {
          const catNews = newsByCategory[slug]
          if (!catNews || catNews.length === 0) return null

          return (
            <section key={slug} className="mb-10">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-xl font-black text-[#2c3e50] flex items-center gap-2">
                  <span className="w-1 h-6 inline-block rounded" style={{ backgroundColor: color }} />
                  {name}
                </h2>
                <Link
                  href={`/kategori/${slug}`}
                  className="text-sm font-semibold hover:underline"
                  style={{ color }}
                >
                  Tümünü Gör →
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {catNews.map((news) => (
                  <NewsCard key={news.id} news={news} />
                ))}
              </div>
            </section>
          )
        })}

        {/* Son Haberler Grid */}
        {sideNews.length > 0 && (
          <section className="mb-10">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-black text-[#2c3e50] flex items-center gap-2">
                <span className="w-1 h-6 bg-[#2c3e50] inline-block rounded" />
                Diğer Haberler
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {sideNews.map((news) => (
                <NewsCard key={news.id} news={news} />
              ))}
            </div>
          </section>
        )}

        {latestNews.length === 0 && (
          <div className="text-center py-20 text-gray-500">
            <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
            <p className="text-lg font-medium">Henüz haber yok</p>
            <p className="text-sm mt-1">Admin panelinden haber ekleyebilirsiniz</p>
          </div>
        )}
      </div>
    </div>
  )
}