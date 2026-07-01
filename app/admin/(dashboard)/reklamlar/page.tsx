'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

type AdPosition = 'sidebar' | 'between-news' | 'footer' | 'header-bottom'

interface Ad {
  id: string
  title: string
  image_url: string | null
  link_url: string | null
  position: AdPosition
  is_active: boolean
  order_index: number
  created_at: string
}

const positionLabels: Record<AdPosition, string> = {
  'sidebar': 'Yan Sutun',
  'between-news': 'Haberler Arasi',
  'footer': 'Alt Bolge',
  'header-bottom': 'Ust Bolge',
}

const SQL_CREATE = `CREATE TABLE public.ads (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  title character varying NOT NULL,
  image_url text,
  link_url text,
  position character varying NOT NULL DEFAULT 'sidebar',
  is_active boolean NOT NULL DEFAULT true,
  order_index integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT ads_pkey PRIMARY KEY (id)
);

ALTER TABLE public.ads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Herkes okuyabilir" ON public.ads FOR SELECT USING (true);
CREATE POLICY "Adminler yonetebilir" ON public.ads USING (true) WITH CHECK (true);`

export default function ReklamlarPage() {
  const [ads, setAds] = useState<Ad[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [editAd, setEditAd] = useState<Ad | null>(null)
  const [message, setMessage] = useState('')
  const [isErr, setIsErr] = useState(false)
  const [noTable, setNoTable] = useState(false)
  const [form, setForm] = useState({
    title: '', image_url: '', link_url: '',
    position: 'sidebar' as AdPosition, is_active: true, order_index: 0,
  })

  const sb = createClient()

  async function loadAds() {
    setLoading(true)
    const { data, error } = await sb.from('ads').select('*').order('order_index')
    if (error) {
      if (error.code === '42P01') setNoTable(true)
      setLoading(false); return
    }
    setAds(data || [])
    setLoading(false)
  }

  useEffect(() => { loadAds() }, [])

  function msg(text: string, err = false) { setMessage(text); setIsErr(err); setTimeout(() => setMessage(''), 4000) }

  function openCreate() {
    setEditAd(null)
    setForm({ title: '', image_url: '', link_url: '', position: 'sidebar', is_active: true, order_index: ads.length })
    setShowForm(true)
  }

  function openEdit(ad: Ad) {
    setEditAd(ad)
    setForm({ title: ad.title, image_url: ad.image_url || '', link_url: ad.link_url || '', position: ad.position, is_active: ad.is_active, order_index: ad.order_index })
    setShowForm(true)
  }

  async function handleSave() {
    if (!form.title.trim()) { msg('Baslik zorunludur.', true); return }
    setSaving(true)
    const payload = { title: form.title, image_url: form.image_url || null, link_url: form.link_url || null, position: form.position, is_active: form.is_active, order_index: form.order_index }
    if (editAd) {
      const { error } = await sb.from('ads').update(payload).eq('id', editAd.id)
      error ? msg('Hata: ' + error.message, true) : (msg('Guncellendi!'), setShowForm(false), loadAds())
    } else {
      const { error } = await sb.from('ads').insert(payload)
      error ? msg('Hata: ' + error.message, true) : (msg('Reklam eklendi!'), setShowForm(false), loadAds())
    }
    setSaving(false)
  }

  async function toggleActive(ad: Ad) {
    await sb.from('ads').update({ is_active: !ad.is_active }).eq('id', ad.id)
    loadAds()
  }

  async function deleteAd(id: string) {
    if (!confirm('Bu reklami silmek istediginize emin misiniz?')) return
    await sb.from('ads').delete().eq('id', id)
    loadAds()
  }

  if (noTable) return (
    <div>
      <h1 className="text-2xl font-extrabold text-[#2B2C35] mb-6" style={{ letterSpacing: '-0.03em' }}>Reklamlar</h1>
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
        <p className="font-bold text-amber-800 mb-3">Veritabani tablosu bulunamadi</p>
        <p className="text-sm text-amber-700 mb-4">Reklam yonetimini kullanmak icin Supabase SQL Editor&apos;de su komutu calistirin:</p>
        <pre className="bg-white border border-amber-200 rounded-xl p-4 text-xs overflow-x-auto text-gray-800 font-mono leading-relaxed">{SQL_CREATE}</pre>
        <button onClick={() => { setNoTable(false); loadAds() }}
          className="mt-4 bg-amber-600 text-white font-bold text-sm px-4 py-2 rounded-xl hover:bg-amber-700">
          Tabloyu tekrar kontrol et
        </button>
      </div>
    </div>
  )

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-extrabold text-[#2B2C35]" style={{ letterSpacing: '-0.03em' }}>Reklamlar</h1>
          <p className="text-sm text-[#747A88] mt-0.5">{ads.length} reklam</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 text-sm font-bold text-white px-4 py-2.5 rounded-xl"
          style={{ background: 'linear-gradient(135deg,#2B59FF 0%,#1a3fd4 100%)' }}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          Yeni Reklam
        </button>
      </div>

      {message && <div className={`mb-4 px-4 py-3 rounded-xl text-sm font-semibold ${isErr ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-emerald-50 text-emerald-600 border border-emerald-100'}`}>{message}</div>}

      {showForm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-extrabold text-[#2B2C35] text-lg">{editAd ? 'Reklam Duzenle' : 'Yeni Reklam'}</h2>
              <button onClick={() => setShowForm(false)} className="w-8 h-8 rounded-xl bg-gray-50 flex items-center justify-center">
                <svg className="w-4 h-4 text-[#747A88]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-[#747A88] uppercase tracking-wider mb-1.5 block">Baslik *</label>
                <input value={form.title} onChange={(e) => setForm(p => ({ ...p, title: e.target.value }))}
                  placeholder="Reklam basligi"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2B59FF]/30 focus:border-[#2B59FF] bg-[#F5F8FF]" />
              </div>
              <div>
                <label className="text-xs font-bold text-[#747A88] uppercase tracking-wider mb-1.5 block">Gorsel URL</label>
                <input value={form.image_url} onChange={(e) => setForm(p => ({ ...p, image_url: e.target.value }))}
                  placeholder="https://..."
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2B59FF]/30 focus:border-[#2B59FF] bg-[#F5F8FF]" />
                {form.image_url && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={form.image_url} alt="Onizleme" className="mt-2 w-full h-24 object-cover rounded-lg" />
                )}
              </div>
              <div>
                <label className="text-xs font-bold text-[#747A88] uppercase tracking-wider mb-1.5 block">Link URL</label>
                <input value={form.link_url} onChange={(e) => setForm(p => ({ ...p, link_url: e.target.value }))}
                  placeholder="https://..."
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2B59FF]/30 focus:border-[#2B59FF] bg-[#F5F8FF]" />
              </div>
              <div>
                <label className="text-xs font-bold text-[#747A88] uppercase tracking-wider mb-1.5 block">Konum</label>
                <select value={form.position} onChange={(e) => setForm(p => ({ ...p, position: e.target.value as AdPosition }))}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2B59FF]/30 focus:border-[#2B59FF] bg-[#F5F8FF]">
                  {(Object.keys(positionLabels) as AdPosition[]).map((k) => (
                    <option key={k} value={k}>{positionLabels[k]}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-[#747A88] uppercase tracking-wider mb-1.5 block">Sira</label>
                <input type="number" value={form.order_index} onChange={(e) => setForm(p => ({ ...p, order_index: Number(e.target.value) }))}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2B59FF]/30 focus:border-[#2B59FF] bg-[#F5F8FF]" />
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.is_active} onChange={(e) => setForm(p => ({ ...p, is_active: e.target.checked }))} className="w-4 h-4 accent-[#2B59FF]" />
                <span className="text-sm font-semibold text-[#2B2C35]">Aktif</span>
              </label>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowForm(false)} className="flex-1 border border-gray-200 text-[#747A88] font-bold py-2.5 rounded-xl text-sm hover:bg-gray-50">Iptal</button>
              <button onClick={handleSave} disabled={saving} className="flex-1 text-white font-bold py-2.5 rounded-xl text-sm disabled:opacity-50"
                style={{ background: 'linear-gradient(135deg,#2B59FF 0%,#1a3fd4 100%)' }}>
                {saving ? 'Kaydediliyor...' : 'Kaydet'}
              </button>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-20"><div className="w-8 h-8 border-2 border-[#2B59FF] border-t-transparent rounded-full animate-spin" /></div>
      ) : ads.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-50 text-center py-20">
          <div className="w-14 h-14 bg-[#EEF2FF] rounded-2xl flex items-center justify-center mx-auto mb-3">
            <svg className="w-7 h-7 text-[#2B59FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
            </svg>
          </div>
          <p className="text-sm font-semibold text-[#2B2C35] mb-2">Henuz reklam eklenmemis</p>
          <button onClick={openCreate} className="text-sm font-bold text-[#2B59FF] hover:underline">Ilk reklami ekle</button>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-50 overflow-hidden">
          <div className="divide-y divide-gray-50">
            {ads.map((ad) => (
              <div key={ad.id} className="flex items-center gap-4 px-5 py-4 hover:bg-[#F5F8FF] transition-colors">
                {ad.image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={ad.image_url} alt={ad.title} className="w-20 h-12 object-cover rounded-lg shrink-0 border border-gray-100" />
                ) : (
                  <div className="w-20 h-12 rounded-lg bg-[#F5F8FF] flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5 text-[#747A88]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[#2B2C35] truncate">{ad.title}</p>
                  <p className="text-[11px] text-[#747A88] font-medium">{positionLabels[ad.position]} · Sira: {ad.order_index}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button onClick={() => toggleActive(ad)}
                    className={`text-[11px] font-bold px-2.5 py-1 rounded-full transition-colors ${ad.is_active ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100' : 'bg-gray-100 text-gray-400 hover:bg-gray-200'}`}>
                    {ad.is_active ? 'Aktif' : 'Pasif'}
                  </button>
                  <button onClick={() => openEdit(ad)} className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-[#EEF2FF] text-[#2B59FF] hover:bg-[#2B59FF] hover:text-white transition-colors">Duzenle</button>
                  <button onClick={() => deleteAd(ad.id)} className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-colors">Sil</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
