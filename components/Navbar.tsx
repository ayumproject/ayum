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
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className="relative z-50">
      {/* Main navbar - glassmorphism */}
      <div
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-black/80 backdrop-blur-2xl border-b border-white/5 shadow-2xl shadow-black/40'
            : 'bg-[#09090b]'
        }`}
      >
        {/* Top strip */}
        <div className="border-b border-white/5">
          <div className="max-w-7xl mx-auto px-4 h-8 flex items-center justify-between">
            <span className="text-zinc-500 text-[11px]">{dateStr}</span>
            <Link
              href="/admin/giris"
              className="text-zinc-500 hover:text-white text-[11px] flex items-center gap-1.5 transition-colors group"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 group-hover:shadow-lg group-hover:shadow-emerald-500/50 transition-shadow" />
              Yönetim Paneli
            </Link>
          </div>
        </div>

        {/* Logo bar */}
        <div className="max-w-7xl mx-auto px-4 py-3.5 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-3 group shrink-0">
            <div className="relative">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center glow-red transition-all duration-300 group-hover:scale-105">
                <span className="text-white font-black text-lg leading-none">U</span>
              </div>
            </div>
            <div>
              <div
                className="font-black text-white text-lg leading-none tracking-tight"
                style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
              >
                Ulusmeydanı
              </div>
              <div className="text-[9px] text-zinc-500 tracking-[0.2em] uppercase mt-0.5">Haber & Gazete</div>
            </div>
          </Link>

          {/* Center nav - desktop */}
          <nav className="hidden lg:flex items-center gap-0.5 flex-1 justify-center">
            {categories.map((cat) => {
              const active = pathname === `/kategori/${cat.slug}`
              return (
                <Link
                  key={cat.slug}
                  href={`/kategori/${cat.slug}`}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
                    active
                      ? 'bg-red-500/15 text-red-400 border border-red-500/20'
                      : 'text-zinc-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {cat.name}
                </Link>
              )
            })}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-2 shrink-0">
            <button className="hidden md:flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/8 text-zinc-400 hover:text-white px-3 py-1.5 rounded-full text-xs transition-all">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Ara
            </button>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="lg:hidden w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-all"
            >
              <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {menuOpen
                  ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="lg:hidden border-t border-white/5 bg-black/60 backdrop-blur-xl">
            <div className="max-w-7xl mx-auto px-4 py-4 grid grid-cols-2 gap-1.5">
              <Link
                href="/"
                onClick={() => setMenuOpen(false)}
                className={`px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  pathname === '/' ? 'bg-red-500/15 text-red-400' : 'text-zinc-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                Ana Sayfa
              </Link>
              {categories.map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/kategori/${cat.slug}`}
                  onClick={() => setMenuOpen(false)}
                  className={`px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    pathname === `/kategori/${cat.slug}`
                      ? 'bg-red-500/15 text-red-400'
                      : 'text-zinc-300 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}