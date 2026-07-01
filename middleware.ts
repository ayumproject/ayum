import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Public routes - pass through
  if (!pathname.startsWith('/admin') || pathname.startsWith('/admin/giris')) {
    return NextResponse.next()
  }

  let response = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          response = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    const loginUrl = new URL('/admin/giris', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  const role = (user.user_metadata?.role as string) || 'admin'

  // Tüm roller şifre değiştirme sayfasına erişebilir
  if (pathname.startsWith('/admin/sifre-degistir')) {
    return response
  }

  // Columnist: sadece /admin, /admin/kose-yazim/* ve /admin/sifre-degistir
  if (role === 'columnist') {
    const allowed = pathname === '/admin' || pathname.startsWith('/admin/kose-yazim')
    if (!allowed) {
      return NextResponse.redirect(new URL('/admin/kose-yazim', request.url))
    }
  }

  // Editor: sadece /admin, /admin/haberler/* ve /admin/sifre-degistir
  if (role === 'editor') {
    const allowed = pathname === '/admin' || pathname.startsWith('/admin/haberler')
    if (!allowed) {
      return NextResponse.redirect(new URL('/admin/haberler', request.url))
    }
  }

  // Admin: her şeye erişebilir

  return response
}

export const config = {
  matcher: ['/admin/:path*'],
}
