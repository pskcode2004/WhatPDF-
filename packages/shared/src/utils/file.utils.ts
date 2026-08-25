// ============================================
// File Utilities — shared helpers
// ============================================

import type { FileFormat } from '../types/conversion.types'

/** Extract file extension from filename. e.g. 'document.pdf' -> 'pdf' */
export function getExtension(filename: string): string {
  return filename.split('.').pop()?.toLowerCase() ?? ''
}

/** MIME type lookup by file extension */
export const MIME_TYPES: Record<string, string> = {
  pdf:  'application/pdf',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  doc:  'application/msword',
  pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  ppt:  'application/vnd.ms-powerpoint',
  xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  xls:  'application/vnd.ms-excel',
  csv:  'text/csv',
  txt:  'text/plain',
  html: 'text/html',
  jpg:  'image/jpeg',
  jpeg: 'image/jpeg',
  png:  'image/png',
  webp: 'image/webp',
  gif:  'image/gif',
  svg:  'image/svg+xml',
  heic: 'image/heic',
  tiff: 'image/tiff',
  zip:  'application/zip',
}

/**
 * Format bytes to human-readable string
 * e.g. 1048576 -> '1 MB'
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`
}

/**
 * Generate a unique R2/S3 storage key for a job file
 * e.g. generateFileKey('abc123', 'input', 'pdf') -> 'jobs/abc123/input.pdf'
 */
export function generateFileKey(jobId: string, type: 'input' | 'output', format: FileFormat): string {
  return `jobs/${jobId}/${type}.${format}`
}

/** Check if a string is a known file format */
export function isKnownFormat(ext: string): ext is FileFormat {
  return ext in MIME_TYPES
}
