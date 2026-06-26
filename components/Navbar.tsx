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
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className="sticky top-0 z-50">
      {/* Main bar */}
      <div
        className={`bg-[#2B2C35] transition-shadow duration-300 ${
          scrolled ? 'shadow-xl shadow-black/20' : ''
        }`}
      >
        <div className="max-w-[1440px] mx-auto sm:px-16 px-6 py-4 flex items-center justify-between gap-4">

          {/* Logo - car site style */}
          <Link href="/" className="flex items-center gap-3 group shrink-0">
            <div className="w-9 h-9 rounded-2xl bg-[#2B59FF] flex items-center justify-center shadow-lg shadow-blue-900/30 group-hover:shadow-blue-900/50 transition-shadow">
              <span className="text-white font-extrabold text-lg leading-none">U</span>
            </div>
            <div>
              <span className="text-white font-extrabold text-xl tracking-tight leading-none">Ulusmeydanı</span>
              <div className="text-[9px] text-white/30 tracking-[0.2em] uppercase mt-0.5">Haber & Gazete</div>
            </div>
          </Link>

          {/* Desktop nav pills - like car site's clean navigation */}
          <nav className="hidden lg:flex items-center gap-1 flex-1 justify-center">
            <Link
              href="/"
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
                pathname === '/'
                  ? 'bg-[#2B59FF] text-white'
                  : 'text-white/50 hover:text-white hover:bg-white/8'
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
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
                    active
                      ? 'bg-[#2B59FF] text-white'
                      : 'text-white/50 hover:text-white hover:bg-white/8'
                  }`}
                >
                  {cat.name}
                </Link>
              )
            })}
          </nav>

          {/* Right - car site style pill button */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="hidden md:block text-white/30 text-[11px]">{dateStr}</span>
            <Link
              href="/admin/giris"
              className="custom-btn text-[#2B59FF] rounded-full bg-white text-xs px-4 py-2"
            >
              Admin
            </Link>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="lg:hidden w-8 h-8 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/15 transition-all"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {menuOpen
                  ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="lg:hidden border-t border-white/5 bg-[#2B2C35]">
            <div className="max-w-[1440px] mx-auto sm:px-16 px-6 py-4 grid grid-cols-3 gap-2">
              <Link
                href="/"
                onClick={() => setMenuOpen(false)}
                className={`px-3 py-2 rounded-full text-xs font-semibold text-center transition-all ${
                  pathname === '/' ? 'bg-[#2B59FF] text-white' : 'text-white/60 bg-white/5 hover:text-white hover:bg-white/10'
                }`}
              >
                Ana Sayfa
              </Link>
              {categories.map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/kategori/${cat.slug}`}
                  onClick={() => setMenuOpen(false)}
                  className={`px-3 py-2 rounded-full text-xs font-semibold text-center transition-all ${
                    pathname === `/kategori/${cat.slug}`
                      ? 'bg-[#2B59FF] text-white'
                      : 'text-white/60 bg-white/5 hover:text-white hover:bg-white/10'
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