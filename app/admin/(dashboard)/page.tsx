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
    supabase
      .from('news')
      .select('id, title, is_published, created_at, category:categories(name, color)')
      .order('created_at', { ascending: false })
      .limit(5),
  ])

  const stats = [
    {
      label: 'Toplam Haber',
      value: totalNews || 0,
      icon: '📰',
      color: 'bg-blue-50 text-blue-700',
      href: '/admin/haberler',
    },
    {
      label: 'Yayınlanan',
      value: publishedNews || 0,
      icon: '✅',
      color: 'bg-green-50 text-green-700',
      href: '/admin/haberler',
    },
    {
      label: 'Aktif Slider',
      value: totalSliders || 0,
      icon: '🖼️',
      color: 'bg-purple-50 text-purple-700',
      href: '/admin/slider',
    },
    {
      label: 'Kategori',
      value: totalCategories || 0,
      icon: '🏷️',
      color: 'bg-yellow-50 text-yellow-700',
      href: '/admin/kategoriler',
    },
  ]

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-black text-gray-900">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Hoş geldiniz! İşte sitenizin özeti.</p>
      </div>

      {/* İstatistik kartları */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-2xl">{stat.icon}</span>
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${stat.color}`}>
                Görüntüle
              </span>
            </div>
            <div className="text-3xl font-black text-gray-900 mb-1">{stat.value}</div>
            <div className="text-sm text-gray-500">{stat.label}</div>
          </Link>
        ))}
      </div>

      {/* Hızlı işlemler */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Son haberler */}
        <div className="bg-white rounded-xl shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-gray-900">Son Eklenen Haberler</h2>
            <Link href="/admin/haberler" className="text-xs text-[#c0392b] font-medium hover:underline">
              Tümünü Gör
            </Link>
          </div>
          <div className="space-y-3">
            {recentNews && recentNews.length > 0 ? (
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              recentNews.map((item: any) => (
                <div key={item.id} className="flex items-center justify-between gap-3 py-2 border-b last:border-0">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{item.title}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      {item.category && (
                        <span
                          className="text-xs px-1.5 py-0.5 rounded text-white"
                          style={{ backgroundColor: item.category.color }}
                        >
                          {item.category.name}
                        </span>
                      )}
                      <span className="text-xs text-gray-400">
                        {new Date(item.created_at).toLocaleDateString('tr-TR')}
                      </span>
                    </div>
                  </div>
                  <span
                    className={`text-xs font-medium px-2 py-0.5 rounded-full shrink-0 ${
                      item.is_published
                        ? 'bg-green-100 text-green-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}
                  >
                    {item.is_published ? 'Yayında' : 'Taslak'}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-400 text-center py-4">Henüz haber yok</p>
            )}
          </div>
        </div>

        {/* Hızlı işlemler */}
        <div className="bg-white rounded-xl shadow-sm p-5">
          <h2 className="font-bold text-gray-900 mb-4">Hızlı İşlemler</h2>
          <div className="grid grid-cols-1 gap-3">
            <Link
              href="/admin/haberler/ekle"
              className="flex items-center gap-3 p-4 bg-[#c0392b] text-white rounded-lg hover:bg-[#922b21] transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <div>
                <div className="font-semibold text-sm">Yeni Haber Ekle</div>
                <div className="text-xs opacity-80">Haberi yaz ve yayınla</div>
              </div>
            </Link>
            <Link
              href="/admin/slider"
              className="flex items-center gap-3 p-4 bg-[#2c3e50] text-white rounded-lg hover:bg-[#1a252f] transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <div>
                <div className="font-semibold text-sm">Slider Yönetimi</div>
                <div className="text-xs opacity-80">Anasayfa slider'larını düzenle</div>
              </div>
            </Link>
            <Link
              href="/admin/kategoriler"
              className="flex items-center gap-3 p-4 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              <div>
                <div className="font-semibold text-sm">Kategoriler</div>
                <div className="text-xs opacity-80">Kategori ekle ve düzenle</div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}