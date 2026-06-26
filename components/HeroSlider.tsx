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

  // ── Empty / no sliders: full-width hero landing section ──────────────────
  if (sliders.length === 0) {
    return (
      <section
        style={{
          width: '100%',
          minHeight: '80vh',
          background: 'linear-gradient(135deg, #2B2C35 0%, #1e1f28 60%, #2B2C35 100%)',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        {/* Decorative blobs */}
        <div style={{ position: 'absolute', top: '-80px', right: '-80px', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(43,89,255,0.15) 0%, transparent 70%)', borderRadius: '50%' }} />
        <div style={{ position: 'absolute', bottom: '-60px', left: '30%', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(79,123,255,0.08) 0%, transparent 70%)', borderRadius: '50%' }} />

        {/* Grid pattern overlay */}
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.035,
          backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }} />

        <div style={{ position: 'relative', zIndex: 10, width: '100%' }}>
          <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '80px 24px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '48px', alignItems: 'center' }}>

              {/* Left: text */}
              <div style={{ maxWidth: '600px' }}>
                {/* Pill tag */}
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: '8px',
                  background: 'rgba(43,89,255,0.15)', border: '1px solid rgba(43,89,255,0.3)',
                  color: '#6b93ff', fontSize: '11px', fontWeight: 800,
                  textTransform: 'uppercase', letterSpacing: '0.18em',
                  padding: '6px 16px', borderRadius: '100px', marginBottom: '32px',
                  fontFamily: 'Manrope, sans-serif',
                }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#2B59FF', animation: 'pulse 2s infinite' }} />
                  Türkiye'nin Güvenilir Haber Kaynağı
                </div>

                {/* Title */}
                <h1 style={{
                  fontSize: 'clamp(2.5rem, 6vw, 5rem)',
                  fontWeight: 800,
                  lineHeight: 1.08,
                  letterSpacing: '-0.02em',
                  color: '#ffffff',
                  fontFamily: 'Manrope, sans-serif',
                  marginBottom: '20px',
                }}>
                  Haberleri Hızlı<br />
                  <span style={{ color: '#2B59FF' }}>Keşfet</span> ve{' '}
                  <span style={{ color: '#f79761' }}>Takip Et!</span>
                </h1>

                {/* Subtitle */}
                <p style={{
                  fontSize: '1.1rem', color: 'rgba(255,255,255,0.5)',
                  fontWeight: 300, lineHeight: 1.75, maxWidth: '480px',
                  marginBottom: '40px', fontFamily: 'Manrope, sans-serif',
                }}>
                  Son dakika gelişmeleri, gündem haberleri ve derinlemesine analizler —
                  her şey tek platformda.
                </p>

                {/* CTA buttons */}
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  <Link
                    href="#haberler"
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: '8px',
                      background: '#2B59FF', color: '#fff', borderRadius: '100px',
                      padding: '14px 28px', fontSize: '14px', fontWeight: 700,
                      textDecoration: 'none', fontFamily: 'Manrope, sans-serif',
                      boxShadow: '0 8px 30px rgba(43,89,255,0.4)',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    Haberleri Keşfet
                    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                  <Link
                    href="/admin/giris"
                    style={{
                      display: 'inline-flex', alignItems: 'center',
                      background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.7)',
                      border: '1px solid rgba(255,255,255,0.15)', borderRadius: '100px',
                      padding: '14px 28px', fontSize: '14px', fontWeight: 600,
                      textDecoration: 'none', fontFamily: 'Manrope, sans-serif',
                      backdropFilter: 'blur(10px)', transition: 'all 0.2s ease',
                    }}
                  >
                    Admin Paneli
                  </Link>
                </div>
              </div>

              {/* Right: visual card */}
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <div style={{
                  width: '100%', maxWidth: '420px', aspectRatio: '4/3',
                  background: 'rgba(43,89,255,0.08)',
                  border: '1px solid rgba(43,89,255,0.2)',
                  borderRadius: '32px',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  backdropFilter: 'blur(20px)',
                  boxShadow: '0 24px 80px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.06)',
                }}>
                  <div style={{
                    width: '100px', height: '100px', borderRadius: '28px',
                    background: 'linear-gradient(135deg, #2B59FF, #4F7BFF)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    marginBottom: '20px',
                    boxShadow: '0 20px 50px rgba(43,89,255,0.35)',
                    fontFamily: 'Manrope, sans-serif', fontSize: '48px',
                    fontWeight: 800, color: '#fff',
                  }}>U</div>
                  <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '13px', fontFamily: 'Manrope, sans-serif', fontWeight: 500 }}>
                    Haberler yakında burada görünecek
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    )
  }

  // ── Full slider ────────────────────────────────────────────────────────────
  return (
    <section style={{ width: '100%', position: 'relative', overflow: 'hidden', background: '#2B2C35', minHeight: '70vh' }}>
      {/* Slides */}
      {sliders.map((slide, i) => (
        <div
          key={slide.id}
          style={{
            position: 'absolute', inset: 0,
            opacity: i === current ? 1 : 0,
            transition: 'opacity 0.7s ease',
            pointerEvents: i === current ? 'auto' : 'none',
          }}
        >
          <Image
            src={slide.image_url}
            alt={slide.title}
            fill
            className="object-cover"
            style={{ transform: i === current ? 'scale(1.06)' : 'scale(1)', transition: 'transform 8s ease' }}
            priority={i === 0}
          />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(43,44,53,0.92) 0%, rgba(43,44,53,0.5) 50%, transparent 100%)' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(43,44,53,0.7) 0%, transparent 50%)' }} />
        </div>
      ))}

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 10, width: '100%', minHeight: '70vh', display: 'flex', alignItems: 'flex-end' }}>
        <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '80px 24px 60px', width: '100%' }}>
          <div style={{ maxWidth: '580px' }}>
            {sliders[current]?.subtitle && (
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)',
                color: 'rgba(255,255,255,0.7)', fontSize: '10px', fontWeight: 800,
                textTransform: 'uppercase', letterSpacing: '0.2em',
                padding: '5px 14px', borderRadius: '100px', marginBottom: '20px',
                backdropFilter: 'blur(10px)', fontFamily: 'Manrope, sans-serif',
              }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#ef4444' }} />
                {sliders[current].subtitle}
              </div>
            )}

            <h1 style={{
              fontSize: 'clamp(1.75rem, 4vw, 3.5rem)',
              fontWeight: 800, lineHeight: 1.12,
              color: '#ffffff', letterSpacing: '-0.02em',
              fontFamily: 'Manrope, sans-serif', marginBottom: '24px',
              textShadow: '0 2px 20px rgba(0,0,0,0.4)',
            }}>
              {sliders[current]?.title}
            </h1>

            {sliders[current]?.link && (
              <Link
                href={sliders[current].link!}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '8px',
                  background: '#2B59FF', color: '#fff',
                  borderRadius: '100px', padding: '14px 28px',
                  fontSize: '14px', fontWeight: 700,
                  textDecoration: 'none', fontFamily: 'Manrope, sans-serif',
                  boxShadow: '0 8px 30px rgba(43,89,255,0.4)',
                }}
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

      {/* Slider controls */}
      {sliders.length > 1 && (
        <div style={{ position: 'absolute', bottom: '24px', left: 0, right: 0, zIndex: 20 }}>
          <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', gap: '8px' }}>
              {sliders.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  style={{
                    height: '6px', borderRadius: '10px', border: 'none', cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    width: i === current ? '28px' : '6px',
                    background: i === current ? '#2B59FF' : 'rgba(255,255,255,0.3)',
                  }}
                />
              ))}
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              {[
                { label: 'Önceki', icon: 'M15 19l-7-7 7-7', dir: -1 },
                { label: 'Sonraki', icon: 'M9 5l7 7-7 7', dir: 1 },
              ].map(({ label, icon, dir }) => (
                <button
                  key={label}
                  aria-label={label}
                  onClick={() => goTo((current + dir + sliders.length) % sliders.length)}
                  style={{
                    width: '40px', height: '40px', borderRadius: '50%',
                    background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)',
                    color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'all 0.2s',
                  }}
                >
                  <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icon} />
                  </svg>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Progress bar */}
      {sliders.length > 1 && (
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '2px', background: 'rgba(255,255,255,0.08)', zIndex: 20 }}>
          <div key={current} style={{ height: '100%', background: '#2B59FF', animation: 'slider-progress 6s linear forwards' }} />
        </div>
      )}

      <style>{`
        @keyframes slider-progress { from { width: 0 } to { width: 100% } }
        @keyframes pulse { 0%, 100% { opacity: 1 } 50% { opacity: 0.4 } }
      `}</style>
    </section>
  )
}