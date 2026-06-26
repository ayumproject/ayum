import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function AdminNewsListPage() {
  const supabase = await createClient()

  const { data: news } = await supabase
    .from('news')
    .select('id, title, slug, is_published, is_breaking, view_count, created_at, category:categories(name, color)')
    .order('created_at', { ascending: false })

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Haberler</h1>
          <p className="text-sm text-gray-500 mt-1">{news?.length || 0} haber</p>
        </div>
        <Link
          href="/admin/haberler/ekle"
          className="bg-[#c0392b] hover:bg-[#922b21] text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Yeni Haber
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {news && news.length > 0 ? (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b">
                <th className="text-left px-5 py-3 font-semibold text-gray-600">Başlık</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600 hidden md:table-cell">Kategori</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600 hidden lg:table-cell">Tarih</th>
                <th className="text-center px-4 py-3 font-semibold text-gray-600">Durum</th>
                <th className="text-right px-5 py-3 font-semibold text-gray-600">İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {news.map((item: any) => (
                <tr key={item.id} className="border-b last:border-0 hover:bg-gray-50">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      {item.is_breaking && (
                        <span className="shrink-0 bg-red-100 text-red-600 text-xs font-bold px-1.5 py-0.5 rounded">
                          SD
                        </span>
                      )}
                      <span className="font-medium text-gray-800 line-clamp-1">{item.title}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    {item.category && (
                      <span
                        className="text-xs px-2 py-0.5 rounded text-white font-medium"
                        style={{ backgroundColor: item.category.color }}
                      >
                        {item.category.name}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-gray-500 hidden lg:table-cell">
                    {new Date(item.created_at).toLocaleDateString('tr-TR')}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span
                      className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                        item.is_published
                          ? 'bg-green-100 text-green-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}
                    >
                      {item.is_published ? 'Yayında' : 'Taslak'}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/haber/${item.slug}`}
                        target="_blank"
                        className="text-gray-400 hover:text-gray-600 p-1"
                        title="Görüntüle"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </Link>
                      <Link
                        href={`/admin/haberler/${item.id}/duzenle`}
                        className="text-blue-500 hover:text-blue-700 p-1"
                        title="Düzenle"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </Link>
                      <DeleteNewsButton newsId={item.id} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="text-center py-16 text-gray-400">
            <p className="text-sm">Henüz haber eklenmemiş</p>
            <Link href="/admin/haberler/ekle" className="text-[#c0392b] text-sm font-medium mt-2 inline-block hover:underline">
              İlk haberi ekle →
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

function DeleteNewsButton({ newsId }: { newsId: string }) {
  return (
    <form action={`/api/admin/news/${newsId}/delete`} method="POST">
      <button
        type="submit"
        className="text-red-400 hover:text-red-600 p-1"
        title="Sil"
        onClick={(e) => {
          if (!confirm('Bu haberi silmek istediğinize emin misiniz?')) {
            e.preventDefault()
          }
        }}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>
    </form>
  )
}