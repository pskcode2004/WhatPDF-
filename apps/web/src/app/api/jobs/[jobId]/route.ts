// ============================================
// API Route: GET /api/jobs/:jobId
// Returns job status + presigned download URL
// Polled by the frontend every 2 seconds
// ============================================
import { NextRequest, NextResponse } from 'next/server'
import { getConversionQueue } from '@/lib/queue/client'
import { getPresignedDownloadUrl } from '@/lib/storage/r2'
import type { JobStatusResponse } from '@whatpdf/shared'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ jobId: string }> },
) {
  const { jobId } = await params

  try {
    const queue = getConversionQueue()
    const job = await queue.getJob(jobId)

    if (!job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 })
    }

    const state = await job.getState()
    const progress = typeof job.progress === 'number' ? job.progress : 0

    // Map BullMQ state to our JobStatus type
    const statusMap: Record<string, JobStatusResponse['status']> = {
      completed:  'done',
      failed:     'failed',
      active:     'processing',
      waiting:    'pending',
      delayed:    'pending',
      prioritized: 'pending',
    }

    const response: JobStatusResponse = {
      jobId,
      status: statusMap[state] ?? 'pending',
      progress,
    }

    // Attach download URL when done
    if (state === 'completed' && job.returnvalue?.outputFileKey) {
      response.downloadUrl = await getPresignedDownloadUrl(job.returnvalue.outputFileKey)
    }

    if (state === 'failed') {
      response.errorMessage = job.failedReason ?? 'Conversion failed'
    }

    return NextResponse.json(response)
  } catch (err) {
    console.error('[/api/jobs] Error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
