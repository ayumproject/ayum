"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const categories = [
  { name: 'Gündem',    slug: 'gundem' },
  { name: 'Siyaset',   slug: 'siyaset' },
  { name: 'Ekonomi',   slug: 'ekonomi' },
  { name: 'Spor',      slug: 'spor' },
  { name: 'Dünya',     slug: 'dunya' },
  { name: 'Teknoloji', slug: 'teknoloji' },
  { name: 'Kültür',    slug: 'kultur-sanat' },
  { name: 'Yerel',     slug: 'yerel' },
]

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close menu on route change
  useEffect(() => { setMenuOpen(false) }, [pathname])

  return (
    <header
      className={cn(
        'w-full sticky top-0 z-50 bg-white transition-all duration-200',
        scrolled ? 'shadow-[0_2px_20px_rgba(43,89,255,0.1)]' : 'border-b border-gray-100'
      )}
    >
      {/* ── Logo + actions row ── */}
      <div className="max-w-[1440px] mx-auto px-6 sm:px-16 h-[70px] flex items-center justify-between gap-4">

        {/* Logo — car site badge style */}
        <Link href="/" className="flex items-center gap-3 shrink-0 group">
          <div className="w-11 h-11 rounded-full bg-[#2B59FF] flex items-center justify-center shadow-[0_4px_14px_rgba(43,89,255,0.4)] group-hover:shadow-[0_6px_20px_rgba(43,89,255,0.5)] transition-shadow">
            <span className="text-white font-extrabold text-xl leading-none">U</span>
          </div>
          <div className="leading-tight hidden sm:block">
            <div className="text-[20px] font-extrabold tracking-tight leading-none text-[#2B2C35]">
              Uluse<span className="text-[#2B59FF]">ydan</span>ı
            </div>
            <div className="text-[10px] text-grey font-medium leading-tight mt-0.5 italic">
              Doğru haber · Güvenilir kaynak
            </div>
          </div>
        </Link>

        {/* Desktop category nav — centered */}
        <nav className="hidden xl:flex items-center gap-1 flex-1 justify-center">
          {categories.map((cat) => {
            const active = pathname === `/kategori/${cat.slug}`
            return (
              <Link
                key={cat.slug}
                href={`/kategori/${cat.slug}`}
                className={cn(
                  'px-3 py-1.5 rounded-full text-[13px] font-semibold transition-all duration-150 whitespace-nowrap',
                  active
                    ? 'bg-[#2B59FF] text-white'
                    : 'text-[#2B2C35] hover:bg-[#F5F8FF] hover:text-[#2B59FF]'
                )}
              >
                {cat.name}
              </Link>
            )
          })}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Search */}
          <button
            className="w-10 h-10 rounded-full bg-[#F5F8FF] flex items-center justify-center text-[#747A88] hover:bg-[#2B59FF] hover:text-white transition-all duration-200"
            aria-label="Ara"
          >
            <svg className="w-4.5 h-4.5" width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>

          {/* Admin pill — car site button style */}
          <Link
            href="/admin/giris"
            className="hidden sm:flex items-center text-[#2B59FF] rounded-full bg-[#F5F8FF] border border-[#2B59FF]/20 min-w-[100px] justify-center py-2 px-4 text-[13px] font-bold hover:bg-[#2B59FF] hover:text-white transition-all duration-200"
          >
            Admin
          </Link>

          {/* Hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="w-10 h-10 rounded-full bg-[#2B59FF] flex items-center justify-center text-white hover:bg-[#1e46e8] transition-all duration-200 xl:hidden"
            aria-label="Menü"
          >
            {menuOpen ? (
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* ── Desktop tab bar (lg, not xl) ── */}
      <div className="xl:hidden hidden lg:block border-t border-gray-100 bg-white overflow-x-auto">
        <div className="max-w-[1440px] mx-auto px-6 flex items-center gap-1 py-2">
          {categories.map((cat) => {
            const active = pathname === `/kategori/${cat.slug}`
            return (
              <Link key={cat.slug} href={`/kategori/${cat.slug}`}
                className={cn(
                  'shrink-0 px-3 py-1.5 rounded-full text-[13px] font-semibold transition-all whitespace-nowrap',
                  active ? 'bg-[#2B59FF] text-white' : 'text-[#2B2C35] hover:bg-[#F5F8FF] hover:text-[#2B59FF]'
                )}>
                {cat.name}
              </Link>
            )
          })}
        </div>
      </div>

      {/* ── Mobile dropdown menu ── */}
      {menuOpen && (
        <div className="xl:hidden border-t border-gray-100 bg-white">
          {/* Categories grid */}
          <div className="max-w-[1440px] mx-auto px-6 py-4">
            <p className="text-[10px] font-extrabold uppercase tracking-widest text-grey mb-3">Kategoriler</p>
            <div className="grid grid-cols-4 gap-2">
              {categories.map((cat) => {
                const active = pathname === `/kategori/${cat.slug}`
                return (
                  <Link
                    key={cat.slug}
                    href={`/kategori/${cat.slug}`}
                    className={cn(
                      'py-2.5 rounded-2xl text-[12px] font-bold text-center transition-all',
                      active
                        ? 'bg-[#2B59FF] text-white'
                        : 'bg-[#F5F8FF] text-[#2B2C35] hover:bg-[#2B59FF] hover:text-white'
                    )}
                  >
                    {cat.name}
                  </Link>
                )
              })}
            </div>
            <div className="mt-3 flex gap-2">
              <Link href="/" className={cn('flex-1 py-2.5 rounded-2xl text-[12px] font-bold text-center transition-all', pathname === '/' ? 'bg-[#2B59FF] text-white' : 'bg-[#F5F8FF] text-[#2B2C35] hover:bg-[#2B59FF] hover:text-white')}>
                Ana Sayfa
              </Link>
              <Link href="/admin/giris" className="flex-1 py-2.5 rounded-2xl text-[12px] font-bold text-center bg-[#2B2C35] text-white hover:bg-black transition-all">
                Admin Girişi
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}