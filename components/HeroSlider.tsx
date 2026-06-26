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
    setTimeout(() => setAnimating(false), 500)
  }, [animating])

  useEffect(() => {
    if (sliders.length <= 1) return
    const t = setInterval(() => goTo((current + 1) % sliders.length), 5000)
    return () => clearInterval(t)
  }, [sliders.length, current, goTo])

  if (sliders.length === 0) return null

  return (
    <section className="w-full bg-[#2B2C35]">
      {/* Main slider — 16/7 aspect ratio, max 500px */}
      <div className="relative w-full overflow-hidden" style={{ aspectRatio: '16/7', maxHeight: 500 }}>
        {sliders.map((slide, i) => (
          <div
            key={slide.id}
            className="absolute inset-0 transition-opacity duration-500"
            style={{ opacity: i === current ? 1 : 0, pointerEvents: i === current ? 'auto' : 'none' }}
          >
            <Image
              src={slide.image_url}
              alt={slide.title}
              fill
              className="object-cover"
              priority={i === 0}
            />
            {/* Two-layer gradient — car site inspired */}
            <div className="absolute inset-0"
              style={{ background: 'linear-gradient(to right, rgba(43,44,53,0.88) 0%, rgba(43,44,53,0.5) 55%, transparent 100%)' }} />
            <div className="absolute inset-0"
              style={{ background: 'linear-gradient(to top, rgba(43,44,53,0.7) 0%, transparent 50%)' }} />

            {/* Slide content — left-aligned, car site hero style */}
            <div className="absolute inset-0 flex items-center">
              <div className="max-w-[1440px] w-full mx-auto px-6 sm:px-16">
                <div className="max-w-xl">
                  {/* Category pill */}
                  {slide.subtitle && (
                    <span className="inline-flex items-center gap-2 bg-[#2B59FF] text-white text-[11px] font-extrabold uppercase tracking-widest px-3 py-1.5 rounded-full mb-4">
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                      {slide.subtitle}
                    </span>
                  )}

                  {/* Title — Manrope extrabold */}
                  <Link href={slide.link || '#'}>
                    <h1 className="text-white font-extrabold leading-tight hover:text-[#F5F8FF] transition-colors"
                      style={{ fontSize: 'clamp(1.6rem, 3.5vw, 3rem)', letterSpacing: '-0.02em' }}>
                      {slide.title}
                    </h1>
                  </Link>

                  {/* CTA — car site CustomButton style */}
                  {slide.link && (
                    <Link
                      href={slide.link}
                      className="inline-flex items-center gap-2 bg-[#2B59FF] text-white rounded-full mt-6 py-3 px-6 text-[14px] font-bold hover:bg-[#1e46e8] transition-all shadow-[0_8px_30px_rgba(43,89,255,0.4)]"
                    >
                      Haberi Oku
                      <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Prev / Next arrows */}
        {sliders.length > 1 && (
          <>
            <button
              onClick={() => goTo((current - 1 + sliders.length) % sliders.length)}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/10 hover:bg-[#2B59FF] border border-white/20 text-white flex items-center justify-center backdrop-blur-sm transition-all"
              aria-label="Önceki"
            >
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() => goTo((current + 1) % sliders.length)}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/10 hover:bg-[#2B59FF] border border-white/20 text-white flex items-center justify-center backdrop-blur-sm transition-all"
              aria-label="Sonraki"
            >
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}

        {/* Progress bar */}
        {sliders.length > 1 && (
          <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-white/10 z-10">
            <div key={current} className="h-full bg-[#2B59FF]"
              style={{ animation: 'sliderProgress 5s linear forwards' }} />
          </div>
        )}
      </div>

      {/* ── Numbered pagination — ankarayaziyor style ── */}
      {sliders.length > 1 && (
        <div className="bg-white border-b border-gray-100">
          <div className="max-w-[1440px] mx-auto px-6 sm:px-16">
            <div className="flex items-center gap-1 py-2 overflow-x-auto">
              {sliders.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  className={`shrink-0 w-9 h-9 rounded-xl text-sm font-extrabold transition-all ${
                    i === current
                      ? 'bg-[#2B59FF] text-white shadow-[0_4px_14px_rgba(43,89,255,0.35)]'
                      : 'text-[#747A88] hover:bg-[#F5F8FF] hover:text-[#2B59FF]'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes sliderProgress { from { width: 0% } to { width: 100% } }
      `}</style>
    </section>
  )
}