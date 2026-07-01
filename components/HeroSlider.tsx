'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import type { Slider } from '@/lib/types'

export default function HeroSlider({ sliders, stretch = false }: { sliders: Slider[]; stretch?: boolean }) {
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

  if (!sliders.length) return null

  return (
    <section className={stretch ? 'w-full h-full flex flex-col' : 'w-full'}>
      {/* Slider — full width, köşesiz */}
      <div className={stretch
        ? 'relative w-full overflow-hidden flex-1 min-h-0'
        : 'relative w-full overflow-hidden aspect-[4/3] sm:aspect-[21/9] sm:max-h-[560px]'
      }>

        {sliders.map((slide, i) => (
          <div key={slide.id} className="absolute inset-0 transition-opacity duration-700"
            style={{ opacity: i === current ? 1 : 0, pointerEvents: i === current ? 'auto' : 'none' }}>
            <Image src={slide.image_url} alt={slide.title} fill className="object-cover" priority={i === 0} />
            {/* Sola doğru gradient */}
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(10,14,30,0.88) 0%, rgba(10,14,30,0.5) 55%, rgba(10,14,30,0.05) 100%)' }} />
            {/* Alta doğru gradient */}
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(10,14,30,0.85) 0%, transparent 55%)' }} />

            {/* İçerik — sol alt */}
            <div className="absolute inset-0 flex flex-col justify-end">
              <div className="max-w-[1440px] w-full mx-auto px-4 sm:px-10 pb-10 sm:pb-16">
                <div className="max-w-2xl">
                  {slide.subtitle && (
                    <span className="inline-flex items-center gap-2 bg-[#1a1a2e] text-white text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 rounded mb-3">
                      {slide.subtitle}
                    </span>
                  )}
                  <Link href={slide.link || '#'}>
                    <h1 className="text-white font-extrabold leading-tight hover:text-white/85 transition-colors mb-4"
                      style={{ fontSize: 'clamp(1.3rem, 2.8vw, 2.6rem)', letterSpacing: '-0.025em', textShadow: '0 2px 16px rgba(0,0,0,0.4)' }}>
                      {slide.title}
                    </h1>
                  </Link>
                  {slide.link && (
                    <Link href={slide.link}
                      className="inline-flex items-center gap-2 bg-[#1a1a2e] hover:bg-red-600 text-white rounded-full py-2.5 px-6 text-[13px] font-bold transition-all shadow-[0_4px_20px_rgba(26,26,46,0.45)]">
                      Haberi Oku
                      <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Progress bar */}
        {sliders.length > 1 && (
          <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-white/10 z-10">
            <div key={current} className="h-full bg-[#1a1a2e]"
              style={{ animation: 'sliderProgress 5s linear forwards' }} />
          </div>
        )}

        {/* Sol/sağ oklar — üst 1/3 konumunda, içerikle çakışmaz */}
        {sliders.length > 1 && (
          <>
            <button onClick={() => goTo((current - 1 + sliders.length) % sliders.length)}
              className="absolute left-3 sm:left-4 top-1/3 -translate-y-1/2 z-10 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-black/30 hover:bg-[#1a1a2e] border border-white/20 text-white flex items-center justify-center backdrop-blur-sm transition-all">
              <svg width="11" height="11" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button onClick={() => goTo((current + 1) % sliders.length)}
              className="absolute right-3 sm:right-4 top-1/3 -translate-y-1/2 z-10 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-black/30 hover:bg-[#1a1a2e] border border-white/20 text-white flex items-center justify-center backdrop-blur-sm transition-all">
              <svg width="11" height="11" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}
      </div>

      {/* Numaralı sayfalama — referans site gibi */}
      {sliders.length > 1 && (
        <div className="bg-white border-b border-gray-100">
          <div className="max-w-[1440px] mx-auto px-6 sm:px-16">
            <div className="flex items-center h-10 gap-1">
              {sliders.map((_, i) => (
                <button key={i} onClick={() => goTo(i)}
                  className={`min-w-[36px] h-7 px-2.5 text-[12px] font-extrabold rounded transition-all duration-200
                    ${i === current
                      ? 'bg-[#1a1a2e] text-white shadow-sm'
                      : 'bg-transparent text-[#747A88] hover:bg-gray-100 hover:text-[#1a1a2e]'
                    }`}>
                  {i + 1}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <style>{`@keyframes sliderProgress { from { width: 0% } to { width: 100% } }`}</style>
    </section>
  )
}