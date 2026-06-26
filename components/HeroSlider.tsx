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
    <div className="w-full bg-gray-100">
      {/* Slider */}
      <div className="relative w-full overflow-hidden bg-gray-900" style={{ aspectRatio: '16/7', maxHeight: '480px' }}>
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
            {/* Gradient overlay */}
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.3) 50%, transparent 100%)' }} />

            {/* Content */}
            <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
              {/* Title */}
              <Link href={slide.link || '#'} className="block">
                <h2 className="text-white font-bold text-lg md:text-2xl leading-snug mb-3 hover:underline" style={{ fontFamily: 'Noto Sans, sans-serif', textShadow: '0 1px 4px rgba(0,0,0,0.4)' }}>
                  {slide.title}
                </h2>
              </Link>
              {/* Bottom meta row */}
              <div className="flex items-center gap-4 text-white/70 text-xs">
                {slide.subtitle && (
                  <span className="flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5a2 2 0 011.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                    {slide.subtitle}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}

        {/* Arrow buttons */}
        {sliders.length > 1 && (
          <>
            <button
              onClick={() => goTo((current - 1 + sliders.length) % sliders.length)}
              className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center transition-all backdrop-blur-sm"
              aria-label="Önceki"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() => goTo((current + 1) % sliders.length)}
              className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center transition-all backdrop-blur-sm"
              aria-label="Sonraki"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}
      </div>

      {/* ── Slide number indicators — ankarayaziyor style ── */}
      {sliders.length > 1 && (
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-screen-xl mx-auto px-4">
            <div className="flex items-center overflow-x-auto scrollbar-none py-2 gap-0.5">
              {sliders.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  className={`shrink-0 w-8 h-8 rounded text-sm font-bold transition-all ${
                    i === current
                      ? 'bg-[#C0282D] text-white'
                      : 'text-gray-500 hover:bg-gray-100'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}