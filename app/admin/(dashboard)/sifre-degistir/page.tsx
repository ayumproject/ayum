'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function SifreDegistirPage() {
  const [form, setForm] = useState({ newPassword: '', confirmPassword: '' })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [isErr, setIsErr] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (form.newPassword.length < 6) { setIsErr(true); setMessage('Sifre en az 6 karakter olmalidir.'); return }
    if (form.newPassword !== form.confirmPassword) { setIsErr(true); setMessage('Sifreler eslesmiyor.'); return }
    setLoading(true); setMessage(''); setIsErr(false)
    const { error } = await createClient().auth.updateUser({ password: form.newPassword })
    if (error) { setIsErr(true); setMessage('Hata: ' + error.message) }
    else { setMessage('Sifreniz basariyla guncellendi!'); setForm({ newPassword: '', confirmPassword: '' }) }
    setLoading(false)
    setTimeout(() => setMessage(''), 5000)
  }

  return (
    <div className="max-w-md">
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-[#2B2C35]" style={{ letterSpacing: '-0.03em' }}>Sifre Degistir</h1>
        <p className="text-sm text-[#747A88] mt-0.5">Hesabinizin sifresini guncelleyin</p>
      </div>
      <div className="bg-white rounded-2xl border border-gray-50 p-6">
        {message && <div className={`mb-5 px-4 py-3 rounded-xl text-sm font-semibold ${isErr ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-emerald-50 text-emerald-600 border border-emerald-100'}`}>{message}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#747A88] uppercase tracking-wider mb-1.5">Yeni Sifre</label>
            <input type="password" value={form.newPassword}
              onChange={(e) => setForm(p => ({ ...p, newPassword: e.target.value }))}
              placeholder="En az 6 karakter"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#2B59FF]/30 focus:border-[#2B59FF] bg-[#F5F8FF]" />
          </div>
          <div>
            <label className="block text-xs font-bold text-[#747A88] uppercase tracking-wider mb-1.5">Sifre Tekrar</label>
            <input type="password" value={form.confirmPassword}
              onChange={(e) => setForm(p => ({ ...p, confirmPassword: e.target.value }))}
              placeholder="Sifrenizi tekrar girin"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#2B59FF]/30 focus:border-[#2B59FF] bg-[#F5F8FF]" />
          </div>
          <button type="submit" disabled={loading}
            className="w-full bg-[#2B59FF] hover:bg-[#1e46e8] disabled:bg-gray-300 text-white font-bold py-3 rounded-xl transition-colors shadow-[0_4px_20px_rgba(43,89,255,0.3)]">
            {loading ? 'Kaydediliyor...' : 'Sifremi Guncelle'}
          </button>
        </form>
      </div>
    </div>
  )
}
