import { NextRequest, NextResponse } from 'next/server'
import { getIronSession } from 'iron-session'
import { cookies } from 'next/headers'
import bcrypt from 'bcryptjs'
import prisma from '@/lib/prisma'
import { sessionOptions, type SessionData } from '@/lib/session'

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()

    if (!email || !password) {
      return NextResponse.json({ success: false, error: 'Email and password required' }, { status: 400 })
    }

    const admin = await prisma.adminUser.findUnique({ where: { email } })
    if (!admin) {
      return NextResponse.json({ success: false, error: 'Invalid credentials' }, { status: 401 })
    }

    const valid = await bcrypt.compare(password, admin.password)
    if (!valid) {
      return NextResponse.json({ success: false, error: 'Invalid credentials' }, { status: 401 })
    }

    const session = await getIronSession<SessionData>(cookies(), sessionOptions)
    session.admin = { adminId: admin.id, email: admin.email, isLoggedIn: true }
    await session.save()

    return NextResponse.json({ success: true })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 })
  }
}
