import Link from 'next/link'
import Image from 'next/image'
import type { News } from '@/lib/types'

interface NewsCardProps {
  news: News
  variant?: 'default' | 'horizontal' | 'featured'
}

function formatDate(dateStr: string | null) {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export default function NewsCard({ news, variant = 'default' }: NewsCardProps) {
  if (variant === 'featured') {
    return (
      <Link href={`/haber/${news.slug}`} className="group block relative h-full min-h-[320px] overflow-hidden rounded-lg">
        {news.image_url ? (
          <Image
            src={news.image_url}
            alt={news.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#2c3e50] to-[#c0392b]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
        <div className="absolute bottom-0 p-5 text-white">
          {news.category && (
            <span
              className="inline-block text-xs font-bold px-2 py-0.5 mb-2 rounded"
              style={{ backgroundColor: news.category.color }}
            >
              {news.category.name}
            </span>
          )}
          <h3 className="font-black text-xl leading-tight group-hover:text-gray-200 transition-colors">
            {news.title}
          </h3>
          <p className="text-gray-300 text-xs mt-2">
            {formatDate(news.published_at || news.created_at)}
          </p>
        </div>
      </Link>
    )
  }

  if (variant === 'horizontal') {
    return (
      <Link href={`/haber/${news.slug}`} className="group flex gap-3 items-start">
        <div className="relative w-24 h-20 shrink-0 rounded overflow-hidden bg-gray-200">
          {news.image_url && (
            <Image
              src={news.image_url}
              alt={news.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          )}
        </div>
        <div className="flex-1 min-w-0">
          {news.category && (
            <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: news.category.color }}>
              {news.category.name}
            </span>
          )}
          <h4 className="text-sm font-bold leading-tight line-clamp-2 group-hover:text-[#c0392b] transition-colors mt-0.5">
            {news.title}
          </h4>
          <p className="text-gray-400 text-xs mt-1">
            {formatDate(news.published_at || news.created_at)}
          </p>
        </div>
      </Link>
    )
  }

  // Default card
  return (
    <Link href={`/haber/${news.slug}`} className="group block bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className="relative h-48 bg-gray-200 overflow-hidden">
        {news.image_url ? (
          <Image
            src={news.image_url}
            alt={news.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">
            <svg className="w-12 h-12 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
        {news.is_breaking && (
          <span className="absolute top-2 left-2 bg-[#c0392b] text-white text-xs font-bold px-2 py-0.5 uppercase tracking-wider">
            Son Dakika
          </span>
        )}
      </div>
      <div className="p-4">
        {news.category && (
          <span
            className="text-xs font-bold uppercase tracking-wider"
            style={{ color: news.category.color }}
          >
            {news.category.name}
          </span>
        )}
        <h3 className="font-bold text-base leading-snug line-clamp-2 mt-1 group-hover:text-[#c0392b] transition-colors">
          {news.title}
        </h3>
        <p className="text-gray-500 text-sm line-clamp-2 mt-2 leading-relaxed">
          {news.summary}
        </p>
        <div className="flex items-center justify-between mt-3 text-xs text-gray-400">
          <span>{formatDate(news.published_at || news.created_at)}</span>
          <span>{news.view_count} görüntülenme</span>
        </div>
      </div>
    </Link>
  )
}