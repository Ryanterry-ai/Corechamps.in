import type { SessionOptions, IronSession } from 'iron-session'
import type { AdminSession } from '@/types'

export interface SessionData {
  admin?: AdminSession
}

export type AppSession = IronSession<SessionData>

export const sessionOptions: SessionOptions = {
  password: process.env.IRON_SESSION_PASSWORD as string,
  cookieName: 'corechamps_admin_session',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  },
}


