import { createClient } from '@/lib/supabase/server'
import { getUserProfile } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function KoseYazimPage() {
  const [profile, supabase] = await Promise.all([getUserProfile(), createClient()])
  if (!profile) redirect('/admin/giris')
  if (profile.role === 'editor') redirect('/admin/haberler')

  let query = supabase
    .from('news')
    .select('*, columnist:columnists(name,photo_url)')
    .not('columnist_id', 'is', null)
    .order('created_at', { ascending: false })
    .limit(50)

  if (profile.role === 'columnist' && profile.columnist_id) {
    // @ts-ignore
    query = query.eq('columnist_id', profile.columnist_id)
  }

  const { data: articles } = await query

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-extrabold text-[#2B2C35]" style={{ letterSpacing: '-0.03em' }}>
            Kose Yazilari
          </h1>
          <p className="text-sm text-[#747A88] mt-0.5">{articles?.length || 0} yazi</p>
        </div>
        <Link href="/admin/kose-yazim/ekle"
          className="flex items-center gap-2 text-sm font-bold text-white px-4 py-2.5 rounded-xl"
          style={{ background: 'linear-gradient(135deg,#2B59FF 0%,#1a3fd4 100%)' }}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Yeni Yazi
        </Link>
      </div>
      {!articles || articles.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-50 text-center py-20">
          <p className="text-sm font-semibold text-[#2B2C35] mb-2">Henuz yazi yok</p>
          <Link href="/admin/kose-yazim/ekle" className="text-sm font-bold text-[#2B59FF] hover:underline">
            Ilk yaziyi ekle
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-50 overflow-hidden">
          <div className="divide-y divide-gray-50">
            {(articles as any[]).map((item) => (
              <div key={item.id} className="flex items-center gap-4 px-5 py-4 hover:bg-[#F5F8FF] transition-colors">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-[11px] text-[#747A88] font-medium">
                      {new Date(item.created_at).toLocaleDateString('tr-TR')}
                    </span>
                    {item.columnist && (
                      <span className="text-[11px] font-bold text-[#2B59FF]">{item.columnist.name}</span>
                    )}
                  </div>
                  <p className="text-sm font-semibold text-[#2B2C35] truncate">{item.title}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${item.is_published ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                    {item.is_published ? 'Yayinda' : 'Taslak'}
                  </span>
                  <Link href={`/admin/kose-yazim/${item.id}/duzenle`}
                    className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-[#EEF2FF] text-[#2B59FF] hover:bg-[#2B59FF] hover:text-white transition-colors">
                    Duzenle
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
