import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth'
import { revalidatePath } from 'next/cache'

export async function GET(req: NextRequest) {
  try {
    const menu = new URL(req.url).searchParams.get('menu') ?? 'main'
    const items = await prisma.navItem.findMany({
      where: { menu, visible: true },
      orderBy: [{ order: 'asc' }, { createdAt: 'asc' }],
    })

    // Build nested tree
    const roots = items.filter((i: {parentId?: string}) => !i.parentId)
    const tree = roots.map((root: {id: string}) => ({
      ...root,
      children: items.filter((i: {parentId?: string}) => i.parentId === root.id),
    }))

    return NextResponse.json({ success: true, data: tree })
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

    // If array, bulk upsert (full menu replace)
    if (Array.isArray(body)) {
      await prisma.navItem.deleteMany({ where: { menu: body[0]?.menu ?? 'main' } })
      const items = await prisma.navItem.createMany({ data: body })
      revalidatePath('/', 'layout')
      return NextResponse.json({ success: true, data: items })
    }

    const item = await prisma.navItem.create({
      data: {
        menu: body.menu ?? 'main',
        label: body.label,
        url: body.url,
        type: body.type ?? 'internal',
        order: body.order ?? 0,
        parentId: body.parentId ?? null,
        visible: body.visible ?? true,
      },
    })

    revalidatePath('/', 'layout')

    await prisma.publishLog.create({
      data: { entity: 'navigation', entityId: item.id, action: 'publish', snapshot: JSON.stringify(body) },
    })

    return NextResponse.json({ success: true, data: item }, { status: 201 })
  } catch (e: unknown) {
    console.error(e)
    return NextResponse.json({ success: false, error: e instanceof Error ? e.message : 'Failed' }, { status: 500 })
  }
}
