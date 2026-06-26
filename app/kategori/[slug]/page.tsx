import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import NewsCard from '@/components/NewsCard'
import type { News, Category } from '@/lib/types'
import type { Metadata } from 'next'

interface PageProps {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ sayfa?: string }>
}

const PAGE_SIZE = 12

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()
  const { data } = await supabase
    .from('categories')
    .select('name')
    .eq('slug', slug)
    .single()

  if (!data) return { title: 'Kategori Bulunamadı' }

  return {
    title: `${data.name} Haberleri`,
    description: `${data.name} kategorisindeki son haberler`,
  }
}

export default async function CategoryPage({ params, searchParams }: PageProps) {
  const { slug } = await params
  const { sayfa } = await searchParams
  const page = Math.max(1, parseInt(sayfa || '1', 10))

  const supabase = await createClient()

  const { data: category } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', slug)
    .single()

  if (!category) notFound()

  const from = (page - 1) * PAGE_SIZE
  const to = from + PAGE_SIZE - 1

  const { data: newsData, count } = await supabase
    .from('news')
    .select('*, category:categories(*)', { count: 'exact' })
    .eq('is_published', true)
    .eq('category_id', (category as Category).id)
    .order('published_at', { ascending: false })
    .range(from, to)

  const news = (newsData as News[]) || []
  const totalPages = Math.ceil((count || 0) / PAGE_SIZE)

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Kategori başlığı */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <span
            className="w-1.5 h-8 rounded"
            style={{ backgroundColor: (category as Category).color }}
          />
          <h1 className="text-3xl font-black text-[#2c3e50]">
            {(category as Category).name}
          </h1>
        </div>
        <p className="text-gray-500 ml-4">
          {count || 0} haber bulundu
        </p>
      </div>

      {/* Haberler grid */}
      {news.length > 0 ? (
        <>
          {/* İlk haber büyük */}
          {page === 1 && news[0] && (
            <div className="mb-6 h-[380px]">
              <NewsCard news={news[0]} variant="featured" />
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
            {(page === 1 ? news.slice(1) : news).map((item) => (
              <NewsCard key={item.id} news={item} />
            ))}
          </div>

          {/* Sayfalama */}
          {totalPages > 1 && (
            <nav className="flex justify-center gap-2 mt-8">
              {page > 1 && (
                <a
                  href={`/kategori/${slug}?sayfa=${page - 1}`}
                  className="px-4 py-2 bg-white border border-gray-300 rounded text-sm font-medium hover:bg-gray-50 transition-colors"
                >
                  ← Önceki
                </a>
              )}

              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 2)
                .map((p, idx, arr) => (
                  <span key={p}>
                    {idx > 0 && arr[idx - 1] !== p - 1 && (
                      <span className="px-2 py-2 text-gray-400">…</span>
                    )}
                    <a
                      href={`/kategori/${slug}?sayfa=${p}`}
                      className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                        p === page
                          ? 'bg-[#c0392b] text-white'
                          : 'bg-white border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {p}
                    </a>
                  </span>
                ))}

              {page < totalPages && (
                <a
                  href={`/kategori/${slug}?sayfa=${page + 1}`}
                  className="px-4 py-2 bg-white border border-gray-300 rounded text-sm font-medium hover:bg-gray-50 transition-colors"
                >
                  Sonraki →
                </a>
              )}
            </nav>
          )}
        </>
      ) : (
        <div className="text-center py-20 text-gray-500">
          <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
          </svg>
          <p className="text-lg font-medium">Bu kategoride henüz haber yok</p>
        </div>
      )}
    </div>
  )
}