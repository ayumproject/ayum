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
  return date.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' })
}

function CatBadge({ name, color }: { name: string; color: string }) {
  return (
    <span
      className="cat-badge text-white"
      style={{ backgroundColor: `${color}cc`, border: `1px solid ${color}40` }}
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
        className="group relative flex flex-col justify-end overflow-hidden rounded-3xl h-full min-h-[480px] card-hover"
      >
        {news.image_url ? (
          <Image src={news.image_url} alt={news.title} fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 to-zinc-800" />
        )}
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
        {/* Red glow bottom */}
        <div className="absolute bottom-0 left-1/4 right-1/4 h-32 bg-red-500/10 blur-3xl" />

        {news.is_breaking && (
          <div className="absolute top-4 left-4 z-10 flex items-center gap-1.5 bg-red-500 text-white text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full">
            <span className="w-1 h-1 rounded-full bg-white animate-pulse" />
            Son Dakika
          </div>
        )}

        <div className="relative z-10 p-6 md:p-7">
          {news.category && (
            <div className="mb-3">
              <CatBadge name={news.category.name} color={news.category.color} />
            </div>
          )}
          <h2
            className="font-black text-white text-xl md:text-2xl lg:text-3xl leading-tight mb-3 group-hover:text-red-100 transition-colors"
            style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
          >
            {news.title}
          </h2>
          <p className="text-zinc-300 text-sm line-clamp-2 leading-relaxed mb-4">{news.summary}</p>
          <div className="flex items-center gap-3 text-zinc-400 text-xs">
            <span>{date}</span>
            <span className="w-1 h-1 rounded-full bg-zinc-600" />
            <span>{news.view_count.toLocaleString('tr-TR')} görüntülenme</span>
          </div>
        </div>
      </Link>
    )
  }

  // ── FEATURED ──────────────────────────────────────────────────────────────
  if (variant === 'featured') {
    return (
      <Link
        href={`/haber/${news.slug}`}
        className="group relative flex flex-col justify-end overflow-hidden rounded-2xl h-full min-h-[220px] card-hover"
      >
        {news.image_url ? (
          <Image src={news.image_url} alt={news.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-zinc-800 to-zinc-900" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent" />

        {news.is_breaking && (
          <span className="absolute top-3 left-3 z-10 bg-red-500 text-white text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full">
            Son Dakika
          </span>
        )}

        <div className="relative z-10 p-4">
          {news.category && <div className="mb-2"><CatBadge name={news.category.name} color={news.category.color} /></div>}
          <h3
            className="font-black text-white text-sm md:text-base leading-snug group-hover:text-red-100 transition-colors line-clamp-2"
            style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
          >
            {news.title}
          </h3>
          <p className="text-zinc-400 text-xs mt-1.5">{date}</p>
        </div>
      </Link>
    )
  }

  // ── HORIZONTAL ────────────────────────────────────────────────────────────
  if (variant === 'horizontal') {
    return (
      <Link href={`/haber/${news.slug}`} className="group flex gap-3 items-start py-3 border-b border-white/5 last:border-0">
        <div className="relative w-20 h-16 shrink-0 rounded-xl overflow-hidden bg-zinc-800">
          {news.image_url ? (
            <Image src={news.image_url} alt={news.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
          ) : (
            <div className="absolute inset-0 bg-zinc-700" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          {news.category && (
            <span className="text-[9px] font-black uppercase tracking-wider mb-1 block" style={{ color: news.category.color }}>
              {news.category.name}
            </span>
          )}
          <h4 className="text-sm font-semibold leading-snug line-clamp-2 text-zinc-200 group-hover:text-white transition-colors">
            {news.title}
          </h4>
          <p className="text-zinc-500 text-[11px] mt-1">{date}</p>
        </div>
      </Link>
    )
  }

  // ── COMPACT ───────────────────────────────────────────────────────────────
  if (variant === 'compact') {
    return (
      <Link href={`/haber/${news.slug}`} className="group flex gap-3 items-center p-2.5 rounded-xl hover:bg-white/5 transition-colors">
        <div className="relative w-12 h-10 shrink-0 rounded-lg overflow-hidden bg-zinc-800">
          {news.image_url && <Image src={news.image_url} alt={news.title} fill className="object-cover" />}
        </div>
        <div className="flex-1 min-w-0">
          <h5 className="text-xs font-semibold line-clamp-2 text-zinc-300 group-hover:text-white transition-colors leading-snug">
            {news.title}
          </h5>
          <span className="text-[10px] text-zinc-600 mt-0.5 block">{date}</span>
        </div>
      </Link>
    )
  }

  // ── DEFAULT ───────────────────────────────────────────────────────────────
  return (
    <Link
      href={`/haber/${news.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl bg-zinc-900/80 border border-white/5 hover:border-white/10 card-hover glow-card"
    >
      <div className="relative h-44 overflow-hidden bg-zinc-800 shrink-0">
        {news.image_url ? (
          <Image
            src={news.image_url}
            alt={news.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-zinc-700 to-zinc-900" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

        {news.is_breaking && (
          <div className="absolute top-2.5 left-2.5">
            <span className="flex items-center gap-1 bg-red-500 text-white text-[9px] font-black uppercase tracking-wide px-2 py-0.5 rounded-full">
              <span className="w-1 h-1 rounded-full bg-white animate-pulse" />
              Son Dakika
            </span>
          </div>
        )}
        {news.category && (
          <div className="absolute bottom-2.5 left-2.5">
            <CatBadge name={news.category.name} color={news.category.color} />
          </div>
        )}
      </div>

      <div className="flex flex-col flex-1 p-4">
        <h3
          className="font-bold text-zinc-100 text-sm leading-snug line-clamp-2 group-hover:text-white transition-colors mb-2"
          style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
        >
          {news.title}
        </h3>
        <p className="text-zinc-500 text-xs line-clamp-2 leading-relaxed flex-1">{news.summary}</p>
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/5 text-[11px] text-zinc-600">
          <span>{date}</span>
          <span>{news.view_count.toLocaleString('tr-TR')} gör.</span>
        </div>
      </div>
    </Link>
  )
}