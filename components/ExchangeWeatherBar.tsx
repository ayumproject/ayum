'use client'

import { useState, useEffect } from 'react'

interface ExchangeRate { usd: number; eur: number; gbp: number }
interface Weather { temp: number; desc: string; code: number }
interface MarketData {
  bist:       number | null
  goldGram:   number | null
  silverGram: number | null
  brent:      number | null
  btc:        number | null
}

const weatherTR: Record<number, string> = {
  113: 'Açık', 116: 'Parçalı Bulutlu', 119: 'Bulutlu', 122: 'Çok Bulutlu',
  143: 'Sisli', 176: 'Yağmurlu', 179: 'Karlı', 200: 'Fırtınalı',
  263: 'Hafif Yağmur', 293: 'Yağmur', 302: 'Yoğun Yağmur', 353: 'Sağanak',
}

function WeatherIcon({ code }: { code: number }) {
  if (code === 113) return (
    <svg className="w-4 h-4 text-amber-400 shrink-0" fill="currentColor" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="4.5"/>
      <path d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none"/>
    </svg>
  )
  if ([176,263,266,293,296,299,302,305,353].includes(code)) return (
    <svg className="w-4 h-4 text-blue-400 shrink-0" fill="currentColor" viewBox="0 0 24 24">
      <path d="M20 17.58A5 5 0 0018 8h-1.26A8 8 0 104 17.17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <line x1="8" y1="19" x2="8" y2="21" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="12" y1="19" x2="12" y2="21" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
      <line x1="16" y1="19" x2="16" y2="21" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
    </svg>
  )
  if ([179,227,230].includes(code)) return (
    <svg className="w-4 h-4 text-sky-300 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v18M3 12h18M5.636 5.636l12.728 12.728M18.364 5.636L5.636 18.364"/>
    </svg>
  )
  return (
    <svg className="w-4 h-4 text-gray-400 shrink-0" fill="currentColor" viewBox="0 0 24 24">
      <path d="M18 10h-1.26A8 8 0 109 20h9a5 5 0 000-10z"/>
    </svg>
  )
}

// ── Tek bir piyasa kalemi ──────────────────────────────────────────────
function Item({ icon, label, value, unit, accent }: {
  icon: React.ReactNode; label: string; value: string; unit?: string; accent: string
}) {
  return (
    <div className="flex items-center gap-1.5 shrink-0 group">
      <div className="w-6 h-6 rounded-md flex items-center justify-center shrink-0"
        style={{ background: accent + '18' }}>
        {icon}
      </div>
      <div className="flex items-baseline gap-1 leading-none">
        <span className="text-[10px] font-black uppercase tracking-wide" style={{ color: accent }}>{label}</span>
        <span className="text-[12px] font-extrabold text-[#1a1a2e] tabular-nums">{value}</span>
        {unit && <span className="text-[9px] text-gray-400 font-medium">{unit}</span>}
      </div>
    </div>
  )
}

const Sep = () => <span className="h-4 w-px bg-gray-200 shrink-0" />

