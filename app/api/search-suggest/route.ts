import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const q = searchParams.get('q')?.trim() || ''

  if (q.length < 2) return NextResponse.json({ results: [] })

  const sb = await createClient()

  // Paralel sorgular: haberler + köşe yazarları
  const [newsRes, columnistRes] = await Promise.all([
    sb
      .from('news')
      .select('id, title, slug, category:categories(name, color)')
      .eq('is_published', true)
      .ilike('title', `%${q}%`)
      .order('published_at', { ascending: false })
      .limit(5),
    sb
      .from('columnists')
      .select('id, name, slug, title')
      .eq('is_active', true)
      .ilike('name', `%${q}%`)
      .limit(3),
  ])

  const results: { type: string; label: string; sub: string; href: string; color?: string }[] = []

  for (const item of newsRes.data || []) {
    const catRaw = item.category
    const cat = Array.isArray(catRaw) ? (catRaw[0] ?? null) : catRaw as { name: string; color: string } | null
    results.push({
      type: 'Haber',
      label: item.title,
      sub: cat?.name || 'Haber',
      href: `/haber/${item.slug}`,
      color: cat?.color || '#2B59FF',
    })
  }

  for (const c of columnistRes.data || []) {
    results.push({
      type: 'Köşe Yazarı',
      label: c.name,
      sub: c.title || 'Köşe Yazarı',
      href: `/yazar/${c.slug}`,
      color: '#f79761',
    })
  }

  return NextResponse.json({ results })
}
