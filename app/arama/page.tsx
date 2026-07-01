import { createClient } from '@/lib/supabase/server'
import NewsCard from '@/components/NewsCard'
import Link from 'next/link'
import type { News } from '@/lib/types'
import type { Metadata } from 'next'

interface PageProps { searchParams: Promise<{ q?: string }> }

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const { q } = await searchParams
  return { title: q ? `"${q}" icin arama sonuclari` : 'Arama' }
}

export default async function AramaPage({ searchParams }: PageProps) {
  const { q } = await searchParams
  const query = q?.trim() || ''

  let results: News[] = []
  if (query.length >= 2) {
    const sb = await createClient()
    const { data } = await sb
      .from('news')
      .select('*, category:categories(*)')
      .eq('is_published', true)
      .or(`title.ilike.%${query}%,summary.ilike.%${query}%`)
      .order('published_at', { ascending: false })
      .limit(24)
    results = (data as News[]) || []
  }

  return (
    <div className="min-h-screen bg-[#F5F8FF]">
      <div className="max-w-[1440px] mx-auto px-6 sm:px-16 py-8">
        <nav className="flex items-center gap-1.5 text-xs text-[#747A88] mb-6 font-medium">
          <Link href="/" className="hover:text-[#2B59FF] transition-colors">Ana Sayfa</Link>
          <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          <span className="text-[#2B2C35]">Arama</span>
        </nav>

        <div className="mb-8">
          <h1 className="text-2xl font-extrabold text-[#2B2C35] mb-1" style={{ letterSpacing: '-0.03em' }}>
            {query ? (
              <><span className="text-[#2B59FF]">&quot;{query}&quot;</span> icin arama sonuclari</>
            ) : 'Arama'}
          </h1>
          {query && results.length > 0 && (
            <p className="text-sm text-[#747A88] font-medium">{results.length} sonuc bulundu</p>
          )}
        </div>

        {!query || query.length < 2 ? (
          <div className="bg-white rounded-2xl p-12 text-center shadow-[0_4px_24px_rgba(43,89,255,0.06)]">
            <div className="w-16 h-16 bg-[#EEF2FF] rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-[#2B59FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <p className="text-sm font-semibold text-[#2B2C35] mb-1">Haber ara</p>
            <p className="text-xs text-[#747A88]">En az 2 karakter girerek arama yapabilirsiniz.</p>
          </div>
        ) : results.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center shadow-[0_4px_24px_rgba(43,89,255,0.06)]">
            <div className="w-16 h-16 bg-[#EEF2FF] rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-[#2B59FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-sm font-semibold text-[#2B2C35] mb-1">Sonuc bulunamadi</p>
            <p className="text-xs text-[#747A88]">&quot;{query}&quot; ile eslesecek haber bulunamadi.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {results.map((n) => <NewsCard key={n.id} news={n} />)}
          </div>
        )}
      </div>
    </div>
  )
}
