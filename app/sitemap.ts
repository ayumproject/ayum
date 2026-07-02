import { MetadataRoute } from 'next'
import { createClient } from '@/lib/supabase/server'

export const revalidate = 3600 // 1 saatte bir yenile

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const sb = await createClient()

  const [{ data: newsData }, { data: categories }] = await Promise.all([
    sb.from('news')
      .select('slug, published_at, updated_at')
      .eq('is_published', true)
      .order('published_at', { ascending: false })
      .limit(1000),
    sb.from('categories').select('slug'),
  ])

  const newsUrls: MetadataRoute.Sitemap = (newsData || []).map((n) => ({
    url: `https://ulusmeydan.com/haber/${n.slug}`,
    lastModified: new Date(n.published_at || n.updated_at || Date.now()),
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  const categoryUrls: MetadataRoute.Sitemap = (categories || []).map((c) => ({
    url: `https://ulusmeydan.com/kategori/${c.slug}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 0.6,
  }))

  const staticUrls: MetadataRoute.Sitemap = [
    { url: 'https://ulusmeydan.com', lastModified: new Date(), changeFrequency: 'hourly', priority: 1.0 },
    { url: 'https://ulusmeydan.com/yazar', lastModified: new Date(), changeFrequency: 'weekly', priority: 0.5 },
    { url: 'https://ulusmeydan.com/about', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.4 },
    { url: 'https://ulusmeydan.com/contact', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.4 },
  ]

  return [...staticUrls, ...categoryUrls, ...newsUrls]
}
