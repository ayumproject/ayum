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
  const [dateStr, setDateStr] = useState('')

  useEffect(() => {
    setDateStr(new Date().toLocaleDateString('tr-TR', {
      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
    }))
    const onScroll = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className="sticky top-0 z-50">

      {/* ── Main bar ── */}
      <div
        className="transition-all duration-300"
        style={{
          background: scrolled
            ? 'rgba(43, 44, 53, 0.85)'
            : '#2B2C35',
          backdropFilter: scrolled ? 'blur(24px) saturate(180%)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(24px) saturate(180%)' : 'none',
          boxShadow: scrolled ? '0 8px 32px rgba(0,0,0,0.25)' : 'none',
        }}
      >
        {/* Top micro-bar */}
        <div className="border-b border-white/6 hidden md:block">
          <div className="max-w-[1440px] mx-auto px-6 sm:px-16 flex items-center justify-between h-8">
            <span className="text-white/30 text-[11px] font-medium">{dateStr}</span>
            <Link href="/admin/giris" className="flex items-center gap-1.5 text-white/30 hover:text-white/80 text-[11px] font-medium transition-colors group">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 group-hover:shadow-sm group-hover:shadow-emerald-400/60 transition-shadow" />
              Yönetim Paneli
            </Link>
          </div>
        </div>

        {/* Main logo + actions row */}
        <div className="max-w-[1440px] mx-auto px-6 sm:px-16 flex items-center justify-between gap-6 py-5">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-3.5 group shrink-0">
            <div
              className="w-11 h-11 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-105 shrink-0"
              style={{
                background: 'linear-gradient(135deg, #2B59FF 0%, #4F7BFF 100%)',
                boxShadow: '0 4px 20px rgba(43,89,255,0.4)',
              }}
            >
              <span className="text-white font-extrabold text-xl leading-none">U</span>
            </div>
            <div className="leading-tight">
              <div className="text-white font-extrabold text-2xl tracking-tight" style={{ fontFamily: 'Manrope, sans-serif' }}>
                Ulusmeydanı
              </div>
              <div className="text-white/30 text-[9px] tracking-[0.25em] uppercase font-medium">
                Haber & Gazete
              </div>
            </div>
          </Link>

          {/* Desktop: category pills — centered */}
          <nav className="hidden xl:flex items-center gap-1 flex-1 justify-center">
            <Link
              href="/"
              className={`px-4 py-2 rounded-full text-[13px] font-semibold transition-all duration-200 whitespace-nowrap ${
                pathname === '/'
                  ? 'bg-[#2B59FF] text-white'
                  : 'text-white/50 hover:text-white hover:bg-white/10'
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
                  className={`px-4 py-2 rounded-full text-[13px] font-semibold transition-all duration-200 whitespace-nowrap ${
                    active
                      ? 'bg-[#2B59FF] text-white'
                      : 'text-white/50 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {cat.name}
                </Link>
              )
            })}
          </nav>

          {/* Right: search + admin + hamburger */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Search pill */}
            <button className="hidden md:flex items-center gap-2 bg-white/8 hover:bg-white/14 border border-white/10 text-white/50 hover:text-white/90 rounded-full px-4 py-2 text-[13px] font-medium transition-all">
              <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span className="hidden lg:inline">Haber ara...</span>
            </button>

            {/* Admin pill — car site style white button */}
            <Link
              href="/admin/giris"
              className="hidden sm:flex items-center gap-2 bg-white text-[#2B59FF] hover:bg-[#F5F8FF] rounded-full px-5 py-2.5 text-[13px] font-bold transition-all"
              style={{ boxShadow: '0 2px 12px rgba(43,89,255,0.2)' }}
            >
              Admin
            </Link>

            {/* Hamburger */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="xl:hidden flex flex-col items-center justify-center gap-1.5 w-10 h-10 rounded-full bg-white/8 hover:bg-white/15 transition-all"
              aria-label="Menü"
            >
              <span className={`block h-0.5 bg-white rounded-full transition-all duration-300 ${menuOpen ? 'w-5 rotate-45 translate-y-2' : 'w-5'}`} />
              <span className={`block h-0.5 bg-white rounded-full transition-all duration-300 ${menuOpen ? 'opacity-0 w-0' : 'w-4'}`} />
              <span className={`block h-0.5 bg-white rounded-full transition-all duration-300 ${menuOpen ? 'w-5 -rotate-45 -translate-y-2' : 'w-5'}`} />
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div
            className="xl:hidden border-t border-white/8"
            style={{ background: 'rgba(43,44,53,0.97)', backdropFilter: 'blur(20px)' }}
          >
            <div className="max-w-[1440px] mx-auto px-6 sm:px-16 py-5">
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mb-4">
                <Link
                  href="/"
                  onClick={() => setMenuOpen(false)}
                  className={`px-3 py-3 rounded-2xl text-sm font-semibold text-center transition-all ${
                    pathname === '/' ? 'bg-[#2B59FF] text-white' : 'bg-white/6 text-white/60 hover:bg-white/12 hover:text-white'
                  }`}
                >
                  Ana Sayfa
                </Link>
                {categories.map((cat) => (
                  <Link
                    key={cat.slug}
                    href={`/kategori/${cat.slug}`}
                    onClick={() => setMenuOpen(false)}
                    className={`px-3 py-3 rounded-2xl text-sm font-semibold text-center transition-all ${
                      pathname === `/kategori/${cat.slug}`
                        ? 'bg-[#2B59FF] text-white'
                        : 'bg-white/6 text-white/60 hover:bg-white/12 hover:text-white'
                    }`}
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
              <Link
                href="/admin/giris"
                onClick={() => setMenuOpen(false)}
                className="flex items-center justify-center w-full bg-white text-[#2B59FF] rounded-2xl py-3 text-sm font-bold"
              >
                Yönetim Paneli
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}