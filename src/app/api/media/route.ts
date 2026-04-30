import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { randomUUID } from 'crypto'

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml']
const MAX_SIZE = 10 * 1024 * 1024 // 10MB

export async function GET(req: NextRequest) {
  const { error } = await requireAdmin()
  if (error) return error

  try {
    const { searchParams } = new URL(req.url)
    const search = searchParams.get('search') ?? ''
    const media = await prisma.mediaAsset.findMany({
      where: search ? { filename: { contains: search } } : undefined,
      orderBy: { uploadedAt: 'desc' },
      take: 100,
    })
    return NextResponse.json({ success: true, data: media })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ success: false, error: 'Failed to fetch media' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const { error } = await requireAdmin()
  if (error) return error

  try {
    const contentType = req.headers.get('content-type') ?? ''

    // ── METHOD A: File upload ───────────────────────────────────────
    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData()
      const file = formData.get('file') as File | null
      if (!file) return NextResponse.json({ success: false, error: 'No file provided' }, { status: 400 })

      if (!ALLOWED_TYPES.includes(file.type)) {
        return NextResponse.json({ success: false, error: 'Invalid file type. Only images allowed.' }, { status: 400 })
      }
      if (file.size > MAX_SIZE) {
        return NextResponse.json({ success: false, error: 'File too large. Max 10MB.' }, { status: 400 })
      }

      const ext = file.name.split('.').pop()
      const filename = `${randomUUID()}.${ext}`
      const uploadDir = join(process.cwd(), 'public', 'images', 'uploads')
      await mkdir(uploadDir, { recursive: true })
      const bytes = await file.arrayBuffer()
      await writeFile(join(uploadDir, filename), Buffer.from(bytes))

      const url = `/images/uploads/${filename}`
      const alt = formData.get('alt') as string || file.name.replace(/\.[^/.]+$/, '')

      const asset = await prisma.mediaAsset.create({
        data: { filename, url, alt, size: file.size, type: 'image' },
      })
      return NextResponse.json({ success: true, data: asset }, { status: 201 })
    }

    // ── METHOD B: URL import ────────────────────────────────────────
    const body = await req.json()
    const { imageUrl, alt } = body

    if (!imageUrl || typeof imageUrl !== 'string') {
      return NextResponse.json({ success: false, error: 'imageUrl is required' }, { status: 400 })
    }

    // Validate the URL returns an image
    let fetchResponse: Response
    try {
      fetchResponse = await fetch(imageUrl, { method: 'HEAD' })
    } catch {
      return NextResponse.json({ success: false, error: 'Could not reach the image URL. Please check it is valid and publicly accessible.' }, { status: 400 })
    }

    const remoteContentType = fetchResponse.headers.get('content-type') ?? ''
    if (!remoteContentType.startsWith('image/')) {
      return NextResponse.json({ success: false, error: 'URL does not point to an image. Please provide a direct image URL (jpg, png, webp, etc.).' }, { status: 400 })
    }

    // Download and save locally — NEVER keep the external URL
    const imgResponse = await fetch(imageUrl)
    const ext = remoteContentType.split('/')[1]?.split(';')[0] || 'jpg'
    const filename = `${randomUUID()}.${ext}`
    const uploadDir = join(process.cwd(), 'public', 'images', 'uploads')
    await mkdir(uploadDir, { recursive: true })
    const buffer = Buffer.from(await imgResponse.arrayBuffer())
    await writeFile(join(uploadDir, filename), buffer)

    const url = `/images/uploads/${filename}`

    const asset = await prisma.mediaAsset.create({
      data: { filename, url, alt: alt || filename, size: buffer.byteLength, type: 'image' },
    })
    return NextResponse.json({ success: true, data: asset }, { status: 201 })
  } catch (e: unknown) {
    console.error(e)
    return NextResponse.json({ success: false, error: e instanceof Error ? e.message : 'Upload failed' }, { status: 500 })
  }
}
