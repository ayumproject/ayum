import Link from 'next/link'
import Image from 'next/image'
import type { News } from '@/lib/types'

interface NewsCardProps {
  news: News
  variant?: 'default' | 'horizontal' | 'featured' | 'compact' | 'hero'
}

function formatDate(dateStr: string | null) {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const mins = Math.floor(diff / 60000)
  const hours = Math.floor(mins / 60)
  const days = Math.floor(hours / 24)
  if (mins < 60) return `${mins}dk önce`
  if (hours < 24) return `${hours}s önce`
  if (days < 7) return `${days}g önce`
  return date.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', year: 'numeric' })
}

function CatBadge({ name, color }: { name: string; color: string }) {
  return (
    <span
      className="cat-badge text-white font-extrabold"
      style={{ backgroundColor: color }}
    >
      {name}
    </span>
  )
}

export default function NewsCard({ news, variant = 'default' }: NewsCardProps) {
  const date = formatDate(news.published_at || news.created_at)

  // ── HERO ──────────────────────────────────────────────────────────────────
  if (variant === 'hero') {
    return (
      <Link
        href={`/haber/${news.slug}`}
        className="group relative flex flex-col justify-end overflow-hidden rounded-3xl h-full min-h-[480px]"
        style={{ transition: 'transform 0.3s ease, box-shadow 0.3s ease' }}
      >
        <style>{`.group:hover { transform: translateY(-4px); box-shadow: 0 24px 60px rgba(43,89,255,0.12); }`}</style>
        {news.image_url ? (
          <Image src={news.image_url} alt={news.title} fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#2B2C35] to-[#1a1b22]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#2B2C35] via-[#2B2C35]/50 to-transparent" />

        {news.is_breaking && (
          <div className="absolute top-4 left-4 z-10">
            <span className="flex items-center gap-1.5 bg-red-500 text-white text-[9px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full">
              <span className="w-1 h-1 rounded-full bg-white animate-pulse" />
              Son Dakika
            </span>
          </div>
        )}

        <div className="relative z-10 p-7">
          {news.category && <div className="mb-3"><CatBadge name={news.category.name} color={news.category.color} /></div>}
          <h2 className="font-extrabold text-white text-2xl md:text-3xl leading-tight mb-3 group-hover:text-blue-100 transition-colors">
            {news.title}
          </h2>
          <p className="text-white/60 text-sm line-clamp-2 leading-relaxed mb-4">{news.summary}</p>
          <div className="flex items-center gap-3 text-white/40 text-xs">
            <span>{date}</span>
            <span>·</span>
            <span>{news.view_count.toLocaleString('tr-TR')} görüntülenme</span>
          </div>
        </div>

        {/* Car-card style: reveal button on hover */}
        <div className="absolute bottom-0 left-0 right-0 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-4">
          <span className="custom-btn w-full rounded-full bg-[#2B59FF] text-white text-sm font-bold justify-center gap-2">
            Haberi Oku
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </span>
        </div>
      </Link>
    )
  }

  // ── FEATURED ──────────────────────────────────────────────────────────────
  if (variant === 'featured') {
    return (
      <Link
        href={`/haber/${news.slug}`}
        className="group relative flex flex-col justify-end overflow-hidden rounded-3xl h-full min-h-[220px]"
      >
        {news.image_url ? (
          <Image src={news.image_url} alt={news.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#2B2C35] to-[#3d3e4f]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#2B2C35]/95 via-[#2B2C35]/40 to-transparent" />
        {news.is_breaking && (
          <span className="absolute top-3 left-3 z-10 bg-red-500 text-white text-[9px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full">Son Dakika</span>
        )}
        <div className="relative z-10 p-5">
          {news.category && <div className="mb-2"><CatBadge name={news.category.name} color={news.category.color} /></div>}
          <h3 className="font-extrabold text-white text-sm md:text-base leading-snug group-hover:text-blue-100 transition-colors line-clamp-2">
            {news.title}
          </h3>
          <p className="text-white/40 text-xs mt-1.5">{date}</p>
        </div>
      </Link>
    )
  }

  // ── HORIZONTAL ────────────────────────────────────────────────────────────
  if (variant === 'horizontal') {
    return (
      <Link href={`/haber/${news.slug}`} className="group flex gap-3 items-start py-3.5 border-b border-[#2B2C35]/8 last:border-0">
        <div className="relative w-20 h-16 shrink-0 rounded-xl overflow-hidden bg-[#F5F8FF]">
          {news.image_url ? (
            <Image src={news.image_url} alt={news.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
          ) : (
            <div className="absolute inset-0 bg-[#dde4f0]" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          {news.category && (
            <span className="text-[9px] font-extrabold uppercase tracking-wider mb-1 block" style={{ color: news.category.color }}>
              {news.category.name}
            </span>
          )}
          <h4 className="text-sm font-semibold leading-snug line-clamp-2 text-[#2B2C35] group-hover:text-[#2B59FF] transition-colors">
            {news.title}
          </h4>
          <p className="text-[#747A88] text-[11px] mt-1">{date}</p>
        </div>
      </Link>
    )
  }

  // ── COMPACT ───────────────────────────────────────────────────────────────
  if (variant === 'compact') {
    return (
      <Link href={`/haber/${news.slug}`} className="group flex gap-3 items-center p-2.5 rounded-2xl hover:bg-[#F5F8FF] transition-colors">
        <div className="relative w-12 h-10 shrink-0 rounded-xl overflow-hidden bg-[#dde4f0]">
          {news.image_url && <Image src={news.image_url} alt={news.title} fill className="object-cover" />}
        </div>
        <div className="flex-1 min-w-0">
          <h5 className="text-xs font-semibold line-clamp-2 text-[#2B2C35] group-hover:text-[#2B59FF] transition-colors leading-snug">
            {news.title}
          </h5>
          <span className="text-[10px] text-[#747A88] mt-0.5 block">{date}</span>
        </div>
      </Link>
    )
  }

  // ── DEFAULT (car-card style!) ─────────────────────────────────────────────
  return (
    <div className="news-card group">
      {/* Card header: title + category */}
      <div className="flex items-start justify-between gap-2 mb-1">
        <h3 className="font-extrabold text-[#2B2C35] text-base leading-snug line-clamp-2 group-hover:text-[#2B59FF] transition-colors flex-1">
          {news.title}
        </h3>
        {news.is_breaking && (
          <span className="shrink-0 flex items-center gap-1 bg-red-500 text-white text-[8px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full">
            <span className="w-1 h-1 bg-white rounded-full animate-pulse" />
            Son Dk.
          </span>
        )}
      </div>

      {/* Category */}
      {news.category && (
        <div className="mb-3">
          <CatBadge name={news.category.name} color={news.category.color} />
        </div>
      )}

      {/* Image - like car card's car image */}
      <div className="relative w-full h-44 my-3 rounded-2xl overflow-hidden bg-[#dde4f0]">
        {news.image_url ? (
          <Image
            src={news.image_url}
            alt={news.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <svg className="w-10 h-10 text-[#a0aec0]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
      </div>

      {/* Meta info (hidden on hover like car card icons) */}
      <div className="news-card__icons relative flex w-full justify-between text-[#747A88]">
        <div className="flex flex-col items-center gap-1">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-[12px] font-medium">{date}</p>
        </div>
        <div className="flex flex-col items-center gap-1">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          <p className="text-[12px] font-medium">{news.view_count.toLocaleString('tr-TR')}</p>
        </div>
        <div className="flex flex-col items-center gap-1">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
          </svg>
          <p className="text-[12px] font-medium">{news.category?.name || '—'}</p>
        </div>
      </div>

      {/* Reveal button on hover - like car card's "View More" */}
      <Link
        href={`/haber/${news.slug}`}
        className="news-card__btn rounded-full"
      >
        <span className="custom-btn w-full rounded-full bg-[#2B59FF] text-white text-[14px] font-bold justify-center gap-2 py-4">
          Haberi Oku
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
          </svg>
        </span>
      </Link>
    </div>
  )
}