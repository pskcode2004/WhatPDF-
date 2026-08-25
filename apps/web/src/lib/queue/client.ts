// ============================================
// Queue Client — BullMQ
// Used in API routes to enqueue conversion jobs
// ============================================
import { Queue } from 'bullmq'
import Redis from 'ioredis'

let redisConnection: Redis | null = null

function getRedisConnection(): Redis {
  if (!redisConnection) {
    redisConnection = new Redis(process.env.REDIS_URL ?? 'redis://localhost:6379', {
      maxRetriesPerRequest: null, // Required by BullMQ
    })
  }
  return redisConnection
}

let conversionQueue: Queue | null = null

export function getConversionQueue(): Queue {
  if (!conversionQueue) {
    conversionQueue = new Queue('conversions', {
      connection: getRedisConnection(),
      defaultJobOptions: {
        attempts: 3,
        backoff: { type: 'exponential', delay: 2000 },
        removeOnComplete: { age: 86400 }, // Keep for 24h
        removeOnFail: { age: 86400 },
      },
    })
  }
  return conversionQueue
}

export { getRedisConnection }
