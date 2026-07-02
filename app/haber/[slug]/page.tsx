import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import NewsCard from '@/components/NewsCard'
import type { News } from '@/lib/types'
import type { Metadata } from 'next'
import MarkdownContent from './_components/MarkdownContent'


interface PageProps { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const sb = await createClient()
  const { data } = await sb
    .from('news')
    .select('title, summary, image_url, published_at, author, category:categories(name)')
    .eq('slug', slug).eq('is_published', true).single()
  if (!data) return { title: 'Haber Bulunamadı' }

  const url = `https://ulusmeydan.com/haber/${slug}`
  const catName = (Array.isArray(data.category) ? data.category[0] : data.category as { name: string } | null)?.name

  return {
    title: data.title,
    description: data.summary ?? undefined,
    keywords: [catName, 'ankara haberleri', 'son dakika', 'ulusmeydan'].filter(Boolean) as string[],
    authors: data.author ? [{ name: data.author }] : undefined,
    openGraph: {
      type: 'article',
      url,
      locale: 'tr_TR',
      siteName: 'Ulusmeydan',
      title: data.title,
      description: data.summary ?? undefined,
      images: data.image_url
        ? [{ url: data.image_url, width: 1200, height: 630, alt: data.title }]
        : [],
      publishedTime: data.published_at ?? undefined,
      authors: data.author ? [data.author] : undefined,
      section: catName ?? undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: data.title,
      description: data.summary ?? undefined,
      images: data.image_url ? [data.image_url] : [],
    },
    alternates: { canonical: url },
  }
}

function fmtDate(d: string | null) {
  if (!d) return ''
  return new Date(d).toLocaleDateString('tr-TR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}
function timeAgo(d: string | null) {
  if (!d) return ''
  const diff = Date.now() - new Date(d).getTime()
  const m = Math.floor(diff / 60000), h = Math.floor(m / 60), day = Math.floor(h / 24)
  if (m < 60) return `${m} dakika önce`
  if (h < 24) return `${h} saat önce`
  return new Date(d).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })
}

