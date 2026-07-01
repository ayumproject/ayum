'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'

const LOGO_URL = 'https://res.cloudinary.com/dfbwqwibi/image/upload/sjbiqbjcew51rhcdqy2w'

const ANKARA_PHOTOS = [
  'https://res.cloudinary.com/dfbwqwibi/image/upload/svgtk0hx8lwmzfndjn2l',
  'https://res.cloudinary.com/dfbwqwibi/image/upload/f17yndqdakoq0mcl6uvv',
  'https://res.cloudinary.com/dfbwqwibi/image/upload/rph8ycmggsedvrwfb1cq',
]

export default function SiteHeader() {
  const [temp, setTemp] = useState<number | null>(null)
  const [weatherDesc, setWeatherDesc] = useState('Bulutlu')
  const [weatherIcon, setWeatherIcon] = useState<'sun' | 'cloud' | 'rain'>('sun')
  const [photoIdx, setPhotoIdx] = useState(0)

  useEffect(() => {
    fetch('https://wttr.in/Ankara?format=j1').then(r => r.json()).then(d => {
      const c = d.current_condition?.[0]
      if (c) {
        setTemp(parseInt(c.temp_C))
        const code = parseInt(c.weatherCode)
        if (code === 113) { setWeatherDesc('Açık'); setWeatherIcon('sun') }
        else if (code <= 119) { setWeatherDesc('Parçalı Bulutlu'); setWeatherIcon('cloud') }
        else if (code <= 314) { setWeatherDesc('Yağmurlu'); setWeatherIcon('rain') }
        else { setWeatherDesc('Bulutlu'); setWeatherIcon('cloud') }
      }
    }).catch(() => {})

    const t = setInterval(() => setPhotoIdx(i => (i + 1) % ANKARA_PHOTOS.length), 4000)
    return () => clearInterval(t)
  }, [])

  return (
    <div className="bg-white border-b border-gray-100">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-16 py-3">
        <div className="flex items-center gap-6">

          {/* SOL: Logo */}
          <Link href="/" className="flex items-center gap-3 shrink-0 group">
            <Image src={LOGO_URL} alt="UlusMeydan Haber" width={64} height={64}
              className="w-16 h-16 object-contain" priority />
            <div className="leading-none">
              <div>
                <span className="text-[24px] font-black tracking-tight text-[#1a1a2e]">ULUS</span>
                <span className="text-[24px] font-black tracking-tight text-red-600"> MEYDAN</span>
              </div>
              <div className="text-[14px] font-extrabold tracking-[0.15em] text-[#1a1a2e] border-t border-b border-[#1a1a2e]/20 py-0.5 mt-0.5 text-center">
                — HABER —
              </div>
              <div className="text-[7.5px] font-bold tracking-[0.12em] text-gray-400 mt-1 uppercase text-center">
                Doğru • Tarafsız • Güvenilir
              </div>
            </div>
          </Link>

          {/* Ayırıcı */}
          <div className="w-px h-14 bg-gray-200 shrink-0" />

          {/* Ankara'dan Haber Var — sıkışmadan */}
          <div className="shrink-0 min-w-[180px]">
            <div className="text-[15px] font-extrabold text-[#1a1a2e] leading-tight mb-2">
              <span className="text-red-600">ANKARA&apos;DAN</span> HABER VAR!
            </div>
            <p className="text-[11px] text-gray-500 leading-relaxed mb-3">
              Başkentte olup biten her şey anlık olarak<br />
              <span className="font-bold text-[#1a1a2e]">ulusmeydan.com</span>&apos;da
            </p>
            <Link href="/"
              className="inline-flex items-center gap-1.5 border border-[#1a1a2e] text-[#1a1a2e] text-[10px] font-extrabold px-3 py-1.5 hover:bg-[#1a1a2e] hover:text-white transition-colors">
              TÜM HABERLER →
            </Link>
          </div>

          {/* FOTO — flex-1, rounded, sol diagonal kesim */}
          <div className="flex-1 relative rounded-lg overflow-hidden min-w-0" style={{ height: 115 }}>
            <div className="absolute inset-0" style={{ clipPath: 'polygon(5% 0%, 100% 0%, 100% 100%, 0% 100%)' }}>
              {ANKARA_PHOTOS.map((src, i) => (
                <div key={src} className="absolute inset-0 transition-opacity duration-700"
                  style={{ opacity: i === photoIdx ? 1 : 0 }}>
                  <Image src={src} alt={`Ankara ${i + 1}`} fill className="object-cover"
                    sizes="500px" priority={i === 0} />
                </div>
              ))}
              <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                {ANKARA_PHOTOS.map((_, i) => (
                  <button key={i} onClick={() => setPhotoIdx(i)}
                    className={`h-1 rounded-full transition-all ${i === photoIdx ? 'bg-white w-5' : 'bg-white/50 w-1.5'}`} />
                ))}
              </div>
            </div>
          </div>

          {/* HAVA DURUMU — sabit, rounded, üstten/alttan boşluklu */}
          <div className="hidden sm:flex flex-col items-center justify-center shrink-0 w-28 xl:w-32 rounded-lg bg-[#1a1a2e] gap-1"
            style={{ height: 115 }}>
            {weatherIcon === 'sun' && (
              <svg className="w-9 h-9 text-amber-400" fill="currentColor" viewBox="0 0 64 64">
                <circle cx="32" cy="32" r="11" />
                <line x1="32" y1="5" x2="32" y2="14" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
                <line x1="32" y1="50" x2="32" y2="59" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
                <line x1="5" y1="32" x2="14" y2="32" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
                <line x1="50" y1="32" x2="59" y2="32" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
                <line x1="13" y1="13" x2="19.8" y2="19.8" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
                <line x1="44.2" y1="44.2" x2="51" y2="51" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
                <line x1="51" y1="13" x2="44.2" y2="19.8" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
                <line x1="19.8" y1="44.2" x2="13" y2="51" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
              </svg>
            )}
            {weatherIcon === 'cloud' && (
              <svg className="w-9 h-9 text-gray-300" fill="currentColor" viewBox="0 0 64 64">
                <path d="M48 28a12 12 0 00-23.2-4A8 8 0 1016 40h32a8 8 0 000-16z" />
              </svg>
            )}
            {weatherIcon === 'rain' && (
              <svg className="w-9 h-9 text-blue-300" fill="currentColor" viewBox="0 0 64 64">
                <path d="M48 22a12 12 0 00-23.2-4A8 8 0 1016 34h32a8 8 0 000-16z" />
                <line x1="24" y1="42" x2="20" y2="52" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
                <line x1="32" y1="42" x2="28" y2="52" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
                <line x1="40" y1="42" x2="36" y2="52" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
              </svg>
            )}
            <div className="text-white font-black text-[24px] leading-none tabular-nums">
              {temp !== null ? `${temp}°C` : '—'}
            </div>
            <div className="text-white/60 text-[9px] font-bold uppercase tracking-widest">Ankara</div>
          </div>

        </div>
      </div>
    </div>
  )
}