'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function AdminLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError('E-posta veya şifre hatalı.')
      setLoading(false)
    } else {
      router.push('/admin')
      router.refresh()
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ background: 'linear-gradient(135deg, #F5F8FF 0%, #eef2ff 50%, #F5F8FF 100%)' }}
    >
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(43,89,255,0.08) 0%, transparent 70%)' }} />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(247,151,97,0.06) 0%, transparent 70%)' }} />
      </div>

      <div className="relative w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3 group">
            <div className="w-14 h-14 rounded-full bg-[#2B59FF] flex items-center justify-center shadow-[0_8px_24px_rgba(43,89,255,0.35)] group-hover:shadow-[0_12px_32px_rgba(43,89,255,0.45)] transition-shadow">
              <span className="text-white font-extrabold text-2xl leading-none">U</span>
            </div>
            <div className="text-left">
              <div className="text-[22px] font-extrabold tracking-tight leading-none text-[#2B2C35]">
                Uluse<span className="text-[#2B59FF]">ydan</span>ı
              </div>
              <div className="text-[11px] text-[#747A88] italic font-medium leading-tight mt-0.5">
                Yönetim Paneli
              </div>
            </div>
          </Link>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-[0_8px_40px_rgba(43,89,255,0.1)] p-8 border border-[#2B59FF]/5">
          <h1 className="text-xl font-extrabold text-[#2B2C35] mb-1 text-center"
            style={{ letterSpacing: '-0.02em' }}>
            Giriş Yap
          </h1>
          <p className="text-center text-[#747A88] text-sm mb-7 font-medium">
            Admin paneline erişmek için giriş yapın
          </p>

          {error && (
            <div className="bg-red-50 border border-red-100 text-red-600 text-sm px-4 py-3 rounded-2xl mb-5 flex items-center gap-2 font-medium">
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-[#2B2C35] mb-1.5">
                E-posta
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="admin@ulusmeydan.com"
                className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm bg-[#F5F8FF] focus:outline-none focus:ring-2 focus:ring-[#2B59FF]/30 focus:border-[#2B59FF] transition-all placeholder:text-[#747A88]"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-[#2B2C35] mb-1.5">
                Şifre
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm bg-[#F5F8FF] focus:outline-none focus:ring-2 focus:ring-[#2B59FF]/30 focus:border-[#2B59FF] transition-all placeholder:text-[#747A88]"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#2B59FF] hover:bg-[#1e46e8] disabled:bg-[#747A88] text-white font-bold py-3.5 rounded-full transition-all text-sm shadow-[0_4px_20px_rgba(43,89,255,0.35)] hover:shadow-[0_6px_28px_rgba(43,89,255,0.45)] disabled:shadow-none flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Giriş yapılıyor...
                </>
              ) : (
                <>
                  Giriş Yap
                  <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                  </svg>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Back to site */}
        <div className="text-center mt-5">
          <Link href="/"
            className="text-[#747A88] hover:text-[#2B59FF] text-sm font-medium transition-colors flex items-center justify-center gap-1.5">
            <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Siteye geri dön
          </Link>
        </div>
      </div>
    </div>
  )
}