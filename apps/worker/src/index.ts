// ============================================
// WhatPDF Worker — Entry Point
// Starts BullMQ worker listening on 'conversions' queue
// ============================================
import 'dotenv/config'
import { Worker, type Job } from 'bullmq'
import Redis from 'ioredis'
import { convertFile } from './converters'
import { startCleanupCron } from './cleanup/cron'
import type { ConversionJob } from '@whatpdf/shared'

const redisConnection = new Redis(process.env.REDIS_URL ?? 'redis://localhost:6379', {
  maxRetriesPerRequest: null, // Required by BullMQ
})

console.log('[worker] 🚀 Starting WhatPDF conversion worker...')

// ============================================
// Main BullMQ Worker
// concurrency = 3: process 3 jobs simultaneously
// ============================================
const worker = new Worker<ConversionJob>(
  'conversions',
  async (job: Job<ConversionJob>) => {
    const { jobId, inputFileKey, inputFormat, outputFormat } = job.data
    console.log(`[worker] Processing job ${jobId}: ${inputFormat} -> ${outputFormat}`)

    await job.updateProgress(10)

    const result = await convertFile({
      jobId,
      inputFileKey,
      inputFormat,
      outputFormat,
      onProgress: async (pct) => job.updateProgress(pct),
    })

    console.log(`[worker] ✅ Job ${jobId} complete. Output: ${result.outputFileKey}`)
    return result
  },
  {
    connection: redisConnection,
    concurrency: 3,
  },
)

worker.on('completed', (job) => {
  console.log(`[worker] ✅ Job ${job.id} completed`)
})

worker.on('failed', (job, err) => {
  console.error(`[worker] ❌ Job ${job?.id} failed:`, err.message)
})

// Start hourly cleanup of expired files
startCleanupCron(redisConnection)

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('[worker] Shutting down gracefully...')
  await worker.close()
  process.exit(0)
})
