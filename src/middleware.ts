import { NextRequest, NextResponse } from 'next/server'
import { getIronSession } from 'iron-session'
import { cookies } from 'next/headers'
import { sessionOptions, type SessionData } from '@/lib/session'

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    try {
      const session = await getIronSession<SessionData>(cookies(), sessionOptions)
      if (!session.admin?.isLoggedIn) {
        return NextResponse.redirect(new URL('/admin/login', req.url))
      }
    } catch {
      return NextResponse.redirect(new URL('/admin/login', req.url))
    }
  }

  if (pathname.startsWith('/api/admin') && !pathname.includes('/login')) {
    try {
      const session = await getIronSession<SessionData>(cookies(), sessionOptions)
      if (!session.admin?.isLoggedIn) {
        return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
      }
    } catch {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
}
