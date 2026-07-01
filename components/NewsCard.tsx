import Link from 'next/link'
import Image from 'next/image'
import type { News } from '@/lib/types'

interface NewsCardProps {
  news: News
  variant?: 'default' | 'horizontal' | 'featured' | 'compact' | 'hero' | 'list' | 'press'
}

function timeAgo(dateStr: string | null) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  const diff = Date.now() - d.getTime()
  const m = Math.floor(diff / 60000)
  const h = Math.floor(m / 60)
  const day = Math.floor(h / 24)
  if (m < 60) return `${m} dk`
  if (h < 24) return `${h} saat önce`
  if (day < 7) return `${day} gün önce`
  return d.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' })
}

function CatPill({ name, color }: { name: string; color: string }) {
  return (
    <span className="inline-block text-white text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full"
      style={{ backgroundColor: color }}>
      {name}
    </span>
  )
}

export default function NewsCard({ news, variant = 'default' }: NewsCardProps) {
  const date = timeAgo(news.published_at || news.created_at)

  // ── HERO ────────────────────────────────────────────────────────
  if (variant === 'hero') {
    return (
      <Link href={`/haber/${news.slug}`}
        className="group block relative overflow-hidden rounded-3xl bg-[#2B2C35]"
        style={{ aspectRatio: '16/9' }}>
        {news.image_url
          ? <Image src={news.image_url} alt={news.title} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
          : <div className="absolute inset-0 bg-gradient-to-br from-[#2B2C35] to-[#1a1b22]" />
        }
        <div className="absolute inset-0"
          style={{ background: 'linear-gradient(to top, rgba(43,44,53,0.92) 0%, rgba(43,44,53,0.2) 55%, transparent 100%)' }} />
        {news.is_breaking && (
          <div className="absolute top-4 left-4 flex items-center gap-1.5 bg-[#f79761] text-white text-[10px] font-extrabold uppercase tracking-widest px-3 py-1.5 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            Son Dakika
          </div>
        )}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          {news.category && <div className="mb-3"><CatPill name={news.category.name} color={news.category.color} /></div>}
          <h2 className="text-white font-extrabold leading-tight group-hover:text-[#F5F8FF] transition-colors"
            style={{ fontSize: 'clamp(1.2rem, 2.5vw, 1.75rem)', letterSpacing: '-0.02em' }}>
            {news.title}
          </h2>
          <p className="text-white/50 text-xs mt-2 font-medium">{date}</p>
        </div>
      </Link>
    )
  }

  // ── FEATURED ─────────────────────────────────────────────────────
  if (variant === 'featured') {
    return (
      <Link href={`/haber/${news.slug}`}
        className="group block relative overflow-hidden rounded-3xl bg-[#2B2C35] h-full"
        style={{ minHeight: 160 }}>
        {news.image_url
          ? <Image src={news.image_url} alt={news.title} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
          : <div className="absolute inset-0 bg-gradient-to-br from-[#2B2C35] to-[#1a1b22]" />
        }
        <div className="absolute inset-0"
          style={{ background: 'linear-gradient(to top, rgba(43,44,53,0.92) 0%, rgba(43,44,53,0.3) 60%, transparent 100%)' }} />
        <div className="absolute bottom-0 left-0 right-0 p-4">
          {news.category && <div className="mb-2"><CatPill name={news.category.name} color={news.category.color} /></div>}
          <h3 className="text-white font-extrabold text-sm leading-snug line-clamp-2 group-hover:text-[#F5F8FF] transition-colors"
            style={{ letterSpacing: '-0.01em' }}>
            {news.title}
          </h3>
          <p className="text-white/40 text-[11px] mt-1 font-medium">{date}</p>
        </div>
      </Link>
    )
  }

  // ── HORIZONTAL ───────────────────────────────────────────────────
  if (variant === 'horizontal') {
    return (
      <Link href={`/haber/${news.slug}`}
        className="group flex gap-3 items-start py-3 border-b border-gray-100 last:border-0">
        <div className="relative w-20 h-[60px] shrink-0 rounded-2xl overflow-hidden bg-[#F5F8FF]">
          {news.image_url
            ? <Image src={news.image_url} alt={news.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
            : <div className="absolute inset-0 bg-[#F5F8FF]" />
          }
        </div>
        <div className="flex-1 min-w-0">
          {news.category && (
            <span className="text-[10px] font-extrabold uppercase tracking-wide mb-0.5 block"
              style={{ color: news.category.color }}>
              {news.category.name}
            </span>
          )}
          <h4 className="text-[13px] font-bold leading-snug line-clamp-2 text-[#2B2C35] group-hover:text-[#2B59FF] transition-colors">
            {news.title}
          </h4>
          <p className="text-[#747A88] text-[11px] mt-1 font-medium">{date}</p>
        </div>
      </Link>
    )
  }

  // ── LIST ─────────────────────────────────────────────────────────
  if (variant === 'list') {
    return (
      <Link href={`/haber/${news.slug}`}
        className="group flex gap-3 items-start py-3 border-b border-gray-100 last:border-0">
        <div className="flex-1 min-w-0">
          <h5 className="text-[13px] font-bold leading-snug line-clamp-2 text-[#2B2C35] group-hover:text-[#2B59FF] transition-colors">
            {news.title}
          </h5>
          <p className="text-[#747A88] text-[11px] mt-0.5 font-medium">{date}</p>
        </div>
        {news.image_url && (
          <div className="relative w-16 h-12 shrink-0 rounded-xl overflow-hidden bg-[#F5F8FF]">
            <Image src={news.image_url} alt={news.title} fill className="object-cover" />
          </div>
        )}
      </Link>
    )
  }

  // ── COMPACT ──────────────────────────────────────────────────────
  if (variant === 'compact') {
    return (
      <Link href={`/haber/${news.slug}`}
        className="group flex gap-2.5 items-center py-2 border-b border-gray-100 last:border-0">
        {news.image_url && (
          <div className="relative w-12 h-10 shrink-0 rounded-xl overflow-hidden bg-[#F5F8FF]">
            <Image src={news.image_url} alt={news.title} fill className="object-cover" />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h5 className="text-xs font-bold line-clamp-2 text-[#2B2C35] group-hover:text-[#2B59FF] transition-colors leading-snug">
            {news.title}
          </h5>
          <span className="text-[10px] text-[#747A88] mt-0.5 block font-medium">{date}</span>
        </div>
      </Link>
    )
  }

  // ── PRESS — referans site gibi: yalın, beyaz, köşesiz ───────────
  if (variant === 'press') {
    return (
      <Link href={`/haber/${news.slug}`} className="group flex flex-col bg-white">
        <div className="relative w-full overflow-hidden" style={{ aspectRatio: '4/3' }}>
          {news.image_url
            ? <Image src={news.image_url} alt={news.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
            : <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
          }
        </div>
        <div className="pt-2.5 pb-1">
          <h3 className="text-[13px] font-bold text-[#1a1a2e] leading-snug line-clamp-2 group-hover:text-red-600 transition-colors mb-1">
            {news.title}
          </h3>
          <p className="text-[11px] text-gray-400 font-medium">{date}</p>
        </div>
      </Link>
    )
  }

  // ── DEFAULT — düz, homojen, köşesiz ──────────────────────────────
  return (
    <Link href={`/haber/${news.slug}`}
      className="group flex flex-col bg-white transition-colors duration-200">
      {/* Image */}
      <div className="relative w-full bg-gray-100 overflow-hidden" style={{ aspectRatio: '3/2' }}>
        {news.image_url
          ? <Image src={news.image_url} alt={news.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
          : <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
              <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
        }
        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {news.is_breaking && (
            <span className="bg-red-600 text-white text-[9px] font-extrabold uppercase tracking-widest px-2 py-0.5">
              Son Dakika
            </span>
          )}
          {news.is_exclusive && (
            <span className="bg-amber-500 text-white text-[9px] font-extrabold uppercase tracking-widest px-2 py-0.5">
              Özel
            </span>
          )}
        </div>
        {news.category && (
          <div className="absolute bottom-0 left-0">
            <span className="inline-block text-white text-[9px] font-extrabold uppercase tracking-widest px-2 py-0.5"
              style={{ backgroundColor: news.category.color }}>
              {news.category.name}
            </span>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="pt-2 pb-1 flex-1 flex flex-col">
        <h3 className="text-[13px] font-bold text-[#1a1a2e] leading-snug line-clamp-2 group-hover:text-red-600 transition-colors mb-1">
          {news.title}
        </h3>
        <div className="mt-auto flex items-center justify-between text-[10px] text-gray-400 font-medium">
          <span>{date}</span>
          <span className="flex items-center gap-1">
            <svg width="10" height="10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            {news.view_count.toLocaleString('tr-TR')}
          </span>
        </div>
      </div>
    </Link>
  )
}