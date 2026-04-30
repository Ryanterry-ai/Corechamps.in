import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth'
import { revalidatePath } from 'next/cache'

export async function GET() {
  try {
    const settings = await prisma.siteSettings.findUnique({ where: { id: 'main' } })
    return NextResponse.json({ success: true, data: settings })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ success: false, error: 'Failed to fetch settings' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const { error } = await requireAdmin()
  if (error) return error

  try {
    const body = await req.json()

    const settings = await prisma.siteSettings.upsert({
      where: { id: 'main' },
      create: { id: 'main', ...body },
      update: body,
    })

    // Revalidate all pages on settings update
    revalidatePath('/', 'layout')
    revalidatePath('/collections/[handle]')

    await prisma.publishLog.create({
      data: { entity: 'settings', entityId: 'main', action: 'publish', snapshot: JSON.stringify(body) },
    })

    return NextResponse.json({ success: true, data: settings })
  } catch (e: unknown) {
    console.error(e)
    return NextResponse.json({ success: false, error: e instanceof Error ? e.message : 'Failed' }, { status: 500 })
  }
}
