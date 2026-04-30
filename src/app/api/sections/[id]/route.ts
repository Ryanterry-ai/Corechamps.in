import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth'
import { revalidatePath } from 'next/cache'
import { safeJsonParse } from '@/lib/utils'

interface Params { params: { id: string } }

export async function PUT(req: NextRequest, { params }: Params) {
  const { error } = await requireAdmin()
  if (error) return error

  try {
    const body = await req.json()
    const isDraft = body.draft === true // save draft: don't revalidate live

    const section = await prisma.pageSection.update({
      where: { id: params.id },
      data: {
        type: body.type,
        order: body.order,
        visible: body.visible,
        content: JSON.stringify(body.content ?? {}),
      },
    })

    if (!isDraft) {
      // Publish live — revalidate storefront immediately
      revalidatePath('/')
      revalidatePath(`/${section.page}`)

      await prisma.publishLog.create({
        data: {
          entity: 'section',
          entityId: section.id,
          action: 'publish',
          snapshot: JSON.stringify(body),
        },
      })
    }

    return NextResponse.json({
      success: true,
      data: { ...section, content: safeJsonParse(section.content, {}) },
      published: !isDraft,
      publishedAt: !isDraft ? new Date().toISOString() : null,
    })
  } catch (e: unknown) {
    console.error(e)
    return NextResponse.json({ success: false, error: e instanceof Error ? e.message : 'Failed' }, { status: 500 })
  }
}

export async function DELETE(_: NextRequest, { params }: Params) {
  const { error } = await requireAdmin()
  if (error) return error

  try {
    await prisma.pageSection.delete({ where: { id: params.id } })
    revalidatePath('/')
    return NextResponse.json({ success: true })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ success: false, error: 'Failed to delete' }, { status: 500 })
  }
}
