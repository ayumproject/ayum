'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const categories = [
  { name: 'Gündem', slug: 'gundem' },
  { name: 'Siyaset', slug: 'siyaset' },
  { name: 'Ekonomi', slug: 'ekonomi' },
  { name: 'Spor', slug: 'spor' },
  { name: 'Dünya', slug: 'dunya' },
  { name: 'Teknoloji', slug: 'teknoloji' },
  { name: 'Kültür', slug: 'kultur-sanat' },
  { name: 'Yerel', slug: 'yerel' },
]

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      {/* ── TOP HEADER ── */}
      <header
        className={`bg-white sticky top-0 z-50 transition-shadow duration-200 ${scrolled ? 'shadow-md' : 'border-b border-gray-200'}`}
      >
        {/* Logo row */}
        <div className="max-w-screen-xl mx-auto px-4 h-16 flex items-center justify-between">

          {/* Logo — ankarayaziyor style */}
          <Link href="/" className="flex items-center gap-3 shrink-0">
            {/* Circular badge */}
            <div className="w-12 h-12 rounded-full bg-[#C0282D] flex items-center justify-center shrink-0 shadow-sm">
              <span className="text-white font-black text-xl leading-none">U</span>
            </div>
            {/* Text */}
            <div className="leading-tight">
              <div className="text-[22px] font-black tracking-tight leading-none" style={{ fontFamily: 'Noto Sans, sans-serif' }}>
                <span className="text-gray-900">ULUSE</span>
                <span className="text-[#C0282D]">YDAN</span>
                <span className="text-gray-900">I</span>
              </div>
              <div className="text-[11px] text-gray-400 italic font-normal leading-tight mt-0.5">
                Doğru haber, dürüst yayıncılık
              </div>
            </div>
          </Link>

          {/* Right: search + menu */}
          <div className="flex items-center gap-2">
            <button
              className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:border-gray-300 hover:bg-gray-50 transition-all"
              aria-label="Ara"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="w-10 h-10 rounded-full bg-[#C0282D] flex items-center justify-center text-white hover:bg-[#9b1f23] transition-all"
              aria-label="Menü"
            >
              {menuOpen ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <rect y="4" width="24" height="2.5" rx="1.25" />
                  <rect y="11" width="24" height="2.5" rx="1.25" />
                  <rect y="18" width="24" height="2.5" rx="1.25" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* ── Category nav bar (always visible, horizontal scroll on mobile) ── */}
        <div className="border-t border-gray-100 bg-white">
          <div className="max-w-screen-xl mx-auto px-4">
            <div className="flex items-center overflow-x-auto scrollbar-none gap-0 -mx-1">
              <Link
                href="/"
                className={`shrink-0 px-3 py-3 text-[13px] font-semibold border-b-2 transition-colors whitespace-nowrap ${
                  pathname === '/'
                    ? 'border-[#C0282D] text-[#C0282D]'
                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                }`}
              >
                Ana Sayfa
              </Link>
              {categories.map((cat) => {
                const active = pathname === `/kategori/${cat.slug}`
                return (
                  <Link
                    key={cat.slug}
                    href={`/kategori/${cat.slug}`}
                    className={`shrink-0 px-3 py-3 text-[13px] font-semibold border-b-2 transition-colors whitespace-nowrap ${
                      active
                        ? 'border-[#C0282D] text-[#C0282D]'
                        : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                    }`}
                  >
                    {cat.name}
                  </Link>
                )
              })}
              <Link
                href="/admin/giris"
                className="shrink-0 ml-auto px-3 py-3 text-[13px] font-semibold border-b-2 border-transparent text-gray-400 hover:text-gray-600 whitespace-nowrap transition-colors"
              >
                Admin
              </Link>
            </div>
          </div>
        </div>

        {/* ── Mobile full menu ── */}
        {menuOpen && (
          <div className="border-t border-gray-100 bg-white">
            <div className="max-w-screen-xl mx-auto px-4 py-4 grid grid-cols-3 gap-1">
              {[{ name: 'Ana Sayfa', slug: '' }, ...categories].map((cat) => {
                const href = cat.slug ? `/kategori/${cat.slug}` : '/'
                const active = pathname === href
                return (
                  <Link
                    key={cat.slug || 'home'}
                    href={href}
                    onClick={() => setMenuOpen(false)}
                    className={`px-3 py-2.5 rounded-lg text-sm font-semibold text-center transition-all ${
                      active
                        ? 'bg-[#C0282D] text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {cat.name}
                  </Link>
                )
              })}
              <Link
                href="/admin/giris"
                onClick={() => setMenuOpen(false)}
                className="px-3 py-2.5 rounded-lg text-sm font-semibold text-center bg-gray-900 text-white hover:bg-gray-800 transition-all"
              >
                Admin Girişi
              </Link>
            </div>
          </div>
        )}
      </header>
    </>
  )
}