'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { uploadToCloudinary } from '@/lib/cloudinary'
import type { Category, News, Columnist } from '@/lib/types'
import dynamic from 'next/dynamic'

const TiptapEditor = dynamic(() => import('@/components/TiptapEditor'), { ssr: false })

interface ColumnFormProps {
  categories: Category[]
  initialData?: Partial<News>
  mode: 'create' | 'edit'
  userRole: 'admin' | 'editor' | 'columnist'
  currentColumnistId: string | null
  currentColumnistName: string
  columnists?: Columnist[]
}

function slugify(t: string) {
  return t.toLowerCase()
    .replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's')
    .replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ç/g, 'c')
    .replace(/[^a-z0-9\s-]/g, '').trim()
    .replace(/\s+/g, '-').replace(/-+/g, '-')
}

export default function ColumnForm({
  categories, initialData, mode,
  userRole, currentColumnistId, currentColumnistName, columnists = [],
}: ColumnFormProps) {
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
    author: initialData?.author || currentColumnistName,
    is_published: initialData?.is_published ?? false,
    columnist_id: initialData?.columnist_id || currentColumnistId || '',
  })

  const handleTitleChange = (v: string) =>
    setForm((p) => ({ ...p, title: v, slug: mode === 'create' ? slugify(v) : p.slug }))

  const handleColumnistChange = (id: string) => {
    const found = columnists.find((c) => c.id === id)
    setForm((p) => ({ ...p, columnist_id: id, author: found ? found.name : p.author }))
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
    if (!form.content.trim()) { setError('İçerik zorunludur.'); setLoading(false); return }
    // Sadece admin için köşe yazarı seçimi zorunlu; columnist rolü zaten kendine ait
    if (userRole === 'admin' && !form.columnist_id) { setError('Köşe yazarı seçiniz.'); setLoading(false); return }
    const sb = createClient()
    const payload = {
      title: form.title, slug: form.slug, summary: form.summary || null,
      content: form.content, image_url: form.image_url || null,
      category_id: form.category_id || null, author: form.author,
      is_published: form.is_published, is_breaking: false,
      columnist_id: form.columnist_id || null,
      editor_id: null,
      published_at: form.is_published ? new Date().toISOString() : null,
    }
    const res = mode === 'create'
      ? await sb.from('news').insert(payload).select().single()
      : await sb.from('news').update(payload).eq('id', initialData!.id!).select().single()
    if (res.error) { setError(res.error.code === '23505' ? 'Bu slug kullaniliyor.' : 'Hata: ' + res.error.message); setLoading(false); return }
    router.push('/admin/kose-yazim'); router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">{error}</div>}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-white rounded-xl shadow-sm p-5">
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Baslik <span className="text-red-500">*</span>
            </label>
            <input type="text" value={form.title} onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="Kose yazisi basligi..."
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2B59FF]/30 focus:border-[#2B59FF] bg-[#F5F8FF]" />
            <label className="block text-sm font-semibold text-gray-700 mb-1.5 mt-4">Slug</label>
            <input type="text" value={form.slug} onChange={(e) => setForm((p) => ({ ...p, slug: e.target.value }))}
              placeholder="kose-yazisi-slug"
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#2B59FF]/30 focus:border-[#2B59FF] bg-[#F5F8FF]" />
          </div>
          <div className="bg-white rounded-xl shadow-sm p-5">
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Ozet</label>
            <textarea value={form.summary} onChange={(e) => setForm((p) => ({ ...p, summary: e.target.value }))}
              placeholder="Kisa ozet (opsiyonel)..." rows={3}
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#2B59FF]/30 focus:border-[#2B59FF] bg-[#F5F8FF]" />
          </div>
          <div className="bg-white rounded-xl shadow-sm p-5">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Icerik <span className="text-red-500">*</span>
            </label>
            <TiptapEditor value={form.content} onChange={(html) => setForm((p) => ({ ...p, content: html }))} />
          </div>
        </div>

        <div className="space-y-5">
          <div className="bg-white rounded-xl shadow-sm p-5">
            <h3 className="font-bold text-[#2B2C35] mb-4 text-sm">Yayin Ayarlari</h3>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" checked={form.is_published}
                onChange={(e) => setForm((p) => ({ ...p, is_published: e.target.checked }))}
                className="w-4 h-4 accent-[#2B59FF]" />
              <div>
                <span className="text-sm font-semibold text-gray-700">Yayinla</span>
                <p className="text-xs text-gray-400">Sitede gorunur olacak</p>
              </div>
            </label>
          </div>

          {userRole === 'admin' && columnists.length > 0 ? (
            <div className="bg-white rounded-xl shadow-sm p-5">
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Kose Yazari <span className="text-red-500">*</span>
              </label>
              <select value={form.columnist_id} onChange={(e) => handleColumnistChange(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2B59FF]/30 focus:border-[#2B59FF] bg-[#F5F8FF]">
                <option value="">Yazar secin</option>
                {columnists.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm p-5">
              <p className="text-xs font-bold text-[#747A88] uppercase tracking-wider mb-1.5">Kose Yazari</p>
              <div className="flex items-center gap-2 bg-[#F5F8FF] rounded-lg px-3 py-2.5">
                <div className="w-6 h-6 rounded-full bg-[#2B59FF] flex items-center justify-center shrink-0">
                  <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <span className="text-sm font-semibold text-[#2B2C35]">{form.author}</span>
              </div>
            </div>
          )}

          <div className="bg-white rounded-xl shadow-sm p-5">
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Kategori</label>
            <select value={form.category_id}
              onChange={(e) => setForm((p) => ({ ...p, category_id: e.target.value }))}
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2B59FF]/30 focus:border-[#2B59FF] bg-[#F5F8FF]">
              <option value="">Kategori secin (opsiyonel)</option>
              {categories.map((cat) => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
            </select>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-5">
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Kapak Gorseli</label>
            {form.image_url && (
              <div className="relative mb-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={form.image_url} alt="Kapak" className="w-full h-36 object-cover rounded-lg" />
                <button type="button" onClick={() => setForm((p) => ({ ...p, image_url: '' }))}
                  className="absolute top-2 right-2 bg-red-500 text-white w-6 h-6 rounded-full text-xs flex items-center justify-center hover:bg-red-600">x</button>
              </div>
            )}
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
            <button type="button" onClick={() => fileInputRef.current?.click()} disabled={imageUploading}
              className="w-full border-2 border-dashed border-gray-200 rounded-lg py-3 text-sm text-gray-500 hover:border-[#2B59FF] hover:text-[#2B59FF] transition-colors disabled:opacity-50">
              {imageUploading ? 'Yukleniyor...' : '+ Gorsel Yukle'}
            </button>
            <input type="url" value={form.image_url}
              onChange={(e) => setForm((p) => ({ ...p, image_url: e.target.value }))}
              placeholder="veya gorsel URL girin"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs mt-3 focus:outline-none focus:ring-2 focus:ring-[#2B59FF]/30 bg-[#F5F8FF]" />
          </div>

          <button type="submit" disabled={loading || imageUploading}
            className="w-full bg-[#2B59FF] hover:bg-[#1e46e8] disabled:bg-gray-300 text-white font-bold py-3 rounded-xl transition-colors shadow-[0_4px_20px_rgba(43,89,255,0.3)]">
            {loading ? 'Kaydediliyor...' : mode === 'create' ? 'Yaziyi Kaydet' : 'Degisiklikleri Kaydet'}
          </button>
        </div>
      </div>
    </form>
  )
}
