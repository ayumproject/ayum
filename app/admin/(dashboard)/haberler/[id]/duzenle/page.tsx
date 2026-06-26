import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import NewsForm from '../../_components/NewsForm'
import type { Category, News } from '@/lib/types'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function AdminNewsEditPage({ params }: PageProps) {
  const { id } = await params
  const supabase = await createClient()

  const [{ data: news }, { data: categories }] = await Promise.all([
    supabase.from('news').select('*').eq('id', id).single(),
    supabase.from('categories').select('*').order('name'),
  ])

  if (!news) notFound()

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-black text-gray-900">Haberi Düzenle</h1>
        <p className="text-sm text-gray-500 mt-1 line-clamp-1">{news.title}</p>
      </div>
      <NewsForm
        categories={(categories as Category[]) || []}
        initialData={news as News}
        mode="edit"
      />
    </div>
  )
}