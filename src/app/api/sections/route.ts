// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth'
import { revalidatePath } from 'next/cache'
import { safeJsonParse } from '@/lib/utils'

export async function GET(req: NextRequest) {
  try {
    const page = new URL(req.url).searchParams.get('page') ?? 'home'
    const sections = await prisma.pageSection.findMany({
      where: { page },
      orderBy: { order: 'asc' },
    })
    return NextResponse.json({
      success: true,
      data: sections.map((s: Record<string, unknown>) => ({ ...s, content: safeJsonParse(s.content, {}) })),
    })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ success: false, error: 'Failed' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const { error } = await requireAdmin()
  if (error) return error

  try {
    const body = await req.json()
    const section = await prisma.pageSection.create({
      data: {
        page: body.page ?? 'home',
        type: body.type,
        order: body.order ?? 0,
        visible: body.visible ?? true,
        content: JSON.stringify(body.content ?? {}),
      },
    })

    if (body.publish !== false) {
      revalidatePath('/')
      await prisma.publishLog.create({
        data: { entity: 'section', entityId: section.id, action: 'publish', snapshot: JSON.stringify(body) },
      })
    }

    return NextResponse.json({ success: true, data: section }, { status: 201 })
  } catch (e: unknown) {
    console.error(e)
    return NextResponse.json({ success: false, error: e instanceof Error ? e.message : 'Failed' }, { status: 500 })
  }
}
