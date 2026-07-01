'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import type { Slider } from '@/lib/types'

export default function SecondarySlider({ sliders }: { sliders: Slider[] }) {
  const [current, setCurrent] = useState(0)

  const next = useCallback(() => setCurrent(p => (p + 1) % sliders.length), [sliders.length])
  const prev = () => setCurrent(p => (p - 1 + sliders.length) % sliders.length)

  useEffect(() => {
    if (sliders.length <= 1) return
    const t = setInterval(next, 5000)
    return () => clearInterval(t)
  }, [next, sliders.length])

  if (!sliders.length) return null

  const slide = sliders[current]

  return (
    <div className="relative rounded-2xl overflow-hidden bg-[#2B2C35]" style={{ height: 120 }}>
      {sliders.map((s, i) => (
        <div key={s.id} className="absolute inset-0 transition-opacity duration-500"
          style={{ opacity: i === current ? 1 : 0, pointerEvents: i === current ? 'auto' : 'none' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={s.image_url} alt={s.title} className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(43,44,53,0.92) 0%, rgba(43,44,53,0.6) 60%, transparent 100%)' }} />
          <div className="absolute inset-0 flex items-center px-10 gap-4">
            {s.subtitle && (
              <span className="shrink-0 text-[10px] font-extrabold bg-[#2B59FF] text-white px-2.5 py-1 rounded-lg uppercase tracking-wide">
                {s.subtitle}
              </span>
            )}
            <Link href={s.link || '#'}
              className="flex-1 text-[14px] font-bold text-white hover:text-[#93b4ff] transition-colors leading-snug line-clamp-2">
              {s.title}
            </Link>
            {s.link && (
              <Link href={s.link}
                className="shrink-0 flex items-center gap-1.5 bg-white/10 hover:bg-[#2B59FF] text-white text-[12px] font-bold px-3 py-1.5 rounded-xl transition-all backdrop-blur-sm">
                Oku
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            )}
          </div>
        </div>
      ))}

      {sliders.length > 1 && (
        <>
          <button onClick={prev}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-7 h-7 rounded-lg bg-white/10 hover:bg-[#2B59FF] text-white flex items-center justify-center backdrop-blur-sm transition-all">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button onClick={next}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-7 h-7 rounded-lg bg-white/10 hover:bg-[#2B59FF] text-white flex items-center justify-center backdrop-blur-sm transition-all">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </button>
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 z-10">
            {sliders.map((_, i) => (
              <button key={i} onClick={() => setCurrent(i)}
                className={`h-1 rounded-full transition-all ${i === current ? 'bg-white w-4' : 'bg-white/30 w-1.5'}`} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
