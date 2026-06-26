'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import type { Slider } from '@/lib/types'

interface HeroSliderProps {
  sliders: Slider[]
}

export default function HeroSlider({ sliders }: HeroSliderProps) {
  const [current, setCurrent] = useState(0)
  const [animating, setAnimating] = useState(false)

  const goTo = useCallback((i: number) => {
    if (animating) return
    setAnimating(true)
    setCurrent(i)
    setTimeout(() => setAnimating(false), 700)
  }, [animating])

  useEffect(() => {
    if (sliders.length <= 1) return
    const t = setInterval(() => goTo((current + 1) % sliders.length), 7000)
    return () => clearInterval(t)
  }, [sliders.length, current, goTo])

  if (sliders.length === 0) {
    return (
      <div className="relative w-full h-[500px] md:h-[620px] overflow-hidden bg-[#09090b] flex items-center justify-center">
        {/* Ambient blobs */}
        <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-red-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/3 w-80 h-80 bg-orange-500/8 rounded-full blur-[100px]" />
        <div className="relative z-10 text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center shadow-2xl shadow-red-900/40"
               style={{ boxShadow: '0 0 40px rgba(239,68,68,0.35), 0 20px 40px rgba(0,0,0,0.5)' }}>
            <span className="text-white font-black text-4xl">U</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-white tracking-tight mb-3"
              style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}>
            Ulusmeydanı
          </h1>
          <p className="text-zinc-500 text-lg">Güvenilir habercilik · Anlık gelişmeler</p>
        </div>
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-[0.03]"
             style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
      </div>
    )
  }

  return (
    <div className="relative w-full h-[500px] md:h-[620px] overflow-hidden bg-[#09090b]">
      {/* Slides */}
      {sliders.map((slide, i) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-all duration-700 ease-out ${
            i === current ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        >
          <Image
            src={slide.image_url}
            alt={slide.title}
            fill
            className={`object-cover transition-transform duration-[8000ms] ease-out ${
              i === current ? 'scale-110' : 'scale-100'
            }`}
            priority={i === 0}
          />
          {/* Dark gradient layers */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-[#09090b]/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#09090b]/70 via-transparent to-transparent" />
        </div>
      ))}

      {/* Ambient glow */}
      <div className="absolute bottom-0 left-1/4 w-1/2 h-40 bg-red-500/10 blur-3xl pointer-events-none" />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-end z-10">
        <div className="max-w-7xl mx-auto px-4 md:px-6 pb-10 md:pb-14 w-full">
          <div className="max-w-2xl">
            {sliders[current]?.subtitle && (
              <div className="flex items-center gap-2 mb-4">
                <span className="w-5 h-0.5 bg-red-500 rounded" />
                <span className="text-red-400 text-[11px] font-black uppercase tracking-[0.2em]">
                  {sliders[current].subtitle}
                </span>
              </div>
            )}
            <h2
              className="text-white font-black text-2xl md:text-4xl lg:text-5xl leading-tight mb-5"
              style={{ fontFamily: "'Bricolage Grotesque', sans-serif", textShadow: '0 2px 20px rgba(0,0,0,0.5)' }}
            >
              {sliders[current]?.title}
            </h2>
            {sliders[current]?.link && (
              <Link
                href={sliders[current].link!}
                className="inline-flex items-center gap-2.5 bg-red-500 hover:bg-red-600 text-white font-bold text-sm px-5 py-2.5 rounded-full transition-all hover:gap-3.5 group"
                style={{ boxShadow: '0 0 20px rgba(239,68,68,0.4), 0 4px 15px rgba(0,0,0,0.3)' }}
              >
                Haberi Oku
                <svg className="w-4 h-4 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            )}
          </div>
        </div>

        {/* Bottom controls */}
        {sliders.length > 1 && (
          <div className="max-w-7xl mx-auto px-4 md:px-6 pb-6 w-full flex items-center justify-between z-20 relative">
            {/* Counter */}
            <span className="text-zinc-600 text-xs font-bold tabular-nums">
              <span className="text-white">{String(current + 1).padStart(2, '0')}</span>
              {' '}/ {String(sliders.length).padStart(2, '0')}
            </span>

            {/* Dots */}
            <div className="flex gap-1.5">
              {sliders.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  className={`rounded-full transition-all duration-300 ${
                    i === current ? 'w-8 h-1.5 bg-red-500' : 'w-1.5 h-1.5 bg-white/20 hover:bg-white/40'
                  }`}
                />
              ))}
            </div>

            {/* Arrows */}
            <div className="flex gap-2">
              <button
                onClick={() => goTo((current - 1 + sliders.length) % sliders.length)}
                className="w-9 h-9 rounded-full glass flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-all"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={() => goTo((current + 1) % sliders.length)}
                className="w-9 h-9 rounded-full glass flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-all"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Progress line */}
      {sliders.length > 1 && (
        <div className="absolute bottom-0 left-0 right-0 h-px bg-white/5 z-20">
          <div key={current} className="h-full bg-gradient-to-r from-red-500 to-orange-400" style={{ animation: 'progress 7s linear forwards' }} />
        </div>
      )}

      <style>{`
        @keyframes progress { from { width: 0 } to { width: 100% } }
      `}</style>
    </div>
  )
}