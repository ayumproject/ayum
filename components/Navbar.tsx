'use client'

import { useState } from 'react'
import Link from 'next/link'

const categories = [
  { name: 'Gündem', slug: 'gundem' },
  { name: 'Spor', slug: 'spor' },
  { name: 'Ekonomi', slug: 'ekonomi' },
  { name: 'Siyaset', slug: 'siyaset' },
  { name: 'Kültür-Sanat', slug: 'kultur-sanat' },
  { name: 'Teknoloji', slug: 'teknoloji' },
  { name: 'Dünya', slug: 'dunya' },
  { name: 'Yerel', slug: 'yerel' },
]

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)

  const today = new Date().toLocaleDateString('tr-TR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      {/* Üst bar */}
      <div className="bg-[#c0392b] text-white text-xs py-1">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <span>{today}</span>
          <span className="font-semibold tracking-wide">ULUSMEYDAN GAZETESİ</span>
        </div>
      </div>

      {/* Logo ve arama */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="bg-[#c0392b] text-white font-black text-2xl px-3 py-1 rounded">
            U
          </div>
          <div>
            <div className="font-black text-xl text-[#2c3e50] leading-tight">ULUSMEYDAN</div>
            <div className="text-[10px] text-gray-500 tracking-widest uppercase">Gazete</div>
          </div>
        </Link>

        {/* Mobil menü butonu */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden p-2 rounded text-gray-600 hover:bg-gray-100"
          aria-label="Menü"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {menuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Navigasyon */}
      <nav className="bg-[#2c3e50] text-white">
        <div className="max-w-7xl mx-auto px-4">
          {/* Desktop nav */}
          <ul className="hidden md:flex items-center">
            <li>
              <Link
                href="/"
                className="block px-4 py-3 text-sm font-semibold hover:bg-[#c0392b] transition-colors"
              >
                ANASAYFA
              </Link>
            </li>
            {categories.map((cat) => (
              <li key={cat.slug}>
                <Link
                  href={`/kategori/${cat.slug}`}
                  className="block px-4 py-3 text-sm font-semibold hover:bg-[#c0392b] transition-colors"
                >
                  {cat.name.toUpperCase()}
                </Link>
              </li>
            ))}
          </ul>

          {/* Mobil nav */}
          {menuOpen && (
            <ul className="md:hidden py-2">
              <li>
                <Link
                  href="/"
                  onClick={() => setMenuOpen(false)}
                  className="block px-4 py-2 text-sm font-semibold hover:bg-[#c0392b] transition-colors"
                >
                  Anasayfa
                </Link>
              </li>
              {categories.map((cat) => (
                <li key={cat.slug}>
                  <Link
                    href={`/kategori/${cat.slug}`}
                    onClick={() => setMenuOpen(false)}
                    className="block px-4 py-2 text-sm hover:bg-[#c0392b] transition-colors"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </nav>
    </header>
  )
}