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
  const [isAnimating, setIsAnimating] = useState(false)

  const goTo = useCallback((index: number) => {
    if (isAnimating) return
    setIsAnimating(true)
    setCurrent(index)
    setTimeout(() => setIsAnimating(false), 600)
  }, [isAnimating])

  useEffect(() => {
    if (sliders.length <= 1) return
    const timer = setInterval(() => {
      goTo((current + 1) % sliders.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [sliders.length, current, goTo])

  if (sliders.length === 0) {
    return (
      <div className="w-full h-[420px] md:h-[560px] relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a]" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
          <div className="text-center">
            <div className="w-16 h-16 bg-[#dc2626] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-2xl shadow-red-900/50">
              <span className="text-3xl font-black">U</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black mb-3 tracking-tight">Ulusmeydanı</h2>
            <p className="text-slate-400 text-lg">Güvenilir habercilik, anlık gelişmeler</p>
          </div>
        </div>
        {/* Grid overlay */}
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)',
          backgroundSize: '50px 50px'
        }} />
      </div>
    )
  }

  return (
    <div className="w-full h-[420px] md:h-[560px] relative overflow-hidden bg-slate-900">
      {/* Slides */}
      {sliders.map((slide, i) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-all duration-700 ease-in-out ${
            i === current ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
          }`}
        >
          <Image
            src={slide.image_url}
            alt={slide.title}
            fill
            className="object-cover"
            priority={i === 0}
          />
          {/* Multi-layer gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent" />
        </div>
      ))}

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-end z-10">
        <div className="max-w-7xl mx-auto px-4 md:px-6 pb-10 w-full">
          <div className="max-w-2xl">
            {/* Subtitle/category tag */}
            {sliders[current]?.subtitle && (
              <div className="flex items-center gap-2 mb-3">
                <span className="bg-[#dc2626] text-white text-[10px] font-black uppercase tracking-[0.15em] px-3 py-1 rounded-sm">
                  {sliders[current].subtitle}
                </span>
              </div>
            )}

            {/* Title */}
            <h2 className="text-white font-black text-2xl md:text-4xl lg:text-5xl leading-tight mb-4 drop-shadow-lg">
              {sliders[current]?.title}
            </h2>

            {/* CTA */}
            {sliders[current]?.link && (
              <Link
                href={sliders[current].link!}
                className="inline-flex items-center gap-2 bg-[#dc2626] hover:bg-[#b91c1c] text-white font-bold text-sm px-5 py-2.5 rounded-lg transition-all hover:gap-3 shadow-xl shadow-red-900/40"
              >
                Haberi Oku
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            )}
          </div>
        </div>

        {/* Progress bar */}
        {sliders.length > 1 && (
          <div className="w-full h-0.5 bg-white/10">
            <div
              key={current}
              className="h-full bg-[#dc2626] transition-none"
              style={{ animation: 'progress-bar 6s linear forwards' }}
            />
          </div>
        )}
      </div>

      {/* Navigation arrows */}
      {sliders.length > 1 && (
        <>
          <button
            onClick={() => goTo((current - 1 + sliders.length) % sliders.length)}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/25 transition-all flex items-center justify-center"
            aria-label="Önceki"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={() => goTo((current + 1) % sliders.length)}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/25 transition-all flex items-center justify-center"
            aria-label="Sonraki"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Dot indicators */}
          <div className="absolute bottom-16 right-4 md:right-6 z-20 flex gap-1.5">
            {sliders.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className={`rounded-full transition-all duration-300 ${
                  i === current
                    ? 'w-6 h-2 bg-[#dc2626]'
                    : 'w-2 h-2 bg-white/40 hover:bg-white/70'
                }`}
                aria-label={`Slayt ${i + 1}`}
              />
            ))}
          </div>

          {/* Slide counter */}
          <div className="absolute bottom-16 left-4 md:left-6 z-20 text-white/60 text-xs font-bold tabular-nums">
            <span className="text-white">{String(current + 1).padStart(2, '0')}</span>
            {' / '}
            {String(sliders.length).padStart(2, '0')}
          </div>
        </>
      )}

      <style>{`
        @keyframes progress-bar {
          from { width: 0%; }
          to { width: 100%; }
        }
      `}</style>
    </div>
  )
}