'use client'

import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { uploadToCloudinary } from '@/lib/cloudinary'
import type { Columnist } from '@/lib/types'

export default function AdminColumnistsPage() {
  const [columnists, setColumnists] = useState<Columnist[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editItem, setEditItem] = useState<Columnist | null>(null)
  const [imageUploading, setImageUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [form, setForm] = useState({ name: '', title: '', photo_url: '', bio: '', slug: '', is_active: true, order_index: 0 })

  function slugify(text: string) {
    return text.toLowerCase().replace(/ğ/g,'g').replace(/ü/g,'u').replace(/ş/g,'s').replace(/ı/g,'i').replace(/ö/g,'o').replace(/ç/g,'c').replace(/[^a-z0-9\s-]/g,'').trim().replace(/\s+/g,'-').replace(/-+/g,'-')
  }

  async function load() {
    setLoading(true)
    const sb = createClient()
    const { data } = await sb.from('columnists').select('*').order('order_index')
    setColumnists(data || [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  function openCreate() {
    setEditItem(null)
    setForm({ name:'', title:'', photo_url:'', bio:'', slug:'', is_active:true, order_index: columnists.length })
    setShowForm(true)
  }

  function openEdit(c: Columnist) {
    setEditItem(c)
    setForm({ name:c.name, title:c.title, photo_url:c.photo_url||'', bio:c.bio||'', slug:c.slug, is_active:c.is_active, order_index:c.order_index })
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
      setMessage('Foto yuklenemedi: ' + (err instanceof Error ? err.message : String(err)))
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
    if (editItem) { const r = await sb.from('columnists').update(payload).eq('id', editItem.id); error = r.error }
    else { const r = await sb.from('columnists').insert(payload); error = r.error }
    if (error) { setMessage(error.code === '23505' ? 'Bu slug zaten kullaniliyor.' : 'Hata: ' + error.message) }
    else { setMessage(editItem ? 'Guncellendi!' : 'Eklendi!'); setShowForm(false); load() }
    setSaving(false); setTimeout(() => setMessage(''), 3000)
  }

  async function handleDelete(id: string) {
    if (!confirm('Bu yazar silinecek. Emin misiniz?')) return
    const sb = createClient()
    await sb.from('columnists').delete().eq('id', id)
    load()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-extrabold text-[#2B2C35]" style={{ letterSpacing:'-0.03em' }}>Kose Yazarlari</h1>
          <p className="text-sm text-[#747A88] mt-1 font-medium">{columnists.length} yazar</p>
        </div>
        <button onClick={openCreate}
          className="flex items-center gap-2 text-sm font-bold text-white px-4 py-2.5 rounded-xl transition-all hover:shadow-[0_8px_24px_rgba(43,89,255,0.35)]"
          style={{ background:'linear-gradient(135deg,#2B59FF 0%,#1a3fd4 100%)' }}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          Yeni Yazar
        </button>
      </div>

      {message && (
        <div className={`mb-5 px-4 py-3 rounded-xl text-sm font-semibold ${message.startsWith('Hata')||message.includes('kullaniliyor')||message.includes('yuklenemedi') ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-emerald-50 text-emerald-600 border border-emerald-100'}`}>
          {message}
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-[0_24px_64px_rgba(43,89,255,0.15)] w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-extrabold text-[#2B2C35] text-lg">{editItem ? 'Yazari Duzenle' : 'Yeni Yazar'}</h2>
              <button onClick={() => setShowForm(false)} className="w-8 h-8 rounded-xl bg-gray-50 flex items-center justify-center text-[#747A88]">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl overflow-hidden bg-[#F5F8FF] shrink-0">
                  {form.photo_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={form.photo_url} alt="foto" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#2B59FF] to-[#1a3fd4]">
                      <span className="text-white font-extrabold text-xl">{form.name ? form.name[0] : '?'}</span>
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <input ref={fileInputRef} type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                  <button type="button" onClick={() => fileInputRef.current?.click()} disabled={imageUploading}
                    className="w-full border-2 border-dashed border-[#2B59FF]/20 bg-[#F5F8FF] rounded-xl py-2 text-sm text-[#747A88] hover:border-[#2B59FF]/50 hover:text-[#2B59FF] disabled:opacity-50 font-medium">
                    {imageUploading ? 'Yukleniyor...' : '+ Foto Yukle'}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-[#2B2C35] mb-1.5 uppercase tracking-wide">Ad Soyad *</label>
                <input type="text" value={form.name} onChange={(e) => setForm(p => ({ ...p, name: e.target.value, slug: editItem ? p.slug : slugify(e.target.value) }))}
                  className="w-full border border-gray-100 bg-[#F5F8FF] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2B59FF]/30" placeholder="Ahmet Yilmaz" />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#2B2C35] mb-1.5 uppercase tracking-wide">Unvan</label>
                <input type="text" value={form.title} onChange={(e) => setForm(p => ({ ...p, title: e.target.value }))}
                  className="w-full border border-gray-100 bg-[#F5F8FF] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2B59FF]/30" placeholder="Siyaset Yazari" />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#2B2C35] mb-1.5 uppercase tracking-wide">Slug *</label>
                <input type="text" value={form.slug} onChange={(e) => setForm(p => ({ ...p, slug: slugify(e.target.value) }))}
                  className="w-full border border-gray-100 bg-[#F5F8FF] rounded-xl px-4 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#2B59FF]/30" placeholder="ahmet-yilmaz" />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#2B2C35] mb-1.5 uppercase tracking-wide">Biyografi</label>
                <textarea value={form.bio} onChange={(e) => setForm(p => ({ ...p, bio: e.target.value }))} rows={3}
                  className="w-full border border-gray-100 bg-[#F5F8FF] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2B59FF]/30 resize-none" placeholder="Kisa biyografi..." />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#2B2C35] mb-1.5 uppercase tracking-wide">Sira</label>
                  <input type="number" value={form.order_index} min={0} onChange={(e) => setForm(p => ({ ...p, order_index: parseInt(e.target.value)||0 }))}
                    className="w-full border border-gray-100 bg-[#F5F8FF] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2B59FF]/30" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#2B2C35] mb-1.5 uppercase tracking-wide">Durum</label>
                  <select value={form.is_active ? 'true' : 'false'} onChange={(e) => setForm(p => ({ ...p, is_active: e.target.value === 'true' }))}
                    className="w-full border border-gray-100 bg-[#F5F8FF] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2B59FF]/30">
                    <option value="true">Aktif</option>
                    <option value="false">Pasif</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowForm(false)} className="flex-1 border border-gray-100 text-[#747A88] font-bold py-2.5 rounded-xl text-sm hover:bg-gray-50">Iptal</button>
              <button onClick={handleSave} disabled={saving} className="flex-1 text-white font-bold py-2.5 rounded-xl text-sm disabled:opacity-50"
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
      ) : columnists.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {columnists.map((c) => (
            <div key={c.id} className="bg-white rounded-2xl border border-gray-50 p-5 flex items-center gap-4 hover:shadow-[0_8px_30px_rgba(43,89,255,0.1)] transition-all group">
              <div className="w-14 h-14 rounded-2xl overflow-hidden shrink-0">
                {c.photo_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={c.photo_url} alt={c.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#2B59FF] to-[#1a3fd4]">
                    <span className="text-white font-extrabold text-xl">{c.name[0]}</span>
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-[#2B2C35] text-sm truncate">{c.name}</p>
                <p className="text-xs text-[#747A88] truncate">{c.title}</p>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-lg ${c.is_active ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-100 text-gray-400'}`}>
                    {c.is_active ? 'Aktif' : 'Pasif'}
                  </span>
                  <span className="text-[10px] text-[#747A88] font-mono">/{c.slug}</span>
                </div>
              </div>
              <div className="flex flex-col gap-1.5 shrink-0">
                <button onClick={() => openEdit(c)} className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-[#EEF2FF] text-[#2B59FF] hover:bg-[#2B59FF] hover:text-white transition-colors">Duzenle</button>
                <button onClick={() => handleDelete(c.id)} className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-colors">Sil</button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-50 text-center py-20">
          <div className="w-16 h-16 bg-[#EEF2FF] rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-[#2B59FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <p className="text-sm font-semibold text-[#2B2C35] mb-1">Henuz yazar eklenmemis</p>
          <p className="text-xs text-[#747A88] mb-4">Kose yazarlarinizi ekleyin</p>
          <button onClick={openCreate} className="text-sm font-bold text-[#2B59FF] hover:underline">Ilk yazari ekle</button>
        </div>
      )}
    </div>
  )
}