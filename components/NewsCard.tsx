import Link from 'next/link'
import Image from 'next/image'
import type { News } from '@/lib/types'

interface NewsCardProps {
  news: News
  variant?: 'default' | 'horizontal' | 'featured' | 'compact' | 'hero' | 'list'
}

function formatDate(dateStr: string | null) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  const now = new Date()
  const diff = now.getTime() - d.getTime()
  const mins = Math.floor(diff / 60000)
  const hours = Math.floor(mins / 60)
  const days = Math.floor(hours / 24)
  if (mins < 60) return `${mins} dakika önce`
  if (hours < 24) return `${hours} saat önce`
  if (days < 7) return `${days} gün önce`
  return d.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' })
}

function CatPill({ name, color }: { name: string; color: string }) {
  return (
    <span
      className="inline-block text-white text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded"
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
      <Link href={`/haber/${news.slug}`} className="block group relative overflow-hidden rounded-lg bg-gray-900" style={{ aspectRatio: '16/9' }}>
        {news.image_url
          ? <Image src={news.image_url} alt={news.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
          : <div className="absolute inset-0 bg-gradient-to-br from-gray-700 to-gray-900" />
        }
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.2) 60%, transparent 100%)' }} />
        {news.is_breaking && (
          <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-[#C0282D] text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />Son Dakika
          </div>
        )}
        <div className="absolute bottom-0 left-0 right-0 p-4 md:p-5">
          {news.category && <div className="mb-2"><CatPill name={news.category.name} color={news.category.color} /></div>}
          <h2 className="text-white font-bold text-lg md:text-xl leading-snug group-hover:underline" style={{ fontFamily: 'Noto Sans, sans-serif' }}>
            {news.title}
          </h2>
          <p className="text-white/60 text-xs mt-2">{date}</p>
        </div>
      </Link>
    )
  }

  // ── FEATURED ──────────────────────────────────────────────────────────────
  if (variant === 'featured') {
    return (
      <Link href={`/haber/${news.slug}`} className="block group relative overflow-hidden rounded-lg bg-gray-900 h-full" style={{ minHeight: '200px' }}>
        {news.image_url
          ? <Image src={news.image_url} alt={news.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
          : <div className="absolute inset-0 bg-gradient-to-br from-gray-700 to-gray-900" />
        }
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.3) 60%, transparent 100%)' }} />
        <div className="absolute bottom-0 left-0 right-0 p-3">
          {news.category && <div className="mb-1.5"><CatPill name={news.category.name} color={news.category.color} /></div>}
          <h3 className="text-white font-bold text-sm leading-snug line-clamp-2 group-hover:underline">
            {news.title}
          </h3>
          <p className="text-white/50 text-xs mt-1">{date}</p>
        </div>
      </Link>
    )
  }

  // ── HORIZONTAL ────────────────────────────────────────────────────────────
  if (variant === 'horizontal') {
    return (
      <Link href={`/haber/${news.slug}`} className="group flex gap-3 items-start py-3 border-b border-gray-100 last:border-0">
        <div className="relative w-20 h-16 shrink-0 rounded overflow-hidden bg-gray-200">
          {news.image_url
            ? <Image src={news.image_url} alt={news.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
            : <div className="absolute inset-0 bg-gray-300" />
          }
        </div>
        <div className="flex-1 min-w-0">
          {news.category && (
            <span className="text-[10px] font-bold uppercase tracking-wide mb-0.5 block" style={{ color: news.category.color }}>
              {news.category.name}
            </span>
          )}
          <h4 className="text-[13px] font-semibold leading-snug line-clamp-2 text-gray-800 group-hover:text-[#C0282D] transition-colors">
            {news.title}
          </h4>
          <p className="text-gray-400 text-[11px] mt-1">{date}</p>
        </div>
      </Link>
    )
  }

  // ── LIST variant (numbered, like sidebar) ─────────────────────────────────
  if (variant === 'list') {
    return (
      <Link href={`/haber/${news.slug}`} className="group flex gap-2 items-start py-2.5 border-b border-gray-100 last:border-0">
        <div className="flex-1 min-w-0">
          <h5 className="text-[13px] font-semibold leading-snug line-clamp-2 text-gray-800 group-hover:text-[#C0282D] transition-colors">
            {news.title}
          </h5>
          <p className="text-gray-400 text-[11px] mt-0.5">{date}</p>
        </div>
        {news.image_url && (
          <div className="relative w-16 h-12 shrink-0 rounded overflow-hidden bg-gray-200">
            <Image src={news.image_url} alt={news.title} fill className="object-cover" />
          </div>
        )}
      </Link>
    )
  }

  // ── COMPACT ───────────────────────────────────────────────────────────────
  if (variant === 'compact') {
    return (
      <Link href={`/haber/${news.slug}`} className="group flex gap-2.5 items-center py-2 border-b border-gray-100 last:border-0">
        {news.image_url && (
          <div className="relative w-12 h-10 shrink-0 rounded overflow-hidden bg-gray-200">
            <Image src={news.image_url} alt={news.title} fill className="object-cover" />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h5 className="text-xs font-semibold line-clamp-2 text-gray-800 group-hover:text-[#C0282D] transition-colors leading-snug">
            {news.title}
          </h5>
          <span className="text-[10px] text-gray-400 mt-0.5 block">{date}</span>
        </div>
      </Link>
    )
  }

  // ── DEFAULT ───────────────────────────────────────────────────────────────
  return (
    <Link href={`/haber/${news.slug}`} className="group block bg-white rounded-lg overflow-hidden hover:shadow-md transition-shadow">
      {/* Image */}
      <div className="relative w-full bg-gray-200 overflow-hidden" style={{ aspectRatio: '16/9' }}>
        {news.image_url
          ? <Image src={news.image_url} alt={news.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
          : <div className="absolute inset-0 bg-gray-300 flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
        }
        {news.is_breaking && (
          <div className="absolute top-2 left-2 flex items-center gap-1 bg-[#C0282D] text-white text-[9px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded">
            <span className="w-1 h-1 rounded-full bg-white animate-pulse" />Son Dk.
          </div>
        )}
        {news.category && (
          <div className="absolute bottom-2 left-2">
            <CatPill name={news.category.name} color={news.category.color} />
          </div>
        )}
      </div>
      {/* Content */}
      <div className="p-3">
        <h3 className="text-sm font-bold text-gray-900 leading-snug line-clamp-2 group-hover:text-[#C0282D] transition-colors mb-1.5">
          {news.title}
        </h3>
        <div className="flex items-center justify-between text-[11px] text-gray-400">
          <span>{date}</span>
          <span>{news.view_count.toLocaleString('tr-TR')} görüntülenme</span>
        </div>
      </div>
    </Link>
  )
}