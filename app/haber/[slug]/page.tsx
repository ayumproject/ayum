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
    .from('news')
    .select('title, summary, image_url')
    .eq('slug', slug)
    .eq('is_published', true)
    .single()

  if (!data) return { title: 'Haber Bulunamadı' }

  return {
    title: data.title,
    description: data.summary,
    openGraph: {
      title: data.title,
      description: data.summary,
      images: data.image_url ? [data.image_url] : [],
    },
  }
}

async function incrementViewCount(id: string) {
  const supabase = await createClient()
  await supabase.rpc('increment_view_count', { news_id: id }).maybeSingle()
}

export default async function NewsDetailPage({ params }: PageProps) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: news } = await supabase
    .from('news')
    .select('*, category:categories(*)')
    .eq('slug', slug)
    .eq('is_published', true)
    .single()

  if (!news) notFound()

  // View count artır (hata olursa devam et)
  try { await incrementViewCount(news.id) } catch {}

  // İlgili haberler
  const { data: related } = await supabase
    .from('news')
    .select('*, category:categories(*)')
    .eq('is_published', true)
    .eq('category_id', news.category_id)
    .neq('id', news.id)
    .order('published_at', { ascending: false })
    .limit(4)

  const publishDate = new Date(news.published_at || news.created_at).toLocaleDateString('tr-TR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Ana içerik */}
        <article className="lg:col-span-2">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-gray-500 mb-4">
            <Link href="/" className="hover:text-[#c0392b]">Anasayfa</Link>
            <span>/</span>
            {news.category && (
              <>
                <Link href={`/kategori/${news.category.slug}`} className="hover:text-[#c0392b]">
                  {news.category.name}
                </Link>
                <span>/</span>
              </>
            )}
            <span className="text-gray-800 line-clamp-1">{news.title}</span>
          </nav>

          {/* Kategori ve Son Dakika */}
          <div className="flex items-center gap-2 mb-3">
            {news.is_breaking && (
              <span className="bg-[#c0392b] text-white text-xs font-bold px-2 py-0.5 uppercase tracking-wider">
                Son Dakika
              </span>
            )}
            {news.category && (
              <span
                className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded text-white"
                style={{ backgroundColor: news.category.color }}
              >
                {news.category.name}
              </span>
            )}
          </div>

          {/* Başlık */}
          <h1 className="text-2xl md:text-3xl font-black leading-tight text-[#2c3e50] mb-4">
            {news.title}
          </h1>

          {/* Özet */}
          <p className="text-lg text-gray-600 leading-relaxed border-l-4 border-[#c0392b] pl-4 mb-5">
            {news.summary}
          </p>

          {/* Meta bilgileri */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-6 pb-4 border-b">
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              {news.author}
            </span>
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {publishDate}
            </span>
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              {news.view_count} görüntülenme
            </span>
          </div>

          {/* Ana görsel */}
          {news.image_url && (
            <div className="relative w-full h-64 md:h-96 rounded-lg overflow-hidden mb-6">
              <Image
                src={news.image_url}
                alt={news.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}

          {/* İçerik */}
          <div
            className="news-content text-gray-800 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: news.content }}
          />

          {/* Paylaş */}
          <div className="mt-8 pt-6 border-t">
            <p className="text-sm font-semibold text-gray-600 mb-3">Haberi Paylaş:</p>
            <div className="flex gap-3">
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(news.title)}&url=${encodeURIComponent(`https://ulusmeydan.com/haber/${news.slug}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#1DA1F2] text-white text-sm px-4 py-2 rounded font-semibold hover:bg-[#1a8fc0] transition-colors"
              >
                Twitter
              </a>
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`https://ulusmeydan.com/haber/${news.slug}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#1877F2] text-white text-sm px-4 py-2 rounded font-semibold hover:bg-[#1565c0] transition-colors"
              >
                Facebook
              </a>
              <a
                href={`https://wa.me/?text=${encodeURIComponent(`${news.title} - https://ulusmeydan.com/haber/${news.slug}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#25D366] text-white text-sm px-4 py-2 rounded font-semibold hover:bg-[#1eba57] transition-colors"
              >
                WhatsApp
              </a>
            </div>
          </div>
        </article>

        {/* Sidebar */}
        <aside>
          {related && related.length > 0 && (
            <div className="bg-white rounded-lg p-5 shadow-sm">
              <h3 className="font-black text-base text-[#2c3e50] mb-4 flex items-center gap-2">
                <span className="w-1 h-5 bg-[#c0392b] inline-block rounded" />
                İlgili Haberler
              </h3>
              <div className="flex flex-col gap-4">
                {(related as News[]).map((item) => (
                  <NewsCard key={item.id} news={item} variant="horizontal" />
                ))}
              </div>
            </div>
          )}
        </aside>
      </div>

      {/* İlgili haberler alt */}
      {related && related.length > 0 && (
        <section className="mt-10">
          <h2 className="text-xl font-black text-[#2c3e50] mb-5 flex items-center gap-2">
            <span className="w-1 h-6 bg-[#c0392b] inline-block rounded" />
            Benzer Haberler
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {(related as News[]).map((item) => (
              <NewsCard key={item.id} news={item} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}