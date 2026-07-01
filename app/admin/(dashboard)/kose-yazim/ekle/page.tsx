import { createClient } from '@/lib/supabase/server'
import { getUserProfile } from '@/lib/auth'
import { redirect } from 'next/navigation'
import ColumnForm from '../_components/ColumnForm'
import type { Category, Columnist } from '@/lib/types'

export default async function KoseYazimEklePage() {
  const [profile, supabase] = await Promise.all([getUserProfile(), createClient()])
  if (!profile) redirect('/admin/giris')
  if (profile.role === 'editor') redirect('/admin/haberler')

  const [{ data: categories }, { data: columnists }] = await Promise.all([
    supabase.from('categories').select('*').order('name'),
    supabase.from('columnists').select('*').eq('is_active', true).order('order_index'),
  ])

  // Köşe yazarı rolü ise kendi kaydını bul — columnist_id yoksa email fallback
  let currentColumnistName = profile.role === 'columnist' ? profile.email : ''
  if (profile.role === 'columnist' && profile.columnist_id) {
    const { data: c } = await supabase.from('columnists').select('name').eq('id', profile.columnist_id).single()
    currentColumnistName = c?.name || profile.email
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-extrabold text-[#2B2C35]" style={{ letterSpacing: '-0.03em' }}>
          Kose Yazisi Ekle
        </h1>
        <p className="text-[#747A88] text-sm mt-0.5">Yeni bir kose yazisi olusturun</p>
      </div>
      <ColumnForm
        categories={(categories as Category[]) || []}
        columnists={(columnists as Columnist[]) || []}
        mode="create"
        userRole={profile.role}
        currentColumnistId={profile.columnist_id}
        currentColumnistName={currentColumnistName}
      />
    </div>
  )
}
