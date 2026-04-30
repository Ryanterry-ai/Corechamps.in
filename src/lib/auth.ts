import { getIronSession } from 'iron-session'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { sessionOptions, type SessionData } from '@/lib/session'

export async function requireAdmin() {
  const session = await getIronSession<SessionData>(cookies(), sessionOptions)
  if (!session.admin?.isLoggedIn) {
    return { error: NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 }), session: null }
  }
  return { error: null, session }
}
