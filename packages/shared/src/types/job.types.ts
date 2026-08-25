// ============================================
// Job Types — shared between web & worker
// ============================================

export type JobStatus = 'pending' | 'processing' | 'done' | 'failed'

export interface ConversionJob {
  jobId: string
  inputFileKey: string       // R2/S3 key for input file
  outputFileKey?: string     // R2/S3 key for output (set when done)
  inputFormat: string        // e.g. 'pdf'
  outputFormat: string       // e.g. 'docx'
  inputSizeBytes: number
  outputSizeBytes?: number
  status: JobStatus
  errorMessage?: string
  createdAt: string          // ISO 8601
  completedAt?: string       // ISO 8601
  expiresAt: string          // ISO 8601 — 24h from createdAt
}

export interface JobStatusResponse {
  jobId: string
  status: JobStatus
  progress?: number          // 0–100
  downloadUrl?: string       // Presigned URL, available when status = 'done'
  errorMessage?: string
}
