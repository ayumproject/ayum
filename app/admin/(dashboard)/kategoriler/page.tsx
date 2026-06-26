'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Category } from '@/lib/types'

const PRESET_COLORS = [
  '#e63946', '#c0392b', '#2a9d8f', '#e9c46a', '#264653',
  '#457b9d', '#6d6875', '#f4a261', '#2ecc71', '#9b59b6',
]

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editItem, setEditItem] = useState<Category | null>(null)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [form, setForm] = useState({ name: '', slug: '', color: '#e63946' })

  function slugify(text: string) {
    return text
      .toLowerCase()
      .replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's')
      .replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ç/g, 'c')
      .replace(/[^a-z0-9\s-]/g, '').trim()
      .replace(/\s+/g, '-').replace(/-+/g, '-')
  }

  async function loadCategories() {
    setLoading(true)
    const sb = createClient()
    const { data } = await sb.from('categories').select('*').order('name')
    setCategories(data || [])
    setLoading(false)
  }

  useEffect(() => { loadCategories() }, [])

  function openCreate() {
    setEditItem(null)
    setForm({ name: '', slug: '', color: '#e63946' })
    setShowForm(true)
  }

  function openEdit(cat: Category) {
    setEditItem(cat)
    setForm({ name: cat.name, slug: cat.slug, color: cat.color })
    setShowForm(true)
  }

  async function handleSave() {
    if (!form.name.trim() || !form.slug.trim()) {
      setMessage('Ad ve slug zorunludur.')
      return
    }

    setSaving(true)
    const sb = createClient()
    let error

    if (editItem) {
      const result = await sb.from('categories').update(form).eq('id', editItem.id)
      error = result.error
    } else {
      const result = await sb.from('categories').insert(form)
      error = result.error
    }

    if (error) {
      setMessage(error.code === '23505' ? 'Bu slug zaten kullanılıyor.' : 'Hata: ' + error.message)
    } else {
      setMessage(editItem ? 'Kategori güncellendi!' : 'Kategori eklendi!')
      setShowForm(false)
      loadCategories()
    }
    setSaving(false)
    setTimeout(() => setMessage(''), 3000)
  }

  async function handleDelete(id: string) {
    if (!confirm('Bu kategoriyi silmek istediğinize emin misiniz? Kategorideki haberlerin kategorisi silinecektir.')) return
    const sb = createClient()
    await sb.from('categories').delete().eq('id', id)
    loadCategories()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Kategoriler</h1>
          <p className="text-sm text-gray-500 mt-1">{categories.length} kategori</p>
        </div>
        <button
          onClick={openCreate}
          className="bg-[#c0392b] hover:bg-[#922b21] text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Yeni Kategori
        </button>
      </div>

      {message && (
        <div className={`mb-4 px-4 py-3 rounded-lg text-sm font-medium ${
          message.startsWith('Hata') || message.includes('kullanılıyor') ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'
        }`}>
          {message}
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-black text-lg">{editItem ? 'Kategori Düzenle' : 'Yeni Kategori'}</h2>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Kategori Adı *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm((p) => ({
                    ...p,
                    name: e.target.value,
                    slug: editItem ? p.slug : slugify(e.target.value),
                  }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#c0392b]"
                  placeholder="ör: Spor"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Slug *</label>
                <input
                  type="text"
                  value={form.slug}
                  onChange={(e) => setForm((p) => ({ ...p, slug: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#c0392b]"
                  placeholder="ör: spor"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Renk</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {PRESET_COLORS.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setForm((p) => ({ ...p, color }))}
                      className={`w-7 h-7 rounded-full border-2 transition-transform hover:scale-110 ${
                        form.color === color ? 'border-gray-800 scale-110' : 'border-transparent'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={form.color}
                    onChange={(e) => setForm((p) => ({ ...p, color: e.target.value }))}
                    className="w-10 h-10 rounded cursor-pointer border border-gray-300"
                  />
                  <span className="text-sm text-gray-500">Özel renk seç</span>
                  <span
                    className="ml-auto text-xs text-white px-3 py-1 rounded-full font-semibold"
                    style={{ backgroundColor: form.color }}
                  >
                    Önizleme
                  </span>
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowForm(false)}
                className="flex-1 border border-gray-300 text-gray-700 font-semibold py-2.5 rounded-lg text-sm hover:bg-gray-50"
              >
                İptal
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 bg-[#c0392b] text-white font-semibold py-2.5 rounded-lg text-sm hover:bg-[#922b21] disabled:bg-gray-300"
              >
                {saving ? 'Kaydediliyor...' : 'Kaydet'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Kategori listesi */}
      {loading ? (
        <div className="text-center py-12 text-gray-400">Yükleniyor...</div>
      ) : categories.length > 0 ? (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b">
                <th className="text-left px-5 py-3 font-semibold text-gray-600">Kategori</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Slug</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600 hidden md:table-cell">Renk</th>
                <th className="text-right px-5 py-3 font-semibold text-gray-600">İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat) => (
                <tr key={cat.id} className="border-b last:border-0 hover:bg-gray-50">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-3 h-3 rounded-full shrink-0"
                        style={{ backgroundColor: cat.color }}
                      />
                      <span className="font-semibold text-gray-800">{cat.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-mono text-gray-500 text-xs">{cat.slug}</td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <span
                      className="text-xs text-white px-2 py-0.5 rounded-full font-medium"
                      style={{ backgroundColor: cat.color }}
                    >
                      {cat.color}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEdit(cat)}
                        className="text-blue-500 hover:text-blue-700 text-xs px-3 py-1 border border-blue-200 rounded"
                      >
                        Düzenle
                      </button>
                      <button
                        onClick={() => handleDelete(cat.id)}
                        className="text-red-500 hover:text-red-700 text-xs px-3 py-1 border border-red-200 rounded"
                      >
                        Sil
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm text-center py-16 text-gray-400">
          <p className="text-sm">Henüz kategori eklenmemiş</p>
        </div>
      )}
    </div>
  )
}