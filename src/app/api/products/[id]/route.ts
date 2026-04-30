import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth'
import { safeJsonParse } from '@/lib/utils'
import { revalidatePath } from 'next/cache'

interface Params { params: { id: string } }

export async function GET(_: NextRequest, { params }: Params) {
  try {
    const p = await prisma.product.findUnique({ where: { id: params.id }, include: { collection: true } })
    if (!p) return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 })
    return NextResponse.json({
      success: true,
      data: { ...p, images: safeJsonParse(p.images, []), tags: safeJsonParse(p.tags, []), variants: safeJsonParse(p.variants, []) },
    })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ success: false, error: 'Failed' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: Params) {
  const { error } = await requireAdmin()
  if (error) return error

  try {
    const body = await req.json()
    const product = await prisma.product.update({
      where: { id: params.id },
      data: {
        name: body.name,
        description: body.description,
        shortDesc: body.shortDesc,
        price: parseFloat(body.price),
        comparePrice: body.comparePrice ? parseFloat(body.comparePrice) : null,
        images: JSON.stringify(body.images ?? []),
        tags: JSON.stringify(body.tags ?? []),
        variants: JSON.stringify(body.variants ?? []),
        stock: parseInt(body.stock),
        sku: body.sku,
        suggestedUse: body.suggestedUse,
        allergenInfo: body.allergenInfo,
        seoTitle: body.seoTitle,
        seoDesc: body.seoDesc,
        visible: body.visible,
        collectionId: body.collectionId ?? null,
      },
    })

    revalidatePath('/')
    revalidatePath('/collections/[handle]')
    revalidatePath(`/products/${product.handle}`)

    // Publish log
    await prisma.publishLog.create({
      data: { entity: 'product', entityId: product.id, action: 'update', snapshot: JSON.stringify(body) },
    })

    return NextResponse.json({ success: true, data: product })
  } catch (e: unknown) {
    console.error(e)
    return NextResponse.json({ success: false, error: e instanceof Error ? e.message : 'Failed' }, { status: 500 })
  }
}

export async function DELETE(_: NextRequest, { params }: Params) {
  const { error } = await requireAdmin()
  if (error) return error

  try {
    await prisma.product.delete({ where: { id: params.id } })
    revalidatePath('/')
    revalidatePath('/collections/[handle]')
    return NextResponse.json({ success: true })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ success: false, error: 'Failed to delete' }, { status: 500 })
  }
}
