import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function AdminDashboardPage() {
  const supabase = await createClient()

  const [
    { count: totalNews },
    { count: publishedNews },
    { count: totalSliders },
    { count: totalCategories },
    { data: recentNews },
  ] = await Promise.all([
    supabase.from('news').select('*', { count: 'exact', head: true }),
    supabase.from('news').select('*', { count: 'exact', head: true }).eq('is_published', true),
    supabase.from('sliders').select('*', { count: 'exact', head: true }),
    supabase.from('categories').select('*', { count: 'exact', head: true }),
    supabase.from('news').select('id, title, is_published, created_at, category:categories(name, color)').order('created_at', { ascending: false }).limit(5),
  ])

  const stats = [
    { label: 'Toplam Haber', value: totalNews || 0, href: '/admin/haberler', icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" /></svg>
    ), color: '#2B59FF', bg: '#EEF2FF' },
    { label: 'Yayinlanan', value: publishedNews || 0, href: '/admin/haberler', icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
    ), color: '#10b981', bg: '#ECFDF5' },
    { label: 'Aktif Slider', value: totalSliders || 0, href: '/admin/slider', icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
    ), color: '#8b5cf6', bg: '#F5F3FF' },
    { label: 'Kategori', value: totalCategories || 0, href: '/admin/kategoriler', icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /></svg>
    ), color: '#f59e0b', bg: '#FFFBEB' },
  ]

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-[#2B2C35]" style={{ letterSpacing: '-0.03em' }}>Dashboard</h1>
        <p className="text-[#747A88] text-sm mt-1 font-medium">Hos geldiniz! Sitenizin anlık ozeti.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <Link key={stat.label} href={stat.href}
            className="bg-white rounded-2xl p-5 hover:shadow-[0_8px_30px_rgba(43,89,255,0.1)] transition-all duration-200 border border-gray-50 group">
            <div className="flex items-center justify-between mb-4">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110"
                style={{ backgroundColor: stat.bg, color: stat.color }}>
                {stat.icon}
              </div>
              <svg className="w-4 h-4 text-gray-300 group-hover:text-[#2B59FF] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
            <div className="text-3xl font-extrabold text-[#2B2C35] mb-1" style={{ letterSpacing: '-0.03em' }}>{stat.value}</div>
            <div className="text-sm text-[#747A88] font-medium">{stat.label}</div>
          </Link>
        ))}
      </div>

      {/* Bottom grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-gray-50 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
            <div className="flex items-center gap-2">
              <span className="w-1 h-5 rounded-full bg-[#2B59FF]" />
              <h2 className="font-extrabold text-[#2B2C35] text-sm">Son Eklenen Haberler</h2>
            </div>
            <Link href="/admin/haberler" className="text-xs font-bold text-[#2B59FF] hover:text-[#1e46e8]">Tumunu Gor</Link>
          </div>
          <div className="divide-y divide-gray-50">
            {recentNews && recentNews.length > 0 ? (
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              recentNews.map((item: any) => (
                <div key={item.id} className="flex items-center justify-between gap-3 px-5 py-3 hover:bg-[#F5F8FF] transition-colors">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      {item.category && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md text-white shrink-0" style={{ backgroundColor: item.category.color }}>
                          {item.category.name}
                        </span>
                      )}
                      <span className="text-[11px] text-[#747A88] font-medium shrink-0">
                        {new Date(item.created_at).toLocaleDateString('tr-TR')}
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-[#2B2C35] truncate">{item.title}</p>
                  </div>
                  <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full shrink-0 ${item.is_published ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                    {item.is_published ? 'Yayinda' : 'Taslak'}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-sm text-[#747A88] text-center py-10">Henuz haber eklenmemis</p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-50 p-5">
          <div className="flex items-center gap-2 mb-5">
            <span className="w-1 h-5 rounded-full bg-[#2B59FF]" />
            <h2 className="font-extrabold text-[#2B2C35] text-sm">Hizli Islemler</h2>
          </div>
          <div className="space-y-3">
            <Link href="/admin/haberler/ekle"
              className="flex items-center gap-4 p-4 rounded-2xl text-white hover:opacity-90 hover:shadow-[0_8px_24px_rgba(43,89,255,0.35)] transition-all"
              style={{ background: 'linear-gradient(135deg,#2B59FF 0%,#1a3fd4 100%)' }}>
              <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
              </div>
              <div className="flex-1">
                <div className="font-bold text-sm">Yeni Haber Ekle</div>
                <div className="text-xs opacity-75">Haberi yaz ve yayinla</div>
              </div>
              <svg className="w-4 h-4 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </Link>
            <Link href="/admin/slider"
              className="flex items-center gap-4 p-4 rounded-2xl text-white hover:opacity-90 hover:shadow-[0_8px_24px_rgba(139,92,246,0.35)] transition-all"
              style={{ background: 'linear-gradient(135deg,#8b5cf6 0%,#7c3aed 100%)' }}>
              <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              </div>
              <div className="flex-1">
                <div className="font-bold text-sm">Slider Yonetimi</div>
                <div className="text-xs opacity-75">Anasayfa sliderlari</div>
              </div>
              <svg className="w-4 h-4 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </Link>
            <Link href="/admin/kategoriler"
              className="flex items-center gap-4 p-4 rounded-2xl text-white hover:opacity-90 hover:shadow-[0_8px_24px_rgba(16,185,129,0.35)] transition-all"
              style={{ background: 'linear-gradient(135deg,#10b981 0%,#059669 100%)' }}>
              <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /></svg>
              </div>
              <div className="flex-1">
                <div className="font-bold text-sm">Kategoriler</div>
                <div className="text-xs opacity-75">Kategori ekle ve duzenle</div>
              </div>
              <svg className="w-4 h-4 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}