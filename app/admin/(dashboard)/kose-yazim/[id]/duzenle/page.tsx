import { createClient } from '@/lib/supabase/server'
import { getUserProfile } from '@/lib/auth'
import { notFound, redirect } from 'next/navigation'
import ColumnForm from '../../_components/ColumnForm'
import type { Category, News, Columnist } from '@/lib/types'

interface PageProps { params: Promise<{ id: string }> }

export default async function KoseYazimDuzenlePage({ params }: PageProps) {
  const { id } = await params
  const [profile, supabase] = await Promise.all([getUserProfile(), createClient()])
  if (!profile) redirect('/admin/giris')
  if (profile.role === 'editor') redirect('/admin/haberler')

  const [{ data: article }, { data: categories }, { data: columnists }] = await Promise.all([
    supabase.from('news').select('*').eq('id', id).single(),
    supabase.from('categories').select('*').order('name'),
    supabase.from('columnists').select('*').eq('is_active', true).order('order_index'),
  ])
  if (!article) notFound()

  if (profile.role === 'columnist' && article.columnist_id !== profile.columnist_id) {
    redirect('/admin/kose-yazim')
  }

  let currentColumnistName = ''
  if (profile.role === 'columnist' && profile.columnist_id) {
    const { data: c } = await supabase.from('columnists').select('name').eq('id', profile.columnist_id).single()
    currentColumnistName = c?.name || profile.email
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-[#2B2C35]" style={{ letterSpacing: '-0.03em' }}>
          Yaziyi Duzenle
        </h1>
        <p className="text-[#747A88] text-sm mt-0.5 line-clamp-1">{article.title}</p>
      </div>
      <ColumnForm
        categories={(categories as Category[]) || []}
        columnists={(columnists as Columnist[]) || []}
        initialData={article as News}
        mode="edit"
        userRole={profile.role}
        currentColumnistId={profile.columnist_id}
        currentColumnistName={currentColumnistName}
      />
    </div>
  )
}
