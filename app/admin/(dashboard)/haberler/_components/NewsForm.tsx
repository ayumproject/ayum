'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { Category, News } from '@/lib/types'

interface NewsFormProps {
  categories: Category[]
  initialData?: Partial<News>
  mode: 'create' | 'edit'
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's')
    .replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ç/g, 'c')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

export default function NewsForm({ categories, initialData, mode }: NewsFormProps) {
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
    author: initialData?.author || 'Editör',
    is_published: initialData?.is_published ?? false,
    is_breaking: initialData?.is_breaking ?? false,
  })

  function handleTitleChange(value: string) {
    setForm((prev) => ({
      ...prev,
      title: value,
      slug: mode === 'create' ? slugify(value) : prev.slug,
    }))
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setImageUploading(true)
    const supabase = createClient()
    const fileName = `${Date.now()}-${file.name.replace(/\s/g, '-')}`

    const { data, error } = await supabase.storage
      .from('news-images')
      .upload(fileName, file, { cacheControl: '3600', upsert: false })

    if (error) {
      setError('Resim yüklenirken hata oluştu: ' + error.message)
      setImageUploading(false)
      return
    }

    const { data: urlData } = supabase.storage.from('news-images').getPublicUrl(data.path)
    setForm((prev) => ({ ...prev, image_url: urlData.publicUrl }))
    setImageUploading(false)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (!form.title.trim()) { setError('Başlık zorunludur.'); setLoading(false); return }
    if (!form.summary.trim()) { setError('Özet zorunludur.'); setLoading(false); return }
    if (!form.content.trim()) { setError('İçerik zorunludur.'); setLoading(false); return }
    if (!form.category_id) { setError('Kategori seçiniz.'); setLoading(false); return }

    const supabase = createClient()
    const payload = {
      ...form,
      published_at: form.is_published ? new Date().toISOString() : null,
    }

    let result
    if (mode === 'create') {
      result = await supabase.from('news').insert(payload).select().single()
    } else {
      result = await supabase.from('news').update(payload).eq('id', initialData!.id!).select().single()
    }

    if (result.error) {
      if (result.error.code === '23505') {
        setError('Bu slug zaten kullanılıyor. Slug\'u değiştirin.')
      } else {
        setError('Hata: ' + result.error.message)
      }
      setLoading(false)
      return
    }

    router.push('/admin/haberler')
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sol kolon - ana içerik */}
        <div className="lg:col-span-2 space-y-5">
          {/* Başlık */}
          <div className="bg-white rounded-xl shadow-sm p-5">
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Başlık <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="Haber başlığını yazın..."
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#c0392b]"
            />

            <label className="block text-sm font-semibold text-gray-700 mb-1.5 mt-4">
              Slug (URL)
            </label>
            <input
              type="text"
              value={form.slug}
              onChange={(e) => setForm((p) => ({ ...p, slug: e.target.value }))}
              placeholder="haber-slug-url"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#c0392b]"
            />
          </div>

          {/* Özet */}
          <div className="bg-white rounded-xl shadow-sm p-5">
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Özet <span className="text-red-500">*</span>
            </label>
            <textarea
              value={form.summary}
              onChange={(e) => setForm((p) => ({ ...p, summary: e.target.value }))}
              placeholder="Haber özeti (2-3 cümle)..."
              rows={3}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#c0392b]"
            />
          </div>

          {/* İçerik */}
          <div className="bg-white rounded-xl shadow-sm p-5">
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              İçerik <span className="text-red-500">*</span>
            </label>
            <textarea
              value={form.content}
              onChange={(e) => setForm((p) => ({ ...p, content: e.target.value }))}
              placeholder="Haber içeriğini yazın. HTML etiketleri kullanabilirsiniz..."
              rows={16}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm font-mono resize-y focus:outline-none focus:ring-2 focus:ring-[#c0392b]"
            />
            <p className="text-xs text-gray-400 mt-1">HTML etiketleri desteklenir: &lt;p&gt;, &lt;h2&gt;, &lt;h3&gt;, &lt;ul&gt;, &lt;li&gt;, &lt;strong&gt;, &lt;em&gt;, &lt;blockquote&gt;</p>
          </div>
        </div>

        {/* Sağ kolon - ayarlar */}
        <div className="space-y-5">
          {/* Yayın ayarları */}
          <div className="bg-white rounded-xl shadow-sm p-5">
            <h3 className="font-bold text-gray-800 mb-4">Yayın Ayarları</h3>

            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.is_published}
                  onChange={(e) => setForm((p) => ({ ...p, is_published: e.target.checked }))}
                  className="w-4 h-4 accent-[#c0392b]"
                />
                <div>
                  <span className="text-sm font-medium text-gray-700">Yayınla</span>
                  <p className="text-xs text-gray-400">Sitede görünür olacak</p>
                </div>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.is_breaking}
                  onChange={(e) => setForm((p) => ({ ...p, is_breaking: e.target.checked }))}
                  className="w-4 h-4 accent-[#c0392b]"
                />
                <div>
                  <span className="text-sm font-medium text-gray-700">Son Dakika</span>
                  <p className="text-xs text-gray-400">Kayan yazıda gösterilir</p>
                </div>
              </label>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Yazar
              </label>
              <input
                type="text"
                value={form.author}
                onChange={(e) => setForm((p) => ({ ...p, author: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#c0392b]"
              />
            </div>
          </div>

          {/* Kategori */}
          <div className="bg-white rounded-xl shadow-sm p-5">
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Kategori <span className="text-red-500">*</span>
            </label>
            <select
              value={form.category_id}
              onChange={(e) => setForm((p) => ({ ...p, category_id: e.target.value }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#c0392b]"
            >
              <option value="">Kategori seçin</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          {/* Kapak Görseli */}
          <div className="bg-white rounded-xl shadow-sm p-5">
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Kapak Görseli
            </label>

            {form.image_url && (
              <div className="relative mb-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={form.image_url}
                  alt="Kapak"
                  className="w-full h-36 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => setForm((p) => ({ ...p, image_url: '' }))}
                  className="absolute top-2 right-2 bg-red-500 text-white w-6 h-6 rounded-full text-xs flex items-center justify-center hover:bg-red-600"
                >
                  ×
                </button>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={imageUploading}
              className="w-full border-2 border-dashed border-gray-300 rounded-lg py-3 text-sm text-gray-500 hover:border-[#c0392b] hover:text-[#c0392b] transition-colors disabled:opacity-50"
            >
              {imageUploading ? 'Yükleniyor...' : '+ Görsel Yükle'}
            </button>

            <div className="mt-3">
              <input
                type="url"
                value={form.image_url}
                onChange={(e) => setForm((p) => ({ ...p, image_url: e.target.value }))}
                placeholder="veya görsel URL'si girin"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#c0392b]"
              />
            </div>
          </div>

          {/* Kaydet butonu */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#c0392b] hover:bg-[#922b21] disabled:bg-gray-300 text-white font-bold py-3 rounded-xl transition-colors"
          >
            {loading ? 'Kaydediliyor...' : mode === 'create' ? 'Haberi Kaydet' : 'Değişiklikleri Kaydet'}
          </button>
        </div>
      </div>
    </form>
  )
}