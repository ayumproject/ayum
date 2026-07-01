import { createClient } from '@/lib/supabase/server'
import { getUserProfile } from '@/lib/auth'
import { redirect } from 'next/navigation'
import NewsForm from '../_components/NewsForm'
import type { Category, Editor } from '@/lib/types'

export default async function AdminNewsAddPage() {
  const [profile, supabase] = await Promise.all([getUserProfile(), createClient()])

  if (!profile) redirect('/admin/giris')
  // Columnist rolü haber ekleyemez
  if (profile.role === 'columnist') redirect('/admin/kose-yazim')

  const [{ data: categories }, { data: editors }] = await Promise.all([
    supabase.from('categories').select('*').order('name'),
    supabase.from('editors').select('*').eq('is_active', true).order('order_index'),
  ])

  // Editör rolü ise kendi kaydını bul — editor_id yoksa email'i fallback olarak kullan
  let currentEditorName = profile.role === 'editor' ? profile.email : ''
  if (profile.role === 'editor' && profile.editor_id) {
    const { data: editorRecord } = await supabase
      .from('editors').select('name').eq('id', profile.editor_id).single()
    currentEditorName = editorRecord?.name || profile.email
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-extrabold text-[#2B2C35]" style={{ letterSpacing: '-0.03em' }}>
          Haber Ekle
        </h1>
        <p className="text-[#747A88] text-sm mt-0.5">Yeni bir haber oluşturun ve yayınlayın</p>
      </div>
      <NewsForm
        categories={(categories as Category[]) || []}
        editors={(editors as Editor[]) || []}
        mode="create"
        userRole={profile.role}
        currentEditorId={profile.editor_id}
        currentEditorName={currentEditorName}
      />
    </div>
  )
}
