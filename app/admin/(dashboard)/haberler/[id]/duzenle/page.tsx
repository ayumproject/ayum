import { createClient } from '@/lib/supabase/server'
import { getUserProfile } from '@/lib/auth'
import { notFound, redirect } from 'next/navigation'
import NewsForm from '../../_components/NewsForm'
import type { Category, News, Editor } from '@/lib/types'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function AdminNewsEditPage({ params }: PageProps) {
  const { id } = await params
  const [profile, supabase] = await Promise.all([getUserProfile(), createClient()])

  if (!profile) redirect('/admin/giris')
  if (profile.role === 'columnist') redirect('/admin/kose-yazim')

  const [{ data: news }, { data: categories }, { data: editors }] = await Promise.all([
    supabase.from('news').select('*').eq('id', id).single(),
    supabase.from('categories').select('*').order('name'),
    supabase.from('editors').select('*').eq('is_active', true).order('order_index'),
  ])

  if (!news) notFound()

  // Editör rolüyse yalnızca kendi haberini düzenleyebilir
  if (profile.role === 'editor' && news.editor_id && news.editor_id !== profile.editor_id) {
    redirect('/admin/haberler')
  }

  let currentEditorName = ''
  if (profile.role === 'editor' && profile.editor_id) {
    const { data: editorRecord } = await supabase
      .from('editors').select('name').eq('id', profile.editor_id).single()
    currentEditorName = editorRecord?.name || profile.email
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-[#2B2C35]" style={{ letterSpacing: '-0.03em' }}>
          Haberi Düzenle
        </h1>
        <p className="text-[#747A88] text-sm mt-0.5 line-clamp-1">{news.title}</p>
      </div>
      <NewsForm
        categories={(categories as Category[]) || []}
        editors={(editors as Editor[]) || []}
        initialData={news as News}
        mode="edit"
        userRole={profile.role}
        currentEditorId={profile.editor_id}
        currentEditorName={currentEditorName}
      />
    </div>
  )
}
