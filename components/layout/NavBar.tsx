'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const categories = [
  { name: 'Gündem',       slug: 'gundem' },
  { name: 'Ankara',       slug: 'ankara' },
  { name: 'Siyaset',      slug: 'siyaset' },
  { name: 'Ekonomi',      slug: 'ekonomi' },
  { name: 'Spor',         slug: 'spor' },
  { name: 'Kültür Sanat', slug: 'kultur-sanat' },
  { name: 'Dünya',        slug: 'dunya' },
  { name: 'Yaşam',        slug: 'yasam' },
  { name: 'Video',        slug: 'video' },
  { name: 'Yazarlar',     slug: 'yazarlar' },
]

export default function NavBar() {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <>
      <nav className="bg-[#1a1a2e] sticky top-0 z-50 shadow-[0_2px_12px_rgba(0,0,0,0.3)]">
        <div className="max-w-[1440px] mx-auto px-0 sm:px-6 lg:px-16">
          <div className="flex items-center h-12">

            {/* Kırmızı Home butonu */}
            <Link href="/"
              className="flex items-center justify-center w-14 h-12 bg-red-600 hover:bg-red-700 transition-colors shrink-0">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
              </svg>
            </Link>

            {/* Kategoriler */}
            <div className="hidden lg:flex items-center flex-1 overflow-hidden px-2">
              {categories.map((cat, i) => {
                const active = pathname === `/kategori/${cat.slug}` || (cat.slug === 'yazarlar' && pathname.startsWith('/yazar'))
                return (
                  <div key={cat.slug} className="flex items-center shrink-0">
                    {i > 0 && <span className="text-white/15 text-sm mx-0.5">|</span>}
                    <Link
                      href={cat.slug === 'yazarlar' ? '/yazar' : `/kategori/${cat.slug}`}
                      className={cn(
                        'px-3 py-1.5 text-[13px] font-semibold transition-all whitespace-nowrap',
                        active
                          ? 'text-red-400 font-extrabold'
                          : 'text-white/75 hover:text-white'
                      )}>
                      {cat.name}
                    </Link>
                  </div>
                )
              })}
            </div>

            {/* Sağ: Hamburger */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="ml-auto flex items-center justify-center w-12 h-12 text-white/60 hover:text-white transition-colors lg:hidden">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {menuOpen
                  ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                  : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" />
                }
              </svg>
            </button>

            <Link href="/admin/giris"
              className="hidden lg:flex items-center gap-1.5 text-white/40 hover:text-white/80 text-[11px] font-bold transition-colors px-3 py-1.5 border border-white/10 rounded hover:border-white/25 mx-3">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Admin
            </Link>

          </div>
        </div>

        {/* Mobile dropdown */}
        {menuOpen && (
          <div className="lg:hidden bg-[#0f1018] border-t border-white/5 px-4 py-3">
            <div className="grid grid-cols-3 gap-2">
              {categories.map(cat => (
                <Link key={cat.slug}
                  href={cat.slug === 'yazarlar' ? '/yazar' : `/kategori/${cat.slug}`}
                  onClick={() => setMenuOpen(false)}
                  className="py-2 text-center text-[12px] font-semibold text-white/70 hover:text-white bg-white/5 rounded hover:bg-white/10 transition-all">
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>
    </>
  )
}