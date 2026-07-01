"use client"

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'

const LOGO_URL = 'https://res.cloudinary.com/dfbwqwibi/image/upload/sjbiqbjcew51rhcdqy2w'

interface Suggestion {
  type: string
  label: string
  sub: string
  href: string
  color?: string
}

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
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [loadingSuggest, setLoadingSuggest] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const searchRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => { setMenuOpen(false); setSearchOpen(false); setSuggestions([]); setShowDropdown(false) }, [pathname])

  useEffect(() => {
    if (searchOpen) setTimeout(() => searchRef.current?.focus(), 50)
    else { setSuggestions([]); setShowDropdown(false) }
  }, [searchOpen])

  // Debounced suggest fetch
  const fetchSuggestions = useCallback(async (q: string) => {
    if (q.length < 2) { setSuggestions([]); setShowDropdown(false); return }
    setLoadingSuggest(true)
    try {
      const res = await fetch(`/api/search-suggest?q=${encodeURIComponent(q)}`)
      const json = await res.json()
      setSuggestions(json.results || [])
      setShowDropdown(true)
    } catch { setSuggestions([]) }
    finally { setLoadingSuggest(false) }
  }, [])

  useEffect(() => {
    const t = setTimeout(() => fetchSuggestions(searchQuery), 280)
    return () => clearTimeout(t)
  }, [searchQuery, fetchSuggestions])

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    const q = searchQuery.trim()
    if (q.length < 2) return
    setShowDropdown(false)
    router.push(`/arama?q=${encodeURIComponent(q)}`)
    setSearchOpen(false)
    setSearchQuery('')
    setSuggestions([])
  }

  function handlePickSuggestion(href: string) {
    setShowDropdown(false)
    setSearchOpen(false)
    setSearchQuery('')
    setSuggestions([])
    router.push(href)
  }

  return (
    <header
      className={cn(
        'w-full sticky top-0 z-50 transition-all duration-300',
        scrolled
          ? 'bg-white/85 backdrop-blur-xl shadow-[0_2px_24px_rgba(43,89,255,0.12)] border-b border-[#2B59FF]/10'
          : 'bg-white/75 backdrop-blur-xl border-b border-[#2B59FF]/8'
      )}>
        <div className="max-w-[1440px] mx-auto px-6 sm:px-16 h-[82px] flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 shrink-0 group">
          <Image
            src={LOGO_URL}
            alt="Ulusmeydan Logo"
            width={52}
            height={52}
            className="h-[52px] w-[52px] object-contain rounded-xl group-hover:opacity-90 transition-opacity"
            priority
          />
          <div className="leading-tight">
            <div className="text-[18px] sm:text-[23px] font-extrabold tracking-tight leading-none text-[#2B2C35]">
              Ulus<span className="text-[#2B59FF]">Meydan</span>
            </div>
            <div className="hidden sm:block text-[10px] text-[#747A88] font-medium leading-tight mt-0.5 italic">
              Ankara'nın Kalbinden Haber
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
            onClick={() => setSearchOpen(!searchOpen)}
            className={cn('w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200', searchOpen ? 'bg-[#2B59FF] text-white' : 'bg-[#F5F8FF] text-[#747A88] hover:bg-[#2B59FF] hover:text-white')}
            aria-label="Ara"
          >
            {searchOpen ? (
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
            ) : (
              <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            )}
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

      {/* ── Search overlay ── */}
      {searchOpen && (
        <div className="border-t border-[#2B59FF]/10 bg-white/95 backdrop-blur-xl">
          <div className="max-w-[1440px] mx-auto px-6 sm:px-16 py-3">
            <form onSubmit={handleSearch} className="flex items-center gap-3">
              <div className="relative flex-1" ref={dropdownRef}>
                <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#747A88] z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                {loadingSuggest && (
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 border-2 border-[#2B59FF] border-t-transparent rounded-full animate-spin" />
                )}
                <input
                  ref={searchRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => { if (suggestions.length > 0) setShowDropdown(true) }}
                  placeholder="Haber, konu veya anahtar kelime ara..."
                  autoComplete="off"
                  className="w-full pl-11 pr-4 py-2.5 rounded-full border border-gray-200 bg-[#F5F8FF] text-sm font-medium text-[#2B2C35] placeholder-[#747A88] focus:outline-none focus:ring-2 focus:ring-[#2B59FF]/30 focus:border-[#2B59FF]"
                />
                {/* Dropdown */}
                {showDropdown && suggestions.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-[0_8px_32px_rgba(43,89,255,0.15)] border border-gray-100 overflow-hidden z-50">
                    {suggestions.map((s, i) => (
                      <button key={i} type="button" onClick={() => handlePickSuggestion(s.href)}
                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[#F5F8FF] transition-colors text-left border-b border-gray-50 last:border-0">
                        <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
                          style={{ backgroundColor: (s.color || '#2B59FF') + '20' }}>
                          {s.type === 'Köşe Yazarı' ? (
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: s.color }}>
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                          ) : (
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: s.color }}>
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                            </svg>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-[#2B2C35] truncate leading-tight">{s.label}</p>
                          <p className="text-[11px] font-bold mt-0.5" style={{ color: s.color || '#2B59FF' }}>{s.sub}</p>
                        </div>
                        <svg className="w-3.5 h-3.5 text-[#747A88] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    ))}
                    <button type="submit"
                      className="w-full py-2.5 text-center text-[12px] font-bold text-[#2B59FF] hover:bg-[#F5F8FF] transition-colors">
                      &quot;{searchQuery}&quot; için tüm sonuçları gör →
                    </button>
                  </div>
                )}
              </div>
              <button type="submit"
                className="shrink-0 bg-[#2B59FF] text-white font-bold text-sm px-5 py-2.5 rounded-full hover:bg-[#1e46e8] transition-colors disabled:opacity-50"
                disabled={searchQuery.trim().length < 2}>
                Ara
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ── Desktop tab bar (lg, not xl) ── */}
      <div className="xl:hidden hidden lg:block border-t border-[#2B59FF]/10 bg-white/85 backdrop-blur-xl overflow-x-auto">
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
        <div className="xl:hidden border-t border-[#2B59FF]/10 bg-white/90 backdrop-blur-xl">
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
            <div className="mt-4 flex items-center gap-2">
              {[
                { title: 'Twitter / X', href: '#', icon: <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.259 5.631L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg> },
                { title: 'Facebook', href: '#', icon: <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg> },
                { title: 'Instagram', href: '#', icon: <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg> },
                { title: 'YouTube', href: '#', icon: <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg> },
                { title: 'TikTok', href: '#', icon: <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg> },
              ].map(({ title, href, icon }) => (
                <a key={title} href={href} title={title} target="_blank" rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-[#F5F8FF] flex items-center justify-center text-[#747A88] hover:bg-[#2B59FF] hover:text-white transition-all">
                  {icon}
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}