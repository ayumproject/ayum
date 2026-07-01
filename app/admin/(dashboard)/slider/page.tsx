'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { uploadToCloudinary } from '@/lib/cloudinary'
import type { Slider } from '@/lib/types'

interface NewsHit { id: string; title: string; slug: string; category: { name: string } | null }

export default function AdminSliderPage() {
  const [sliders, setSliders] = useState<Slider[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editItem, setEditItem] = useState<Slider | null>(null)
  const [imageUploading, setImageUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Haber arama
  const [newsSearch, setNewsSearch] = useState('')
  const [newsResults, setNewsResults] = useState<NewsHit[]>([])
  const [newsOpen, setNewsOpen] = useState(false)
  const newsBoxRef = useRef<HTMLDivElement>(null)

  const [form, setForm] = useState({ title: '', subtitle: '', image_url: '', link: '', order_index: 0, is_active: true, type: 'main' })

  // ── Haber arama debounce ──────────────────────────────────
  const searchNews = useCallback(async (q: string) => {
    if (!q.trim()) { setNewsResults([]); setNewsOpen(false); return }
    const sb = createClient()
    const { data } = await sb
      .from('news')
      .select('id, title, slug, category:categories(name)')
      .eq('is_published', true)
      .ilike('title', `%${q}%`)
      .order('published_at', { ascending: false })
      .limit(8)
    setNewsResults((data as unknown as NewsHit[]) || [])
    setNewsOpen(true)
  }, [])

  useEffect(() => {
    const t = setTimeout(() => searchNews(newsSearch), 280)
    return () => clearTimeout(t)
  }, [newsSearch, searchNews])

  // Dışarı tıklanınca kapat
  useEffect(() => {
    function handleOut(e: MouseEvent) {
      if (newsBoxRef.current && !newsBoxRef.current.contains(e.target as Node)) {
        setNewsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleOut)
    return () => document.removeEventListener('mousedown', handleOut)
  }, [])

  function selectNews(n: NewsHit) {
    setForm(p => ({ ...p, link: `/haber/${n.slug}` }))
    setNewsSearch('')
    setNewsResults([])
    setNewsOpen(false)
  }

  function clearNewsSelection() {
    setForm(p => ({ ...p, link: '' }))
  }
  // ─────────────────────────────────────────────────────────

  async function loadSliders() {
    setLoading(true)
    const sb = createClient()
    const { data } = await sb.from('sliders').select('*').order('order_index', { ascending: true })
    setSliders(data || [])
    setLoading(false)
  }

  useEffect(() => { loadSliders() }, [])

  function openCreate() {
    setEditItem(null)
    setNewsSearch('')
    setNewsResults([])
    setForm({ title: '', subtitle: '', image_url: '', link: '', order_index: sliders.length, is_active: true, type: 'main' })
    setShowForm(true)
  }

  function openEdit(slider: Slider) {
    setEditItem(slider)
    setNewsSearch('')
    setNewsResults([])
    setForm({ title: slider.title, subtitle: slider.subtitle || '', image_url: slider.image_url, link: slider.link || '', order_index: slider.order_index, is_active: slider.is_active, type: (slider.type || 'main') })
    setShowForm(true)
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setImageUploading(true)
    setMessage('')
    try {
      const url = await uploadToCloudinary(file)
      setForm((p) => ({ ...p, image_url: url }))
    } catch (err: unknown) {
      setMessage('Resim yuklenemedi: ' + (err instanceof Error ? err.message : String(err)))
    } finally {
      setImageUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  async function handleSave() {
    if (!form.title.trim() || !form.image_url.trim()) { setMessage('Baslik ve gorsel zorunludur.'); return }
    setSaving(true)
    const sb = createClient()
    const payload = { ...form, subtitle: form.subtitle || null, link: form.link || null }
    let error
    if (editItem) { const r = await sb.from('sliders').update(payload).eq('id', editItem.id); error = r.error }
    else { const r = await sb.from('sliders').insert(payload); error = r.error }
    if (error) { setMessage('Hata: ' + error.message) }
    else { setMessage(editItem ? 'Slider guncellendi!' : 'Slider eklendi!'); setShowForm(false); loadSliders() }
    setSaving(false)
    setTimeout(() => setMessage(''), 3000)
  }

  async function handleDelete(id: string) {
    if (!confirm('Bu slideri silmek istediginize emin misiniz?')) return
    const sb = createClient()
    await sb.from('sliders').delete().eq('id', id)
    loadSliders()
  }

  async function toggleActive(slider: Slider) {
    const sb = createClient()
    await sb.from('sliders').update({ is_active: !slider.is_active }).eq('id', slider.id)
    loadSliders()
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-extrabold text-[#2B2C35]" style={{ letterSpacing: '-0.03em' }}>Slider Yonetimi</h1>
          <p className="text-sm text-[#747A88] mt-1 font-medium">Anasayfa slider gorsellerini yonetin</p>
        </div>
        <button onClick={openCreate}
          className="flex items-center gap-2 text-sm font-bold text-white px-4 py-2.5 rounded-xl transition-all hover:shadow-[0_8px_24px_rgba(43,89,255,0.35)]"
          style={{ background: 'linear-gradient(135deg,#2B59FF 0%,#1a3fd4 100%)' }}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Yeni Slider
        </button>
      </div>

      {/* Message */}
      {message && (
        <div className={`mb-5 px-4 py-3 rounded-xl text-sm font-semibold ${
          message.startsWith('Hata') || message.startsWith('Resim') ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-emerald-50 text-emerald-600 border border-emerald-100'
        }`}>
          {message}
        </div>
      )}

      {/* Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-[0_24px_64px_rgba(43,89,255,0.15)] w-full max-w-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-extrabold text-[#2B2C35] text-lg">{editItem ? 'Slider Duzenle' : 'Yeni Slider'}</h2>
                <p className="text-xs text-[#747A88] mt-0.5">{editItem ? 'Bilgileri guncelleyin' : 'Yeni slider olusturun'}</p>
              </div>
              <button onClick={() => setShowForm(false)} className="w-8 h-8 rounded-xl bg-gray-50 hover:bg-gray-100 flex items-center justify-center text-[#747A88]">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#2B2C35] mb-1.5 uppercase tracking-wide">Baslik *</label>
                <input type="text" value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                  className="w-full border border-gray-100 bg-[#F5F8FF] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2B59FF]/30 focus:border-[#2B59FF] transition-all" placeholder="Slider basligi" />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#2B2C35] mb-1.5 uppercase tracking-wide">Alt Baslik</label>
                <input type="text" value={form.subtitle} onChange={(e) => setForm((p) => ({ ...p, subtitle: e.target.value }))}
                  className="w-full border border-gray-100 bg-[#F5F8FF] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2B59FF]/30 focus:border-[#2B59FF] transition-all" placeholder="Opsiyonel" />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#2B2C35] mb-1.5 uppercase tracking-wide">Gorsel *</label>
                {form.image_url && (
                  <div className="relative mb-2 rounded-xl overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={form.image_url} alt="preview" className="w-full h-32 object-cover" />
                    <button type="button" onClick={() => setForm((p) => ({ ...p, image_url: '' }))}
                      className="absolute top-2 right-2 bg-red-500 text-white w-7 h-7 rounded-lg flex items-center justify-center hover:bg-red-600">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                  </div>
                )}
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                <button type="button" onClick={() => fileInputRef.current?.click()} disabled={imageUploading}
                  className="w-full border-2 border-dashed border-[#2B59FF]/20 bg-[#F5F8FF] rounded-xl py-3 text-sm text-[#747A88] hover:border-[#2B59FF]/50 hover:text-[#2B59FF] transition-all disabled:opacity-50 font-medium">
                  {imageUploading ? 'Yukleniyor...' : '+ Gorsel Yukle'}
                </button>
                <input type="url" value={form.image_url} onChange={(e) => setForm((p) => ({ ...p, image_url: e.target.value }))}
                  placeholder="veya URL girin" className="mt-2 w-full border border-gray-100 bg-[#F5F8FF] rounded-xl px-4 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#2B59FF]/30 transition-all" />
              </div>

              {/* ── Haber Arama Dropdown ────────────────────────────── */}
              <div ref={newsBoxRef}>
                <label className="block text-xs font-bold text-[#2B2C35] mb-1.5 uppercase tracking-wide">
                  Haber Linki
                </label>

                {/* Seçili haber chip'i */}
                {form.link && (
                  <div className="flex items-center gap-2 mb-2 px-3 py-2 bg-[#EEF2FF] rounded-xl border border-[#2B59FF]/20">
                    <svg className="w-3.5 h-3.5 text-[#2B59FF] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 015.656 0l4-4a4 4 0 01-5.656-5.656l-1.1 1.1" />
                    </svg>
                    <span className="text-xs font-semibold text-[#2B59FF] flex-1 truncate">{form.link}</span>
                    <button type="button" onClick={clearNewsSelection}
                      className="w-5 h-5 rounded-md bg-red-100 text-red-500 hover:bg-red-500 hover:text-white flex items-center justify-center transition-colors shrink-0">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                  </div>
                )}

                {/* Arama kutusu */}
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#747A88]">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35m0 0A7 7 0 1016.65 16.65z" />
                    </svg>
                  </span>
                  <input
                    type="text"
                    value={newsSearch}
                    onChange={e => setNewsSearch(e.target.value)}
                    onFocus={() => { if (newsResults.length) setNewsOpen(true) }}
                    className="w-full border border-gray-100 bg-[#F5F8FF] rounded-xl pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2B59FF]/30 focus:border-[#2B59FF] transition-all"
                    placeholder="Haber adı yazarak ara..."
                  />
                </div>

                {/* Sonuç listesi */}
                {newsOpen && newsResults.length > 0 && (
                  <div className="mt-1 border border-gray-100 bg-white rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.10)] overflow-hidden z-20 relative">
                    {newsResults.map(n => (
                      <button
                        key={n.id}
                        type="button"
                        onClick={() => selectNews(n)}
                        className="w-full text-left flex items-start gap-3 px-4 py-2.5 hover:bg-[#EEF2FF] transition-colors border-b border-gray-50 last:border-0 group">
                        <div className="min-w-0 flex-1">
                          {n.category && (
                            <span className="text-[9px] font-extrabold uppercase tracking-wider text-[#2B59FF] block mb-0.5">{n.category.name}</span>
                          )}
                          <span className="text-[12px] font-semibold text-[#2B2C35] leading-snug line-clamp-2 group-hover:text-[#2B59FF] transition-colors">
                            {n.title}
                          </span>
                          <span className="text-[10px] text-[#747A88] mt-0.5 block">/haber/{n.slug}</span>
                        </div>
                        <svg className="w-3.5 h-3.5 text-[#747A88] group-hover:text-[#2B59FF] shrink-0 mt-1 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    ))}
                  </div>
                )}

                {newsOpen && newsSearch.trim() && newsResults.length === 0 && (
                  <div className="mt-1 border border-gray-100 bg-white rounded-xl px-4 py-3 text-xs text-[#747A88]">
                    Haber bulunamadı. Manuel giriş yapabilirsiniz.
                  </div>
                )}

                {/* Manuel link girişi (fallback) */}
                <input
                  type="text"
                  value={form.link}
                  onChange={e => setForm(p => ({ ...p, link: e.target.value }))}
                  placeholder="veya /haber/slug manuel girin"
                  className="mt-2 w-full border border-gray-100 bg-[#F5F8FF] rounded-xl px-4 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#2B59FF]/30 transition-all text-[#747A88]"
                />
              </div>
              {/* ──────────────────────────────────────────────────── */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#2B2C35] mb-1.5 uppercase tracking-wide">Sira</label>
                  <input type="number" value={form.order_index} min={0} onChange={(e) => setForm((p) => ({ ...p, order_index: parseInt(e.target.value) || 0 }))}
                    className="w-full border border-gray-100 bg-[#F5F8FF] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2B59FF]/30 transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#2B2C35] mb-1.5 uppercase tracking-wide">Durum</label>
                  <select value={form.is_active ? 'true' : 'false'} onChange={(e) => setForm((p) => ({ ...p, is_active: e.target.value === 'true' }))}
                    className="w-full border border-gray-100 bg-[#F5F8FF] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2B59FF]/30 transition-all">
                    <option value="true">Aktif</option>
                    <option value="false">Pasif</option>
                  </select>
                <div>
                  <label className="block text-xs font-bold text-[#2B2C35] mb-1.5 uppercase tracking-wide">Tur</label>
                  <select value={form.type} onChange={(e) => setForm((p) => ({ ...p, type: e.target.value }))}
                    className="w-full border border-gray-100 bg-[#F5F8FF] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2B59FF]/30 transition-all">
                    <option value="main">Ana Slider</option>
                    <option value="secondary">Ikincil Slider</option>
                  </select>
                </div>
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowForm(false)} className="flex-1 border border-gray-100 text-[#747A88] font-bold py-2.5 rounded-xl text-sm hover:bg-gray-50">Iptal</button>
              <button onClick={handleSave} disabled={saving} className="flex-1 text-white font-bold py-2.5 rounded-xl text-sm disabled:opacity-50 hover:shadow-[0_8px_24px_rgba(43,89,255,0.35)] transition-all"
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
      ) : sliders.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {sliders.map((slider) => (
            <div key={slider.id} className="bg-white rounded-2xl overflow-hidden border border-gray-50 hover:shadow-[0_8px_30px_rgba(43,89,255,0.1)] transition-all duration-200 group">
              <div className="relative h-44">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={slider.image_url} alt={slider.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  {slider.subtitle && <span className="text-[10px] font-bold bg-[#2B59FF] px-2 py-0.5 rounded-lg mb-1 inline-block">{slider.subtitle}</span>}
                  <p className="font-bold text-sm line-clamp-1">{slider.title}</p>
                </div>
                <div className="absolute top-2 right-2">
                  <span className={`text-[10px] font-bold px-2 py-1 rounded-lg ${slider.is_active ? 'bg-emerald-500 text-white' : 'bg-gray-400 text-white'}`}>
                    {slider.is_active ? 'Aktif' : 'Pasif'}
                  </span>
                </div>
              </div>
              <div className="px-4 py-3 flex items-center justify-between">
                <span className="text-xs text-[#747A88] font-medium">Sira: {slider.order_index} · <span className="font-bold text-[#2B59FF]">{slider.type === "secondary" ? "Ikincil" : "Ana"}</span></span>
                <div className="flex gap-1.5">
                  <button onClick={() => toggleActive(slider)}
                    className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg transition-colors ${slider.is_active ? 'bg-gray-50 text-[#747A88] hover:bg-gray-100' : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'}`}>
                    {slider.is_active ? 'Devre Disi' : 'Aktif Et'}
                  </button>
                  <button onClick={() => openEdit(slider)} className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-[#EEF2FF] text-[#2B59FF] hover:bg-[#2B59FF] hover:text-white transition-colors">Duzenle</button>
                  <button onClick={() => handleDelete(slider.id)} className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-colors">Sil</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-50 text-center py-20">
          <div className="w-16 h-16 bg-[#EEF2FF] rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-[#2B59FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
          </div>
          <p className="text-sm font-semibold text-[#2B2C35] mb-1">Henuz slider eklenmemis</p>
          <p className="text-xs text-[#747A88] mb-4">Anasayfada gosterilecek slider ekleyin</p>
          <button onClick={openCreate} className="text-sm font-bold text-[#2B59FF] hover:underline">Ilk slideri ekle</button>
        </div>
      )}
    </div>
  )
}