import { createClient } from '@supabase/supabase-js'
import { createClient as createSbServer } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

function adminSb() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )
}

async function checkAdmin() {
  const sb = await createSbServer()
  const { data: { user } } = await sb.auth.getUser()
  if (!user) return false
  return ((user.user_metadata?.role as string) || 'admin') === 'admin'
}

export async function GET() {
  if (!await checkAdmin()) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  const { data, error } = await adminSb().auth.admin.listUsers()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  const users = data.users.map((u) => ({
    id: u.id,
    email: u.email,
    role: (u.user_metadata?.role as string) || 'admin',
    created_at: u.created_at,
  }))
  return NextResponse.json({ users })
}

export async function POST(req: Request) {
  if (!await checkAdmin()) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  const { email, password, role } = await req.json()
  if (!email || !password || !role)
    return NextResponse.json({ error: 'Email, sifre ve rol zorunludur.' }, { status: 400 })
  const { data, error } = await adminSb().auth.admin.createUser({
    email, password, email_confirm: true, user_metadata: { role },
  })
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ user: data.user })
}

export async function PATCH(req: Request) {
  if (!await checkAdmin()) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  const { userId, role } = await req.json()
  const { error } = await adminSb().auth.admin.updateUserById(userId, { user_metadata: { role } })
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ ok: true })
}
