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
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffMins < 60) return `${diffMins} dakika önce`
  if (diffHours < 24) return `${diffHours} saat önce`
  if (diffDays < 7) return `${diffDays} gün önce`

  return date.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })
}

function CategoryBadge({ name, color }: { name: string; color: string }) {
  return (
    <span
      className="category-badge text-white font-black"
      style={{ backgroundColor: color }}
    >
      {name}
    </span>
  )
}

export default function NewsCard({ news, variant = 'default' }: NewsCardProps) {
  const date = formatDate(news.published_at || news.created_at)

  // ── HERO variant ──────────────────────────────────────────────────────────
  if (variant === 'hero') {
    return (
      <Link
        href={`/haber/${news.slug}`}
        className="group block relative overflow-hidden rounded-2xl bg-slate-900 h-full min-h-[460px] news-card-hover"
      >
        {news.image_url ? (
          <Image src={news.image_url} alt={news.title} fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

        {news.is_breaking && (
          <div className="absolute top-4 left-4 z-10">
            <span className="bg-[#dc2626] text-white text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-sm flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              Son Dakika
            </span>
          </div>
        )}

        <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
          {news.category && (
            <div className="mb-2">
              <CategoryBadge name={news.category.name} color={news.category.color} />
            </div>
          )}
          <h2 className="font-black text-white text-xl md:text-2xl leading-tight mb-3 group-hover:text-red-100 transition-colors">
            {news.title}
          </h2>
          <p className="text-slate-300 text-sm leading-relaxed line-clamp-2 mb-4">{news.summary}</p>
          <div className="flex items-center gap-3 text-xs text-slate-400">
            <span className="flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {date}
            </span>
            <span>·</span>
            <span>{news.view_count.toLocaleString('tr-TR')} görüntülenme</span>
          </div>
        </div>
      </Link>
    )
  }

  // ── FEATURED variant ──────────────────────────────────────────────────────
  if (variant === 'featured') {
    return (
      <Link
        href={`/haber/${news.slug}`}
        className="group block relative overflow-hidden rounded-xl bg-slate-900 h-full min-h-[300px] news-card-hover"
      >
        {news.image_url ? (
          <Image src={news.image_url} alt={news.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-slate-700 to-slate-900" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent" />

        {news.is_breaking && (
          <div className="absolute top-3 left-3 z-10">
            <span className="bg-[#dc2626] text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-sm">
              Son Dakika
            </span>
          </div>
        )}

        <div className="absolute bottom-0 p-4 z-10">
          {news.category && (
            <div className="mb-2">
              <CategoryBadge name={news.category.name} color={news.category.color} />
            </div>
          )}
          <h3 className="font-black text-white text-base md:text-lg leading-snug group-hover:text-red-100 transition-colors">
            {news.title}
          </h3>
          <p className="text-slate-400 text-xs mt-1.5">{date}</p>
        </div>
      </Link>
    )
  }

  // ── HORIZONTAL variant ────────────────────────────────────────────────────
  if (variant === 'horizontal') {
    return (
      <Link href={`/haber/${news.slug}`} className="group flex gap-3 items-start py-3 border-b border-slate-100 last:border-0">
        <div className="relative w-20 h-16 md:w-24 md:h-20 shrink-0 rounded-lg overflow-hidden bg-slate-200">
          {news.image_url ? (
            <Image src={news.image_url} alt={news.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-slate-300 to-slate-400" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          {news.category && (
            <span className="text-[10px] font-black uppercase tracking-wider mb-1 block" style={{ color: news.category.color }}>
              {news.category.name}
            </span>
          )}
          <h4 className="text-sm font-bold leading-snug line-clamp-2 text-slate-900 group-hover:text-[#dc2626] transition-colors">
            {news.title}
          </h4>
          <p className="text-slate-400 text-[11px] mt-1 flex items-center gap-1">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {date}
          </p>
        </div>
      </Link>
    )
  }

  // ── COMPACT variant ───────────────────────────────────────────────────────
  if (variant === 'compact') {
    return (
      <Link href={`/haber/${news.slug}`} className="group flex gap-3 items-center p-3 rounded-xl hover:bg-slate-50 transition-colors">
        <div className="relative w-14 h-12 shrink-0 rounded-lg overflow-hidden bg-slate-200">
          {news.image_url && (
            <Image src={news.image_url} alt={news.title} fill className="object-cover" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h5 className="text-xs font-bold line-clamp-2 text-slate-800 group-hover:text-[#dc2626] transition-colors leading-snug">
            {news.title}
          </h5>
          <span className="text-[10px] text-slate-400 mt-0.5 block">{date}</span>
        </div>
      </Link>
    )
  }

  // ── DEFAULT card ──────────────────────────────────────────────────────────
  return (
    <Link
      href={`/haber/${news.slug}`}
      className="group block bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 news-card-hover"
    >
      {/* Image */}
      <div className="relative h-48 bg-slate-100 overflow-hidden">
        {news.image_url ? (
          <Image
            src={news.image_url}
            alt={news.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center">
            <svg className="w-10 h-10 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}

        {/* Breaking badge */}
        {news.is_breaking && (
          <div className="absolute top-2.5 left-2.5">
            <span className="bg-[#dc2626] text-white text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-sm flex items-center gap-1">
              <span className="w-1 h-1 bg-white rounded-full animate-pulse" />
              Son Dakika
            </span>
          </div>
        )}

        {/* Category overlay */}
        {news.category && (
          <div className="absolute bottom-2.5 left-2.5">
            <CategoryBadge name={news.category.name} color={news.category.color} />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-bold text-[#0f172a] text-base leading-snug line-clamp-2 group-hover:text-[#dc2626] transition-colors mb-2">
          {news.title}
        </h3>
        <p className="text-slate-500 text-sm line-clamp-2 leading-relaxed mb-3">
          {news.summary}
        </p>
        <div className="flex items-center justify-between text-xs text-slate-400 pt-3 border-t border-slate-100">
          <span className="flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {date}
          </span>
          <span className="flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            {news.view_count.toLocaleString('tr-TR')}
          </span>
        </div>
      </div>
    </Link>
  )
}