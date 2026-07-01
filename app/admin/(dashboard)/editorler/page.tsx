'use client'

import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { uploadToCloudinary } from '@/lib/cloudinary'
import type { Editor } from '@/lib/types'

export default function AdminEditorsPage() {
  const [editors, setEditors] = useState<Editor[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editItem, setEditItem] = useState<Editor | null>(null)
  const [imageUploading, setImageUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [form, setForm] = useState({ name: '', slug: '', photo_url: '', bio: '', is_active: true, order_index: 0 })

  function slugify(text: string) {
    return text.toLowerCase()
      .replace(/ğ/g,'g').replace(/ü/g,'u').replace(/ş/g,'s')
      .replace(/ı/g,'i').replace(/ö/g,'o').replace(/ç/g,'c')
      .replace(/[^a-z0-9\s-]/g,'').trim()
      .replace(/\s+/g,'-').replace(/-+/g,'-')
  }

  async function load() {
    setLoading(true)
    const sb = createClient()
    const { data } = await sb.from('editors').select('*').order('order_index')
    setEditors(data || [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  function openCreate() {
    setEditItem(null)
    setForm({ name: '', slug: '', photo_url: '', bio: '', is_active: true, order_index: editors.length })
    setShowForm(true)
  }

  function openEdit(e: Editor) {
    setEditItem(e)
    setForm({ name: e.name, slug: e.slug, photo_url: e.photo_url || '', bio: e.bio || '', is_active: e.is_active, order_index: e.order_index })
    setShowForm(true)
  }

  async function handlePhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setImageUploading(true)
    try {
      const url = await uploadToCloudinary(file)
      setForm(p => ({ ...p, photo_url: url }))
    } catch (err: unknown) {
      setMessage('Fotoğraf yüklenemedi: ' + (err instanceof Error ? err.message : String(err)))
    } finally {
      setImageUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  async function handleSave() {
    if (!form.name.trim() || !form.slug.trim()) { setMessage('Ad ve slug zorunludur.'); return }
    setSaving(true)
    const sb = createClient()
    const payload = { ...form, bio: form.bio || null, photo_url: form.photo_url || null }
    let error
    if (editItem) { const r = await sb.from('editors').update(payload).eq('id', editItem.id); error = r.error }
    else { const r = await sb.from('editors').insert(payload); error = r.error }
    if (error) { setMessage(error.code === '23505' ? 'Bu slug zaten kullanılıyor.' : 'Hata: ' + error.message) }
    else { setMessage(editItem ? 'Güncellendi!' : 'Eklendi!'); setShowForm(false); load() }
    setSaving(false)
    setTimeout(() => setMessage(''), 3000)
  }

  async function handleDelete(id: string) {
    if (!confirm('Bu editörü silmek istediğinize emin misiniz?')) return
    const sb = createClient()
    await sb.from('editors').delete().eq('id', id)
    load()
  }
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-extrabold text-[#2B2C35]" style={{ letterSpacing: '-0.03em' }}>Editörler</h1>
          <p className="text-sm text-[#747A88] mt-0.5">{editors.length} editör</p>
        </div>
        <button onClick={openCreate}
          className="flex items-center gap-2 text-sm font-bold text-white px-4 py-2.5 rounded-xl"
          style={{ background: 'linear-gradient(135deg,#2B59FF 0%,#1a3fd4 100%)' }}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Yeni Editör
        </button>
      </div>

      {message && (
        <div className={`mb-4 text-sm font-medium px-4 py-3 rounded-xl ${message.includes('Hata') || message.includes('zaten') ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
          {message}
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <h2 className="font-extrabold text-[#2B2C35] text-lg mb-5">{editItem ? 'Editörü Düzenle' : 'Yeni Editör'}</h2>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-[#747A88] uppercase tracking-wider mb-1.5 block">Ad Soyad *</label>
                <input type="text" value={form.name}
                  onChange={(e) => setForm(p => ({ ...p, name: e.target.value, slug: editItem ? p.slug : slugify(e.target.value) }))}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2B59FF]/30 focus:border-[#2B59FF]" />
              </div>
              <div>
                <label className="text-xs font-bold text-[#747A88] uppercase tracking-wider mb-1.5 block">Slug *</label>
                <input type="text" value={form.slug} onChange={(e) => setForm(p => ({ ...p, slug: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#2B59FF]/30 focus:border-[#2B59FF]" />
              </div>
              <div>
                <label className="text-xs font-bold text-[#747A88] uppercase tracking-wider mb-1.5 block">Biyografi</label>
                <textarea value={form.bio} onChange={(e) => setForm(p => ({ ...p, bio: e.target.value }))} rows={3}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#2B59FF]/30 focus:border-[#2B59FF]" />
              </div>
              <div>
                <label className="text-xs font-bold text-[#747A88] uppercase tracking-wider mb-1.5 block">Fotoğraf</label>
                {form.photo_url && (
                  <div className="relative w-16 h-16 mb-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={form.photo_url} alt="" className="w-full h-full object-cover rounded-xl" />
                    <button type="button" onClick={() => setForm(p => ({ ...p, photo_url: '' }))}
                      className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center">×</button>
                  </div>
                )}
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                <button type="button" onClick={() => fileInputRef.current?.click()} disabled={imageUploading}
                  className="w-full border-2 border-dashed border-gray-200 rounded-xl py-2.5 text-sm text-[#747A88] hover:border-[#2B59FF] hover:text-[#2B59FF] transition-colors disabled:opacity-50">
                  {imageUploading ? 'Yükleniyor...' : '+ Fotoğraf Yükle'}
                </button>
              </div>
              <div className="flex items-center gap-3">
                <label className="text-xs font-bold text-[#747A88] uppercase tracking-wider">Sıra</label>
                <input type="number" value={form.order_index}
                  onChange={(e) => setForm(p => ({ ...p, order_index: parseInt(e.target.value) || 0 }))}
                  className="w-20 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none" />
                <label className="flex items-center gap-2 ml-auto cursor-pointer">
                  <span className="text-xs font-bold text-[#747A88] uppercase tracking-wider">Aktif</span>
                  <input type="checkbox" checked={form.is_active}
                    onChange={(e) => setForm(p => ({ ...p, is_active: e.target.checked }))}
                    className="w-4 h-4 accent-[#2B59FF]" />
                </label>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowForm(false)}
                className="flex-1 border border-gray-200 text-[#747A88] font-bold py-2.5 rounded-xl text-sm hover:bg-gray-50">İptal</button>
              <button onClick={handleSave} disabled={saving}
                className="flex-1 text-white font-bold py-2.5 rounded-xl text-sm disabled:opacity-50"
                style={{ background: 'linear-gradient(135deg,#2B59FF 0%,#1a3fd4 100%)' }}>
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
      ) : editors.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {editors.map((e) => (
            <div key={e.id} className="bg-white rounded-2xl border border-gray-50 p-5 flex items-center gap-4 hover:shadow-[0_8px_30px_rgba(43,89,255,0.1)] transition-all">
              <div className="w-14 h-14 rounded-2xl overflow-hidden shrink-0">
                {e.photo_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={e.photo_url} alt={e.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#2B59FF] to-[#1a3fd4]">
                    <span className="text-white font-extrabold text-xl">{e.name[0]}</span>
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-[#2B2C35] text-sm truncate">{e.name}</p>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-lg ${e.is_active ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-100 text-gray-400'}`}>
                  {e.is_active ? 'Aktif' : 'Pasif'}
                </span>
              </div>
              <div className="flex flex-col gap-1.5 shrink-0">
                <button onClick={() => openEdit(e)} className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-[#EEF2FF] text-[#2B59FF] hover:bg-[#2B59FF] hover:text-white transition-colors">Düzenle</button>
                <button onClick={() => handleDelete(e.id)} className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-colors">Sil</button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-50 text-center py-20">
          <p className="text-sm font-semibold text-[#2B2C35] mb-1">Henüz editör eklenmemiş</p>
          <button onClick={openCreate} className="text-sm font-bold text-[#2B59FF] hover:underline mt-2">İlk editörü ekle</button>
        </div>
      )}
    </div>
  )
}