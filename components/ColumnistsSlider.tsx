'use client'

import { useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import type { Columnist } from '@/lib/types'

export default function ColumnistsSlider({ columnists }: { columnists: Columnist[] }) {
  const scrollRef = useRef<HTMLDivElement>(null)

  function scroll(dir: 'left' | 'right') {
    if (!scrollRef.current) return
    scrollRef.current.scrollBy({ left: dir === 'left' ? -300 : 300, behavior: 'smooth' })
  }

  if (!columnists.length) return null

  return (
    <div className="bg-white border-b border-gray-200">
      {/* Başlık */}
      <div className="flex items-center justify-between pb-2 mb-4 border-b border-gray-200">
        <div className="flex items-center gap-2.5">
          <span className="w-1 h-6 rounded-sm bg-red-600 shrink-0" />
          <h2 className="text-[15px] font-extrabold uppercase tracking-wide text-[#1a1a2e]">Köşe Yazarları</h2>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={() => scroll('left')}
            className="w-7 h-7 flex items-center justify-center text-gray-400 hover:text-[#1a1a2e] border border-gray-200 hover:border-[#1a1a2e] transition-all">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button onClick={() => scroll('right')}
            className="w-7 h-7 flex items-center justify-center text-gray-400 hover:text-[#1a1a2e] border border-gray-200 hover:border-[#1a1a2e] transition-all">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Yazarlar — yatay scroll, düz kartlar */}
      <div ref={scrollRef} className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth pb-2">
        {columnists.map((c) => (
          <Link key={c.id} href={`/yazar/${c.slug}`}
            className="flex flex-col items-start shrink-0 w-28 group text-left">
            {/* Fotoğraf — kare */}
            <div className="relative w-full aspect-square overflow-hidden bg-gray-100 rounded-lg">
              {c.photo_url ? (
                <Image src={c.photo_url} alt={c.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-[#1a1a2e]">
                  <span className="text-white font-extrabold text-2xl">{c.name[0]}</span>
                </div>
              )}
            </div>
            {/* İsim + başlık — sola yasla */}
            <div className="pt-2 w-full text-left">
              <p className="text-[12px] font-extrabold text-[#1a1a2e] leading-tight group-hover:text-red-600 transition-colors line-clamp-1">{c.name}</p>
              <p className="text-[10px] text-gray-500 mt-0.5 line-clamp-2 leading-snug">{c.title}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}