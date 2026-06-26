'use client'

import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Slider } from '@/lib/types'

export default function AdminSliderPage() {
  const [sliders, setSliders] = useState<Slider[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editItem, setEditItem] = useState<Slider | null>(null)
  const [imageUploading, setImageUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [form, setForm] = useState({
    title: '',
    subtitle: '',
    image_url: '',
    link: '',
    order_index: 0,
    is_active: true,
  })

  async function loadSliders() {
    setLoading(true)
    const sb = createClient()
    const { data } = await sb
      .from('sliders')
      .select('*')
      .order('order_index', { ascending: true })
    setSliders(data || [])
    setLoading(false)
  }

  useEffect(() => { loadSliders() }, [])

  function openCreate() {
    setEditItem(null)
    setForm({ title: '', subtitle: '', image_url: '', link: '', order_index: sliders.length, is_active: true })
    setShowForm(true)
  }

  function openEdit(slider: Slider) {
    setEditItem(slider)
    setForm({
      title: slider.title,
      subtitle: slider.subtitle || '',
      image_url: slider.image_url,
      link: slider.link || '',
      order_index: slider.order_index,
      is_active: slider.is_active,
    })
    setShowForm(true)
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setImageUploading(true)
    const sb = createClient()
    const fileName = `slider-${Date.now()}-${file.name.replace(/\s/g, '-')}`
    const { data, error } = await sb.storage.from('news-images').upload(fileName, file, { cacheControl: '3600' })

    if (error) { setMessage('Resim yüklenemedi: ' + error.message); setImageUploading(false); return }

    const { data: urlData } = sb.storage.from('news-images').getPublicUrl(data.path)
    setForm((p) => ({ ...p, image_url: urlData.publicUrl }))
    setImageUploading(false)
  }

  async function handleSave() {
    if (!form.title.trim() || !form.image_url.trim()) {
      setMessage('Başlık ve görsel zorunludur.')
      return
    }

    setSaving(true)
    const sb = createClient()
    const payload = { ...form, subtitle: form.subtitle || null, link: form.link || null }

    let error
    if (editItem) {
      const result = await sb.from('sliders').update(payload).eq('id', editItem.id)
      error = result.error
    } else {
      const result = await sb.from('sliders').insert(payload)
      error = result.error
    }

    if (error) {
      setMessage('Hata: ' + error.message)
    } else {
      setMessage(editItem ? 'Slider güncellendi!' : 'Slider eklendi!')
      setShowForm(false)
      loadSliders()
    }
    setSaving(false)
    setTimeout(() => setMessage(''), 3000)
  }

  async function handleDelete(id: string) {
    if (!confirm('Bu slider\'ı silmek istediğinize emin misiniz?')) return
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
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Slider Yönetimi</h1>
          <p className="text-sm text-gray-500 mt-1">Anasayfa slider görsellerini yönetin</p>
        </div>
        <button
          onClick={openCreate}
          className="bg-[#c0392b] hover:bg-[#922b21] text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Yeni Slider
        </button>
      </div>

      {message && (
        <div className={`mb-4 px-4 py-3 rounded-lg text-sm font-medium ${
          message.startsWith('Hata') ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'
        }`}>
          {message}
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-black text-lg">{editItem ? 'Slider Düzenle' : 'Yeni Slider'}</h2>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Başlık *</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#c0392b]"
                  placeholder="Slider başlığı"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Alt Başlık</label>
                <input
                  type="text"
                  value={form.subtitle}
                  onChange={(e) => setForm((p) => ({ ...p, subtitle: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#c0392b]"
                  placeholder="Opsiyonel alt başlık (kategori gibi)"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Görsel *</label>
                {form.image_url && (
                  <div className="relative mb-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={form.image_url} alt="Slider" className="w-full h-32 object-cover rounded-lg" />
                  </div>
                )}
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={imageUploading}
                  className="w-full border-2 border-dashed border-gray-300 rounded-lg py-2.5 text-sm text-gray-500 hover:border-[#c0392b] hover:text-[#c0392b] transition-colors disabled:opacity-50 mb-2"
                >
                  {imageUploading ? 'Yükleniyor...' : '+ Görsel Yükle'}
                </button>
                <input
                  type="url"
                  value={form.image_url}
                  onChange={(e) => setForm((p) => ({ ...p, image_url: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#c0392b]"
                  placeholder="veya görsel URL'si"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Link</label>
                <input
                  type="text"
                  value={form.link}
                  onChange={(e) => setForm((p) => ({ ...p, link: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#c0392b]"
                  placeholder="/haber/slug-adresi"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Sıra</label>
                  <input
                    type="number"
                    value={form.order_index}
                    onChange={(e) => setForm((p) => ({ ...p, order_index: parseInt(e.target.value) }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#c0392b]"
                    min={0}
                  />
                </div>
                <div className="flex items-end">
                  <label className="flex items-center gap-2 cursor-pointer pb-2.5">
                    <input
                      type="checkbox"
                      checked={form.is_active}
                      onChange={(e) => setForm((p) => ({ ...p, is_active: e.target.checked }))}
                      className="w-4 h-4 accent-[#c0392b]"
                    />
                    <span className="text-sm font-medium text-gray-700">Aktif</span>
                  </label>
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

      {/* Slider listesi */}
      {loading ? (
        <div className="text-center py-12 text-gray-400">Yükleniyor...</div>
      ) : sliders.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sliders.map((slider) => (
            <div key={slider.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="relative h-40">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={slider.image_url} alt={slider.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-3 left-3 text-white">
                  {slider.subtitle && (
                    <span className="text-xs bg-[#c0392b] px-1.5 py-0.5 rounded mb-1 inline-block">{slider.subtitle}</span>
                  )}
                  <p className="font-bold text-sm line-clamp-1">{slider.title}</p>
                </div>
                <div className="absolute top-2 right-2 flex gap-1">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    slider.is_active ? 'bg-green-500 text-white' : 'bg-gray-400 text-white'
                  }`}>
                    {slider.is_active ? 'Aktif' : 'Pasif'}
                  </span>
                </div>
              </div>
              <div className="p-3 flex items-center justify-between">
                <span className="text-xs text-gray-400">Sıra: {slider.order_index}</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => toggleActive(slider)}
                    className="text-xs text-gray-500 hover:text-gray-700 px-2 py-1 border rounded"
                  >
                    {slider.is_active ? 'Devre Dışı' : 'Aktif Et'}
                  </button>
                  <button
                    onClick={() => openEdit(slider)}
                    className="text-xs text-blue-500 hover:text-blue-700 px-2 py-1 border border-blue-200 rounded"
                  >
                    Düzenle
                  </button>
                  <button
                    onClick={() => handleDelete(slider.id)}
                    className="text-xs text-red-500 hover:text-red-700 px-2 py-1 border border-red-200 rounded"
                  >
                    Sil
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm text-center py-16 text-gray-400">
          <p className="text-sm">Henüz slider eklenmemiş</p>
          <button onClick={openCreate} className="text-[#c0392b] text-sm font-medium mt-2 hover:underline">
            İlk slider'ı ekle →
          </button>
        </div>
      )}
    </div>
  )
}