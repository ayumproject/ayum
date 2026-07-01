'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Category } from '@/lib/types'

const PRESET_COLORS = [
  '#2B59FF','#e63946','#2a9d8f','#f59e0b','#8b5cf6',
  '#10b981','#f4a261','#457b9d','#6d6875','#ef4444',
]

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editItem, setEditItem] = useState<Category | null>(null)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [form, setForm] = useState({ name: '', slug: '', color: '#2B59FF' })

  function slugify(text: string) {
    return text.toLowerCase()
      .replace(/ğ/g,'g').replace(/ü/g,'u').replace(/ş/g,'s')
      .replace(/ı/g,'i').replace(/ö/g,'o').replace(/ç/g,'c')
      .replace(/[^a-z0-9\s-]/g,'').trim()
      .replace(/\s+/g,'-').replace(/-+/g,'-')
  }

  async function loadCategories() {
    setLoading(true)
    const sb = createClient()
    const { data } = await sb.from('categories').select('*').order('name')
    setCategories(data || [])
    setLoading(false)
  }

  useEffect(() => { loadCategories() }, [])

  function openCreate() { setEditItem(null); setForm({ name:'', slug:'', color:'#2B59FF' }); setShowForm(true) }

  function openEdit(cat: Category) {
    setEditItem(cat); setForm({ name: cat.name, slug: cat.slug, color: cat.color }); setShowForm(true)
  }

  async function handleSave() {
    if (!form.name.trim() || !form.slug.trim()) { setMessage('Ad ve slug zorunludur.'); return }
    setSaving(true)
    const sb = createClient()
    let error
    if (editItem) { const r = await sb.from('categories').update(form).eq('id', editItem.id); error = r.error }
    else { const r = await sb.from('categories').insert(form); error = r.error }
    if (error) { setMessage(error.code === '23505' ? 'Bu slug zaten kullaniliyor.' : 'Hata: ' + error.message) }
    else { setMessage(editItem ? 'Kategori guncellendi!' : 'Kategori eklendi!'); setShowForm(false); loadCategories() }
    setSaving(false); setTimeout(() => setMessage(''), 3000)
  }

  async function handleDelete(id: string) {
    if (!confirm('Bu kategoriyi silmek istediginize emin misiniz?')) return
    const sb = createClient()
    await sb.from('categories').delete().eq('id', id)
    loadCategories()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-extrabold text-[#2B2C35]" style={{ letterSpacing:'-0.03em' }}>Kategoriler</h1>
          <p className="text-sm text-[#747A88] mt-1 font-medium">{categories.length} kategori</p>
        </div>
        <button onClick={openCreate}
          className="flex items-center gap-2 text-sm font-bold text-white px-4 py-2.5 rounded-xl transition-all hover:shadow-[0_8px_24px_rgba(43,89,255,0.35)]"
          style={{ background:'linear-gradient(135deg,#2B59FF 0%,#1a3fd4 100%)' }}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Yeni Kategori
        </button>
      </div>

      {message && (
        <div className={`mb-5 px-4 py-3 rounded-xl text-sm font-semibold ${message.startsWith('Hata')||message.includes('kullaniliyor') ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-emerald-50 text-emerald-600 border border-emerald-100'}`}>
          {message}
        </div>
      )}

      {/* Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-[0_24px_64px_rgba(43,89,255,0.15)] w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-extrabold text-[#2B2C35] text-lg">{editItem ? 'Kategori Duzenle' : 'Yeni Kategori'}</h2>
                <p className="text-xs text-[#747A88] mt-0.5">{editItem ? 'Bilgileri guncelleyin' : 'Yeni kategori olusturun'}</p>
              </div>
              <button onClick={() => setShowForm(false)} className="w-8 h-8 rounded-xl bg-gray-50 hover:bg-gray-100 flex items-center justify-center text-[#747A88] transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#2B2C35] mb-1.5 uppercase tracking-wide">Kategori Adi *</label>
                <input type="text" value={form.name}
                  onChange={(e) => setForm((p) => ({ ...p, name: e.target.value, slug: editItem ? p.slug : slugify(e.target.value) }))}
                  className="w-full border border-gray-100 bg-[#F5F8FF] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2B59FF]/30 focus:border-[#2B59FF] transition-all"
                  placeholder="Spor, Ekonomi..." />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#2B2C35] mb-1.5 uppercase tracking-wide">Slug *</label>
                <input type="text" value={form.slug}
                  onChange={(e) => setForm((p) => ({ ...p, slug: slugify(e.target.value) }))}
                  className="w-full border border-gray-100 bg-[#F5F8FF] rounded-xl px-4 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#2B59FF]/30 focus:border-[#2B59FF] transition-all"
                  placeholder="spor, ekonomi..." />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#2B2C35] mb-1.5 uppercase tracking-wide">Renk</label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {PRESET_COLORS.map((color) => (
                    <button key={color} type="button" onClick={() => setForm((p) => ({ ...p, color }))}
                      className={`w-8 h-8 rounded-xl transition-all ${form.color === color ? 'ring-2 ring-offset-2 ring-[#2B59FF] scale-110' : 'hover:scale-105'}`}
                      style={{ backgroundColor: color }} />
                  ))}
                </div>
                <div className="flex items-center gap-3 bg-[#F5F8FF] rounded-xl px-4 py-2.5 border border-gray-100">
                  <input type="color" value={form.color} onChange={(e) => setForm((p) => ({ ...p, color: e.target.value }))}
                    className="w-7 h-7 rounded-lg border-0 cursor-pointer bg-transparent" />
                  <span className="text-sm text-[#747A88] font-medium flex-1">Ozel renk sec</span>
                  <span className="text-xs font-bold text-white px-3 py-1 rounded-lg" style={{ backgroundColor: form.color }}>
                    Onizleme
                  </span>
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowForm(false)} className="flex-1 border border-gray-100 text-[#747A88] font-bold py-2.5 rounded-xl text-sm hover:bg-gray-50 transition-colors">Iptal</button>
              <button onClick={handleSave} disabled={saving}
                className="flex-1 text-white font-bold py-2.5 rounded-xl text-sm disabled:opacity-50 transition-all hover:shadow-[0_8px_24px_rgba(43,89,255,0.35)]"
                style={{ background:'linear-gradient(135deg,#2B59FF 0%,#1a3fd4 100%)' }}>
                {saving ? 'Kaydediliyor...' : 'Kaydet'}
              </button>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-[#2B59FF] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : categories.length > 0 ? (
        <div className="bg-white rounded-2xl border border-gray-50 overflow-hidden">
          <div className="grid grid-cols-4 px-5 py-3 bg-[#F5F8FF] border-b border-gray-100">
            <span className="text-xs font-bold text-[#747A88] uppercase tracking-wide col-span-2">Kategori</span>
            <span className="text-xs font-bold text-[#747A88] uppercase tracking-wide hidden md:block">Slug</span>
            <span className="text-xs font-bold text-[#747A88] uppercase tracking-wide text-right">Islemler</span>
          </div>
          <div className="divide-y divide-gray-50">
            {categories.map((cat) => (
              <div key={cat.id} className="grid grid-cols-4 px-5 py-3.5 items-center hover:bg-[#F5F8FF] transition-colors">
                <div className="flex items-center gap-3 col-span-2">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-sm"
                    style={{ backgroundColor: cat.color + '20', border: `2px solid ${cat.color}30` }}>
                    <span className="w-3.5 h-3.5 rounded-full shrink-0" style={{ backgroundColor: cat.color }} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#2B2C35]">{cat.name}</p>
                    <span className="text-[10px] font-bold text-white px-1.5 py-0.5 rounded-md" style={{ backgroundColor: cat.color }}>
                      {cat.color}
                    </span>
                  </div>
                </div>
                <div className="hidden md:block">
                  <span className="text-xs font-mono text-[#747A88] bg-[#F5F8FF] px-2.5 py-1 rounded-lg border border-gray-100">{cat.slug}</span>
                </div>
                <div className="flex items-center justify-end gap-1.5">
                  <button onClick={() => openEdit(cat)}
                    className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-[#EEF2FF] text-[#2B59FF] hover:bg-[#2B59FF] hover:text-white transition-colors">
                    Duzenle
                  </button>
                  <button onClick={() => handleDelete(cat.id)}
                    className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-colors">
                    Sil
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-50 text-center py-20">
          <div className="w-16 h-16 bg-[#EEF2FF] rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-[#2B59FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
          </div>
          <p className="text-sm font-semibold text-[#2B2C35] mb-1">Henuz kategori eklenmemis</p>
          <p className="text-xs text-[#747A88] mb-4">Haberleriniz icin kategori olusturun</p>
          <button onClick={openCreate} className="text-sm font-bold text-[#2B59FF] hover:underline">Ilk kategoriyi ekle</button>
        </div>
      )}
    </div>
  )
}