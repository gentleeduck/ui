import { getSessionCookie } from 'better-auth/cookies'
import { type NextRequest, NextResponse } from 'next/server'

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Allow auth API routes and static files
  if (pathname.startsWith('/api/auth') || pathname.startsWith('/_next') || pathname.startsWith('/favicon')) {
    return NextResponse.next()
  }

  const sessionCookie = getSessionCookie(request)
  const isAuthPage = pathname.startsWith('/auth/')

  if (!sessionCookie && !isAuthPage) {
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }

  if (sessionCookie && isAuthPage) {
    return NextResponse.redirect(new URL('/workspaces', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
