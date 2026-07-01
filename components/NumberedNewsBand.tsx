'use client'

import Link from 'next/link'
import type { News } from '@/lib/types'

export default function NumberedNewsBand({ news }: { news: News[] }) {
  if (!news.length) return null
  const items = news.slice(0, 5)

  return (
    <div className="hidden sm:block bg-white border-b border-gray-100 py-2">
      <div className="max-w-[1440px] mx-auto px-6 sm:px-16">
        <div className="flex gap-2.5">
          {items.map((n, i) => (
            <Link
              key={n.id}
              href={"/haber/" + n.slug}
              className="flex-1 min-w-0 rounded-xl bg-white group border border-gray-100 hover:border-[#2B59FF]/25 hover:shadow-[0_2px_16px_rgba(43,89,255,0.1)] transition-all overflow-hidden flex flex-col"
            >
              {/* Üst — thumbnail + numara */}
              <div className="relative w-full overflow-hidden" style={{ height: 58 }}>
                {n.image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={n.image_url} alt={n.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-[#F5F8FF] to-[#dde8ff]" />
                )}
                {/* Numara badge üst solda */}
                <div className="absolute top-1.5 left-2 w-6 h-6 rounded-lg flex items-center justify-center text-[12px] font-black"
                  style={{
                    background: i === 0 ? '#2B59FF' : i === 1 ? '#f59e0b' : i === 2 ? '#10b981' : 'rgba(255,255,255,0.85)',
                    color: i < 3 ? '#fff' : '#94a3b8',
                    boxShadow: '0 1px 4px rgba(0,0,0,0.15)'
                  }}>
                  {i + 1}
                </div>
              </div>
              {/* Alt — kategori + başlık */}
              <div className="px-2.5 py-2 flex-1">
                {n.category && (
                  <span className="text-[9px] font-extrabold uppercase tracking-widest leading-none block mb-0.5"
                    style={{ color: (n.category as any).color || '#2B59FF' }}>
                    {(n.category as any).name}
                  </span>
                )}
                <p className="text-[11px] font-bold text-[#2B2C35] group-hover:text-[#2B59FF] transition-colors leading-snug line-clamp-2">
                  {n.title}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
