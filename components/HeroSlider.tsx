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
    setTimeout(() => setAnimating(false), 600)
  }, [animating])

  useEffect(() => {
    if (sliders.length <= 1) return
    const t = setInterval(() => goTo((current + 1) % sliders.length), 6000)
    return () => clearInterval(t)
  }, [sliders.length, current, goTo])

  // ── Empty state: car site hero layout ─────────────────────────────────────
  if (sliders.length === 0) {
    return (
      <div className="hero xl:flex-row flex-col gap-5 max-w-[1440px] mx-auto sm:px-16 px-6 min-h-[60vh] xl:min-h-[80vh] pb-10 pt-28">
        {/* Left text side */}
        <div className="flex-1 flex flex-col justify-center">
          <div className="inline-flex items-center gap-2 bg-[#F5F8FF] border border-[#2B59FF]/20 text-[#2B59FF] text-[11px] font-extrabold uppercase tracking-[0.15em] px-4 py-2 rounded-full w-fit mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2B59FF] animate-pulse" />
            Türkiye'nin Güvenilir Haber Kaynağı
          </div>
          <h1 className="hero__title">
            Haberleri Hızlı <br />
            <span className="text-[#2B59FF]">Keşfet</span> ve{' '}
            <span style={{ color: '#f79761' }}>Takip Et!</span>
          </h1>
          <p className="hero__subtitle max-w-lg">
            Son dakika gelişmeleri, gündem haberleri ve derinlemesine analizler —
            her şey tek platformda.
          </p>
          <div className="flex flex-wrap gap-3 mt-10">
            <Link
              href="#haberler"
              className="custom-btn bg-[#2B59FF] text-white rounded-full text-sm px-6 py-3"
            >
              Haberleri Keşfet
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
            <Link
              href="/admin/giris"
              className="custom-btn text-[#2B59FF] rounded-full bg-[#F5F8FF] text-sm px-6 py-3 border border-[#2B59FF]/20"
            >
              Admin Paneli
            </Link>
          </div>
        </div>

        {/* Right image side */}
        <div className="xl:flex-[1.5] flex justify-end items-end w-full xl:h-full h-[400px] relative">
          <div className="relative w-full h-full xl:w-[90%]">
            {/* Abstract gradient shape like car site's hero bg */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#2B59FF]/15 via-[#F5F8FF] to-[#f79761]/10 rounded-3xl" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div
                  className="w-32 h-32 mx-auto mb-6 rounded-3xl bg-[#2B59FF] flex items-center justify-center"
                  style={{ boxShadow: '0 20px 60px rgba(43,89,255,0.25)' }}
                >
                  <span className="text-white font-extrabold text-6xl">U</span>
                </div>
                <p className="text-[#747A88] text-sm font-medium">
                  Haberler yakında burada görünecek
                </p>
              </div>
            </div>
          </div>
          {/* Overlay bg pattern */}
          <div
            className="absolute -top-10 -right-10 w-full h-full -z-10 rounded-3xl opacity-40"
            style={{ background: 'radial-gradient(ellipse at center, rgba(43,89,255,0.08) 0%, transparent 70%)' }}
          />
        </div>
      </div>
    )
  }

  // ── Full slider ────────────────────────────────────────────────────────────
  return (
    <div className="relative w-full overflow-hidden bg-[#2B2C35]" style={{ minHeight: '70vh' }}>
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
            className={`object-cover transition-transform duration-[8000ms] ease-out ${i === current ? 'scale-110' : 'scale-100'}`}
            priority={i === 0}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#2B2C35]/90 via-[#2B2C35]/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#2B2C35]/60 to-transparent" />
        </div>
      ))}

      {/* Content - car site inspired split layout */}
      <div className="relative z-10 max-w-[1440px] mx-auto sm:px-16 px-6 flex items-center min-h-[70vh] py-24">
        <div className="max-w-xl">
          {sliders[current]?.subtitle && (
            <div className="inline-flex items-center gap-2 mb-6 bg-white/10 backdrop-blur-sm border border-white/15 text-white/80 text-[10px] font-extrabold uppercase tracking-[0.2em] px-4 py-2 rounded-full">
              <span className="w-1 h-1 bg-red-400 rounded-full animate-pulse" />
              {sliders[current].subtitle}
            </div>
          )}

          <h1 className="hero__title mb-5">{sliders[current]?.title}</h1>

          {sliders[current]?.link && (
            <Link
              href={sliders[current].link!}
              className="custom-btn bg-[#2B59FF] text-white rounded-full text-sm px-6 py-3 mt-6 w-fit"
              style={{ boxShadow: '0 8px 30px rgba(43,89,255,0.4)' }}
            >
              Haberi Oku
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          )}
        </div>
      </div>

      {/* Controls */}
      {sliders.length > 1 && (
        <div className="absolute bottom-8 left-0 right-0 z-20 max-w-[1440px] mx-auto sm:px-16 px-6 flex items-center justify-between">
          <div className="flex gap-2">
            {sliders.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className={`rounded-full transition-all duration-300 ${
                  i === current ? 'w-8 h-2 bg-[#2B59FF]' : 'w-2 h-2 bg-white/30 hover:bg-white/60'
                }`}
              />
            ))}
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => goTo((current - 1 + sliders.length) % sliders.length)}
              className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/15 flex items-center justify-center text-white hover:bg-[#2B59FF] hover:border-[#2B59FF] transition-all"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() => goTo((current + 1) % sliders.length)}
              className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/15 flex items-center justify-center text-white hover:bg-[#2B59FF] hover:border-[#2B59FF] transition-all"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Progress */}
      {sliders.length > 1 && (
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/10 z-20">
          <div key={current} className="h-full bg-[#2B59FF]" style={{ animation: 'progress 6s linear forwards' }} />
        </div>
      )}

      <style>{`@keyframes progress { from { width: 0 } to { width: 100% } }`}</style>
    </div>
  )
}