export default function ExchangeWeatherBar() {
  const [rates, setRates] = useState<ExchangeRate | null>(null)
  const [weather, setWeather] = useState<Weather | null>(null)
  const [market, setMarket] = useState<MarketData>({
    bist: null, goldGram: null, silverGram: null, brent: null, btc: null,
  })
  const [time, setTime] = useState('')

  useEffect(() => {
    // Saat
    const tick = () => {
      setTime(new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Istanbul' }))
    }
    tick()
    const t = setInterval(tick, 1000)

    // Piyasa
    fetch('/api/market-data').then(r => r.json()).then(d => setMarket(d)).catch(() => {})

    // Döviz
    fetch('https://open.er-api.com/v6/latest/TRY')
      .then(r => r.json())
      .then(d => {
        if (d.rates) setRates({
          usd: parseFloat((1 / d.rates.USD).toFixed(2)),
          eur: parseFloat((1 / d.rates.EUR).toFixed(2)),
          gbp: parseFloat((1 / d.rates.GBP).toFixed(2)),
        })
      }).catch(() => {})

    // Hava
    fetch('https://wttr.in/Ankara?format=j1')
      .then(r => r.json())
      .then(d => {
        const c = d.current_condition?.[0]
        if (c) {
          const code = parseInt(c.weatherCode)
          setWeather({ temp: parseInt(c.temp_C), desc: weatherTR[code] || 'Bulutlu', code })
        }
      }).catch(() => {})

    return () => clearInterval(t)
  }, [])

  return (
    <div className="bg-[#f8f9fb] border-b border-gray-200">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-16">
        <div className="flex items-center h-9 gap-3 overflow-x-auto scrollbar-hide">

          {/* ── Piyasa ── */}
          {rates ? (
            <>
              <Item
                icon={<svg className="w-3.5 h-3.5" fill="none" stroke="#16a34a" strokeWidth={2.5} strokeLinecap="round" viewBox="0 0 24 24"><line x1="12" y1="2" x2="12" y2="22"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>}
                label="USD" value={rates.usd.toFixed(2)} unit="₺" accent="#16a34a"
              />
              <Sep />
              <Item
                icon={<svg className="w-3.5 h-3.5" fill="none" stroke="#2563eb" strokeWidth={2.5} strokeLinecap="round" viewBox="0 0 24 24"><path d="M18 5a7 7 0 100 14M4 10h10M4 14h10"/></svg>}
                label="EUR" value={rates.eur.toFixed(2)} unit="₺" accent="#2563eb"
              />
              <Sep />
              <div className="hidden sm:contents">
                <Item
                  icon={<svg className="w-3.5 h-3.5" fill="none" stroke="#7c3aed" strokeWidth={2.5} strokeLinecap="round" viewBox="0 0 24 24"><path d="M15 5H9a4 4 0 00-4 4v2h8M5 15h10M7 11v6a2 2 0 002 2h6"/></svg>}
                  label="GBP" value={rates.gbp.toFixed(2)} unit="₺" accent="#7c3aed"
                />
                <Sep />
              </div>
            </>
          ) : (
            <div className="flex gap-2">
              {[1,2,3].map(i => <div key={i} className="w-20 h-5 bg-gray-200 rounded animate-pulse" />)}
            </div>
          )}

          {/* ALTIN */}
          {market.goldGram !== null && (
            <>
              <Item
                icon={<svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="#f59e0b"><circle cx="12" cy="12" r="9"/><text x="12" y="16" textAnchor="middle" fontSize="9" fill="white" fontWeight="bold">Au</text></svg>}
                label="ALTIN" value={market.goldGram.toLocaleString('tr-TR')} unit="₺/gr" accent="#f59e0b"
              />
              <Sep />
            </>
          )}

          {/* BIST */}
          {market.bist !== null && (
            <>
              <Item
                icon={<svg className="w-3.5 h-3.5" fill="none" stroke="#10b981" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>}
                label="BIST" value={market.bist.toLocaleString('tr-TR')} accent="#10b981"
              />
              <Sep />
            </>
          )}

          {/* GÜMÜŞ */}
          {market.silverGram !== null && (
            <div className="hidden md:contents">
              <Item
                icon={<svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="#94a3b8"><circle cx="12" cy="12" r="9"/><text x="12" y="16" textAnchor="middle" fontSize="9" fill="white" fontWeight="bold">Ag</text></svg>}
                label="GÜMÜŞ" value={market.silverGram.toLocaleString('tr-TR')} unit="₺/gr" accent="#64748b"
              />
              <Sep />
            </div>
          )}

          {/* PETROL */}
          {market.brent !== null && (
            <div className="hidden md:contents">
              <Item
                icon={<svg className="w-3.5 h-3.5" fill="none" stroke="#dc2626" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M5 20a1 1 0 001 1h12a1 1 0 001-1V9l-5-6H6a1 1 0 00-1 1v16z"/><path d="M13 3v6h6"/><path d="M9 13h6M9 17h4"/></svg>}
                label="PETROL" value={market.brent.toFixed(2)} unit="$" accent="#dc2626"
              />
              <Sep />
            </div>
          )}

          {/* BTC */}
          {market.btc !== null && (
            <div className="hidden lg:contents">
              <Item
                icon={<svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="#f97316"><path d="M23.638 14.904c-1.602 6.43-8.113 10.34-14.542 8.736C2.67 22.05-1.244 15.525.362 9.105 1.962 2.67 8.475-1.243 14.9.358c6.43 1.605 10.342 8.115 8.738 14.546z"/><path d="M17.204 10.52c.23-1.54-.944-2.367-2.55-2.92l.52-2.086-1.27-.316-.507 2.032a53 53 0 00-1.016-.239l.512-2.05-1.27-.316-.52 2.085c-.28-.063-.556-.126-.824-.192l.001-.006-1.752-.437-.337 1.355s.944.216.924.23c.515.128.608.468.593.737l-.595 2.385c.035.009.081.022.131.042l-.133-.033-.834 3.343c-.063.157-.223.392-.583.302.013.018-.924-.23-.924-.23l-.632 1.452 1.653.412c.308.077.609.158.906.234l-.527 2.11 1.27.317.52-2.087c.34.092.67.177.993.257l-.518 2.076 1.27.317.527-2.104c2.175.411 3.81.245 4.499-1.722.555-1.583-.027-2.496-1.17-3.092.831-.192 1.457-.738 1.624-1.868zm-2.908 4.078c-.394 1.583-3.06.728-3.924.513l.7-2.806c.865.216 3.638.644 3.224 2.293zm.395-4.1c-.36 1.44-2.576.708-3.296.529l.634-2.543c.72.18 3.042.514 2.662 2.014z" fill="white"/></svg>}
                label="BTC" value={`$${market.btc.toLocaleString('en-US')}`} accent="#f97316"
              />
              <Sep />
            </div>
          )}

          {/* Spacer */}
          <div className="flex-1 hidden sm:block" />

          {/* ── Hava Durumu ── */}
          <div className="flex items-center gap-1.5 shrink-0">
            <div className="w-6 h-6 rounded-md bg-[#1a1a2e]/8 flex items-center justify-center shrink-0">
              <svg className="w-3.5 h-3.5 text-[#1a1a2e]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
              </svg>
            </div>
            <span className="text-[10px] font-black text-[#1a1a2e] uppercase tracking-wide">Ankara</span>
            {weather ? (
              <>
                <WeatherIcon code={weather.code} />
                <span className="text-[12px] font-extrabold text-[#1a1a2e] tabular-nums">{weather.temp}°C</span>
                <span className="text-[10px] text-gray-500 hidden md:inline font-medium">{weather.desc}</span>
              </>
            ) : (
              <div className="w-12 h-4 bg-gray-200 rounded animate-pulse" />
            )}
          </div>

          <Sep />

          {/* ── Saat ── */}
          {time && (
            <div className="hidden sm:flex items-center gap-1 shrink-0">
              <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" strokeWidth={2}/>
                <polyline strokeLinecap="round" strokeWidth={2} points="12 6 12 12 16 14"/>
              </svg>
              <span className="text-[12px] font-extrabold text-[#1a1a2e] tabular-nums">{time}</span>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
