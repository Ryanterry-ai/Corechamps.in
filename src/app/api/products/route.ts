// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth'
import { safeJsonParse, slugify } from '@/lib/utils'
import { revalidatePath } from 'next/cache'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get('page') ?? '1')
    const pageSize = parseInt(searchParams.get('pageSize') ?? '20')
    const search = searchParams.get('search') ?? ''
    const collectionId = searchParams.get('collectionId')

    const where: Record<string, unknown> = {}
    if (search) where.name = { contains: search }
    if (collectionId) where.collectionId = collectionId

    const [items, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
        include: { collection: { select: { name: true, handle: true } } },
      }),
      prisma.product.count({ where }),
    ])

    const products = items.map((p: Record<string, unknown>) => ({
      ...p,
      images: safeJsonParse(p.images, []),
      tags: safeJsonParse(p.tags, []),
      variants: safeJsonParse(p.variants, []),
    }))

    return NextResponse.json({ success: true, data: { items: products, total, page, pageSize, totalPages: Math.ceil(total / pageSize) } })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ success: false, error: 'Failed to fetch products' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const { error } = await requireAdmin()
  if (error) return error

  try {
    const body = await req.json()
    const handle = body.handle || slugify(body.name)

    const product = await prisma.product.create({
      data: {
        handle,
        name: body.name,
        description: body.description ?? '',
        shortDesc: body.shortDesc ?? '',
        price: parseFloat(body.price),
        comparePrice: body.comparePrice ? parseFloat(body.comparePrice) : null,
        currency: 'INR',
        images: JSON.stringify(body.images ?? []),
        tags: JSON.stringify(body.tags ?? []),
        variants: JSON.stringify(body.variants ?? []),
        stock: parseInt(body.stock ?? '0'),
        sku: body.sku ?? '',
        suggestedUse: body.suggestedUse ?? '',
        allergenInfo: body.allergenInfo ?? '',
        seoTitle: body.seoTitle ?? body.name,
        seoDesc: body.seoDesc ?? body.shortDesc ?? '',
        visible: body.visible ?? true,
        collectionId: body.collectionId ?? null,
      },
    })

    revalidatePath('/')
    revalidatePath('/collections/[handle]')
    revalidatePath(`/products/${handle}`)

    return NextResponse.json({ success: true, data: product }, { status: 201 })
  } catch (e: unknown) {
    console.error(e)
    const msg = e instanceof Error ? e.message : 'Failed to create product'
    return NextResponse.json({ success: false, error: msg }, { status: 500 })
  }
}
