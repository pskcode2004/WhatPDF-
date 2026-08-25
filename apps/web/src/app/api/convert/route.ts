// ============================================
// API Route: POST /api/convert
// 1. Validates file + format params
// 2. Uploads input file to R2
// 3. Enqueues conversion job in BullMQ
// Returns: { jobId }
// ============================================
import { NextRequest, NextResponse } from 'next/server'
import { nanoid } from 'nanoid'
import { z } from 'zod'
import { uploadFile } from '@/lib/storage/r2'
import { getConversionQueue } from '@/lib/queue/client'
import { generateFileKey, MIME_TYPES, isKnownFormat, isRouteSupported } from '@whatpdf/shared'
import type { FileFormat } from '@whatpdf/shared'

const QuerySchema = z.object({
  from: z.string().min(1),
  to: z.string().min(1),
})

export async function POST(req: NextRequest) {
  try {
    // 1. Validate query params
    const { searchParams } = new URL(req.url)
    const parsed = QuerySchema.safeParse({
      from: searchParams.get('from'),
      to: searchParams.get('to'),
    })
    if (!parsed.success) {
      return NextResponse.json({ error: 'Missing from/to params' }, { status: 400 })
    }
    const { from, to } = parsed.data

    // 2. Validate format + route
    if (!isKnownFormat(from) || !isKnownFormat(to)) {
      return NextResponse.json({ error: 'Unsupported format' }, { status: 400 })
    }
    if (!isRouteSupported(from, to)) {
      return NextResponse.json({ error: 'This conversion is not supported' }, { status: 400 })
    }

    // 3. Parse multipart form data
    const formData = await req.formData()
    const file = formData.get('file') as File | null
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // 4. Read file into buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // 5. Generate unique job ID and storage key
    const jobId = nanoid()
    const inputKey = generateFileKey(jobId, 'input', from as FileFormat)
    const contentType = MIME_TYPES[from] ?? 'application/octet-stream'

    // 6. Upload input file to R2
    await uploadFile(inputKey, buffer, contentType)

    // 7. Enqueue conversion job (jobId = BullMQ job ID for easy lookup)
    const queue = getConversionQueue()
    await queue.add(
      'convert',
      {
        jobId,
        inputFileKey: inputKey,
        inputFormat: from,
        outputFormat: to,
        inputSizeBytes: buffer.byteLength,
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      },
      { jobId },
    )

    return NextResponse.json({ jobId })
  } catch (err) {
    console.error('[/api/convert] Error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
