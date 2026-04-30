import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth'
import { revalidatePath } from 'next/cache'

interface Params { params: { id: string } }

export async function GET(_: NextRequest, { params }: Params) {
  try {
    const collection = await prisma.collection.findUnique({
      where: { id: params.id },
      include: { products: { where: { visible: true } } },
    })
    if (!collection) return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 })
    return NextResponse.json({ success: true, data: collection })
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
    const collection = await prisma.collection.update({
      where: { id: params.id },
      data: {
        name: body.name,
        description: body.description,
        image: body.image,
        seoTitle: body.seoTitle,
        seoDesc: body.seoDesc,
        visible: body.visible,
        order: body.order,
      },
    })

    revalidatePath(`/collections/${collection.handle}`)
    revalidatePath('/')

    await prisma.publishLog.create({
      data: { entity: 'collection', entityId: collection.id, action: 'update', snapshot: JSON.stringify(body) },
    })

    return NextResponse.json({ success: true, data: collection })
  } catch (e: unknown) {
    console.error(e)
    return NextResponse.json({ success: false, error: e instanceof Error ? e.message : 'Failed' }, { status: 500 })
  }
}

export async function DELETE(_: NextRequest, { params }: Params) {
  const { error } = await requireAdmin()
  if (error) return error

  try {
    // Unlink products before deleting
    await prisma.product.updateMany({
      where: { collectionId: params.id },
      data: { collectionId: null },
    })
    await prisma.collection.delete({ where: { id: params.id } })
    revalidatePath('/')
    return NextResponse.json({ success: true })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ success: false, error: 'Failed to delete' }, { status: 500 })
  }
}
