import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import NewsCard from '@/components/NewsCard'
import Link from 'next/link'
import type { News, Category } from '@/lib/types'
import type { Metadata } from 'next'

interface PageProps { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const sb = await createClient()
  const { data } = await sb.from('categories').select('name').eq('slug', slug).single()
  if (!data) return { title: 'Kategori Bulunamadı' }
  return { title: `${data.name} Haberleri` }
}

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params
  const sb = await createClient()

  const { data: category } = await sb
    .from('categories').select('*').eq('slug', slug).single()
  if (!category) notFound()

  const { data: newsData } = await sb
    .from('news').select('*, category:categories(*)')
    .eq('is_published', true).eq('category_id', category.id)
    .order('published_at', { ascending: false }).limit(24)

  const { data: allCats } = await sb
    .from('categories').select('*').order('name')

  const news = (newsData as News[]) || []
  const cats = (allCats as Category[]) || []

  return (
    <div className="min-h-screen bg-[#F5F8FF]">
      <div className="max-w-[1440px] mx-auto px-6 sm:px-16 py-8">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-[#747A88] mb-6 font-medium">
          <Link href="/" className="hover:text-[#2B59FF] transition-colors">Ana Sayfa</Link>
          <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <span className="text-[#2B2C35] font-bold">{category.name}</span>
        </nav>

        {/* Category header */}
        <div className="bg-white rounded-3xl p-6 mb-8 flex items-center gap-4 shadow-[0_4px_24px_rgba(43,89,255,0.06)]">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-[0_4px_14px_rgba(43,89,255,0.2)]"
            style={{ backgroundColor: category.color }}>
            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5a2 2 0 011.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-[#2B2C35]" style={{ letterSpacing: '-0.02em' }}>
              {category.name}
            </h1>
            <p className="text-[#747A88] text-sm font-medium mt-0.5">
              {news.length} haber bulundu
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* News grid */}
          <div className="lg:col-span-3">
            {news.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {news.map((n) => <NewsCard key={n.id} news={n} />)}
              </div>
            ) : (
              <div className="text-center py-20 bg-white rounded-3xl">
                <div className="w-16 h-16 bg-[#F5F8FF] rounded-3xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-[#747A88]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                  </svg>
                </div>
                <p className="text-[#747A88] font-medium">Bu kategoride henüz haber yok</p>
              </div>
            )}
          </div>

          {/* Sidebar: other categories */}
          <div>
            <div className="bg-white rounded-3xl overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-50 flex items-center gap-2">
                <span className="w-1 h-5 rounded-full bg-[#2B59FF]" />
                <h3 className="text-[15px] font-extrabold text-[#2B2C35]" style={{ letterSpacing: '-0.02em' }}>
                  Kategoriler
                </h3>
              </div>
              <div className="p-3 flex flex-col gap-1">
                {cats.map((cat) => (
                  <Link key={cat.id} href={`/kategori/${cat.slug}`}
                    className={`flex items-center justify-between px-4 py-2.5 rounded-2xl text-sm font-bold transition-all ${
                      cat.slug === slug
                        ? 'bg-[#2B59FF] text-white'
                        : 'text-[#2B2C35] hover:bg-[#F5F8FF] hover:text-[#2B59FF]'
                    }`}>
                    <span>{cat.name}</span>
                    {cat.slug === slug && (
                      <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                      </svg>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}