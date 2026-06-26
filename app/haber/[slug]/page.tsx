import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import NewsCard from '@/components/NewsCard'
import type { News } from '@/lib/types'
import type { Metadata } from 'next'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()
  const { data } = await supabase
    .from('news').select('title, summary, image_url').eq('slug', slug).eq('is_published', true).single()
  if (!data) return { title: 'Haber Bulunamadı' }
  return {
    title: data.title,
    description: data.summary,
    openGraph: { title: data.title, description: data.summary, images: data.image_url ? [data.image_url] : [] },
  }
}

function formatFullDate(dateStr: string | null) {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('tr-TR', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit',
  })
}

function formatRelativeDate(dateStr: string | null) {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMins / 60)
  if (diffMins < 60) return `${diffMins} dakika önce`
  if (diffHours < 24) return `${diffHours} saat önce`
  return date.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })
}

export default async function NewsDetailPage({ params }: PageProps) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: news } = await supabase
    .from('news').select('*, category:categories(*)')
    .eq('slug', slug).eq('is_published', true).single()

  if (!news) notFound()

  // Increment view count silently
  void supabase.rpc('increment_view_count', { news_id: news.id })

  const { data: related } = await supabase
    .from('news').select('*, category:categories(*)')
    .eq('is_published', true).eq('category_id', news.category_id)
    .neq('id', news.id).order('published_at', { ascending: false }).limit(4)

  const { data: latestNews } = await supabase
    .from('news').select('*, category:categories(*)')
    .eq('is_published', true).order('published_at', { ascending: false }).limit(5)

  const newsUrl = `https://ulusmeydan.com/haber/${news.slug}`

  return (
    <div className="bg-[#f1f5f9] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* ── Main Article ── */}
          <article className="lg:col-span-2">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-1.5 text-xs text-slate-500 mb-5">
              <Link href="/" className="hover:text-[#dc2626] transition-colors">Ana Sayfa</Link>
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              {news.category && (
                <>
                  <Link href={`/kategori/${news.category.slug}`} className="hover:text-[#dc2626] transition-colors">
                    {news.category.name}
                  </Link>
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </>
              )}
              <span className="text-slate-400 line-clamp-1">{news.title}</span>
            </nav>

            <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
              {/* Tags row */}
              <div className="px-6 pt-6 flex items-center gap-2 flex-wrap">
                {news.is_breaking && (
                  <span className="bg-[#dc2626] text-white text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-sm flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                    Son Dakika
                  </span>
                )}
                {news.category && (
                  <span
                    className="text-white text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-sm"
                    style={{ backgroundColor: news.category.color }}
                  >
                    {news.category.name}
                  </span>
                )}
              </div>

              {/* Title */}
              <div className="px-6 pt-4 pb-5 border-b border-slate-100">
                <h1 className="text-2xl md:text-3xl font-black text-[#0f172a] leading-tight mb-4">
                  {news.title}
                </h1>
                <p className="text-slate-600 text-lg leading-relaxed border-l-4 border-[#dc2626] pl-4 bg-red-50 py-3 rounded-r-lg">
                  {news.summary}
                </p>
              </div>

              {/* Meta */}
              <div className="px-6 py-3 bg-slate-50 flex flex-wrap items-center gap-4 text-xs text-slate-500 border-b border-slate-100">
                <span className="flex items-center gap-1.5">
                  <div className="w-6 h-6 bg-[#dc2626] rounded-full flex items-center justify-center">
                    <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <span className="font-semibold text-slate-700">{news.author}</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span title={formatFullDate(news.published_at || news.created_at)}>
                    {formatRelativeDate(news.published_at || news.created_at)}
                  </span>
                </span>
                <span className="flex items-center gap-1.5">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  {news.view_count.toLocaleString('tr-TR')} görüntülenme
                </span>
              </div>

              {/* Hero image */}
              {news.image_url && (
                <div className="relative w-full h-72 md:h-[420px]">
                  <Image src={news.image_url} alt={news.title} fill className="object-cover" priority />
                </div>
              )}

              {/* Content */}
              <div className="px-6 py-8">
                <div
                  className="news-content"
                  dangerouslySetInnerHTML={{ __html: news.content }}
                />
              </div>

              {/* Share */}
              <div className="px-6 pb-6 border-t border-slate-100 pt-5">
                <p className="text-sm font-bold text-slate-600 mb-3">Bu haberi paylaş:</p>
                <div className="flex flex-wrap gap-2">
                  <a
                    href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(news.title)}&url=${encodeURIComponent(newsUrl)}`}
                    target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-[#1DA1F2] hover:bg-[#1a8fc0] text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors"
                  >
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
                    </svg>
                    Twitter
                  </a>
                  <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(newsUrl)}`}
                    target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-[#1877F2] hover:bg-[#1565c0] text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors"
                  >
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
                    </svg>
                    Facebook
                  </a>
                  <a
                    href={`https://wa.me/?text=${encodeURIComponent(news.title + ' - ' + newsUrl)}`}
                    target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-[#25D366] hover:bg-[#1eba57] text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors"
                  >
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    WhatsApp
                  </a>
                </div>
              </div>
            </div>

            {/* Related articles */}
            {related && related.length > 0 && (
              <div className="mt-8">
                <h2 className="section-title mb-5">İlgili Haberler</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {(related as News[]).map((item) => (
                    <NewsCard key={item.id} news={item} />
                  ))}
                </div>
              </div>
            )}
          </article>

          {/* ── Sidebar ── */}
          <aside className="space-y-6">
            {/* Latest News */}
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-100">
                <h3 className="section-title text-sm">Son Haberler</h3>
              </div>
              <div className="px-5">
                {(latestNews as News[] || []).filter((n) => n.id !== news.id).slice(0, 5).map((item) => (
                  <NewsCard key={item.id} news={item} variant="horizontal" />
                ))}
              </div>
            </div>

            {/* Category box */}
            {news.category && (
              <div className="bg-white rounded-2xl shadow-sm p-5">
                <h3 className="font-black text-sm text-[#0f172a] mb-4 flex items-center gap-2">
                  <span className="w-1 h-4 rounded" style={{ backgroundColor: news.category.color }} />
                  {news.category.name} Haberleri
                </h3>
                <Link
                  href={`/kategori/${news.category.slug}`}
                  className="flex items-center justify-between text-sm font-bold hover:text-[#dc2626] transition-colors group"
                  style={{ color: news.category.color }}
                >
                  <span>Tüm {news.category.name} haberlerini gör</span>
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            )}
          </aside>
        </div>
      </div>
    </div>
  )
}