import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  // If there's no session and the user is trying to access a protected route
  if (!session && req.nextUrl.pathname.startsWith('/bubbles')) {
    const redirectUrl = new URL('/login', req.url)
    return NextResponse.redirect(redirectUrl)
  }

  // If there's a session and the user is on the login page
  if (session && req.nextUrl.pathname.startsWith('/login')) {
    const redirectUrl = new URL('/bubbles', req.url)
    return NextResponse.redirect(redirectUrl)
  }

  return res
}

// Specify which routes to run the middleware on
export const config = {
  matcher: ['/bubbles/:path*', '/login'],
}
