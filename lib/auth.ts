import { createClient } from '@/lib/supabase/server'

export type UserRole = 'admin' | 'editor' | 'columnist'

export interface UserProfile {
  id: string
  email: string
  role: UserRole
  editor_id: string | null
  columnist_id: string | null
}

export async function getUserProfile(): Promise<UserProfile | null> {
  const sb = await createClient()
  const { data: { user } } = await sb.auth.getUser()
  if (!user) return null
  const meta = user.user_metadata || {}
  return {
    id: user.id,
    email: user.email || '',
    role: (meta.role as UserRole) || 'admin',
    editor_id: meta.editor_id || null,
    columnist_id: meta.columnist_id || null,
  }
}