export default async function NewsDetailPage({ params }: PageProps) {
  const { slug } = await params
  const sb = await createClient()

  const { data: news } = await sb
    .from('news').select('*, category:categories(*)')
    .eq('slug', slug).eq('is_published', true).single()
  if (!news) notFound()

  try { await sb.rpc('increment_view_count', { news_id: news.id }) } catch (_) {}

  const [{ data: related }, { data: latestNews }] = await Promise.all([
    sb.from('news').select('*, category:categories(*)').eq('is_published', true).eq('category_id', news.category_id).neq('id', news.id).order('published_at', { ascending: false }).limit(4),
    sb.from('news').select('*, category:categories(*)').eq('is_published', true).order('published_at', { ascending: false }).limit(5),
  ])

  const newsUrl = `https://ulusmeydan.com/haber/${news.slug}`

  return (
    <div className="min-h-screen bg-[#F5F8FF]">
      <div className="max-w-[1440px] mx-auto px-6 sm:px-16 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* ── Article ── */}
          <article className="lg:col-span-2">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-1.5 text-xs text-[#747A88] mb-5 font-medium">
              <Link href="/" className="hover:text-[#2B59FF] transition-colors">Ana Sayfa</Link>
              <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              {news.category && (
                <>
                  <Link href={`/kategori/${news.category.slug}`} className="hover:text-[#2B59FF] transition-colors">
                    {news.category.name}
                  </Link>
                  <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                </>
              )}
              <span className="line-clamp-1 text-[#2B2C35]">{news.title}</span>
            </nav>

            {/* Article card */}
            <div className="bg-white rounded-3xl overflow-hidden shadow-[0_4px_24px_rgba(43,89,255,0.06)]">
              {/* Tags */}
              <div className="px-6 pt-6 flex items-center gap-2 flex-wrap">
                {news.is_breaking && (
                  <span className="flex items-center gap-1.5 bg-[#f79761] text-white text-[10px] font-extrabold uppercase tracking-widest px-3 py-1.5 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />Son Dakika
                  </span>
                )}
                {news.category && (
                  <span className="text-white text-[10px] font-extrabold uppercase tracking-widest px-3 py-1.5 rounded-full"
                    style={{ backgroundColor: news.category.color }}>
                    {news.category.name}
                  </span>
                )}
              </div>

              {/* Title */}
              <div className="px-6 pt-4 pb-5 border-b border-gray-50">
                <h1 className="text-2xl md:text-3xl font-extrabold text-[#2B2C35] leading-tight mb-4"
                  style={{ letterSpacing: '-0.02em' }}>
                  {news.title}
                </h1>
                {news.summary && (
                  <p className="text-[#747A88] text-base leading-relaxed border-l-4 border-[#2B59FF] pl-4 bg-[#F5F8FF] py-3 rounded-r-2xl">
                    {news.summary}
                  </p>
                )}
              </div>

              {/* Meta */}
              <div className="px-6 py-3 bg-[#F5F8FF]/50 flex flex-wrap items-center gap-4 text-xs text-[#747A88] border-b border-gray-50">
                <span className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-[#2B59FF] flex items-center justify-center">
                    <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <span className="font-bold text-[#2B2C35]">{news.author}</span>
                </span>
                <span className="flex items-center gap-1.5" title={fmtDate(news.published_at || news.created_at)}>
                  <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  {timeAgo(news.published_at || news.created_at)}
                </span>
                <span className="flex items-center gap-1.5">
                  <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                  {news.view_count.toLocaleString('tr-TR')} görüntülenme
                </span>
              </div>

              {/* Hero image */}
              {news.image_url && (
                <div className="relative w-full h-72 md:h-[440px]">
                  <Image src={news.image_url} alt={news.title} fill className="object-cover" priority />
                </div>
              )}

              {/* Content */}
              <div className="px-6 py-8">
                <MarkdownContent content={news.content || ""} />
              </div>

              {/* Share */}
              <div className="px-6 pb-6 border-t border-gray-50 pt-5">
                <p className="text-sm font-extrabold text-[#2B2C35] mb-3" style={{ letterSpacing: '-0.01em' }}>
                  Bu haberi paylaş:
                </p>
                <div className="flex flex-wrap gap-2">
                  {[
                    { label: 'Twitter', color: '#1DA1F2', url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(news.title)}&url=${encodeURIComponent(newsUrl)}` },
                    { label: 'Facebook', color: '#1877F2', url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(newsUrl)}` },
                    { label: 'WhatsApp', color: '#25D366', url: `https://wa.me/?text=${encodeURIComponent(news.title + ' - ' + newsUrl)}` },
                  ].map(({ label, color, url }) => (
                    <a key={label} href={url} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-2 text-white text-xs font-bold px-4 py-2 rounded-full transition-all hover:opacity-90"
                      style={{ backgroundColor: color }}>
                      {label}
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Related */}
            {related && related.length > 0 && (
              <div className="mt-8">
                <div className="flex items-center gap-3 mb-5">
                  <span className="w-1 h-6 rounded-full bg-[#2B59FF]" />
                  <h2 className="text-[18px] font-extrabold text-[#2B2C35]" style={{ letterSpacing: '-0.02em' }}>
                    İlgili Haberler
                  </h2>
                </div>
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
            <div className="bg-white rounded-3xl overflow-hidden shadow-[0_4px_24px_rgba(43,89,255,0.06)]">
              <div className="px-5 py-4 border-b border-gray-50 flex items-center gap-2">
                <span className="w-1 h-5 rounded-full bg-[#2B59FF]" />
                <h3 className="text-[15px] font-extrabold text-[#2B2C35]" style={{ letterSpacing: '-0.02em' }}>
                  Son Haberler
                </h3>
              </div>
              <div className="px-5 py-2">
                {(latestNews as News[] || []).filter((n) => n.id !== news.id).slice(0, 5).map((item) => (
                  <NewsCard key={item.id} news={item} variant="horizontal" />
                ))}
              </div>
            </div>

            {news.category && (
              <div className="bg-white rounded-3xl p-5 shadow-[0_4px_24px_rgba(43,89,255,0.06)]">
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-1 h-5 rounded-full" style={{ background: news.category.color }} />
                  <h3 className="text-[15px] font-extrabold text-[#2B2C35]" style={{ letterSpacing: '-0.02em' }}>
                    {news.category.name} Haberleri
                  </h3>
                </div>
                <Link href={`/kategori/${news.category.slug}`}
                  className="flex items-center justify-between text-sm font-bold rounded-2xl px-4 py-3 transition-all hover:opacity-90 text-white"
                  style={{ backgroundColor: news.category.color }}>
                  <span>Tüm {news.category.name} haberlerini gör</span>
                  <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
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