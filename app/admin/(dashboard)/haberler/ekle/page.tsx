import { createClient } from '@/lib/supabase/server'
import NewsForm from '../_components/NewsForm'
import type { Category } from '@/lib/types'

export default async function AdminNewsCreatePage() {
  const supabase = await createClient()
  const { data: categories } = await supabase.from('categories').select('*').order('name')

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-black text-gray-900">Yeni Haber Ekle</h1>
        <p className="text-sm text-gray-500 mt-1">Yeni bir haber oluşturun ve yayınlayın</p>
      </div>
      <NewsForm categories={(categories as Category[]) || []} mode="create" />
    </div>
  )
}