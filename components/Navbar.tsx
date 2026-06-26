'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const categories = [
  { name: 'Gündem', slug: 'gundem', color: '#dc2626' },
  { name: 'Siyaset', slug: 'siyaset', color: '#7c3aed' },
  { name: 'Ekonomi', slug: 'ekonomi', color: '#059669' },
  { name: 'Spor', slug: 'spor', color: '#2563eb' },
  { name: 'Dünya', slug: 'dunya', color: '#0891b2' },
  { name: 'Teknoloji', slug: 'teknoloji', color: '#7c3aed' },
  { name: 'Kültür-Sanat', slug: 'kultur-sanat', color: '#db2777' },
  { name: 'Yerel', slug: 'yerel', color: '#d97706' },
]

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

  const [dateStr, setDateStr] = useState('')

  useEffect(() => {
    setDateStr(new Date().toLocaleDateString('tr-TR', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    }))
    const handleScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      {/* Top utility bar */}
      <div className="bg-[#0f172a] text-slate-400 text-xs">
        <div className="max-w-7xl mx-auto px-4 py-1.5 flex items-center justify-between">
          <span className="hidden sm:block">{dateStr}</span>
          <div className="flex items-center gap-4">
            <Link href="/admin/giris" className="hover:text-white transition-colors flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Admin
            </Link>
          </div>
        </div>
      </div>

      {/* Logo bar */}
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="w-10 h-10 bg-[#dc2626] rounded-lg flex items-center justify-center shadow-lg shadow-red-200 group-hover:shadow-red-300 transition-shadow">
                <span className="text-white font-black text-xl">U</span>
              </div>
            </div>
            <div>
              <div className="text-2xl font-black text-[#0f172a] tracking-tight leading-none">
                Ulusmeydanı
              </div>
              <div className="text-[10px] text-slate-400 tracking-[0.2em] uppercase font-medium mt-0.5">
                Haber & Gazete
              </div>
            </div>
          </Link>

          {/* Search + mobile menu */}
          <div className="flex items-center gap-3">
            <button className="hidden md:flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-700 px-3 py-2 rounded-lg text-sm transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span>Ara...</span>
            </button>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
              aria-label="Menü"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {menuOpen
                  ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Category nav */}
      <nav className={`bg-[#0f172a] sticky top-0 z-50 transition-shadow ${scrolled ? 'shadow-xl shadow-black/20' : ''}`}>
        <div className="max-w-7xl mx-auto px-4">
          {/* Desktop */}
          <div className="hidden md:flex items-center overflow-x-auto scrollbar-none">
            <Link
              href="/"
              className={`shrink-0 px-4 py-3.5 text-xs font-bold uppercase tracking-widest transition-colors border-b-2 ${
                pathname === '/'
                  ? 'text-white border-[#dc2626]'
                  : 'text-slate-400 border-transparent hover:text-white hover:border-slate-500'
              }`}
            >
              Ana Sayfa
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/kategori/${cat.slug}`}
                className={`shrink-0 px-4 py-3.5 text-xs font-bold uppercase tracking-widest transition-colors border-b-2 ${
                  pathname === `/kategori/${cat.slug}`
                    ? 'text-white border-[#dc2626]'
                    : 'text-slate-400 border-transparent hover:text-white hover:border-slate-600'
                }`}
              >
                {cat.name}
              </Link>
            ))}
          </div>

          {/* Mobile */}
          {menuOpen && (
            <div className="md:hidden py-2 border-t border-slate-700">
              <Link
                href="/"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-300 hover:text-white hover:bg-slate-700/50 rounded-lg transition-colors mx-2"
              >
                <svg className="w-4 h-4 text-[#dc2626]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Ana Sayfa
              </Link>
              {categories.map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/kategori/${cat.slug}`}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-300 hover:text-white hover:bg-slate-700/50 rounded-lg transition-colors mx-2"
                >
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: cat.color }} />
                  {cat.name}
                </Link>
              ))}
            </div>
          )}
        </div>
      </nav>
    </>
  )
}