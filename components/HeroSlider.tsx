'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import type { Slider } from '@/lib/types'

interface HeroSliderProps {
  sliders: Slider[]
}

export default function HeroSlider({ sliders }: HeroSliderProps) {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    if (sliders.length <= 1) return
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % sliders.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [sliders.length])

  if (sliders.length === 0) {
    return (
      <div className="w-full h-[400px] md:h-[500px] bg-gradient-to-r from-[#2c3e50] to-[#c0392b] flex items-center justify-center">
        <div className="text-center text-white">
          <h2 className="text-3xl font-black mb-2">Ulusmeydan Gazetesi</h2>
          <p className="text-gray-300">Güvenilir habercilik</p>
        </div>
      </div>
    )
  }

  const slide = sliders[current]

  return (
    <div className="relative w-full h-[400px] md:h-[520px] overflow-hidden bg-gray-900">
      {sliders.map((s, i) => (
        <div
          key={s.id}
          className={`absolute inset-0 transition-opacity duration-700 ${i === current ? 'opacity-100' : 'opacity-0'}`}
        >
          <Image
            src={s.image_url}
            alt={s.title}
            fill
            className="object-cover"
            priority={i === 0}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        </div>
      ))}

      {/* İçerik */}
      <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 text-white z-10">
        <div className="max-w-3xl">
          {slide.subtitle && (
            <span className="inline-block bg-[#c0392b] text-xs font-bold px-2 py-1 mb-3 uppercase tracking-wider">
              {slide.subtitle}
            </span>
          )}
          <h2 className="text-2xl md:text-4xl font-black leading-tight mb-3">
            {slide.title}
          </h2>
          {slide.link && (
            <Link
              href={slide.link}
              className="inline-block bg-[#c0392b] hover:bg-[#922b21] text-white text-sm font-semibold px-5 py-2 rounded transition-colors"
            >
              Haberi Oku →
            </Link>
          )}
        </div>
      </div>

      {/* Oklar */}
      {sliders.length > 1 && (
        <>
          <button
            onClick={() => setCurrent((prev) => (prev - 1 + sliders.length) % sliders.length)}
            className="absolute left-3 top-1/2 -translate-y-1/2 z-10 bg-black/40 hover:bg-black/70 text-white w-10 h-10 rounded-full flex items-center justify-center transition-colors"
            aria-label="Önceki"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={() => setCurrent((prev) => (prev + 1) % sliders.length)}
            className="absolute right-3 top-1/2 -translate-y-1/2 z-10 bg-black/40 hover:bg-black/70 text-white w-10 h-10 rounded-full flex items-center justify-center transition-colors"
            aria-label="Sonraki"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Noktalar */}
          <div className="absolute bottom-4 right-6 z-10 flex gap-2">
            {sliders.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  i === current ? 'bg-[#c0392b] w-6' : 'bg-white/60 hover:bg-white'
                }`}
                aria-label={`Slayt ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}