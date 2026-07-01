'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { uploadToCloudinary } from '@/lib/cloudinary'
import type { Category, News, Editor } from '@/lib/types'
import dynamic from 'next/dynamic'
import NewsFormSidebar from './NewsFormSidebar'

const TiptapEditor = dynamic(() => import('@/components/TiptapEditor'), { ssr: false })

interface NewsFormProps {
  categories: Category[]
  initialData?: Partial<News>
  mode: 'create' | 'edit'
  userRole: 'admin' | 'editor' | 'columnist'
  currentEditorId: string | null
  currentEditorName: string
  editors?: Editor[]
}

function slugify(t: string) {
  return t.toLowerCase()
    .replace(/ğ/g,'g').replace(/ü/g,'u').replace(/ş/g,'s')
    .replace(/ı/g,'i').replace(/ö/g,'o').replace(/ç/g,'c')
    .replace(/[^a-z0-9\s-]/g,'').trim()
    .replace(/\s+/g,'-').replace(/-+/g,'-')
}

export default function NewsForm({
  categories, initialData, mode,
  userRole, currentEditorId, currentEditorName, editors = [],
}: NewsFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [imageUploading, setImageUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [form, setForm] = useState({
    title: initialData?.title || '',
    slug: initialData?.slug || '',
    summary: initialData?.summary || '',
    content: initialData?.content || '',
    image_url: initialData?.image_url || '',
    category_id: initialData?.category_id || '',
    author: initialData?.author || currentEditorName,
    is_published: initialData?.is_published ?? false,
    is_breaking: initialData?.is_breaking ?? false,
    is_exclusive: initialData?.is_exclusive ?? false,
    editor_id: initialData?.editor_id || currentEditorId || '',
    columnist_id: null as string | null,
  })

  const handleTitleChange = (v: string) =>
    setForm((p) => ({ ...p, title: v, slug: mode === 'create' ? slugify(v) : p.slug }))

  const handleEditorChange = (id: string) => {
    const found = editors.find((e) => e.id === id)
    setForm((p) => ({ ...p, editor_id: id, author: found ? found.name : p.author }))
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return
    setImageUploading(true); setError('')
    try { const url = await uploadToCloudinary(file); setForm((p) => ({ ...p, image_url: url })) }
    catch (err: unknown) { setError('Hata: ' + (err instanceof Error ? err.message : String(err))) }
    finally { setImageUploading(false); if (fileInputRef.current) fileInputRef.current.value = '' }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true); setError('')
    if (!form.title.trim()) { setError('Başlık zorunludur.'); setLoading(false); return }
    if (!form.summary.trim()) { setError('Özet zorunludur.'); setLoading(false); return }
    if (!form.content.trim()) { setError('İçerik zorunludur.'); setLoading(false); return }
    if (!form.category_id) { setError('Kategori seçiniz.'); setLoading(false); return }
    if (!form.editor_id && !form.author.trim()) { setError('Editör bilgisi eksik.'); setLoading(false); return }
    const sb = createClient()
    const payload = {
      title: form.title, slug: form.slug, summary: form.summary,
      content: form.content, image_url: form.image_url || null,
      category_id: form.category_id, author: form.author,
      is_published: form.is_published, is_breaking: form.is_breaking,
      is_exclusive: form.is_exclusive,
      editor_id: form.editor_id || null,
      columnist_id: null,
      published_at: form.is_published ? new Date().toISOString() : null,
    }
    const res = mode === 'create'
      ? await sb.from('news').insert(payload).select().single()
      : await sb.from('news').update(payload).eq('id', initialData!.id!).select().single()
    if (res.error) { setError(res.error.code === '23505' ? 'Bu slug kullanılıyor.' : 'Hata: ' + res.error.message); setLoading(false); return }
    router.push('/admin/haberler'); router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">{error}</div>}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-white rounded-xl shadow-sm p-5">
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Başlık <span className="text-red-500">*</span></label>
            <input type="text" value={form.title} onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="Haber başlığını yazın..."
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2B59FF]/30 focus:border-[#2B59FF]" />
            <label className="block text-sm font-semibold text-gray-700 mb-1.5 mt-4">Slug</label>
            <input type="text" value={form.slug} onChange={(e) => setForm((p) => ({ ...p, slug: e.target.value }))}
              placeholder="haber-slug-url"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#2B59FF]/30 focus:border-[#2B59FF]" />
          </div>
          <div className="bg-white rounded-xl shadow-sm p-5">
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Özet <span className="text-red-500">*</span></label>
            <textarea value={form.summary} onChange={(e) => setForm((p) => ({ ...p, summary: e.target.value }))}
              placeholder="Haber özeti..." rows={3}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#2B59FF]/30 focus:border-[#2B59FF]" />
          </div>
          <div className="bg-white rounded-xl shadow-sm p-5">
            <label className="block text-sm font-semibold text-gray-700 mb-2">İçerik <span className="text-red-500">*</span></label>
            <TiptapEditor value={form.content} onChange={(html) => setForm((p) => ({ ...p, content: html }))} />
          </div>
        </div>
        <NewsFormSidebar
          form={form} setForm={setForm} categories={categories}
          editors={editors} userRole={userRole}
          handleEditorChange={handleEditorChange}
          handleImageUpload={handleImageUpload}
          imageUploading={imageUploading} loading={loading}
          fileInputRef={fileInputRef} mode={mode}
        />
      </div>
    </form>
  )
}
