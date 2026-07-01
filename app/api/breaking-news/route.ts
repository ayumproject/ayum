import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  const sb = await createClient()
  const { data } = await sb
    .from('news')
    .select('id, title, slug')
    .eq('is_published', true)
    .eq('is_breaking', true)
    .order('published_at', { ascending: false })
    .limit(8)
  return NextResponse.json(data || [], {
    headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120' },
  })
}