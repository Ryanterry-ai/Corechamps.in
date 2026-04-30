import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth'
import { slugify } from '@/lib/utils'
import { revalidatePath } from 'next/cache'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get('page') ?? '1')
    const pageSize = parseInt(searchParams.get('pageSize') ?? '50')

    const [items, total] = await Promise.all([
      prisma.collection.findMany({
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { order: 'asc' },
        include: { _count: { select: { products: true } } },
      }),
      prisma.collection.count(),
    ])

    return NextResponse.json({
      success: true,
      data: { items, total, page, pageSize, totalPages: Math.ceil(total / pageSize) },
    })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ success: false, error: 'Failed to fetch collections' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const { error } = await requireAdmin()
  if (error) return error

  try {
    const body = await req.json()
    const handle = body.handle || slugify(body.name)

    const collection = await prisma.collection.create({
      data: {
        handle,
        name: body.name,
        description: body.description ?? '',
        image: body.image ?? '',
        seoTitle: body.seoTitle ?? body.name,
        seoDesc: body.seoDesc ?? '',
        visible: body.visible ?? true,
        order: body.order ?? 0,
      },
    })

    revalidatePath('/collections/[handle]')
    return NextResponse.json({ success: true, data: collection }, { status: 201 })
  } catch (e: unknown) {
    console.error(e)
    return NextResponse.json({ success: false, error: e instanceof Error ? e.message : 'Failed' }, { status: 500 })
  }
}
