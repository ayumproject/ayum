'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Item { id: number; title: string; slug: string; published_at?: string }

export default function BreakingBand() {
  const [items, setItems] = useState<Item[]>([])
  const [offset, setOffset] = useState(0)

  useEffect(() => {
    fetch('/api/breaking-news').then(r => r.json()).then(d => setItems(d)).catch(() => {})
  }, [])

  if (!items.length) return null

  const visible = items.slice(offset, offset + 3)
  const canPrev = offset > 0
  const canNext = offset + 3 < items.length

  return (
    <div className="bg-red-600 border-b border-red-700">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-16">
        <div className="flex items-center h-10 gap-0">

          {/* Etiket */}
          <div className="flex items-center gap-1.5 shrink-0 pr-4 border-r border-red-500 mr-4">
            <svg className="w-3.5 h-3.5 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
            </svg>
            <span className="text-white text-[11px] font-extrabold uppercase tracking-widest whitespace-nowrap">
              Son Dakika
            </span>
          </div>

          {/* Haberler */}
          <div className="flex items-center flex-1 overflow-hidden gap-0">
            {visible.map((n, i) => {
              const dt = n.published_at ? new Date(n.published_at) : null
              const t = dt ? dt.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Istanbul' }) : ''
              return (
                <div key={n.id} className="flex items-center shrink-0">
                  {i > 0 && <span className="text-red-400 mx-4 text-sm font-light">|</span>}
                  <div className="flex items-center gap-2">
                    <Link href={`/haber/${n.slug}`}
                      className="text-white text-[12px] font-semibold hover:text-red-100 transition-colors line-clamp-1 max-w-xs">
                      {n.title}
                    </Link>
                    {t && <span className="text-red-200/70 text-[11px] font-bold tabular-nums shrink-0">{t}</span>}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Prev/Next oklar */}
          <div className="flex items-center gap-1 shrink-0 pl-4 border-l border-red-500">
            <button
              onClick={() => setOffset(Math.max(0, offset - 3))}
              disabled={!canPrev}
              className="w-7 h-7 flex items-center justify-center text-white/60 hover:text-white disabled:opacity-30 transition-colors rounded">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() => setOffset(Math.min(items.length - 3, offset + 3))}
              disabled={!canNext}
              className="w-7 h-7 flex items-center justify-center text-white/60 hover:text-white disabled:opacity-30 transition-colors rounded">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

        </div>
      </div>
    </div>
  )
}