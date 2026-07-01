'use client'

import { useState, useEffect } from 'react'

export default function TopBar() {
  const [dateStr, setDateStr] = useState('')

  useEffect(() => {
    const fmt = () => {
      const now = new Date()
      setDateStr(now.toLocaleDateString('tr-TR', {
        day: 'numeric', month: 'long', year: 'numeric', weekday: 'long',
        timeZone: 'Europe/Istanbul',
      }).toUpperCase())
    }
    fmt()
    const t = setInterval(fmt, 60_000)
    return () => clearInterval(t)
  }, [])

  return (
    <div className="bg-[#14151f] border-b border-white/5">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-16">
        <div className="flex items-center h-9 gap-4">

          {/* Sol: Tarih chip */}
          <div className="shrink-0 bg-red-600 text-white text-[10px] font-extrabold uppercase tracking-wide px-3 py-1 rounded whitespace-nowrap">
            {dateStr || '—'}
          </div>

          {/* Orta: Slogan */}
          <p className="flex-1 text-center text-[11px] text-white/50 font-medium hidden md:block truncate italic">
            &ldquo;Ankara&apos;nın Kalbinden, Türkiye&apos;ye ve Dünyaya&rdquo;
          </p>

          {/* Sağ: Sosyal + Arama */}
          <div className="flex items-center gap-2 shrink-0 ml-auto">
            {/* Sosyal ikonlar */}
            {[
              { title: 'Facebook', href: '#', d: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z' },
              { title: 'Twitter', href: '#', d: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.259 5.631L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117z' },
              { title: 'Instagram', href: '#', d: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z' },
              { title: 'YouTube', href: '#', d: 'M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z' },
            ].map(s => (
              <a key={s.title} href={s.href} title={s.title} target="_blank" rel="noopener noreferrer"
                className="w-6 h-6 flex items-center justify-center text-white/40 hover:text-white transition-colors">
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d={s.d} /></svg>
              </a>
            ))}

            {/* Arama */}
            <div className="hidden sm:flex items-center gap-1.5 bg-white/8 rounded px-2.5 py-1 ml-1">
              <input type="text" placeholder="Haber ara..."
                className="bg-transparent text-[11px] text-white/60 placeholder:text-white/30 outline-none w-28 lg:w-36" />
              <svg className="w-3.5 h-3.5 text-white/40 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}