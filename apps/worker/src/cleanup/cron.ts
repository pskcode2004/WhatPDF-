// ============================================
// Cleanup Cron — runs every hour
// Removes expired jobs and their R2 files
// Files expire 24 hours after creation
// ============================================
import { Queue } from 'bullmq'
import { deleteFile } from '../storage/r2'
import type Redis from 'ioredis'

const INTERVAL_MS = 60 * 60 * 1000  // 1 hour
const TTL_MS      = 24 * 60 * 60 * 1000  // 24 hours

export function startCleanupCron(redisConnection: Redis) {
  setInterval(async () => {
    console.log('[cleanup] Running cleanup job...')
    try {
      const queue = new Queue('conversions', { connection: redisConnection })

      // Get all completed jobs
      const completedJobs = await queue.getCompleted(0, 1000)
      const now = Date.now()

      let deletedCount = 0
      for (const job of completedJobs) {
        const jobAge = now - (job.finishedOn ?? 0)
        if (jobAge > TTL_MS) {
          // Delete input and output files from R2
          if (job.data.inputFileKey) {
            await deleteFile(job.data.inputFileKey).catch(() => {})
          }
          if (job.returnvalue?.outputFileKey) {
            await deleteFile(job.returnvalue.outputFileKey).catch(() => {})
          }
          // Remove job from BullMQ
          await job.remove()
          deletedCount++
        }
      }

      console.log(`[cleanup] Deleted ${deletedCount} expired jobs`)
    } catch (err) {
      console.error('[cleanup] Error:', err)
    }
  }, INTERVAL_MS)

  console.log('[cleanup] ✅ Cron started (runs every hour)')
}
