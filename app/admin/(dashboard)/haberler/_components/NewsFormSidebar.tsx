'use client'

import type { Category, Editor } from '@/lib/types'

interface SidebarProps {
  form: {
    is_published: boolean
    is_breaking: boolean
    is_exclusive: boolean
    category_id: string
    editor_id: string
    image_url: string
    author: string
  }
  setForm: (fn: (p: any) => any) => void
  categories: Category[]
  editors: Editor[]
  userRole: 'admin' | 'editor' | 'columnist'
  handleEditorChange: (id: string) => void
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void
  imageUploading: boolean
  loading: boolean
  fileInputRef: React.RefObject<HTMLInputElement>
  mode: 'create' | 'edit'
}

export default function NewsFormSidebar({
  form, setForm, categories, editors, userRole,
  handleEditorChange, handleImageUpload,
  imageUploading, loading, fileInputRef, mode,
}: SidebarProps) {
  return (
    <div className="space-y-5">
      {/* Yayın Ayarları */}
      <div className="bg-white rounded-xl shadow-sm p-5">
        <h3 className="font-bold text-[#2B2C35] mb-4 text-sm">Yayın Ayarları</h3>
        <div className="space-y-3">
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" checked={form.is_published}
              onChange={(e) => setForm((p: any) => ({ ...p, is_published: e.target.checked }))}
              className="w-4 h-4 accent-[#2B59FF]" />
            <div>
              <span className="text-sm font-semibold text-gray-700">Yayınla</span>
              <p className="text-xs text-gray-400">Sitede görünür olacak</p>
            </div>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" checked={form.is_breaking}
              onChange={(e) => setForm((p: any) => ({ ...p, is_breaking: e.target.checked }))}
              className="w-4 h-4 accent-[#f79761]" />
            <div>
              <span className="text-sm font-semibold text-gray-700">Son Dakika</span>
              <p className="text-xs text-gray-400">Kayan yazıda gösterilir</p>
            </div>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" checked={form.is_exclusive}
              onChange={(e) => setForm((p: any) => ({ ...p, is_exclusive: e.target.checked }))}
              className="w-4 h-4 accent-[#f59e0b]" />
            <div>
              <span className="text-sm font-semibold text-gray-700">Özel Haber</span>
              <p className="text-xs text-gray-400">Haber kartında özel rozet gösterilir</p>
            </div>
          </label>
        </div>
      </div>

      {/* Kategori */}
      <div className="bg-white rounded-xl shadow-sm p-5">
        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
          Kategori <span className="text-red-500">*</span>
        </label>
        <select value={form.category_id}
          onChange={(e) => setForm((p: any) => ({ ...p, category_id: e.target.value }))}
          className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2B59FF]/30 focus:border-[#2B59FF] bg-[#F5F8FF]">
          <option value="">Kategori seçin</option>
          {categories.map((cat) => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
        </select>
      </div>

      {/* Editör — sadece admin seçebilir, editor için otomatik atanır */}
      {userRole === 'admin' && editors.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm p-5">
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Editör</label>
          <select value={form.editor_id} onChange={(e) => handleEditorChange(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#2B59FF]/30 focus:border-[#2B59FF] bg-[#F5F8FF]">
            <option value="">Editör seçin</option>
            {editors.map((ed) => <option key={ed.id} value={ed.id}>{ed.name}</option>)}
          </select>
        </div>
      )}

      {/* Editör rol — sadece bilgi göster */}
      {userRole === 'editor' && (
        <div className="bg-white rounded-xl shadow-sm p-5">
          <p className="text-xs font-bold text-[#747A88] uppercase tracking-wider mb-1.5">Editör</p>
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

      {/* Kapak Görseli */}
      <div className="bg-white rounded-xl shadow-sm p-5">
        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Kapak Görseli</label>
        {form.image_url && (
          <div className="relative mb-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={form.image_url} alt="Kapak" className="w-full h-36 object-cover rounded-lg" />
            <button type="button" onClick={() => setForm((p: any) => ({ ...p, image_url: '' }))}
              className="absolute top-2 right-2 bg-red-500 text-white w-6 h-6 rounded-full text-xs flex items-center justify-center hover:bg-red-600">×</button>
          </div>
        )}
        <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
        <button type="button" onClick={() => fileInputRef.current?.click()} disabled={imageUploading}
          className="w-full border-2 border-dashed border-gray-200 rounded-lg py-3 text-sm text-gray-500 hover:border-[#2B59FF] hover:text-[#2B59FF] transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
          {imageUploading ? 'Yükleniyor...' : '+ Görsel Yükle'}
        </button>
        <input type="url" value={form.image_url}
          onChange={(e) => setForm((p: any) => ({ ...p, image_url: e.target.value }))}
          placeholder="veya görsel URL'si girin"
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs mt-3 focus:outline-none focus:ring-2 focus:ring-[#2B59FF]/30 focus:border-[#2B59FF] bg-[#F5F8FF]" />
      </div>

      <button type="submit" disabled={loading || imageUploading}
        className="w-full bg-[#2B59FF] hover:bg-[#1e46e8] disabled:bg-gray-300 text-white font-bold py-3 rounded-xl transition-colors shadow-[0_4px_20px_rgba(43,89,255,0.3)]">
        {loading ? 'Kaydediliyor...' : mode === 'create' ? 'Haberi Kaydet' : 'Değişiklikleri Kaydet'}
      </button>
    </div>
  )
}
